const os = require('os');

function getStatus(){
  return {
    ok:true,
    cpu: os.loadavg(),
    ram: {
      total: os.totalmem(),
      free: os.freemem()
    },
    uptime: os.uptime() * 1000,
    platform: os.platform()
  };
}

module.exports = { getStatus };
