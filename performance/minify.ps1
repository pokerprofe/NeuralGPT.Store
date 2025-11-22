param(
    [string],
    [string]
)

# Lectura del archivo
 = Get-Content  -Raw

# Minificación rápida global
# (Elimina saltos, espacios dobles y comentarios simples)
 =  
    -replace "
", " " 
    -replace "\s{2,}", " " 
    -replace "<!--.*?-->", "" 
    -replace "\s*{\s*", "{ " 
    -replace "\s*}\s*", "} " 
    -replace "\s*;\s*", ";" 
    -replace "\s*:\s*", ":" 
    -replace "\s*,\s*", "," 

# Guardar resultado optimizado
 | Set-Content  -Encoding UTF8

