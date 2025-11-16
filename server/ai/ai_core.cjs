const fs = require('fs');
const path = require('path');
const notify = require('../notifications/notifications_handler.cjs');

const db = path.join(__dirname, 'localDB.json');

function load(){
  return JSON.parse(fs.readFileSync(db));
}

// Motor simple de inferencia local
function answer(msg){
  const data = load();
  const t = msg.toLowerCase();

  // Moderación básica
  if(t.includes('insulto') || t.includes('malo')) {
    notify.push('Mensaje inapropiado filtrado','warn');
    return 'Tu mensaje ha sido moderado para mantener un entorno seguro.';
  }

  // Dudas sobre productos
  if(t.includes('producto') || t.includes('chip') || t.includes('agente')){
    return 'Busca cualquier producto en /search o accede al panel del Halcón para más detalles.';
  }

  // Dudas del sistema
  if(t.includes('estado') || t.includes('servidor')){
    return Sistema en estado:  — versión IA ;
  }

  // Pagos
  if(t.includes('pago')){
    return data.faq.pagos;
  }

  // Envíos
  if(t.includes('envio')){
    return data.faq.envio;
  }

  // Acceso al Halcón
  if(t.includes('halcon') || t.includes('cockpit')){
    return 'Accede a tu Centro de Mando en /admin/cockpit para ver estadísticas, alertas y actividad en vivo.';
  }

  // Respuesta general
  return 'Estoy lista para ayudarte con el sistema, clientes, productos o panel de mando.';
}

// API que leerá el cockpit y el chat interno
function assist(input){
  const out = answer(input);
  notify.push('IA asistió a una consulta','info');
  return { ok:true, reply: out };
}

module.exports = { assist };
