param()

$date = Get-Date -Format "yyyy-MM-dd_HH-mm"
$zip  = "C:\NeuralGPT.Store\backups_weekly\backup_$date.zip"

if(-not (Test-Path "backups_weekly")){ New-Item -ItemType Directory -Path "backups_weekly" | Out-Null }

$include = @(
  "server",
  "dashboard",
  "public_html",
  "assets/css",
  "assets/js",
  "database/models.json",
  "database/users.json",
  "database/products.json",
  "database/analytics.json",
  "database/edo_users.json",
  "database/vendors_inbox.enc",
  "logs"
)

Compress-Archive -Path $include -DestinationPath $zip -Force
