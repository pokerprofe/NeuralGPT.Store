const os   = require('os');
const fs   = require('fs');
const path = require('path');

function exists(p){
  try { return fs.existsSync(p); } catch { return false; }
}

function diag(){
  const root   = path.join(__dirname,'..');
  const server = path.join(root,'server');
  const data   = path.join(root,'data');
  const logs   = path.join(root,'logs');

  const mem    = process.memoryUsage();
  const total  = os.totalmem();
  const free   = os.freemem();

  const modules = {
    irene_core:  exists(path.join(__dirname,'irene_core.cjs')),
    auto_tasks:  exists(path.join(server,'tasks','auto_tasks.cjs')),
    auto_vendor: exists(path.join(server,'autovendor','autovendor.cjs')),
    catalog:     exists(path.join(server,'catalog_engine.cjs')),
    firewall:    exists(path.join(server,'firewall_vpn.cjs')),
    hardening:   exists(path.join(server,'hardening_engine.cjs')),
    metrics:     exists(path.join(server,'metrics_engine.cjs')),
    health:      exists(path.join(server,'health_monitor.cjs'))
  };

  let score = 100;
  Object.keys(modules).forEach(k=>{
    if(!modules[k]) score -= 7;
  });

  const loadavg = os.loadavg ? os.loadavg() : [0,0,0];

  return {
    ts: new Date().toISOString(),
    uptimeSec: process.uptime(),
    nodeVersion: process.version,
    platform: os.platform(),
    cpuCount: os.cpus().length,
    load: {
      '1min':  loadavg[0],
      '5min':  loadavg[1],
      '15min': loadavg[2]
    },
    memory: {
      rss:       mem.rss,
      heapUsed:  mem.heapUsed,
      heapTotal: mem.heapTotal,
      external:  mem.external,
      osTotal:   total,
      osFree:    free,
      osUsagePct: Number(((total-free)/total*100).toFixed(1))
    },
    paths: {
      root,
      server,
      data,
      logs
    },
    modules,
    healthScore: score < 0 ? 0 : score
  };
}

module.exports = { diag };
