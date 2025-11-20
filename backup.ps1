# === NeuralGPT AutoBackup ===
$fecha = Get-Date -Format "yyyy-MM-dd_HH-mm"
$destino = "C:\NeuralGPT_Respaldo_$fecha.zip"
Compress-Archive -Path "C:\NeuralGPT.Store\*" -DestinationPath $destino -Force
Write-Host "✅ Respaldo creado en: $destino" -ForegroundColor Green
