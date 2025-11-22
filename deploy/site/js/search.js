(function() {

  const resultsBox = document.getElementById('search-results');
  const input = document.getElementById('search-input');

  async function loadProducts() {
    try {
      const res = await fetch('../data/products.json');
      return await res.json();
    } catch (e) {
      console.error('Error cargando productos', e);
      return [];
    }
  }

  function loadCourses() {
    return [
      { name: 'Curso IA Junior', url: '../training/ia-junior.html', type: 'Curso' },
      { name: 'Robótica Escolar', url: '../training/robotica-escolar.html', type: 'Curso' },
      { name: 'IA Creativa', url: '../training/ia-creative.html', type: 'Curso' }
    ];
  }

  function loadAgents() {
    return [
      { name: 'Irene Local v3', url: '../agents/irene-local.html', type: 'Agente IA' },
      { name: 'Guardian V5', url: '../agents/guardian-v5.html', type: 'Agente IA' },
      { name: 'NeuroSales AI', url: '../agents/neurosales.html', type: 'Agente IA' },
      { name: 'MotherCore AI', url: '../agents/mothercore.html', type: 'Agente IA' },
      { name: 'AtlasMind', url: '../agents/atlasmind.html', type: 'Agente IA' },
      { name: 'LexOracle', url: '../agents/lexoracle.html', type: 'Agente IA' },
      { name: 'DataOracle', url: '../agents/dataoracle.html', type: 'Agente IA' },
      { name: 'AutoVendor', url: '../agents/autovendor.html', type: 'Agente IA' },
      { name: 'Enterprise AI', url: '../agents/enterpriseai.html', type: 'Agente IA' }
    ];
  }

  function drawResult(item) {
    const div = document.createElement('a');
    div.className = 'ng-card ng-card-hover';
    div.href = item.url;
    div.innerHTML = 
      <h3 class="ng-title-md"></h3>
      <p></p>
    ;
    return div;
  }

  async function search(q) {
    const query = q.trim().toLowerCase();
    resultsBox.innerHTML = '';

    if (!query) return;

    const products = await loadProducts();
    const courses = loadCourses();
    const agents = loadAgents();

    const all = [];

    // productos
    products.forEach(p => {
      if (
        p.name?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query)
      ) {
        all.push({
          name: p.name,
          type: 'Producto',
          url: '../product/index.html?id=' + encodeURIComponent(p.id)
        });
      }
    });

    // cursos
    courses.forEach(c => {
      if (c.name.toLowerCase().includes(query)) all.push(c);
    });

    // agentes
    agents.forEach(a => {
      if (a.name.toLowerCase().includes(query)) all.push(a);
    });

    // pintar
    if (!all.length) {
      resultsBox.innerHTML = '<p class="ng-text-muted">Sin resultados.</p>';
      return;
    }

    all.forEach(item => {
      resultsBox.appendChild(drawResult(item));
    });

  }

  document.addEventListener('DOMContentLoaded', function() {
    if (!input) return;
    input.addEventListener('input', () => search(input.value));
  });

})();
