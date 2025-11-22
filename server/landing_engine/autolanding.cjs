const fs   = require('fs');
const path = require('path');

class AutoLandingMatrix {

    constructor() {
        this.root = path.join(__dirname, '..', 'public_html', 'landing');
    }

    ensureRoot() {
        if (!fs.existsSync(this.root)) {
            fs.mkdirSync(this.root, { recursive: true });
        }
    }

    slugify(text) {
        if (!text) return 'producto-' + Date.now();
        return text
            .toString()
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            || 'producto-' + Date.now();
    }

    buildHTML(product, lang, slug) {
        const title       = product.title       || 'Producto NeuralGPT.Store';
        const subtitle    = product.subtitle    || '';
        const description = product.description || '';
        const price       = product.price       || '';
        const category    = product.category    || '';
        const level       = product.level       || '';
        const tags        = Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || '');

        const urlCanonical = `https://neuralgpt.store/landing/${slug}/`;

        return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<title>${title} · NeuralGPT.Store</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="${description.substring(0, 180).replace(/"/g, '')}">
<link rel="canonical" href="${urlCanonical}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description.substring(0, 180).replace(/"/g, '')}">
<meta property="og:type" content="website">
<meta property="og:url" content="${urlCanonical}">
<meta name="keywords" content="NeuralGPT, IA, tecnología, ${tags}">
<link rel="stylesheet" href="/styles/global.css">
</head>
<body class="ng-body">
  <main class="ng-main ng-p-lg">
    <section class="ng-section ng-landing-hero">
      <header class="ng-section-header">
        <h1 class="ng-title-xl">${title}</h1>
        ${subtitle ? `<p class="ng-text-lg ng-text-muted">${subtitle}</p>` : ''}
      </header>

      <div class="ng-grid-2 ng-gap-lg ng-mt-lg">
        <div class="ng-card ng-card-solid ng-p-lg">
          <h2 class="ng-title-md">Descripción</h2>
          <p class="ng-text-base">${description}</p>

          <ul class="ng-list ng-mt-md">
            ${category ? `<li><strong>Categoría:</strong> ${category}</li>` : ''}
            ${level ? `<li><strong>Nivel:</strong> ${level}</li>` : ''}
            ${tags ? `<li><strong>Etiquetas:</strong> ${tags}</li>` : ''}
          </ul>
        </div>

        <div class="ng-card ng-card-gold ng-p-lg">
          <h2 class="ng-title-md">Oferta especial</h2>
          ${price ? `<p class="ng-price">Desde: <span class="ng-price-amount">${price}</span></p>` : ''}
          <p class="ng-text-muted">Accede al ecosistema NeuralGPT.Store y potencia tu negocio con IA, robótica y automatización.</p>
          <a href="/pay/" class="ng-btn ng-btn-primary ng-w-full ng-mt-md">Empezar ahora</a>
          <a href="/catalog/" class="ng-btn ng-btn-secondary ng-w-full ng-mt-sm">Ver más productos</a>
        </div>
      </div>
    </section>

    <section class="ng-section ng-mt-xl">
      <header class="ng-section-header">
        <h2 class="ng-title-lg">¿Por qué NeuralGPT.Store?</h2>
      </header>
      <div class="ng-grid-3 ng-gap-lg">
        <div class="ng-card ng-card-outline ng-p-md">
          <h3 class="ng-title-sm">Infraestructura cuántica</h3>
          <p class="ng-text-sm">Infraestructura diseñada por un Chief Quantum Systems Architect, pensada para escalar a nivel global.</p>
        </div>
        <div class="ng-card ng-card-outline ng-p-md">
          <h3 class="ng-title-sm">Seguridad de nivel militar</h3>
          <p class="ng-text-sm">Capas de seguridad internas y módulos de guardianes digitales protegiendo tus datos.</p>
        </div>
        <div class="ng-card ng-card-outline ng-p-md">
          <h3 class="ng-title-sm">IA como mayordomo</h3>
          <p class="ng-text-sm">Irene guía, asesora y acompaña a cada usuario en su idioma local.</p>
        </div>
      </div>
    </section>
  </main>
</body>
</html>`;
    }

    generateLanding(product, lang = 'es') {
        this.ensureRoot();

        const slug = this.slugify(product.slug || product.title);
        const destDir  = path.join(this.root, slug);
        const filePath = path.join(destDir, 'index.html');

        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        const html = this.buildHTML(product, lang, slug);
        fs.writeFileSync(filePath, html, 'utf8');

        return {
            slug,
            url: `/landing/${slug}/`,
            filePath
        };
    }

    listLandings() {
        this.ensureRoot();
        const dirs = fs.readdirSync(this.root, { withFileTypes: true })
            .filter(d => d.isDirectory())
            .map(d => d.name);

        return dirs.map(slug => ({
            slug,
            url: `/landing/${slug}/`
        }));
    }
}

module.exports = new AutoLandingMatrix();
