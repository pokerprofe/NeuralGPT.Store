//////////////////////////////////////////////////////
// IRENE_LOGIC v1 - Razonamiento estratégico
//////////////////////////////////////////////////////
module.exports = {
  decide(optionA, optionB, weightA=1, weightB=1){
    return (weightA >= weightB) ? optionA : optionB;
  },

  evaluateRisk(data){
    const score = (data.trafico || 0) + (data.errores || 0) + (data.alertas || 0);
    if(score > 80) return 'ALTO';
    if(score > 40) return 'MEDIO';
    return 'BAJO';
  }
}
