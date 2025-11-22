param(
    [string]$Incoming = ".\b2b_engine\incoming",
    [string]$Processed = ".\b2b_engine\processed",
    [string]$Partners = ".\b2b_engine\partners",
    [string]$Contracts = ".\b2b_engine\contracts",
    [string]$DriveRoot = "H:\Mi unidad\NEURALGPT",
    [string]$LogFile = ".\b2b_engine\logs\b2b.log"
)

function Score-Provider {
    param([hashtable]$p)

    $score = 0

    if ($p.area -match "robot|ia|hardware|software") { $score += 40 }
    if ($p.experience -ge 5) { $score += 30 }
    if ($p.company -ne "") { $score += 20 }
    if ($p.projects -ge 3) { $score += 10 }

    if ($score -gt 100) { $score = 100 }
    return $score
}

function Priority-Label {
    param([int]$score)
    if ($score -ge 80) { return "TOP" }
    elseif ($score -ge 60) { return "HIGH" }
    elseif ($score -ge 40) { return "MEDIUM" }
    else { return "LOW" }
}

if (-not (Test-Path $Incoming)) { exit }

$csv = Join-Path ".\b2b_engine\exports" ("providers_scored_{0}.csv" -f (Get-Date -Format "yyyyMMdd_HHmmss"))
"nombre,email,empresa,area,experiencia,proyectos,score,prioridad" | Out-File $csv -Encoding UTF8

Get-ChildItem $Incoming -Filter *.json | ForEach-Object {
    try {
        $p = (Get-Content $_.FullName -Raw | ConvertFrom-Json)

        $hash = @{
            name       = $p.name
            email      = $p.email
            company    = $p.company
            area       = $p.area
            experience = $p.experience
            projects   = $p.projects
        }

        $score    = Score-Provider -p $hash
        $priority = Priority-Label -score $score

        "$($hash.name),$($hash.email),$($hash.company),$($hash.area),$($hash.experience),$($hash.projects),$score,$priority" | Out-File $csv -Append -Encoding UTF8

        $partnerFile = Join-Path $Partners ("{0}_{1}.txt" -f $hash.name, (Get-Date -Format "yyyyMMdd"))
        "Proveedor: $($hash.name)`nEmpresa: $($hash.company)`nEmail: $($hash.email)`nPrioridad: $priority`nScore: $score" | Out-File $partnerFile -Encoding UTF8

        # Generación automática de contrato
        $ctemplate = Get-Content ".\b2b_engine\contracts\contract_template.txt" -Raw
        $contractText = $ctemplate.Replace("{{NOMBRE}}", $hash.name).Replace("{{EMAIL}}", $hash.email).Replace("{{AREA}}", $hash.area).Replace("{{FECHA}}", (Get-Date))
        $cfile = Join-Path $Contracts ("contract_{0}.txt" -f $hash.name)
        Set-Content $cfile $contractText -Encoding UTF8

        Move-Item $_.FullName (Join-Path $Processed $_.Name) -Force

        "[{0}] Proveedor procesado: {1} | Score={2} | Pri={3}" -f (Get-Date), $hash.email, $score, $priority | Out-File $LogFile -Append
    }
    catch {
        "[{0}] ERROR procesando: {1}" -f (Get-Date), $_.FullName | Out-File ".\b2b_engine\logs\errors.log" -Append
    }
}

try {
    $driveDest = Join-Path $DriveRoot "PROVEEDORES"
    if (-not (Test-Path $driveDest)) { New-Item -ItemType Directory -Path $driveDest | Out-Null }
    Copy-Item $csv $driveDest -Force
} catch {}
