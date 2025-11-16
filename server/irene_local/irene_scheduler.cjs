//// =============================================================
// IRENE_SCHED v1 — Scheduler ligero
// NO ejecuta hilos ni timers globales por defecto.
// Sólo corre cuando se llama desde /api/irene/run-daily o similar.
// =============================================================

const IRENE_NOTIFY = require('./irene_notify.cjs');

async function runDaily(){
  // Por defecto mira suscripciones que vencen en 7 días
  const OUT = await IRENE_NOTIFY.sendReminders({
    daysAhead: 7,
    sendEmails: true
  });

  return {
    when: new Date().toISOString(),
    result: OUT
  };
}

module.exports = {
  runDaily
};
