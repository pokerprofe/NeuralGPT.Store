param(
  [string]$ApiBase = "http://localhost:4000"
)

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$icon = New-Object System.Windows.Forms.NotifyIcon
$icon.Icon = [System.Drawing.SystemIcons]::Information
$icon.Visible = $true
$icon.Text = "NeuralGPT.Store — Irene Local"

$lastId = 0

Write-Host "Desktop alert agent running. Close this window to stop."

while ($true) {
  try {
    $resp = Invoke-RestMethod "$ApiBase/api/activity" -Method Get -ErrorAction Stop
    if ($resp.ok -and $resp.items) {
      $latest = $resp.items[0]
      if ($latest.id -gt $lastId) {
        $lastId = $latest.id
        $title = "NeuralGPT.Store — " + $latest.type
        $msg   = $latest.detail

        $icon.BalloonTipTitle = $title
        $icon.BalloonTipText  = $msg
        $icon.ShowBalloonTip(5000)
      }
    }
  } catch {
    # Silencio: si el server no está levantado, no molestamos
  }

  Start-Sleep -Seconds 60
}
