param(
    [string]$SalesExports = ".\sales_engine\exports",
    [string]$B2BExports   = ".\b2b_engine\exports",
    [string]$ReportsDir   = ".\neuro_analytics\reports",
    [string]$LogsDir      = ".\neuro_analytics\logs",
    [string]$DriveRoot    = "H:\Mi unidad\NEURALGPT"
)

if (-not (Test-Path $LogsDir))   { New-Item -ItemType Directory -Path $LogsDir   | Out-Null }
if (-not (Test-Path $ReportsDir)){ New-Item -ItemType Directory -Path $ReportsDir| Out-Null }

$logFile = Join-Path $LogsDir "neuro_analytics.log"

function Get-LatestFile {
    param([string]$path, [string]$filter)
    if (-not (Test-Path $path)) { return $null }
    $files = Get-ChildItem $path -Filter $filter | Sort-Object LastWriteTime -Descending
    if ($files.Count -gt 0) { return $files[0].FullName }
    return $null
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$reportPath = Join-Path $ReportsDir ("war_room_report_{0}.txt" -f $timestamp)

$lines = @()
$lines += "NEURALGPT.STORE  WAR ROOM REPORT"
$lines += "========================================"
$lines += "Fecha/Hora: $(Get-Date)"
$lines += ""

# 1) Procesar último CSV de ventas (leads scored)
$salesFile = Get-LatestFile -path $SalesExports -filter "leads_scored_*.csv"
if ($salesFile) {
    $lines += "BLOQUE VENTAS (LEADS IA)"
    $lines += "-------------------------"
    try {
        $sales = Import-Csv $salesFile
        $totalLeads = $sales.Count

        $byPriority = $sales | Group-Object prioridad | Sort-Object Name
        foreach ($grp in $byPriority) {
            $lines += ("Prioridad {0}: {1} leads" -f $grp.Name, $grp.Count)
        }

        $top10 = $sales | Sort-Object score -Descending | Select-Object -First 10
        $lines += ""
        $lines += "TOP 10 LEADS:"
        foreach ($l in $top10) {
            $lines += (" - {0} ({1}) · {2} · Score={3}" -f $l.nombre, $l.email, $l.producto, $l.score)
        }
    } catch {
        $lines += "ERROR leyendo ventas: $salesFile"
    }
    $lines += ""
} else {
    $lines += "BLOQUE VENTAS: No hay CSV de leads aún."
    $lines += ""
}

# 2) Procesar último CSV de proveedores (B2B)
$b2bFile = Get-LatestFile -path $B2BExports -filter "providers_scored_*.csv"
if ($b2bFile) {
    $lines += "BLOQUE PROVEEDORES (B2B)"
    $lines += "-------------------------"
    try {
        $providers = Import-Csv $b2bFile
        $totalProv = $providers.Count

        $lines += ("Total proveedores evaluados: {0}" -f $totalProv)

        $byPriorityP = $providers | Group-Object prioridad | Sort-Object Name
        foreach ($grp in $byPriorityP) {
            $lines += ("Prioridad {0}: {1} proveedores" -f $grp.Name, $grp.Count)
        }

        $top5 = $providers | Sort-Object score -Descending | Select-Object -First 5
        $lines += ""
        $lines += "TOP 5 PROVEEDORES:"
        foreach ($p in $top5) {
            $lines += (" - {0} ({1}) · {2} · Exp={3} años · Score={4}" -f $p.nombre, $p.email, $p.empresa, $p.experiencia, $p.score)
        }
    } catch {
        $lines += "ERROR leyendo proveedores: $b2bFile"
    }
    $lines += ""
} else {
    $lines += "BLOQUE PROVEEDORES: No hay CSV de proveedores aún."
    $lines += ""
}

# 3) Resumen ejecutivo
$lines += "RESUMEN EJECUTIVO"
$lines += "------------------"
if ($salesFile -or $b2bFile) {
    $lines += " Sistema de ventas IA operativo."
    if ($salesFile) { $lines += " Hay leads procesados y puntuados." }
    if ($b2bFile)   { $lines += " Hay proveedores evaluados y priorizados." }
    $lines += " Listo para decisiones diarias tipo sala de guerra."
} else {
    $lines += "Por ahora no hay datos procesados. Ejecuta los engines de ventas y B2B primero."
}

$lines | Out-File -Encoding UTF8 -FilePath $reportPath

# 4) Exportar reporte a Drive (REPORTES)
try {
    $reportDriveRoot = Join-Path $DriveRoot "REPORTES"
    if (-not (Test-Path $reportDriveRoot)) {
        New-Item -ItemType Directory -Path $reportDriveRoot | Out-Null
    }
    Copy-Item $reportPath $reportDriveRoot -Force
} catch {
    "[{0}] ERROR exportando reporte a Drive." -f (Get-Date) | Out-File $logFile -Append -Encoding UTF8
}

"[{0}] Neuro Analytics ejecutado. Reporte: {1}" -f (Get-Date), $reportPath | Out-File $logFile -Append -Encoding UTF8
