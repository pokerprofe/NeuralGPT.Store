//////////////////////////////////////////////////////////////
// IRENE_BRAIN v10
// Motor cognitivo de NeuralGPT.Store
// - Estado del sistema
// - Decisiones de negocio
// - Predicción simple (ventas/tráfico)
// - Balance contable básico
// - Priorización de acciones
// - Memoria fría limitada en JSON
//////////////////////////////////////////////////////////////

const fs   = require('fs');
const path = require('path');

const STATE_FILE = path.join(__dirname, 'irene_brain_state.json');

function safeLoadState(){
  try{
    if(!fs.existsSync(STATE_FILE)) return { runs:0, notes:[], lastDecisions:[] };
    const txt = fs.readFileSync(STATE_FILE,'utf8');
    return JSON.parse(txt);
  }catch(e){
    return { runs:0, notes:[], lastDecisions:[], error:e.message };
  }
}

function safeSaveState(st){
  try{
    const clean = {
      runs: Number(st.runs||0),
      notes: Array.isArray(st.notes)? st.notes.slice(-200):[],
      lastDecisions: Array.isArray(st.lastDecisions)? st.lastDecisions.slice(-200):[]
    };
    fs.writeFileSync(STATE_FILE, JSON.stringify(clean,null,2));
    return true;
  }catch(e){
    return false;
  }
}

function summarizeMetrics(m){
  const out = {};
  if(!m) return out;
  if(m.sales){
    const arr = m.sales.filter(x=>typeof x==='number');
    const total = arr.reduce((a,b)=>a+b,0);
    const avg   = arr.length? total/arr.length:0;
    out.sales = { total, avg, last: arr.slice(-1)[0]||0 };
  }
  if(m.traffic){
    const arr = m.traffic.filter(x=>typeof x==='number');
    const total = arr.reduce((a,b)=>a+b,0);
    const avg   = arr.length? total/arr.length:0;
    out.traffic = { total, avg, last: arr.slice(-1)[0]||0 };
  }
  if(m.expenses){
    const arr = m.expenses.filter(x=>typeof x==='number');
    const total = arr.reduce((a,b)=>a+b,0);
    out.expenses = { total };
  }
  return out;
}

function classifyLevel(v){
  if(v<=0) return 'zero';
  if(v<100) return 'low';
  if(v<1000) return 'mid';
  return 'high';
}

function decideNextActions(ctx){
  const metrics = summarizeMetrics(ctx.metrics||{});
  const levelSales    = classifyLevel((metrics.sales && metrics.sales.total)||0);
  const levelTraffic  = classifyLevel((metrics.traffic && metrics.traffic.total)||0);
  const levelExpenses = classifyLevel((metrics.expenses && metrics.expenses.total)||0);

  const actions = [];

  if(levelSales==='low' && levelTraffic!=='low'){
    actions.push('Activar campañas de conversión: destacar modelos premium y Quantum Pass.');
  }
  if(levelTraffic==='low'){
    actions.push('Incrementar captación: outreach B2B, afiliados y promociones cruzadas.');
  }
  if(levelSales==='high' && levelExpenses==='high'){
    actions.push('Revisar comisiones, costes de APIs externas y optimizar márgenes.');
  }
  if(actions.length===0){
    actions.push('Mantener estrategia actual, monitorizar KPIs y reforzar IA de soporte.');
  }

  return { levelSales, levelTraffic, levelExpenses, actions };
}

function scoreVendor(v){
  if(!v) return { score:0, tag:'unknown' };
  const sales = Number(v.sales||0);
  const refunds = Number(v.refunds||0);
  const onTime  = Number(v.onTime||0); // porcentaje 0–100
  let score = 0;

  score += Math.min(sales,10000)/100;
  score -= refunds*2;
  score += onTime/5;

  if(score<0) score = 0;
  if(score>100) score = 100;

  let tag = 'normal';
  if(score>=80) tag = 'estrella';
  else if(score<=30) tag = 'riesgo';

  return { score, tag };
}

function calculateBalance(inp){
  const sales    = (inp && Array.isArray(inp.sales))    ? inp.sales    : [];
  const expenses = (inp && Array.isArray(inp.expenses)) ? inp.expenses : [];
  const totalSales    = sales.reduce((a,b)=>a+(Number(b)||0),0);
  const totalExpenses = expenses.reduce((a,b)=>a+(Number(b)||0),0);
  const profit        = totalSales - totalExpenses;
  const margin        = totalSales>0 ? (profit/totalSales)*100 : 0;
  return {
    totalSales,
    totalExpenses,
    profit,
    margin: Number(margin.toFixed(2)),
    status: profit>0 ? 'beneficio' : (profit<0 ? 'pérdida' : 'equilibrio')
  };
}

const IRENE_BRAIN = {

  systemStatus(){
    const st = safeLoadState();
    return {
      ok: true,
      runs: st.runs||0,
      lastDecisions: (st.lastDecisions||[]).slice(-5),
      notes: (st.notes||[]).slice(-5)
    };
  },

  decide(a,b,c,d,e){
    const ctx = a && typeof a==='object' ? a : { metrics:{} };
    const res = decideNextActions(ctx);

    const st = safeLoadState();
    st.runs = (st.runs||0)+1;
    st.lastDecisions = st.lastDecisions || [];
    st.lastDecisions.push({
      t: new Date().toISOString(),
      summary: res.actions[0]||'sin-acción'
    });
    safeSaveState(st);

    return { ok:true, context:ctx, decision:res };
  },

  predictSales(salesHistory){
    const arr = Array.isArray(salesHistory)? salesHistory.map(x=>Number(x)||0):[];
    const last = arr.slice(-3);
    const avg  = last.length ? last.reduce((a,b)=>a+b,0)/last.length : 0;
    const next = avg*1.05;
    return { ok:true, base:avg, next: Number(next.toFixed(2)) };
  },

  predictTraffic(trafficHistory){
    const arr = Array.isArray(trafficHistory)? trafficHistory.map(x=>Number(x)||0):[];
    const last = arr.slice(-5);
    const avg  = last.length ? last.reduce((a,b)=>a+b,0)/last.length : 0;
    const next = avg*1.03;
    return { ok:true, base:avg, next: Number(next.toFixed(2)) };
  },

  balance(input){
    return calculateBalance(input||{});
  },

  vendorScore(vendor){
    return scoreVendor(vendor);
  },

  dailySummary(metrics){
    const m = summarizeMetrics(metrics||{});
    const balance = calculateBalance({
      sales: (metrics && metrics.sales)||[],
      expenses: (metrics && metrics.expenses)||[]
    });

    const summary = {
      sales: m.sales||{},
      traffic: m.traffic||{},
      expenses: m.expenses||{},
      balance
    };

    const st = safeLoadState();
    st.notes = st.notes || [];
    st.notes.push({
      t: new Date().toISOString(),
      summary
    });
    safeSaveState(st);

    return { ok:true, summary };
  }
};

module.exports = IRENE_BRAIN;
