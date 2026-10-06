$ErrorActionPreference = 'Stop'
$runtimeDir = Join-Path $env:LOCALAPPDATA 'VivaMateAI\node'
$downloadDir = Join-Path $env:TEMP ('VivaMateAI-node-' + [guid]::NewGuid().ToString('N'))

try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Write-Host 'Checking the official Node.js release list...'
    $releases = Invoke-RestMethod -Uri 'https://nodejs.org/dist/index.json'
    $release = $releases | Where-Object { $_.lts -is [string] -and $_.lts.Length -gt 0 } | Select-Object -First 1
    if (-not $release) { throw 'Could not find a current Node.js LTS release.' }

    $architecture = [Runtime.InteropServices.RuntimeInformation]::OSArchitecture.ToString()
    switch ($architecture) {
        'X64' { $nodeArchitecture = 'x64' }
        'Arm64' { $nodeArchitecture = 'arm64' }
        default { throw "This Windows processor architecture is not supported: $architecture" }
    }

    $archiveName = "node-$($release.version)-win-$nodeArchitecture.zip"
    if ($release.files -notcontains "win-$nodeArchitecture-zip") {
        throw "The official Node.js release does not provide a $nodeArchitecture Windows runtime."
    }

    New-Item -ItemType Directory -Path $downloadDir -Force | Out-Null
    $archivePath = Join-Path $downloadDir $archiveName
    $archiveUrl = "https://nodejs.org/dist/$($release.version)/$archiveName"
    Write-Host "Downloading Node.js $($release.version) ($nodeArchitecture)..."
    Invoke-WebRequest -Uri $archiveUrl -OutFile $archivePath

    $extractDir = Join-Path $downloadDir 'extract'
    Expand-Archive -LiteralPath $archivePath -DestinationPath $extractDir
    $extractedRuntime = Join-Path $extractDir "node-$($release.version)-win-$nodeArchitecture"
    if (-not (Test-Path (Join-Path $extractedRuntime 'npm.cmd'))) {
        throw 'The downloaded Node.js archive did not include npm.'
    }

    New-Item -ItemType Directory -Path (Split-Path $runtimeDir -Parent) -Force | Out-Null
    if (Test-Path -LiteralPath $runtimeDir) {
        Remove-Item -LiteralPath $runtimeDir -Recurse -Force
    }
    Move-Item -LiteralPath $extractedRuntime -Destination $runtimeDir
    Write-Host "Portable Node.js installed at $runtimeDir"
}
catch {
    Write-Error "Could not set up Node.js automatically. $($_.Exception.Message)"
    exit 1
}
finally {
    if (Test-Path -LiteralPath $downloadDir) {
        Remove-Item -LiteralPath $downloadDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}
