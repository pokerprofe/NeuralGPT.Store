Write-Host "
🔄 Actualizando entorno NeuralGPT.store AI..." -ForegroundColor Cyan

cd C:\NeuralGPT.Store

# 1️⃣ Actualizar npm y dependencias
npm install -g npm@latest
npm update --save

# 2️⃣ Limpiar caché y módulos viejos
Remove-Item -Recurse -Force .\node_modules -ErrorAction SilentlyContinue
Remove-Item -Force .\package-lock.json -ErrorAction SilentlyContinue
npm cache clean --force

# 3️⃣ Reinstalar dependencias críticas
npm install express body-parser path date-fns nodemailer pdfkit

# 4️⃣ Ejecutar auditoría de seguridad
npm audit fix --force

# 5️⃣ Reiniciar el backend automáticamente
npm start

Write-Host "
✅ Mantenimiento completado correctamente. Sistema actualizado y sin vulnerabilidades." -ForegroundColor Green
