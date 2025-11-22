(async function() {
  try {
    const res = await fetch('../seo/meta.json');
    const meta = await res.json();

    const head = document.querySelector('head');

    const d = document.createElement('meta');
    d.name = 'description';
    d.content = meta.description;
    head.appendChild(d);

    const k = document.createElement('meta');
    k.name = 'keywords';
    k.content = meta.keywords.join(', ');
    head.appendChild(k);

    const ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.content = meta.site_name;
    head.appendChild(ogTitle);

    const ogDesc = document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    ogDesc.content = meta.description;
    head.appendChild(ogDesc);

  } catch (e) {
    console.error("SEO injection error", e);
  }
})();
