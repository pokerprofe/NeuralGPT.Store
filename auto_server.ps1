# Script persistente de arranque automático del servidor NeuralGPT.Store
\Continue = 'SilentlyContinue'
Write-Host '🚀 Iniciando servidor NeuralGPT.Store automático...' -ForegroundColor Yellow
cd "C:\NeuralGPT.Store"
while (\True) {
    try {
        # Cierra instancias previas
        Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
        # Inicia el servidor
        Start-Process -NoNewWindow "npm" -ArgumentList "start"
        Write-Host "✅ Servidor iniciado correctamente en http://localhost:4000" -ForegroundColor Green
        # Espera y vigila si se cierra
        Start-Sleep -Seconds 5
        while (Get-Process node -ErrorAction SilentlyContinue) { Start-Sleep -Seconds 3 }
        Write-Host "⚠️ Servidor detenido. Reiniciando..." -ForegroundColor Red
    } catch { Start-Sleep -Seconds 5 }
}
# ===== reCAPTCHA SECRET KEY =====
 = 'TU_SECRET_KEY_REAL_AQUI'
# ===== END =====
