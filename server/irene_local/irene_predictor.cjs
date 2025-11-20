//////////////////////////////////////////////////////
// IRENE_PREDICTOR v1 - Proyección inteligente
//////////////////////////////////////////////////////
module.exports = {
  predictSales(history){
    if(!Array.isArray(history) || history.length===0) return 0;
    const avg = history.reduce((t,x)=>t+Number(x),0) / history.length;
    return avg * 1.18;  // crecimiento esperado
  },

  predictTraffic(h){
    if(!Array.isArray(h) || h.length===0) return 0;
    return h[h.length-1] * 1.12; // tendencia ligera
  }
}
