param(
    [string]$BaselineDir = ".\neuro_secintel\baselines",
    [string]$AnomaliesDir = ".\neuro_secintel\anomalies",
    [string]$LogsDir = ".\neuro_secintel\logs",
    [string]$DriveRoot = "H:\Mi unidad\NEURALGPT\AUDITORIAS"
)

if (-not (Test-Path $LogsDir))   { New-Item -ItemType Directory -Path $LogsDir   | Out-Null }
if (-not (Test-Path $AnomaliesDir)){ New-Item -ItemType Directory -Path $AnomaliesDir| Out-Null }

$logFile = Join-Path $LogsDir "secintel.log"

# 1) Obtener baseline más reciente
$baseline = Get-ChildItem $BaselineDir -Filter baseline_structure_*.txt |
            Sort-Object LastWriteTime -Descending |
            Select-Object -First 1

if (-not $baseline) {
    "[{0}] ERROR: No baseline encontrado." -f (Get-Date) | Out-File $logFile -Append
    exit
}

# 2) Generar snapshot actual
$currentSnap = Join-Path $AnomaliesDir ("snapshot_{0}.txt" -f (Get-Date -Format "yyyyMMdd_HHmmss"))
Get-ChildItem -Recurse | Select-Object FullName, Length, LastWriteTime |
    Out-File -Encoding UTF8 $currentSnap

# 3) Comparar baseline vs snapshot
$baselineLines = Get-Content $baseline.FullName
$currentLines  = Get-Content $currentSnap

$diffFile = Join-Path $AnomaliesDir ("diff_{0}.txt" -f (Get-Date -Format "yyyyMMdd_HHmmss"))
Compare-Object $baselineLines $currentLines |
    Out-File -Encoding UTF8 $diffFile

# 4) Exportar anomalías a Drive
try {
    if (-not (Test-Path $DriveRoot)) {
        New-Item -ItemType Directory -Path $DriveRoot | Out-Null
    }
    Copy-Item $diffFile $DriveRoot -Force
} catch {}

"[{0}] Auditoría completada. Anomalías: {1}" -f (Get-Date), $diffFile |
    Out-File -Append $logFile -Encoding UTF8
