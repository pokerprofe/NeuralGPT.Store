//////////////////////////////////////////////////////
// IRENE_MATH v1 - Contabilidad y cálculos del negocio
//////////////////////////////////////////////////////
module.exports = {
  sum(a,b){ return Number(a)+Number(b); },
  sub(a,b){ return Number(a)-Number(b); },
  mul(a,b){ return Number(a)*Number(b); },
  div(a,b){ return (Number(b)===0)?0:Number(a)/Number(b); },

  balance(ing, gast){
    const totalIng = ing.reduce((t,x)=>t+Number(x),0);
    const totalGas = gast.reduce((t,x)=>t+Number(x),0);
    return { ingresos:totalIng, gastos:totalGas, balance: totalIng-totalGas };
  },

  forecastBalance(current, rate){
    return Number(current) * (1 + Number(rate));
  }
}
