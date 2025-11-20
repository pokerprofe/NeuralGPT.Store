/////////////////////////////////////////////////////////////////////////
// GLOBAL AUTO-CATALOG ORCHESTRATOR v1.0
//
// Irene Local coordina TODOS los motores:
//  • AutoVendor
//  • AutoProduct
//  • AutoPublish
//  • Verification Engine
//  • Lingua Engine
//  • Metrics Engine
//  • Task Engine
//
// Este módulo es el CEREBRO que decide:
//  – Cuándo publicar nuevos productos.
//  – Cuándo verificar proveedores.
//  – Cuándo traducir y optimizar el catálogo.
//  – Cuándo eliminar duplicados o limpiar basura.
//  – Cuándo regenerar SEO.
//  – Cuándo activar modo “boost” si hay mucho tráfico.
//
// COMPLETAMENTE LOCAL.
// SIN APIs EXTERNAS.
// SIN COSTES.
// Irene al mando total.
//
/////////////////////////////////////////////////////////////////////////

const fs = require('fs');
const path = require('path');

const AUTOGEN   = require('../auto_product/auto_product_gen.cjs');
const AUTOPUB   = require('../auto_publish/auto_publish.cjs');
const VERIFY    = require('../provider_verify/verify_engine.cjs');
const METRICS   = require('../metrics_engine.cjs');
const LINGUA    = require('../lingua/lingua_engine.cjs');

const logFile = path.join(__dirname,'orchestrator.log');

function log(msg){
  const line = '['+new Date().toISOString()+'] '+msg+'\\n';
  try { fs.appendFileSync(logFile,line); }catch{}
}

function cleanDuplicates(){
  const catPath = path.join(__dirname,'..','data','catalog.json');
  try{
    const raw = JSON.parse(fs.readFileSync(catPath,'utf8'));
    const seen = {};
    const out = [];

    for(const p of raw){
      if(!seen[p.name]){
        seen[p.name] = true;
        out.push(p);
      }
    }

    fs.writeFileSync(catPath, JSON.stringify(out,null,2));
    log('CleanDuplicates: OK ('+out.length+' products)');
  }catch(e){
    log('CleanDuplicates ERROR: '+e.message);
  }
}

function optimizeCatalog(){
  try{
    const overview = METRICS.getOverview();
    const pc = overview.kpi.totalProducts || 0;

    if(pc < 100){
      log('OptimizeCatalog: Low-volume → boost mode');
      AUTOPUB.publishProduct();
      AUTOPUB.publishProduct();
    }else if(pc > 500){
      log('OptimizeCatalog: High-volume → maintenance mode');
      cleanDuplicates();
    }else{
      log('OptimizeCatalog: Balanced → standard publish');
      AUTOPUB.publishProduct();
    }
  }catch(e){
    log('OptimizeCatalog ERROR: '+e.message);
  }
}

function verifyVendors(){
  try{
    const res = VERIFY.verifyAll();
    const good = res.filter(v=>v.status==='verified').length;
    log('VerifyVendors: '+good+' verified / '+res.length+' total');
  }catch(e){
    log('VerifyVendors ERROR: '+e.message);
  }
}

function orchestrate(){
  log('ORCHESTRATOR: cycle begin');
  verifyVendors();
  optimizeCatalog();
  cleanDuplicates();
  log('ORCHESTRATOR: cycle end');
}

module.exports = { orchestrate };
