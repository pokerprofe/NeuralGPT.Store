# ============================================================
# STATIC BUILD ENGINE v1.0
# Crea una carpeta dist/ limpia, lista para GitHub Pages.
# Solo copia archivos estáticos: html, css, js, imágenes.
# Nunca copia backend, Node, IA, ni módulos privados.
# ============================================================

Write-Host "Compilando Static Build..." -ForegroundColor Cyan

# Ruta origen y destino
\ = "C:\NeuralGPT.Store\public_html"
\ = "C:\NeuralGPT.Store\dist"

# Borrar dist anterior
if (Test-Path \) {
    Remove-Item \ -Recurse -Force
}

# Crear carpeta dist
New-Item -ItemType Directory -Path \ | Out-Null

# Copiar solo archivos permitidos por GitHub Pages
Get-ChildItem -Recurse \ | ForEach-Object {
    if (\ -is [System.IO.FileInfo]) {
        if (\ -match '\.html$' -or
            \ -match '\.css$' -or
            \ -match '\.js$' -or
            \ -match '\.png$' -or
            \ -match '\.jpg$' -or
            \ -match '\.jpeg$' -or
            \ -match '\.svg$' -or
            \ -match '\.ico$') {

            # Crear carpeta destino si no existe
            \ = \ + \.Substring(\.Length)
            \ = Split-Path \

            if (-not (Test-Path \)) {
                New-Item -ItemType Directory -Path \ | Out-Null
            }

            Copy-Item \ \ -Force
        }
    }
}

Write-Host "Static Build completada. Carpeta dist lista." -ForegroundColor Green
