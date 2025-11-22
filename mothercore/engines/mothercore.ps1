param(
    [string]$CoreDir = ".\mothercore",
    [string]$DriveRoot = "H:\Mi unidad\NEURALGPT"
)

$logFile = Join-Path $CoreDir "logs\mothercore.log"

# 1) Consolidar estados de engines
$engines = @(
    ".\leads_engine\logs",
    ".\b2b_engine\logs",
    ".\neuro_analytics\logs",
    ".\neuro_secintel\logs"
)

$report = @()
$report += "NEURALGPT.STORE  MOTHERCORE SYSTEM REPORT"
$report += "==============================================="
$report += "Fecha/Hora: $(Get-Date)"
$report += ""

foreach ($e in $engines) {
    if (Test-Path $e) {
        $latest = Get-ChildItem $e -File | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        if ($latest) {
            $report += "Engine: $e"
            $report += "Último log: $($latest.Name)"
            $report += ""
        }
    }
}

# 2) Guardar reporte
$reportPath = Join-Path $CoreDir ("reports\mothercore_report_{0}.txt" -f (Get-Date -Format "yyyyMMdd_HHmmss"))
$report | Out-File -Encoding UTF8 $reportPath

# 3) Exportar a Drive
try {
    $driveMC = Join-Path $DriveRoot "MOTHERCORE"
    if (-not (Test-Path $driveMC)) {
        New-Item -ItemType Directory -Path $driveMC | Out-Null
    }
    Copy-Item $reportPath $driveMC -Force
} catch {}

"[{0}] MotherCore ejecutado. Reporte: {1}" -f (Get-Date), $reportPath | Out-File $logFile -Append -Encoding UTF8
