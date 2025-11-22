param(
    [string]$WatchPath = ".",
    [string]$LogsDir = ".\neurogateway\logs",
    [string]$EventsDir = ".\neurogateway\events",
    [string]$DriveRoot = "H:\Mi unidad\NEURALGPT\NEUROGATE"
)

if (-not (Test-Path $LogsDir))   { New-Item -ItemType Directory -Path $LogsDir   | Out-Null }
if (-not (Test-Path $EventsDir)) { New-Item -ItemType Directory -Path $EventsDir | Out-Null }

$logFile = Join-Path $LogsDir "neurogateway.log"

# Eventos sospechosos (no bloquean el sistema)
$patterns = @("*.exe", "*.dll", "*.msi", "*.bat", "*.sh")
$files = Get-ChildItem $WatchPath -Recurse -ErrorAction SilentlyContinue

foreach ($f in $files) {
    foreach ($p in $patterns) {
        if ($f.Name -like $p) {
            $eventFile = Join-Path $EventsDir ("event_{0}.txt" -f (Get-Date -Format "yyyyMMdd_HHmmss"))
            $content = @"
EVENTO SOSPECHOSO DETECTADO
==============================
Archivo: $($f.FullName)
Tipo: $p
Fecha: $(Get-Date)
"@
            $content | Out-File $eventFile -Encoding UTF8

            # Exportar evento a Drive
            try {
                if (-not (Test-Path $DriveRoot)) {
                    New-Item -ItemType Directory -Path $DriveRoot | Out-Null
                }
                Copy-Item $eventFile $DriveRoot -Force
            } catch {}

            "[{0}] Evento sospechoso: {1}" -f (Get-Date), $f.FullName |
                Out-File $logFile -Append -Encoding UTF8
        }
    }
}

"[{0}] NeuroGate ejecutado." -f (Get-Date) | Out-File $logFile -Append -Encoding UTF8
