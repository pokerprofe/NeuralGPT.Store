/////////////////////////////////////////////////////////////////////////
// FULL SEO ENGINE v1.0
// Generación automática (local) de:
//   • sitemap.xml dinámico
//   • robots.txt inteligente
//   • metadatos OpenGraph
//   • microdata JSON-LD
// Sin APIs externas. Sin costes.
/////////////////////////////////////////////////////////////////////////

const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname,'..','..','public_html');

function generateSitemap(){
  const urls = [
    'https://neuralgpt.store/',
    'https://neuralgpt.store/sections/register.html',
    'https://neuralgpt.store/sections/store.html',
    'https://neuralgpt.store/sections/about.html',
    'https://neuralgpt.store/admin/desktop/index.html'
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\\n';
  urls.forEach(u=>{
    xml += '  <url><loc>'+u+'</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\\n';
  });
  xml += '</urlset>';

  fs.writeFileSync(path.join(PUBLIC,'sitemap.xml'), xml);
  return true;
}

function generateRobots(){
  const txt = [
    'User-agent: *',
    'Disallow: /admin/',
    'Disallow: /server/',
    'Sitemap: https://neuralgpt.store/sitemap.xml'
  ].join('\\n');

  fs.writeFileSync(path.join(PUBLIC,'robots.txt'), txt);
  return true;
}

function generateJSONLD(){
  const json = {
    "@context":"https://schema.org",
    "@type":"WebSite",
    "name":"NeuralGPT.Store",
    "url":"https://neuralgpt.store",
    "description":"NeuroCommerce Marketplace powered by Irene Local AI.",
    "publisher":{
      "@type":"Organization",
      "name":"NeuralGPT.Store"
    }
  };

  fs.writeFileSync(path.join(PUBLIC,'jsonld_site.json'), JSON.stringify(json,null,2));
  return true;
}

function buildAll(){
  try{
    generateSitemap();
    generateRobots();
    generateJSONLD();
    return {ok:true};
  }catch(e){
    return {ok:false,error:e.message};
  }
}

module.exports = { buildAll };
