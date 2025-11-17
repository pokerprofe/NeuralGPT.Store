//////////////////////////////////////////////////////////
// IRENE PLANNER v3
// Planificación autónoma, tareas, recordatorios
//////////////////////////////////////////////////////////
module.exports = {
  planDay(tasks){
    // tasks = [ {tarea,impacto,urgencia} ]
    const sorted = tasks.sort((a,b)=> 
      (b.impacto+b.urgencia)-(a.impacto+a.urgencia)
    );
    return { ok:true, agenda:sorted };
  },

  nextActions(system){
    return {
      ok:true,
      revisar_logs: system.errors>3,
      optimizar_performance: system.cpu>75,
      backup: system.changes>10
    };
  }
};
