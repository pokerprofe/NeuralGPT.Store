const fs = require('fs');
const path = require('path');

function safeRead(p, fallback){
  try { return require(p); } catch { return fallback; }
}

function buildSummary(){
  const products  = safeRead('../data/products.json', []);
  const agents    = safeRead('../data/agents.json', []);
  const suppliers = safeRead('../data/suppliers/suppliers.json', []);
  const orders    = safeRead('../data/orders/orders.json', []);
  const customers = safeRead('../data/customers/customers.json', []);

  return {
    products: products.length,
    agents: agents.length,
    suppliers: suppliers.length,
    orders: orders.length,
    customers: customers.length
  };
}

function answerQuestion(payload){
  const s = buildSummary();
  const q = (payload.message || '').toLowerCase();

  let base =
    'Estás hablando con el asistente interno de NeuralGPT.Store. ' +
    'La plataforma dispone actualmente de ' + s.products + ' productos, ' +
    s.agents + ' agentes IA, ' + s.suppliers + ' proveedores registrados y ' +
    s.customers + ' clientes en base de datos. ';

  if (q.includes('pago') || q.includes('precio')) {
    base += 'Los pagos reales aún no están activos: todo está en modo TEST y sin cargos. ';
  } else if (q.includes('envío') || q.includes('shipping')) {
    base += 'Los detalles de envío dependen del proveedor seleccionado; esta versión aún no calcula tarifas automáticamente. ';
  } else if (q.includes('ia') || q.includes('agente')) {
    base += 'Los agentes IA se entregan como productos digitales listos para integrar en flujos de trabajo del cliente. ';
  } else {
    base += 'Tu consulta será registrada para que el propietario pueda responder con más detalle si es necesario. ';
  }

  return {
    ok:true,
    answer: base.trim(),
    summary: s
  };
}

module.exports = { answerQuestion };
