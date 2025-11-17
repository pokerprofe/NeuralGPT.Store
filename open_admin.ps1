# Script oculto de acceso seguro al panel administrativo
\Continue = 'SilentlyContinue'
\iOT0p8N9Gvc6saLY2fOwyI3uEoJlqVM44n82ywasHhQ=
 = Get-Content 'C:\NeuralGPT.Store\server\admin.token' -Raw
Start-Process "http://localhost:4000/admin" -ArgumentList @("/Headers:X-Admin-Token=\iOT0p8N9Gvc6saLY2fOwyI3uEoJlqVM44n82ywasHhQ=
") -Verb open
Write-Host "🔒 Acceso administrativo local abierto en el navegador. Puerto: 4000" -ForegroundColor Green
