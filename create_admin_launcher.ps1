\C:\NeuralGPT.Store = 'C:\NeuralGPT.Store'
\iOT0p8N9Gvc6saLY2fOwyI3uEoJlqVM44n82ywasHhQ= = Get-Content -Raw (Join-Path \C:\NeuralGPT.Store 'server\admin.token')
\ = Join-Path \C:\Users\poker\AppData\Local\Temp 'neural_admin_launch.html'
\ = @'
<!doctype html>
<html><head><meta charset="utf-8"><title>Admin Launch</title></head><body>
<script>
fetch('/admin',{headers:{'X-Admin-Token':'__TOKEN__'}})
.then(r=>r.text()).then(t=>{document.open();document.write(t);document.close();})
.catch(e=>{document.body.innerText='Error: '+e});
</script>
</body></html>
'@
\ = \ -replace '__TOKEN__', \iOT0p8N9Gvc6saLY2fOwyI3uEoJlqVM44n82ywasHhQ=
Set-Content -Path \ -Value \ -Encoding UTF8
Start-Process \
Start-Sleep -Seconds 2
# opcional: eliminar el archivo al cerrar manualmente; dejamos el tmp para depuración
