///////////////////////////////
// BENEFIT POPUP ENGINE v1.0
// • Auto-explica los beneficios
// • Version local de un 'sales assistant'
///////////////////////////////

function showBenefits(type='general'){
  const msgs = {
    general: [
      'Aceleración inmediata del trabajo.',
      'Automatización de tareas que consumen horas.',
      'Acceso a más de 50 agentes IA en un único ecosistema.',
      'Ahorro económico superior al coste anual de la suscripción.'
    ],
    business: [
      'Optimiza procesos internos con IA.',
      'Reduce el 40–60% del tiempo administrativo.',
      'Permite a tus empleados trabajar con herramientas avanzadas sin costo extra.',
      'Mejora productividad, reduce errores, escala más rápido.'
    ],
    creator: [
      'Genera contenido 5 veces más rápido.',
      'Organiza proyectos complejos sin esfuerzo.',
      'Convierte ideas en productos reales.',
      'Paga una vez, úsalo todo el año.'
    ],
    developer: [
      'Asistentes técnicos inteligentes.',
      'Refactorización automática.',
      'Análisis de código y documentación.',
      'Mejora velocidad de desarrollo y reduce bugs.'
    ]
  };

  const pack = msgs[type] || msgs.general;

  // Popup container
  const div = document.createElement('div');
  div.id = 'benefitPopup';
  div.style.position = 'fixed';
  div.style.bottom = '40px';
  div.style.right = '40px';
  div.style.background = '#000';
  div.style.color = '#d4af37';
  div.style.border = '1px solid #d4af37';
  div.style.padding = '20px';
  div.style.maxWidth = '300px';
  div.style.fontFamily = 'Arial';
  div.style.zIndex = '999999';

  const title = document.createElement('h3');
  title.innerText = 'Benefits of NeuralGPT Ecosystem';
  title.style.marginTop = '0';

  const ul = document.createElement('ul');
  pack.forEach(m=>{
    const li = document.createElement('li');
    li.innerText = m;
    li.style.marginBottom = '8px';
    ul.appendChild(li);
  });

  const close = document.createElement('button');
  close.innerText = 'Close';
  close.style.marginTop = '10px';
  close.style.padding = '8px';
  close.style.background = '#111';
  close.style.border = '1px solid #d4af37';
  close.style.color = '#d4af37';
  close.onclick = ()=>div.remove();

  div.appendChild(title);
  div.appendChild(ul);
  div.appendChild(close);

  document.body.appendChild(div);
}

window.showBenefits = showBenefits;
