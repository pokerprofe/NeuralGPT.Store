//
// --- MÓDULO PREMIUM DE METADATOS DE PRODUCTO (PD-1) ---
//

// Conversión de precio a formato inteligente
function formatPrice(value) {
    if (value === undefined || value === null || value === "" || isNaN(value)) return "Consultar";
    return parseFloat(value).toFixed(2) + " €";
}

// Simulación de stock dinámico
function getStockStatus() {
    const states = [
        "En stock",
        "Stock bajo",
        "Últimas unidades",
        "Disponible bajo pedido"
    ];
    return states[Math.floor(Math.random() * states.length)];
}

// Rating visual estrellas
function buildRating(r) {
    const stars = Math.max(1, Math.min(5, r || 5));
    let html = "";
    for (let i = 0; i < stars; i++) html += "<span class=\"star full\"></span>";
    for (let i = stars; i < 5; i++) html += "<span class=\"star empty\"></span>";
    return html;
}

// Microdatos SEO (schema.org)
function injectSEO(product) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.title,
        "image": product.image,
        "description": product.description,
        "sku": "SKU-" + product.id,
        "brand": {
            "@type": "Brand",
            "name": "NeuralGPT.Store"
        },
        "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": "EUR",
            "price": product.price || "0",
            "availability": "https://schema.org/InStock"
        }
    });
    document.head.appendChild(script);
}

// API global
window.ProductMeta = {
    formatPrice,
    getStockStatus,
    buildRating,
    injectSEO
};

