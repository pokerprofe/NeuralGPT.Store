# PERFORMANCE DIAGNOSTIC
# Mide tamaño real y tamaño optimizado

  = "C:\NeuralGPT.Store\public_html"
 = "C:\NeuralGPT.Store\performance\minified"

 = ".\performance\reports\performance_report_20251121_055244.txt"

"REPORTE DE RENDIMIENTO  11/21/2025 05:52:44"     | Out-File  -Encoding UTF8
"---------------------------------------" | Out-File  -Append -Encoding UTF8

  = Get-ChildItem   -Recurse -Include *.html, *.css, *.js
 = Get-ChildItem  -Recurse -Include *.html, *.css, *.js

 = ( | Measure-Object Length -Sum).Sum
 = ( | Measure-Object Length -Sum).Sum

"Peso original: 0 KB" | Out-File  -Append -Encoding UTF8
"Peso optimizado: 0 KB" | Out-File  -Append -Encoding UTF8

 = [math]::Round((1 - ( / )) * 100,2)
"Reducción total:  %" | Out-File  -Append -Encoding UTF8

Write-Host "Reporte generado: " -ForegroundColor Green
