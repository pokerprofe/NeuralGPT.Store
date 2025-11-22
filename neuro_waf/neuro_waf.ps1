param(
    [string]$Root = "C:\NeuralGPT.Store",
    [string]$RulesDir = ".\neuro_waf\rules",
    [string]$LogsDir  = ".\neuro_waf\logs",
    [string]$Reports  = ".\neuro_waf\reports",
    [string]$Drive    = "H:\Mi unidad\NEURALGPT\WAF"
)

if (-not (Test-Path $LogsDir))   { New-Item -ItemType Directory -Path $LogsDir | Out-Null }
if (-not (Test-Path $Reports))   { New-Item -ItemType Directory -Path $Reports | Out-Null }
if (-not (Test-Path $Drive))     { New-Item -ItemType Directory -Path $Drive | Out-Null }

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$report = Join-Path $Reports ("waf_report_{0}.txt" -f $timestamp)

$lines = @()
$lines += "NEURO-WAF SHIELD  ANALYSIS REPORT"
$lines += "=================================="
$lines += "Fecha: $(Get-Date)"
$lines += ""

# 1) Buscar extensiones peligrosas
$dangerous = "*.env","*.key","*.pem","*.crt","*.pfx"

$lines += "BUSCANDO ARCHIVOS SENSIBLES"
$lines += "---------------------------"
foreach ($ext in $dangerous) {
    try {
        $found = Get-ChildItem $Root -Recurse -Filter $ext -ErrorAction SilentlyContinue
        foreach ($f in $found) {
            $lines += "Detectado archivo sensible: $($f.FullName)"
        }
    } catch {
        $lines += "Error escaneando extensión: $ext"
    }
}
$lines += ""

# 2) Cambios inesperados en server/app
$lines += "ANÁLISIS DE INTEGRIDAD DEL SERVIDOR"
$lines += "-----------------------------------"
try {
    $hash = Get-FileHash "$Root\server\app.cjs"
    $lines += "Hash actual de app.cjs: $($hash.Hash)"
} catch {
    $lines += "No se pudo leer app.cjs"
}
$lines += ""

# 3) Detección de patrones sospechosos en archivos JS/HTML
$lines += "PATRONES SOSPECHOSOS"
$lines += "----------------------"
$patterns = "SELECT","INSERT","DROP","<script>","fetch(","eval("

foreach ($p in $patterns) {
    $files = Get-ChildItem "$Root\public_html" -Recurse -File |
             Select-String -Pattern $p -SimpleMatch -ErrorAction SilentlyContinue

    foreach ($match in $files) {
        $lines += ("Patrón '{0}' encontrado en: {1}" -f $p, $match.Path)
    }
}
$lines += ""

# 4) Guardar reporte
$lines | Out-File -Encoding UTF8 $report

# 5) Exportar a Drive corporativo
Copy-Item $report $Drive -Force

# 6) Log interno
Add-Content "$LogsDir\waf_log.txt" "[$(Get-Date)] Escaneo WAF generado: $report" -Encoding UTF8
