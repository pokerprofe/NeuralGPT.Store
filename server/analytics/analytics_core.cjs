module.exports = {
  status(){
    return {
      ok:true,
      cpu:  Math.floor(Math.random()*40)+10,
      ram:  Math.floor(Math.random()*50)+20,
      disk: Math.floor(Math.random()*60)+10,
      time: Date.now()
    };
  },

  radar(){
    return {
      ok:true,
      threats: [
        { id:'scan-'+Date.now(), type:'scan', level:'low',  msg:'Ping externo bloqueado' },
        { id:'sys-'+Date.now(),  type:'sys',  level:'info', msg:'Actividad normal del sistema' }
      ]
    };
  },

  stats(){
    return {
      ok:true,
      uptime: process.uptime(),
      requests: Math.floor(Math.random()*500),
      alerts:   Math.floor(Math.random()*10)
    };
  }
};
