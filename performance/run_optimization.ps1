# PERFORMANCE RUNNER
# Optimiza solo copias, jamás toca el proyecto vivo

  = "C:\NeuralGPT.Store\public_html"
 = "C:\NeuralGPT.Store\performance\minified"

Write-Host "Iniciando optimización" -ForegroundColor Cyan

# Buscar todos los HTML, CSS, JS
 = Get-ChildItem  -Recurse -Include *.html, *.css, *.js

foreach ( in ) {

     = .FullName.Replace(, "")
       = Join-Path  

    # Crear carpetas destino
     = Split-Path 
    if (-not (Test-Path )) {
        New-Item -ItemType Directory -Path  | Out-Null
    }

    Write-Host "Minificando: " -ForegroundColor Yellow

    # Ejecutar minificador
    powershell -ExecutionPolicy Bypass -File ".\performance\minify.ps1" 
        -source .FullName 
        -target 
}

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "OPTIMIZACIÓN COMPLETA  Archivos minificados generados" -ForegroundColor Green
Write-Host "Ubicación: performance/minified/" -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor Cyan

