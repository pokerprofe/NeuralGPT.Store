$source = "C:\NeuralGPT.Store\dashboard\assets\uploads"
$target = "G:\Mi unidad\NeuralGPT.Store\uploads"
$log    = "G:\Mi unidad\NeuralGPT.Store\logs\sync_drive.log"
while ($true) {
    $files = Get-ChildItem -Path $source -File
    foreach ($f in $files) {
        $dest = Join-Path $target $f.Name
        if (-not (Test-Path $dest)) {
            Copy-Item $f.FullName -Destination $dest -Force
            $msg = "[{0}] Copiado {1} → {2}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $f.Name, $dest
            $msg | Out-File -Append -Encoding utf8 $log
        }
    }
    Start-Sleep -Seconds 60
}
