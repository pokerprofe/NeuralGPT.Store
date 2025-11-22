const Cart = {
    key: "ngpt_cart",
    legacyKeys: ["neural_cart", "ngpt_cart", "ngpt_store_cart"],

    loadRaw(k) {
        try {
            return JSON.parse(localStorage.getItem(k)) || [];
        } catch(e) { return []; }
    },

    migrateIfNeeded() {
        let merged = [];
        let changed = false;

        for (const k of this.legacyKeys) {
            const data = this.loadRaw(k);
            if (data.length > 0 && k !== this.key) {
                changed = true;
            }
            for (const item of data) {
                if (!item || item.id == null) continue;
                const exist = merged.find(x => x.id === item.id);
                if (exist) {
                    exist.qty += Number(item.qty || 1);
                } else {
                    merged.push({
                        id: item.id,
                        name: item.name || "Producto",
                        price: Number(item.price || 0),
                        img: item.img || item.image || (item.images?.[0] || ""),
                        qty: Number(item.qty || 1)
                    });
                }
            }
        }

        if (changed) {
            this.save(merged);
            for (const k of this.legacyKeys) {
                if (k !== this.key) localStorage.removeItem(k);
            }
        }
    },

    load() {
        this.migrateIfNeeded();
        return this.loadRaw(this.key);
    },

    save(data) {
        localStorage.setItem(this.key, JSON.stringify(data));
    },

    add(product) {
        if (!product || product.id == null) return;

        const cart = this.load();
        const exist = cart.find(i => i.id === product.id);

        const price = Number(product.price || 0);
        const img = product.img || product.image || (product.images?.[0] || "");

        if (exist) {
            exist.qty += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name || "Producto",
                price,
                img,
                qty: 1
            });
        }

        this.save(cart);
    },

    remove(id) {
        let cart = this.load();
        cart = cart.filter(item => item.id !== id);
        this.save(cart);
        CartUI.render();
    },

    updateQty(id, qty) {
        let cart = this.load();
        const item = cart.find(x => x.id === id);
        if (!item) return;
        item.qty = Math.max(1, Number(qty || 1));
        this.save(cart);
        CartUI.render();
    },

    total() {
        return this.load().reduce((t, i) => t + (Number(i.price || 0) * Number(i.qty || 1)), 0);
    },

    count() {
        return this.load().reduce((t, i) => t + Number(i.qty || 0), 0);
    }
};

const CartUI = {
    render() {
        const container = document.getElementById("cart-items");
        const totalEl = document.getElementById("cart-total");

        if (!container || !totalEl) return;

        const cart = Cart.load();

        if (cart.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    Tu carrito está vacío.
                </div>`;
            totalEl.textContent = "0,00 €";
            return;
        }

        let html = "";
        for (const item of cart) {
            const subtotal = (Number(item.price || 0) * Number(item.qty || 1)).toFixed(2);

            html += `
                <div class="cart-row">
                    <div class="cart-img">
                        <img src="${item.img}" alt="${item.name}">
                    </div>
                    <div class="cart-info">
                        <h3>${item.name}</h3>
                        <p class="price">${Number(item.price || 0).toFixed(2)} €</p>
                        <div class="qty-box">
                            <button class="qty-btn" onclick="Cart.updateQty(${item.id}, ${item.qty - 1})">-</button>
                            <span class="qty">${item.qty}</span>
                            <button class="qty-btn" onclick="Cart.updateQty(${item.id}, ${item.qty + 1})">+</button>
                        </div>
                    </div>
                    <div class="cart-actions">
                        <strong>${subtotal} €</strong><br><br>
                        <button class="remove-btn" onclick="Cart.remove(${item.id})">Eliminar</button>
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
        totalEl.textContent = Cart.total().toFixed(2) + " €";
    }
};

document.addEventListener("DOMContentLoaded", () => {
    CartUI.render();
});
