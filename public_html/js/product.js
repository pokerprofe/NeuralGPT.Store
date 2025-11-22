(function() {
 // Obtener parÃ¡metro ID del producto
 const params = new URLSearchParams(window.location.search);
 const productId = params.get('id');

 const productTitle = document.getElementById('product-title');
 const productImage = document.getElementById('product-image');
 const productDescription = document.getElementById('product-description');
 const productCategory = document.getElementById('product-category');
 const productTags = document.getElementById('product-tags');
 const productPrice = document.getElementById('product-price');
 const relatedProductsContainer = document.getElementById('related-products');
 const addToCartBtn = document.getElementById('add-to-cart');

 // FunciÃ³n para cargar JSON local
 async function loadProducts() {
 try {
 const response = await fetch('../data/products.json');
 return await response.json();
 } catch (e) {
 console.error('Error cargando productos:', e);
 return [];
 }
 }

 // Render del producto principal
 async function renderProduct() {
 // Módulo 'Comprados juntos'
 renderBoughtTogether(product);

 // Inserción automática de tabla técnica
 if (product.specs) {
 renderSpecs(product);
 }

 const products = await loadProducts();
 const product = products.find(p => p.id == productId);

 if (!product) {
 productTitle.textContent = 'Producto no encontrado';
 return;
 }

 productTitle.textContent = product.title;
 productImage.src = product.image || '../assets/images/no_image.png';
 productDescription.textContent = product.description;
 productCategory.textContent = 'CategorÃ­a: ' + product.category;
 productTags.textContent = 'Tags: ' + (product.tags || []).join(', ');
 productPrice.textContent = 'Precio estimado: ' + (product.price || 'consultar') + 'â‚¬';

 renderRelated(products, product);
 setupCart(product);
 }

 // Render relacionados por categorÃ­a
 function renderRelated(products, product) {
 const related = products.filter(
 p => p.category === product.category && p.id !== product.id
 ).slice(0, 4);

 relatedProductsContainer.innerHTML = '';

 related.forEach(r => {
 const div = document.createElement('div');
 div.className = 'related-item';
 div.innerHTML = 
 <img src="\" class="related-thumb" />
 <h4>\</h4>
 <a href="../product/index.html?id=\">Ver</a>
 ;
 relatedProductsContainer.appendChild(div);
 });
 }

 // Carrito (localStorage)
 function setupCart(product) {
 addToCartBtn.addEventListener('click', () => {
 let cart = JSON.parse(localStorage.getItem('cart')) || [];
 cart.push({
 id: product.id,
 title: product.title,
 price: product.price,
 image: product.image
 });
 localStorage.setItem('cart', JSON.stringify(cart));
 alert('Producto aÃ±adido al carrito');
 });
 }

 // Inicio
 renderProduct();
})();

//
// --- INTEGRACIÃ“N CON METADATOS DE PRODUCTO (PD-1 Â· BLOQUE 10) ---
// - SEO automÃ¡tico
// - Stock visual
// - Rating premium
// - Precio formateado
//

(async function enhanceProductMeta() {
 const params = new URLSearchParams(window.location.search);
 const productId = params.get("id");
 if (!productId) return;

 const res = await fetch("../data/products.json");
 const products = await res.json();
 const product = products.find(p => p.id == productId);
 if (!product) return;

 // SEO automÃ¡tico
 if (window.ProductMeta && ProductMeta.injectSEO) {
 ProductMeta.injectSEO(product);
 }

 // Meta box
 const meta = document.getElementById("product-meta");
 if (!meta) return;

 // Stock visual
 const stock = document.createElement("span");
 stock.textContent = "Estado: " + (ProductMeta.getStockStatus ? ProductMeta.getStockStatus() : "En stock");
 meta.appendChild(stock);

 // Rating visual
 const ratingBox = document.createElement("div");
 ratingBox.id = "rating-box";
 ratingBox.innerHTML = (ProductMeta.buildRating ? ProductMeta.buildRating(product.rating || 4) : "");
 meta.appendChild(ratingBox);

 // Reforzar precio
 const price = document.getElementById("product-price");
 if (price) {
 price.textContent = "Precio estimado: " + (ProductMeta.formatPrice ? ProductMeta.formatPrice(product.price) : (product.price + " â‚¬"));
 }
})();
//
// --- PD-1 · BLOQUE 11 Sistema de galería premium para productos ---
// - Galería de miniaturas tipo Amazon
// - Imagen principal dinámica
// - Estilos visuales premium
//

function renderGallery(product) {

 // Validación
 if (!product || !product.images || !Array.isArray(product.images)) return;

 const mainImg = document.getElementById("product-image");
 if (!mainImg) return;

 // Crear contenedor si no existe
 let galleryContainer = document.getElementById("gallery-thumbs");
 if (!galleryContainer) {
 galleryContainer = document.createElement("div");
 galleryContainer.id = "gallery-thumbs";
 mainImg.parentNode.insertBefore(galleryContainer, mainImg);
 }

 galleryContainer.innerHTML = "";

 product.images.forEach((imgSrc, index) => {
 const thumb = document.createElement("img");
 thumb.src = imgSrc;
 thumb.className = "thumb-item";
 thumb.style.width = "70px";
 thumb.style.height = "70px";
 thumb.style.objectFit = "cover";
 thumb.style.borderRadius = "6px";
 thumb.style.margin = "6px";
 thumb.style.cursor = "pointer";
 thumb.style.border = "2px solid #333";
 thumb.style.transition = "0.25s";

 if (index === 0) {
 thumb.style.border = "2px solid #d4af37";
 }

 thumb.addEventListener("click", () => {
 mainImg.src = imgSrc;

 const all = document.querySelectorAll(".thumb-item");
 all.forEach(t => t.style.border = "2px solid #333");

 thumb.style.border = "2px solid #d4af37";
 });

 galleryContainer.appendChild(thumb);
 });
}

// Encapsular renderProduct original
const _renderProduct_gallery = renderProduct;

renderProduct = async function() {
 // Inyección automática de especificaciones técnicas
 if (product.specs) {
 renderSpecs(product);
 }

 // Ejecutar render original
 await _renderProduct_gallery();

 const params = new URLSearchParams(window.location.search);
 const productId = params.get("id");
 if (!productId) return;

 const res = await fetch("../data/products.json");
 const products = await res.json();
 const product = products.find(p => p.id == productId);

 if (!product) return;

 // Activar galería
 renderGallery(product);
};


//
// --- PD-1 · BLOQUE 12 Tabla de especificaciones técnicas ---
//

function renderSpecs(product) {

 // Validación
 if (!product || !product.specs || typeof product.specs !== "object") return;

 // Crear contenedor si no existe
 let specsContainer = document.getElementById("product-specs");
 if (!specsContainer) {
 specsContainer = document.createElement("div");
 specsContainer.id = "product-specs";
 specsContainer.style.marginTop = "40px";

 const title = document.createElement("h2");
 title.textContent = "Especificaciones técnicas";
 title.style.color = "#d4af37";
 title.style.marginBottom = "15px";
 title.style.fontWeight = "900";
 title.style.fontSize = "1.6rem";

 specsContainer.appendChild(title);
 document.getElementById("product-container").appendChild(specsContainer);
 }

 // Crear tabla
 const table = document.createElement("table");
 table.style.width = "100%";
 table.style.borderCollapse = "collapse";
 table.style.background = "#131313";
 table.style.border = "1px solid #d4af37";
 table.style.borderRadius = "8px";
 table.style.overflow = "hidden";

 Object.entries(product.specs).forEach(([key, value]) => {
 const row = document.createElement("tr");
 row.style.borderBottom = "1px solid #333";

 const cellKey = document.createElement("td");
 cellKey.textContent = key;
 cellKey.style.padding = "12px";
 cellKey.style.color = "#d4af37";
 cellKey.style.fontWeight = "700";
 cellKey.style.width = "35%";
 cellKey.style.borderRight = "1px solid #333";

 const cellVal = document.createElement("td");
 cellVal.textContent = value;
 cellVal.style.padding = "12px";
 cellVal.style.color = "#eee";

 row.appendChild(cellKey);
 row.appendChild(cellVal);
 table.appendChild(row);
 });

 specsContainer.appendChild(table);
}

// Conectar specs al render principal
const _renderProduct_specs = renderProduct;

renderProduct = async function() {
 // Inyección automática de especificaciones técnicas
 if (product.specs) {
 renderSpecs(product);
 }
 await _renderProduct_specs();

 const params = new URLSearchParams(window.location.search);
 const productId = params.get("id");

 if (!productId) return;

 const res = await fetch("../data/products.json");
 const products = await res.json();
 const product = products.find(p => p.id == productId);

 if (!product) return;

 // Activar specs
 renderSpecs(product);
};


//
// --- PD-1 · BLOQUE 13 Sistema de Reseñas Premium (Opiniones tipo Amazon) ---
//

function renderReviews(product) {

 if (!product || !product.reviews || !Array.isArray(product.reviews)) return;

 let reviewsContainer = document.getElementById("product-reviews");
 if (!reviewsContainer) {
 reviewsContainer = document.createElement("div");
 reviewsContainer.id = "product-reviews";
 reviewsContainer.style.marginTop = "50px";

 const title = document.createElement("h2");
 title.textContent = "Opiniones de clientes";
 title.style.color = "#d4af37";
 title.style.marginBottom = "15px";
 title.style.fontWeight = "900";
 title.style.fontSize = "1.6rem";

 document.getElementById("product-container").appendChild(title);
 document.getElementById("product-container").appendChild(reviewsContainer);
 }

 reviewsContainer.innerHTML = "";

 product.reviews.forEach(review => {

 const card = document.createElement("div");
 card.className = "review-card";
 card.style.background = "#111";
 card.style.padding = "20px";
 card.style.marginBottom = "20px";
 card.style.border = "1px solid #d4af37";
 card.style.borderRadius = "10px";
 card.style.boxShadow = "0 0 15px rgba(0,0,0,0.4)";
 card.style.transition = "0.3s";

 const user = document.createElement("h4");
 user.textContent = review.user;
 user.style.color = "#d4af37";
 user.style.marginBottom = "8px";

 const rating = document.createElement("div");
 rating.innerHTML = ProductMeta.buildRating(review.rating || 5);
 rating.style.marginBottom = "10px";

 const text = document.createElement("p");
 text.textContent = review.text;
 text.style.color = "#eee";
 text.style.lineHeight = "1.5";

 const date = document.createElement("span");
 date.textContent = "Fecha: " + review.date;
 date.style.display = "block";
 date.style.marginTop = "12px";
 date.style.color = "#aaa";
 date.style.fontSize = "0.9rem";

 card.appendChild(user);
 card.appendChild(rating);
 card.appendChild(text);
 card.appendChild(date);

 reviewsContainer.appendChild(card);
 });
}

// Conectar reseñas al flujo principal
const _renderProduct_reviews = renderProduct;

renderProduct = async function() {
 // Inyección automática de especificaciones técnicas
 if (product.specs) {
 renderSpecs(product);
 }
 await _renderProduct_reviews();

 const params = new URLSearchParams(window.location.search);
 const productId = params.get("id");
 if (!productId) return;

 const res = await fetch("../data/products.json");
 const products = await res.json();
 const product = products.find(p => p.id == productId);
 if (!product) return;

 renderReviews(product);
};


//
// --- PD-1 · BLOQUE 14 Beneficios y Preguntas Frecuentes (FAQ) ---
//

function renderBenefits(product) {

 if (!product || !product.benefits || !Array.isArray(product.benefits)) return;

 let benefitsContainer = document.getElementById("product-benefits");
 if (!benefitsContainer) {
 benefitsContainer = document.createElement("div");
 benefitsContainer.id = "product-benefits";
 benefitsContainer.style.marginTop = "50px";

 const title = document.createElement("h2");
 title.textContent = "¿Por qué elegir este producto?";
 title.style.color = "#d4af37";
 title.style.marginBottom = "15px";
 title.style.fontWeight = "900";
 title.style.fontSize = "1.6rem";

 document.getElementById("product-container").appendChild(title);
 document.getElementById("product-container").appendChild(benefitsContainer);
 }

 benefitsContainer.innerHTML = "";

 product.benefits.forEach(line => {
 const item = document.createElement("div");
 item.className = "benefit-item";
 item.style.padding = "12px 16px";
 item.style.margin = "8px 0";
 item.style.background = "#0e0e0e";
 item.style.borderLeft = "4px solid #d4af37";
 item.style.borderRadius = "6px";
 item.style.color = "#eee";
 item.style.fontSize = "1.1rem";
 item.style.boxShadow = "0 0 10px rgba(0,0,0,0.4)";
 item.textContent = " " + line;

 benefitsContainer.appendChild(item);
 });
}

function renderFAQ(product) {

 if (!product || !product.faq || !Array.isArray(product.faq)) return;

 let faqContainer = document.getElementById("product-faq");
 if (!faqContainer) {
 faqContainer = document.createElement("div");
 faqContainer.id = "product-faq";
 faqContainer.style.marginTop = "60px";

 const title = document.createElement("h2");
 title.textContent = "Preguntas frecuentes";
 title.style.color = "#d4af37";
 title.style.marginBottom = "15px";
 title.style.fontWeight = "900";
 title.style.fontSize = "1.6rem";

 document.getElementById("product-container").appendChild(title);
 document.getElementById("product-container").appendChild(faqContainer);
 }

 faqContainer.innerHTML = "";

 product.faq.forEach(entry => {

 const card = document.createElement("div");
 card.className = "faq-card";
 card.style.background = "#141414";
 card.style.padding = "20px";
 card.style.marginBottom = "20px";
 card.style.border = "1px solid #d4af37";
 card.style.borderRadius = "10px";
 card.style.cursor = "pointer";
 card.style.transition = "0.3s";

 const q = document.createElement("h4");
 q.textContent = entry.q;
 q.style.color = "#d4af37";
 q.style.marginBottom = "8px";

 const a = document.createElement("p");
 a.textContent = entry.a;
 a.style.color = "#eee";
 a.style.lineHeight = "1.5";
 a.style.display = "none";

 card.appendChild(q);
 card.appendChild(a);

 card.addEventListener("click", () => {
 a.style.display = (a.style.display === "none") ? "block" : "none";
 });

 faqContainer.appendChild(card);
 });
}

// Conectar beneficios + FAQ al render principal
const _renderProduct_benefits = renderProduct;

renderProduct = async function() {
 // Inyección automática de especificaciones técnicas
 if (product.specs) {
 renderSpecs(product);
 }
 await _renderProduct_benefits();

 const params = new URLSearchParams(window.location.search);
 const productId = params.get("id");
 if (!productId) return;

 const res = await fetch("../data/products.json");
 const products = await res.json();
 const product = products.find(p => p.id == productId);
 if (!product) return;

 renderBenefits(product);
 renderFAQ(product);
};


//
// --- PD-1 · BLOQUE 15 Sección de Productos Relacionados PRO ---
//

async function renderRelatedProducts(product) {

 if (!product) return;

 const container = document.getElementById("product-related");
 if (!container) {
 const parent = document.getElementById("product-container");

 const title = document.createElement("h2");
 title.textContent = "Productos relacionados";
 title.style.color = "#d4af37";
 title.style.marginTop = "60px";
 title.style.marginBottom = "15px";
 title.style.fontWeight = "900";
 title.style.fontSize = "1.6rem";

 const newContainer = document.createElement("div");
 newContainer.id = "product-related";
 newContainer.style.display = "flex";
 newContainer.style.overflowX = "auto";
 newContainer.style.gap = "20px";
 newContainer.style.padding = "10px 0";

 parent.appendChild(title);
 parent.appendChild(newContainer);
 }

 const relatedBox = document.getElementById("product-related");
 relatedBox.innerHTML = "";

 const res = await fetch("../data/products.json");
 const products = await res.json();

 const related = products.filter(p =>
 p.id !== product.id &&
 (p.category === product.category ||
 (product.tags && p.tags && p.tags.some(t => product.tags.includes(t))))
 ).slice(0, 6);

 related.forEach(item => {

 const card = document.createElement("div");
 card.className = "related-pro-card";
 card.style.minWidth = "220px";
 card.style.background = "#101010";
 card.style.border = "1px solid #d4af37";
 card.style.borderRadius = "12px";
 card.style.padding = "15px";
 card.style.cursor = "pointer";
 card.style.transition = "0.3s";
 card.style.boxShadow = "0 0 15px rgba(0,0,0,0.5)";
 card.addEventListener("click", () => {
 window.location.href = "index.html?id=" + item.id;
 });

 const img = document.createElement("img");
 img.src = item.images[0] || "../assets/images/noimg.png";
 img.style.width = "100%";
 img.style.height = "150px";
 img.style.objectFit = "cover";
 img.style.borderRadius = "8px";

 const name = document.createElement("h4");
 name.textContent = item.name;
 name.style.color = "#d4af37";
 name.style.margin = "12px 0 6px";

 const price = document.createElement("p");
 price.textContent = ProductMeta.formatPrice(item.price);
 price.style.color = "#ddd";
 price.style.margin = "0";

 card.appendChild(img);
 card.appendChild(name);
 card.appendChild(price);

 relatedBox.appendChild(card);
 });
}

// Conectar al render principal
const _renderProduct_related = renderProduct;
renderProduct = async function() {
 // Inyección automática de especificaciones técnicas
 if (product.specs) {
 renderSpecs(product);
 }
 await _renderProduct_related();

 const params = new URLSearchParams(window.location.search);
 const productId = params.get("id");
 if (!productId) return;

 const res = await fetch("../data/products.json");
 const products = await res.json();
 const product = products.find(p => p.id == productId);
 if (!product) return;

 renderRelatedProducts(product);
};


//
// --- PD-1 · BLOQUE 16 Módulo de Conversión Máxima (CTA Pro) ---
//

function renderConversionBlock(product) {

 if (!product) return;

 let block = document.getElementById("product-conversion");
 if (!block) {
 block = document.createElement("div");
 block.id = "product-conversion";
 block.style.marginTop = "55px";
 block.style.padding = "25px";
 block.style.border = "1px solid #d4af37";
 block.style.borderRadius = "12px";
 block.style.background = "#0e0e0e";
 block.style.boxShadow = "0 0 15px rgba(0,0,0,0.5)";
 document.getElementById("product-container").appendChild(block);
 }

 block.innerHTML = "";

 const title = document.createElement("h2");
 title.textContent = "Listo para llevar tu compra al siguiente nivel";
 title.style.color = "#d4af37";
 title.style.marginBottom = "15px";
 title.style.fontWeight = "900";
 title.style.fontSize = "1.5rem";

 const urgency = document.createElement("p");
 urgency.textContent = " Atención: quedan pocas unidades en stock";
 urgency.style.color = "#ffcc66";
 urgency.style.fontSize = "1.1rem";
 urgency.style.marginBottom = "12px";

 const recommend = document.createElement("p");
 recommend.textContent = " Irene recomienda este producto por su alta calidad y demanda reciente.";
 recommend.style.color = "#eee";
 recommend.style.marginBottom = "20px";

 const btnBuy = document.createElement("button");
 btnBuy.textContent = "Comprar ahora";
 btnBuy.style.width = "100%";
 btnBuy.style.padding = "14px 0";
 btnBuy.style.fontSize = "1.2rem";
 btnBuy.style.marginBottom = "12px";
 btnBuy.style.fontWeight = "700";
 btnBuy.style.background = "#d4af37";
 btnBuy.style.color = "#000";
 btnBuy.style.border = "none";
 btnBuy.style.borderRadius = "8px";
 btnBuy.style.cursor = "pointer";
 btnBuy.style.transition = "0.25s";

 btnBuy.addEventListener("click", () => {
 window.location.href = "../pay/index.html?id=" + product.id;
 });

 const btnCart = document.createElement("button");
 btnCart.textContent = "Añadir al carrito";
 btnCart.style.width = "100%";
 btnCart.style.padding = "12px 0";
 btnCart.style.fontSize = "1.1rem";
 btnCart.style.background = "#222";
 btnCart.style.color = "#d4af37";
 btnCart.style.border = "1px solid #d4af37";
 btnCart.style.borderRadius = "8px";
 btnCart.style.cursor = "pointer";
 btnCart.style.transition = "0.25s";

 btnCart.addEventListener("click", () => {
 ProductMeta.addToCart(product.id);
 btnCart.textContent = "Añadido ";
 setTimeout(() => { btnCart.textContent = "Añadir al carrito"; }, 1500);
 });

 block.appendChild(title);
 block.appendChild(urgency);
 block.appendChild(recommend);
 block.appendChild(btnBuy);
 block.appendChild(btnCart);
}

// Conectar el módulo al render principal
const _renderProduct_conversion = renderProduct;

renderProduct = async function() {
 // Inyección automática de especificaciones técnicas
 if (product.specs) {
 renderSpecs(product);
 }
 await _renderProduct_conversion();

 const params = new URLSearchParams(window.location.search);
 const productId = params.get("id");
 if (!productId) return;

 const res = await fetch("../data/products.json");
 const products = await res.json();
 const product = products.find(p => p.id == productId);
 if (!product) return;

 renderConversionBlock(product);
};

//
// --- PD-1 · BLOQUE 17 Breadcrumbs dinámicas (versión blindada) ---
//

function renderBreadcrumbs(product) {

 if (!product) return;

 let breadcrumb = document.getElementById("product-breadcrumbs");
 if (!breadcrumb) {
 breadcrumb = document.createElement("div");
 breadcrumb.id = "product-breadcrumbs";
 breadcrumb.style.marginBottom = "20px";
 breadcrumb.style.fontSize = "0.95rem";
 breadcrumb.style.color = "#d4af37";
 breadcrumb.style.opacity = "0.9";

 const container = document.getElementById("product-container");
 container.parentNode.insertBefore(breadcrumb, container);
 }

 const category = product.category || "General";

 let html = "";
 html += "<span style=\"cursor:pointer;color:#d4af37;\" onclick=\"window.location.href='../catalog/index.html'\">Catálogo</span>";
 html += " / ";
 html += "<span style=\"cursor:pointer;color:#d4af37;\" onclick=\"window.location.href='../catalog/index.html?cat=" + category + "'\">" + category + "</span>";
 html += " / ";
 html += "<span style=\"color:#fff;font-weight:700;\">" + product.name + "</span>";

 breadcrumb.innerHTML = html;
}

// Integración al render principal (cadena limpia)
const _renderProduct_breadcrumbs_fixed3 = renderProduct;

renderProduct = async function() {
 // Inyección automática de especificaciones técnicas
 if (product.specs) {
 renderSpecs(product);
 }
 await _renderProduct_breadcrumbs_fixed3();

 const params = new URLSearchParams(window.location.search);
 const productId = params.get("id");
 if (!productId) return;

 const res = await fetch("../data/products.json");
 const products = await res.json();
 const product = products.find(p => p.id == productId);
 if (!product) return;

 renderBreadcrumbs(product);
};
//
// --- PD-1 · BLOQUE 18 Características Destacadas (Highlights Pro) ---
//

function renderHighlights(product) {

 if (!product || !product.highlights || !Array.isArray(product.highlights)) return;

 let box = document.getElementById("product-highlights");
 if (!box) {
 const parent = document.getElementById("product-container");

 const title = document.createElement("h2");
 title.textContent = "Características destacadas";
 title.style.color = "#d4af37";
 title.style.marginTop = "50px";
 title.style.marginBottom = "15px";
 title.style.fontWeight = "900";
 title.style.fontSize = "1.6rem";

 box = document.createElement("div");
 box.id = "product-highlights";
 box.style.display = "flex";
 box.style.flexWrap = "wrap";
 box.style.gap = "15px";

 parent.appendChild(title);
 parent.appendChild(box);
 }

 box.innerHTML = "";

 product.highlights.forEach(text => {
 const item = document.createElement("div");
 item.className = "highlight-item";
 item.style.background = "#101010";
 item.style.border = "1px solid #d4af37";
 item.style.borderRadius = "10px";
 item.style.padding = "18px";
 item.style.flex = "1 1 250px";
 item.style.boxShadow = "0 0 10px rgba(0,0,0,0.4)";
 item.style.color = "#eee";
 item.style.lineHeight = "1.5";
 item.style.fontSize = "1.05rem";
 item.style.display = "flex";
 item.style.gap = "12px";
 item.style.alignItems = "flex-start";

 const bullet = document.createElement("div");
 bullet.style.minWidth = "10px";
 bullet.style.height = "10px";
 bullet.style.borderRadius = "50%";
 bullet.style.background = "#d4af37";
 bullet.style.marginTop = "6px";

 const textNode = document.createElement("span");
 textNode.textContent = text;

 item.appendChild(bullet);
 item.appendChild(textNode);

 box.appendChild(item);
 });
}

// Integrar Highlights al render principal
const _renderProduct_highlights = renderProduct;

renderProduct = async function() {
 // Inyección automática de especificaciones técnicas
 if (product.specs) {
 renderSpecs(product);
 }
 await _renderProduct_highlights();

 const params = new URLSearchParams(window.location.search);
 const productId = params.get("id");
 if (!productId) return;

 const res = await fetch("../data/products.json");
 const products = await res.json();
 const product = products.find(p => p.id == productId);
 if (!product) return;

 renderHighlights(product);
};
//
// --- PD-1 · BLOQUE 19 Garantía, Devoluciones y Soporte (GDS Pro) ---
//

function renderGuarantee(product) {

 // Si el producto no define garantías, usamos valores por defecto
 const g = product.guarantee || {
 period: "2 años de garantía oficial",
 return: "30 días para devoluciones",
 support: "Soporte técnico bajo demanda",
 extra: [
 "Protección total contra defectos",
 "Reemplazo inmediato en caso de fallo grave",
 "Acceso prioritario al soporte Irene"
 ]
 };

 let box = document.getElementById("product-guarantee");
 if (!box) {
 const parent = document.getElementById("product-container");

 const title = document.createElement("h2");
 title.textContent = "Garantía y soporte";
 title.style.color = "#d4af37";
 title.style.marginTop = "55px";
 title.style.marginBottom = "15px";
 title.style.fontWeight = "900";
 title.style.fontSize = "1.6rem";

 box = document.createElement("div");
 box.id = "product-guarantee";
 box.style.background = "#0e0e0e";
 box.style.border = "1px solid #d4af37";
 box.style.borderRadius = "12px";
 box.style.padding = "25px";
 box.style.boxShadow = "0 0 12px rgba(0,0,0,0.6)";
 box.style.lineHeight = "1.6";

 parent.appendChild(title);
 parent.appendChild(box);
 }

 box.innerHTML = "";

 const p1 = document.createElement("p");
 p1.style.color = "#eee";
 p1.style.marginBottom = "8px";
 p1.innerHTML = " " + g.period;

 const p2 = document.createElement("p");
 p2.style.color = "#eee";
 p2.style.marginBottom = "8px";
 p2.innerHTML = " " + g.return;

 const p3 = document.createElement("p");
 p3.style.color = "#eee";
 p3.style.marginBottom = "15px";
 p3.innerHTML = " " + g.support;

 const hr = document.createElement("hr");
 hr.style.border = "1px solid #333";
 hr.style.margin = "18px 0";

 const subt = document.createElement("h3");
 subt.textContent = "Cobertura adicional";
 subt.style.color = "#d4af37";
 subt.style.fontSize = "1.3rem";
 subt.style.marginBottom = "12px";

 const list = document.createElement("ul");
 list.style.paddingLeft = "18px";

 g.extra.forEach(item => {
 const li = document.createElement("li");
 li.style.color = "#eee";
 li.style.marginBottom = "6px";
 li.textContent = item;
 list.appendChild(li);
 });

 box.appendChild(p1);
 box.appendChild(p2);
 box.appendChild(p3);
 box.appendChild(hr);
 box.appendChild(subt);
 box.appendChild(list);
}

// Integrar en el flujo principal
const _renderProduct_guarantee = renderProduct;

renderProduct = async function() {
 // Inyección automática de especificaciones técnicas
 if (product.specs) {
 renderSpecs(product);
 }
 await _renderProduct_guarantee();

 const params = new URLSearchParams(window.location.search);
 const productId = params.get("id");
 if (!productId) return;

 const res = await fetch("../data/products.json");
 const products = await res.json();
 const product = products.find(p => p.id == productId);
 if (!product) return;

 renderGuarantee(product);
};


/* ================== SPEC PANEL INTEGRATION ================== */
function renderSpecs(product) {
 document.getElementById("spec-category").textContent = product.category || "";
 document.getElementById("spec-type").textContent = product.type || "";
 document.getElementById("spec-level").textContent = product.level || "";
 document.getElementById("spec-compat").textContent = product.compatibility || "Universal";
 document.getElementById("spec-delivery").textContent = product.delivery || "Digital instantánea";
 document.getElementById("spec-updates").textContent = product.updates || "Incluidas para siempre";
}

const _renderProduct_specs = renderProduct;
renderProduct = async function() {
 // Inyección automática de especificaciones técnicas
 if (product.specs) {
 renderSpecs(product);
 }
 await _renderProduct_specs();
 const params = new URLSearchParams(window.location.search);
 const id = params.get("id");
 if (!id) return;

 const res = await fetch("../data/products.json");
 const products = await res.json();
 const product = products.find(p => p.id == id);
 if (!product) return;

 renderSpecs(product);
};


function renderRecommended(products, currentProduct) {
 const container = document.getElementById("recommended-products-section");
 if (!container) return;

 const related = products
 .filter(p => p.id !== currentProduct.id && p.category === currentProduct.category)
 .slice(0, 4);

 let html = "";
 related.forEach(item => {
 html += 
 <div class="recommended-card" onclick="window.location.href='../product/index.html?id='">
 <img src="../assets/images/products/" class="recommended-img"/>
 <div class="recommended-info">
 <div class="recommended-title"></div>
 <div class="recommended-price">Desde </div>
 <button class="btn-gold-mini">Ver producto</button>
 </div>
 </div>;
 });

 container.innerHTML = html;
}




async function renderBoughtTogether(product) {
 const container = document.getElementById("bought-together");
 if (!container) return;

 // Si el producto no tiene "bought_together", no hacemos nada
 if (!product.bought_together || product.bought_together.length === 0) {
 container.style.display = "none";
 return;
 }

 const res = await fetch("../data/products.json");
 const products = await res.json();

 const items = products.filter(p => product.bought_together.includes(p.id));

 let html = "";
 items.forEach(p => {
 html += `
 <div class="bt-item">
 <img src="../${p.image}" class="bt-thumb" />
 <div class="bt-name">${p.name}</div>
 <div class="bt-price">${ProductMeta.formatPrice(p.price)}</div>
 </div>`;
 });

 container.innerHTML = html;
}




function addToCart(product) {
    try {
        let cart = JSON.parse(localStorage.getItem("NeuralGPT_Cart") || "[]");
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price
        });
        localStorage.setItem("NeuralGPT_Cart", JSON.stringify(cart));
        alert("Añadido al carrito");
    } catch(e) {
        console.error("Error añadiendo al carrito:", e);
    }
}
const btnAddToCart = document.getElementById("btn-add-cart");
if (btnAddToCart) {
    btnAddToCart.onclick = () => {
        addToCart(product);
    };
}
