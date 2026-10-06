$ErrorActionPreference = 'Stop'
$version = '8.0.32'
$runtimeRoot = Join-Path $env:LOCALAPPDATA "VivaMateAI\mongodb\$version"
$mongodPath = Join-Path $runtimeRoot 'mongod.exe'
$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$envFile = Join-Path $projectRoot 'backend\.env'
$dataPath = Join-Path $projectRoot 'backend\data\mongodb'
$logPath = Join-Path $projectRoot 'backend\data\mongodb.log'
$tempPath = Join-Path $env:TEMP ('VivaMateAI-mongodb-' + [guid]::NewGuid().ToString('N'))

try {
    $mongoLine = Get-Content -LiteralPath $envFile | Where-Object { $_ -match '^MONGO_URI=' } | Select-Object -First 1
    $mongoUri = $mongoLine -replace '^MONGO_URI=', ''
    if ($mongoUri -and $mongoUri -notmatch '^mongodb://(127\.0\.0\.1|localhost):27017(?:/|$)') {
        Write-Host 'Using the configured remote MongoDB URI.'
        exit 0
    }

    $listener = Get-NetTCPConnection -LocalPort 27017 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($listener) {
        Write-Host 'MongoDB is already listening on port 27017.'
        exit 0
    }

    if (-not (Test-Path -LiteralPath $mongodPath)) {
        $architecture = [Runtime.InteropServices.RuntimeInformation]::OSArchitecture.ToString()
        if ($architecture -ne 'X64') {
            throw "The bundled MongoDB runtime supports Windows x64; this machine is $architecture. Set MONGO_URI to a remote MongoDB instance instead."
        }

        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        New-Item -ItemType Directory -Path $tempPath -Force | Out-Null
        $archiveName = "mongodb-windows-x86_64-$version.zip"
        $archivePath = Join-Path $tempPath $archiveName
        $archiveUrl = "https://fastdl.mongodb.org/windows/$archiveName"
        Write-Host "Downloading MongoDB Community $version for Windows x64..."
        Invoke-WebRequest -Uri $archiveUrl -OutFile $archivePath

        $extractPath = Join-Path $tempPath 'extract'
        Expand-Archive -LiteralPath $archivePath -DestinationPath $extractPath
        $mongodFile = Get-ChildItem -LiteralPath $extractPath -Filter 'mongod.exe' -Recurse | Select-Object -First 1
        if (-not $mongodFile) { throw 'The MongoDB archive did not contain mongod.exe.' }

        New-Item -ItemType Directory -Path (Split-Path $runtimeRoot -Parent) -Force | Out-Null
        if (Test-Path -LiteralPath $runtimeRoot) {
            Remove-Item -LiteralPath $runtimeRoot -Recurse -Force
        }
        Move-Item -LiteralPath $mongodFile.Directory.FullName -Destination $runtimeRoot
        if (-not (Test-Path -LiteralPath $mongodPath)) { throw 'Could not install the MongoDB runtime.' }
    }

    New-Item -ItemType Directory -Path $dataPath -Force | Out-Null
    New-Item -ItemType Directory -Path (Split-Path $logPath -Parent) -Force | Out-Null
    Start-Process -FilePath $mongodPath -ArgumentList @('--dbpath', $dataPath, '--bind_ip', '127.0.0.1', '--port', '27017', '--logpath', $logPath, '--logappend') -WindowStyle Hidden | Out-Null

    $deadline = (Get-Date).AddSeconds(30)
    do {
        Start-Sleep -Milliseconds 500
        $listener = Get-NetTCPConnection -LocalPort 27017 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
    } until ($listener -or (Get-Date) -ge $deadline)
    if (-not $listener) { throw "MongoDB did not start. See $logPath for details." }

    Write-Host 'MongoDB is running on localhost. Database files are stored in backend/data/mongodb.'
}
catch {
    Write-Error "MongoDB setup failed. $($_.Exception.Message)"
    exit 1
}
finally {
    if (Test-Path -LiteralPath $tempPath) {
        Remove-Item -LiteralPath $tempPath -Recurse -Force -ErrorAction SilentlyContinue
    }
}
