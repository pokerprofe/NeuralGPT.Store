param(
    [string]$Incoming = ".\neuro_crm\incoming",
    [string]$Clients  = ".\neuro_crm\clients",
    [string]$Tickets  = ".\neuro_crm\tickets",
    [string]$Subs     = ".\neuro_crm\subscriptions",
    [string]$DriveRoot = "H:\Mi unidad\NEURALGPT\CRM",
    [string]$Logs     = ".\neuro_crm\logs"
)

if (-not (Test-Path $Logs)) { New-Item -ItemType Directory -Path $Logs | Out-Null }

$logFile = Join-Path $Logs "crm_log.txt"

Get-ChildItem $Incoming -Filter *.json | ForEach-Object {
    try {
        $json = Get-Content $_.FullName -Raw | ConvertFrom-Json

        if ($json.type -eq "client") {
            $dest = Join-Path $Clients ("client_{0}.txt" -f $json.email)
            $data = "Cliente: $($json.name)`nEmail: $($json.email)`nProducto: $($json.product)`nFecha: $(Get-Date)"
            $data | Out-File -Encoding UTF8 $dest
        }

        if ($json.type -eq "ticket") {
            $dest = Join-Path $Tickets ("ticket_{0}.txt" -f (Get-Date -Format "yyyyMMdd_HHmmss"))
            $data = "Ticket de: $($json.email)`nAsunto: $($json.subject)`nMensaje:`n$($json.body)"
            $data | Out-File -Encoding UTF8 $dest
        }

        if ($json.type -eq "subscription") {
            $dest = Join-Path $Subs ("sub_{0}.txt" -f $json.email)
            $data = "Suscripción: $($json.email)`nPlan: $($json.plan)`nFecha: $(Get-Date)"
            $data | Out-File -Encoding UTF8 $dest
        }

        Move-Item $_.FullName ".\neuro_crm\processed" -Force -ErrorAction SilentlyContinue

    } catch {
        "[{0}] ERROR procesando CRM: {1}" -f (Get-Date), $_.FullName |
            Out-File $logFile -Append -Encoding UTF8
    }
}

# Exportación a Drive
try {
    if (-not (Test-Path $DriveRoot)) { New-Item -ItemType Directory -Path $DriveRoot | Out-Null }
    Copy-Item $Clients  $DriveRoot -Recurse -Force
    Copy-Item $Tickets  $DriveRoot -Recurse -Force
    Copy-Item $Subs     $DriveRoot -Recurse -Force
} catch {}

"[{0}] CRM ejecutado y exportado." -f (Get-Date) |
    Out-File -Append $logFile -Encoding UTF8
