(function() {
    // Obtener parámetro ID del producto
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

    // Función para cargar JSON local
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
        const products = await loadProducts();
        const product = products.find(p => p.id == productId);

        if (!product) {
            productTitle.textContent = 'Producto no encontrado';
            return;
        }

        productTitle.textContent = product.title;
        productImage.src = product.image || '../assets/images/no_image.png';
        productDescription.textContent = product.description;
        productCategory.textContent = 'Categoría: ' + product.category;
        productTags.textContent = 'Tags: ' + (product.tags || []).join(', ');
        productPrice.textContent = 'Precio estimado: ' + (product.price || 'consultar') + '€';

        renderRelated(products, product);
        setupCart(product);
    }

    // Render relacionados por categoría
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
            alert('Producto añadido al carrito');
        });
    }

    // Inicio
    renderProduct();
})();
