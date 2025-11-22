param(
    [string]$LeadsDir = ".\leads_engine\incoming",
    [string]$ProcessedDir = ".\sales_engine\processed",
    [string]$LogFile = ".\sales_engine\logs\sales_engine.log",
    [string]$DriveRoot = "H:\Mi unidad\NEURALGPT"
)

function Get-LeadScore {
    param([hashtable]$lead)

    $score = 0

    $email = ($lead.email  | Out-String).ToLower()
    $prod  = ($lead.product| Out-String).ToLower()
    $msg   = ($lead.message| Out-String)
    $src   = ($lead.source | Out-String).ToLower()

    if ($email -match "@.+\.(com|es|org|edu|io|tech)") { $score += 15 }
    if ($email -notmatch "gmail|yahoo|hotmail|outlook") { $score += 10 }

    if ($prod -match "quantum" -or $prod -match "consultor" -or $prod -match "b2b") { $score += 25 }

    if ($msg.Length -gt 180) { $score += 15 }

    if ($src -match "linkedin" -or $src -match "partner" -or $src -match "empresa") { $score += 20 }

    if ($lead.recurrent -eq $true) { $score += 15 }

    if ($score -gt 100) { $score = 100 }
    return $score
}

function Get-PriorityLabel {
    param([int]$score)
    if ($score -ge 80) { return "MAX" }
    elseif ($score -ge 60) { return "HIGH" }
    elseif ($score -ge 40) { return "MEDIUM" }
    else { return "LOW" }
}

if (-not (Test-Path $LeadsDir)) { exit }

$csvPath = Join-Path ".\sales_engine\exports" ("leads_scored_{0}.csv" -f (Get-Date -Format "yyyyMMdd_HHmmss"))
"nombre,email,producto,origen,score,prioridad" | Out-File $csvPath -Encoding UTF8

Get-ChildItem $LeadsDir -Filter *.json | ForEach-Object {
    try {
        $raw  = Get-Content $_.FullName -Raw
        $lead = $raw | ConvertFrom-Json

        $h = @{
            name      = $lead.name
            email     = $lead.email
            product   = $lead.product
            message   = $lead.message
            source    = $lead.source
            recurrent = $lead.recurrent
        }

        $score    = Get-LeadScore -lead $h
        $priority = Get-PriorityLabel -score $score

        "$($h.name),$($h.email),$($h.product),$($h.source),$score,$priority" | Out-File $csvPath -Encoding UTF8 -Append

        $destFile = Join-Path $ProcessedDir $_.Name
        Move-Item $_.FullName $destFile -Force

        $logLine = "[{0}] Lead procesado: {1} | Score={2} | Priority={3}" -f (Get-Date), $h.email, $score, $priority
        $logLine | Out-File $LogFile -Encoding UTF8 -Append

    } catch {
        $errLine = "[{0}] ERROR procesando lead: {1}" -f (Get-Date), $_.FullName
        $errLine | Out-File ".\sales_engine\logs\errors.log" -Encoding UTF8 -Append
    }
}

try {
    $driveLeads = Join-Path $DriveRoot "LEADS"
    if (-not (Test-Path $driveLeads)) {
        New-Item -ItemType Directory -Path $driveLeads | Out-Null
    }
    Copy-Item $csvPath $driveLeads -Force
} catch {}
