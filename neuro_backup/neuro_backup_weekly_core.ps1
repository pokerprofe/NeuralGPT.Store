# Motor semanal del backup cuántico
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "C:\NeuralGPT.Store\neuro_backup\weekly\backup_$timestamp"
$zipFile   = "C:\NeuralGPT.Store\neuro_backup\weekly_zip\backup_$timestamp.zip"

New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

Copy-Item "C:\NeuralGPT.Store\public_html" $backupDir -Recurse -Force
Copy-Item "C:\NeuralGPT.Store\server"       $backupDir -Recurse -Force

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($backupDir, $zipFile)

$driveDest = "H:\Mi unidad\NEURALGPT\BACKUPS"
if (-not (Test-Path $driveDest)) {
    New-Item -ItemType Directory -Path $driveDest | Out-Null
}
Copy-Item $zipFile $driveDest -Force

Add-Content "C:\NeuralGPT.Store\neuro_backup\logs\weekly_backup_log.txt" "[$(Get-Date)] Backup semanal creado: $zipFile" -Encoding UTF8
