$ErrorActionPreference = 'Stop'
$envFile = Join-Path $PSScriptRoot '..\backend\.env'
$envFile = [System.IO.Path]::GetFullPath($envFile)

if (-not (Test-Path -LiteralPath $envFile)) {
    $secretBytes = [byte[]]::new(48)
    $generator = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $generator.GetBytes($secretBytes)
    $generator.Dispose()
    $secret = -join ($secretBytes | ForEach-Object { $_.ToString('x2') })
    @(
        'PORT=5000'
        "JWT_SECRET=$secret"
        'MONGO_URI=mongodb://127.0.0.1:27017/vivamate-ai'
        'MONGO_SERVER_SELECTION_TIMEOUT_MS=10000'
    ) | Set-Content -LiteralPath $envFile -Encoding utf8
    Write-Host 'Created backend/.env with a private random JWT secret and local MongoDB URL.'
}
