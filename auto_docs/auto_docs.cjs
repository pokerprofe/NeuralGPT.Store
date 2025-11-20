const fs = require('fs');
const path = require('path');

function scanModules(){
  const root = 'C:/NeuralGPT.Store/server';
  const out = [];

  function walk(dir){
    const files = fs.readdirSync(dir);
    files.forEach(f=>{
      const full = path.join(dir,f);
      const stat = fs.statSync(full);
      if(stat.isDirectory()) walk(full);
      else if(f.endsWith('.cjs')){
        out.push(full.replace(/C:/,''));
      }
    });
  }

  walk(root);
  return out;
}

function scanEndpoints(){
  const app = fs.readFileSync('C:/NeuralGPT.Store/server/app.cjs','utf8');
  const lines = app.split('\n');
  const res = [];

  lines.forEach(l=>{
    const m = l.match(/app\.(get|post|patch|put|delete)\('([^']+)'/);
    if(m){
      res.push({ method:m[1].toUpperCase(), route:m[2] });
    }
  });
  return res;
}

function generate(){
  const mods = scanModules();
  const eps  = scanEndpoints();

  let html = 
  <html><head>
  <meta charset="UTF-8"/>
  <title>Documentation — NeuralGPT.Store</title>
  <style>
    body{background:#000;color:#d4af37;font-family:Arial;padding:20px;}
    h1,h2{color:#d4af37;}
    .block{margin-top:30px;padding:20px;border:1px solid #333;}
    li{margin:4px 0;}
  </style>
  </head><body>

  <h1>NeuralGPT.Store — Auto Documentation</h1>
  <p>Generated automatically by Irene Local.</p>

  <div class="block">
    <h2>1) Modules</h2>
    <ul>
  ;
  mods.forEach(m=>{ html += <li></li> });

  html += 
    </ul></div>
    <div class="block">
      <h2>2) API Endpoints</h2>
      <ul>
  ;
  eps.forEach(e=>{ html += <li>[] </li> });

  html += 
      </ul>
    </div>
  </body></html>
  ;

  const outFile = 'C:/NeuralGPT.Store/public_html/admin/docs/index.html';
  fs.writeFileSync(outFile, html);

  return { ok:true };
}

module.exports = { generate };
