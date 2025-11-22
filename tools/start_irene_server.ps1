param(
    [int]\ = 4000
)

# Comprobar si ya hay algo escuchando en el puerto 4000
\ = \False
try {
    \ = Get-NetTCPConnection -LocalPort \ -State Listen -ErrorAction SilentlyContinue
    if (\) { \ = \True }
} catch { }

if (\) {
    exit 0
}

# Lanzar servidor Node minimizado
Start-Process -FilePath "node" 
    -ArgumentList "server\app.cjs" 
    -WorkingDirectory "C:\NeuralGPT.Store" 
    -WindowStyle Minimized
