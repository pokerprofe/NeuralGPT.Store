param(
    [string]$ProjectRoot = "C:\NeuralGPT.Store",
    [string]$ReportsDir  = ".\neuro_performance\reports",
    [string]$LogsDir     = ".\neuro_performance\logs",
    [string]$DriveRoot   = "H:\Mi unidad\NEURALGPT\PERFORMANCE"
)

if (-not (Test-Path $ReportsDir)) { New-Item -ItemType Directory -Path $ReportsDir | Out-Null }
if (-not (Test-Path $LogsDir))    { New-Item -ItemType Directory -Path $LogsDir    | Out-Null }

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$reportFile = Join-Path $ReportsDir ("perf_report_{0}.txt" -f $timestamp)

# Análisis
$lines = @()
$lines += "NEURALGPT.STORE  NEURO PERFORMANCE REPORT"
$lines += "=========================================="
$lines += "Fecha: $(Get-Date)"
$lines += ""

# 1) Tamaño total del proyecto
try {
    $size = (Get-ChildItem $ProjectRoot -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    $sizeMB = [Math]::Round($size / 1MB, 2)
    $lines += "Tamaño total del proyecto: $sizeMB MB"
} catch {
    $lines += "Error midiendo tamaño total."
}
$lines += ""

# 2) Archivos más pesados
$lines += "ARCHIVOS MÁS PESADOS"
$lines += "---------------------"
try {
    $heavy = Get-ChildItem $ProjectRoot -Recurse -File | Sort-Object Length -Descending | Select-Object -First 10
    foreach ($f in $heavy) {
        $lines += ("{0}  {1} KB" -f $f.FullName, [Math]::Round($f.Length/1KB,2))
    }
} catch {
    $lines += "Error listando archivos."
}
$lines += ""

# 3) Conteo de archivos por tipo
$lines += "ARCHIVOS POR EXTENSIÓN"
$lines += "-----------------------"
try {
    $exts = Get-ChildItem $ProjectRoot -Recurse -File |
            Group-Object Extension |
            Sort-Object Count -Descending

    foreach ($ex in $exts) {
        $lines += ("{0}: {1}" -f $ex.Name, $ex.Count)
    }
} catch {
    $lines += "Error analizando extensiones."
}
$lines += ""

# 4) Peso aproximado de carga web (HTML/CSS/JS)
$lines += "PESO DE CARGA WEB"
$lines += "------------------"
try {
    $web = Get-ChildItem "$ProjectRoot\public_html" -Recurse -File |
           Where-Object { $_.Extension -in ".html",".css",".js",".png",".jpg",".jpeg",".svg" }

    $websize = ($web | Measure-Object -Property Length -Sum).Sum
    $webMB = [Math]::Round($websize / 1MB, 2)

    $lines += "Peso estimado de carga web: $webMB MB"
} catch {
    $lines += "Error midiendo carga web."
}
$lines += ""

# Guardar reporte
$lines | Out-File -Encoding UTF8 $reportFile

# Exportar a Drive
try {
    if (-not (Test-Path $DriveRoot)) {
        New-Item -ItemType Directory -Path $DriveRoot | Out-Null
    }
    Copy-Item $reportFile $DriveRoot -Force
} catch {}

# Log interno
"[{0}] Performance report generado: {1}" -f (Get-Date), $reportFile |
    Out-File -Append "$LogsDir\perf_log.txt" -Encoding UTF8
