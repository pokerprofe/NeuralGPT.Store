if ($js -notmatch "") {
    # correcto, sin regex
}
class Cart {
    static key = "NeuralGPT_Cart";

    static load() {
        return JSON.parse(localStorage.getItem(Cart.key) || "[]");
    

    static save(cart) {
        localStorage.setItem(Cart.key, JSON.stringify(cart));
    

    static add(product) {
        const cart = Cart.load();
        cart.push(product);
        Cart.save(cart);
    

    static remove(index) {
        const cart = Cart.load();
        cart.splice(index, 1);
        Cart.save(cart);
    

    static total() {
        return Cart.load().reduce((sum, p) => sum + (p.price || 0), 0);
    


function renderCart() {
    const container = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    const cart = Cart.load();

    if (!container) return;

    container.innerHTML = "";

    cart.forEach((p, i) => {
        const row = document.createElement("div");
        row.className = "cart-item";

        row.innerHTML = `
            <span class="cart-item-name">${p.name</span>
            <span class="cart-item-price">${p.price.toFixed(2) €</span>
            <button class="remove-btn" onclick="Cart.remove(${i); renderCart();">Quitar</button>
        `;

        container.appendChild(row);
    );

    totalEl.textContent = "Total: " + Cart.total().toFixed(2) + " €";


document.addEventListener("DOMContentLoaded", () => {
    renderCart();
    document.getElementById("go-pay").onclick = () => {
        window.location.href = "../pay/index.html";
    ;
);

 
     catch (e) {
        console.error("Error calculando totales:", e);
    

calcularTotales();

setInterval(() => {
    try {
        calcularTotales();
     catch(e) {
        console.error("Watcher carrito:", e);
    
, 1200);

/* CartWatcher_v1 */
setInterval(() => {
    try { calcularTotales();  catch(e) {
, 1200);





document.querySelectorAll("[data-add-cart]").forEach(btn => {
    btn.addEventListener("click", () => {
        try {
            let carrito = safeLoadCarrito();

            const item = {
                id: btn.dataset.id,
                name: btn.dataset.name,
                price: parseFloat(btn.dataset.price || 0)
            };

            carrito.push(item);
            localStorage.setItem("carrito", JSON.stringify(carrito));

            calcularTotales();
        } catch(e) {
            console.error("ERROR AddCart:", e);
        }
    });
});

function calcularTotales() {
    try {
        let carrito = safeLoadCarrito();
        let total = 0;

        carrito.forEach(item => {
            total += parseFloat(item.price || 0);
        });

        const slot = document.getElementById("cart-total");
        if (slot) {
            slot.textContent = total.toFixed(2) + " €";
        }
    } catch(e) {
        console.error("ERROR Totales:", e);
    }
}
setInterval(() => {
    try {
        calcularTotales();
    } catch(e) {
        console.error("WatcherAutoCart ERROR:", e);
    }
}, 800);

function removeFromCart(id) {
    try {
        let carrito = safeLoadCarrito();

        carrito = carrito.filter(item => item.id != id);

        localStorage.setItem("carrito", JSON.stringify(carrito));

        calcularTotales();
        renderCarrito();
    } catch(e) {
        console.error("ERROR Remove:", e);
    }
}
function renderCarrito() {
    try {
        const cont = document.getElementById("cart-list");
        if (!cont) return;

        let carrito = safeLoadCarrito();

        let html = "";

        carrito.forEach(item => {
            html += `
                <div class="cart-item">
                    <div class="cart-name">${item.name}</div>
                    <div class="cart-price">${parseFloat(item.price).toFixed(2)} €</div>
                    <button class="remove-btn" onclick="removeFromCart('${item.id}')">Eliminar</button>
                </div>
            `;
        });

        cont.innerHTML = html;
    } catch(e) {
        console.error("ERROR RenderCart:", e);
    }
}

window.addEventListener("load", () => {
    try {
        renderCarrito();
        calcularTotales();
    } catch(e) {
        console.error("ERROR InitCart:", e);
    }
});
function safeLoadCarrito() {
    try {
        let raw = localStorage.getItem("carrito");
        if (!raw || raw === "" || raw === "null" || raw === "undefined") {
            localStorage.setItem("carrito", "[]");
            return [];
        }
        return JSON.parse(raw);
    } catch(e) {
        console.error("ERROR SafeLoad:", e);
        localStorage.setItem("carrito", "[]");
        return [];
    }
}

function updateTotals() {
    const cart = getCart();
    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.qty;
    });

    const total = subtotal;

    const subEl = document.getElementById("cart-subtotal");
    const totEl = document.getElementById("cart-total");

    if (subEl) subEl.textContent = subtotal.toFixed(2) + " €";
    if (totEl) totEl.textContent = total.toFixed(2) + " €";
}

/* ==========================================================
   CART15_SEAL_v1
   Canonical Cart Engine (última definición gana)
   ========================================================== */

function getCart() {
    try {
        const raw = localStorage.getItem("carrito");
        if (!raw || raw === "null" || raw === "undefined" || raw.trim() === "") {
            localStorage.setItem("carrito", "[]");
            return [];
        }
        const arr = JSON.parse(raw);
        if (!Array.isArray(arr)) {
            localStorage.setItem("carrito", "[]");
            return [];
        }
        return arr.map(x => ({
            id: String(x.id),
            name: String(x.name || ""),
            price: Number(x.price || 0),
            qty: Number(x.qty || 1)
        }));
    } catch(e) {
        console.error("getCart ERROR:", e);
        localStorage.setItem("carrito", "[]");
        return [];
    }
}

function saveCart(cart) {
    try {
        if (!Array.isArray(cart)) cart = [];
        localStorage.setItem("carrito", JSON.stringify(cart));
    } catch(e) {
        console.error("saveCart ERROR:", e);
    }
}

function addItemToCart(item) {
    try {
        let cart = getCart();
        const idx = cart.findIndex(p => p.id == item.id);
        if (idx >= 0) {
            cart[idx].qty += 1;
        } else {
            cart.push({
                id: String(item.id),
                name: String(item.name || ""),
                price: Number(item.price || 0),
                qty: 1
            });
        }
        saveCart(cart);
        renderCarrito();
        updateTotals();
    } catch(e) {
        console.error("addItemToCart ERROR:", e);
    }
}

function removeFromCart(id) {
    try {
        let cart = getCart().filter(p => p.id != id);
        saveCart(cart);
        renderCarrito();
        updateTotals();
    } catch(e) {
        console.error("removeFromCart ERROR:", e);
    }
}

function incQty(id) {
    try {
        let cart = getCart();
        const idx = cart.findIndex(p => p.id == id);
        if (idx >= 0) cart[idx].qty += 1;
        saveCart(cart);
        renderCarrito();
        updateTotals();
    } catch(e) {
        console.error("incQty ERROR:", e);
    }
}

function decQty(id) {
    try {
        let cart = getCart();
        const idx = cart.findIndex(p => p.id == id);
        if (idx >= 0) {
            cart[idx].qty -= 1;
            if (cart[idx].qty <= 0) cart.splice(idx, 1);
        }
        saveCart(cart);
        renderCarrito();
        updateTotals();
    } catch(e) {
        console.error("decQty ERROR:", e);
    }
}

function updateTotals() {
    try {
        const cart = getCart();
        let subtotal = 0;
        cart.forEach(item => subtotal += Number(item.price) * Number(item.qty));
        const total = subtotal;

        const subEl = document.getElementById("cart-subtotal");
        const totEl = document.getElementById("cart-total");

        if (subEl) subEl.textContent = subtotal.toFixed(2) + " €";
        if (totEl) totEl.textContent = total.toFixed(2) + " €";
    } catch(e) {
        console.error("updateTotals ERROR:", e);
    }
}

function renderCarrito() {
    try {
        const cont = document.getElementById("cart-list");
        if (!cont) return;

        const cart = getCart();
        if (cart.length === 0) {
            cont.innerHTML = `
                <div class="cart-empty" style="
                    padding:20px;
                    background:#0e0e0e;
                    border:1px solid #222;
                    border-radius:12px;
                    text-align:center;
                    color:#d4af37;
                    font-size:1.15rem;
                ">
                    Tu carrito está vacío
                </div>
            `;
            return;
        }

        let html = "";
        cart.forEach(item => {
            const lineTotal = (Number(item.price) * Number(item.qty)).toFixed(2);

            html += `
            <div class="cart-item">
                <div class="cart-left">
                    <div class="cart-name">${item.name}</div>
                    <div class="cart-unit">Unidad: ${Number(item.price).toFixed(2)} €</div>
                </div>

                <div class="cart-mid">
                    <div class="qty-box">
                        <button class="qty-btn" onclick="decQty('${item.id}')"></button>
                        <span class="qty-num">${item.qty}</span>
                        <button class="qty-btn" onclick="incQty('${item.id}')">+</button>
                    </div>
                    <div class="line-total">${lineTotal} €</div>
                </div>

                <div class="cart-right">
                    <button class="remove-btn" onclick="removeFromCart('${item.id}')">Eliminar</button>
                </div>
            </div>
            `;
        });

        cont.innerHTML = html;
    } catch(e) {
        console.error("renderCarrito ERROR:", e);
    }
}

window.addEventListener("load", () => {
    renderCarrito();
    updateTotals();
});

/* ============================================================
   CART17_CORE_v1
   Núcleo reforzado · Cálculo + Render + Persistencia
   ============================================================ */

function loadCart() {
    try {
        const data = localStorage.getItem("cart");
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function calculateTotals(cart) {
    let subtotal = 0;
    for (const item of cart) {
        subtotal += (item.price * item.qty);
    }
    return {
        subtotal: subtotal.toFixed(2),
        total: subtotal.toFixed(2)
    };
}

async function renderCarrito() {
    const list = document.getElementById("cart-list");
    const subtotalEl = document.getElementById("cart-subtotal");
    const totalEl = document.getElementById("cart-total");

    const cart = loadCart();
    list.innerHTML = "";

    for (const item of cart) {
        const row = document.createElement("div");
        row.className = "cart-row";
        row.style.cssText = `
            display:flex;
            justify-content:space-between;
            align-items:center;
            background:#0c0c0c;
            padding:15px 20px;
            border-radius:12px;
            border:1px solid #222;
        `;

        row.innerHTML = `
            <div style="color:#fff;font-weight:700;">
                ${item.name}
                <div style="color:#888;font-size:0.9rem;">${item.price} €</div>
            </div>

            <div style="display:flex;gap:10px;align-items:center;">
                <button class="qty-btn" data-id="${item.id}" data-op="minus"></button>
                <span style="color:#fff;font-weight:700;">${item.qty}</span>
                <button class="qty-btn" data-id="${item.id}" data-op="plus">+</button>
            </div>
        `;

        list.appendChild(row);
    }

    const totals = calculateTotals(cart);
    subtotalEl.textContent = totals.subtotal + " €";
    totalEl.textContent = totals.total + " €";

    attachQtyEvents();
}

function attachQtyEvents() {
    const btns = document.querySelectorAll(".qty-btn");
    btns.forEach(btn => {
        btn.onclick = () => {
            const id = btn.dataset.id;
            const op = btn.dataset.op;

            const cart = loadCart();
            const item = cart.find(i => i.id == id);
            if (!item) return;

            if (op === "minus" && item.qty > 1) item.qty--;
            if (op === "plus") item.qty++;

            saveCart(cart);
            renderCarrito();
        };
    });
}

// Render inicial tras cargar
document.addEventListener("DOMContentLoaded", renderCarrito);

/* CART20_CORE_v1  Control de cantidades */

function updateQty(productId, delta) {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    let item = cart.find(p => p.id === productId);

    if (!item) return;

    item.qty = (item.qty || 1) + delta;

    // Si baja a 0, eliminar
    if (item.qty <= 0) {
        cart = cart.filter(p => p.id !== productId);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Re-render total
    renderCartTotals();
    // Re-render items lista
    renderCartItems();
}

function renderCartTotals() {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    let count = cart.reduce((acc, item)=> acc + (item.qty || 1), 0);
    let total = cart.reduce((acc, item)=> acc + (item.price * (item.qty || 1)), 0);

    let countBox = document.getElementById("cart-items-count");
    let totalBox = document.getElementById("cart-total");

    if (countBox) countBox.textContent = count;
    if (totalBox) totalBox.textContent = total.toFixed(2) + "€";
}

/* Incrusta botones + /  en los items */
function renderQtyControls(productId, qty) {
    return `
        <div style="display:flex;align-items:center;gap:8px;margin-top:8px;">
            <button onclick="updateQty(${productId}, -1)"
                style="width:32px;height:32px;border-radius:8px;background:#222;color:white;border:none;font-weight:900;cursor:pointer;">-</button>

            <span style="font-weight:700;">${qty}</span>

            <button onclick="updateQty(${productId}, 1)"
                style="width:32px;height:32px;border-radius:8px;background:#d4af37;color:black;border:none;font-weight:900;cursor:pointer;">+</button>
        </div>
    `;
}

/* CART21_RENDER_v1  Renderizado premium de items */

function renderCartItems() {
    const list = document.getElementById("cart-items");
    if (!list) return;

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (cart.length === 0) {
        list.innerHTML = `
            <div style="padding:40px;text-align:center;color:#aaa;font-size:20px;">
                Tu carrito está vacío.
            </div>`;
        renderCartTotals();
        return;
    }

    let html = "";

    cart.forEach(item => {
        const qty = item.qty || 1;

        html += `
        <div class="cart-item" style="
            display:flex;
            gap:20px;
            background:#111;
            padding:20px;
            border-radius:16px;
            margin-bottom:16px;
            border:1px solid #222;
        ">
            <img src="../assets/img/${item.image}" 
                 style="width:110px;height:110px;object-fit:cover;border-radius:12px;border:1px solid #333;">
            
            <div style="flex:1;color:white;">
                <div style="font-size:20px;font-weight:700;margin-bottom:8px;">
                    ${item.name}
                </div>

                <div style="color:#d4af37;font-size:18px;margin-bottom:10px;">
                    ${item.price.toFixed(2)}€
                </div>

                ${renderQtyControls(item.id, qty)}

                <button onclick="removeFromCart(${item.id})"
                    style="
                        margin-top:12px;
                        background:#550000;
                        color:white;
                        border:none;
                        padding:8px 14px;
                        border-radius:10px;
                        font-weight:700;
                        cursor:pointer;
                    ">Eliminar</button>
            </div>
        </div>
        `;
    });

    list.innerHTML = html;

    renderCartTotals();
}

/* CART22_INIT_v1  Inicialización del carrito */

document.addEventListener("DOMContentLoaded", () => {
    try {
        renderCartItems();
        renderCartTotals();

        const clearBtn = document.getElementById("clear-cart");
        if (clearBtn) {
            clearBtn.onclick = () => {
                localStorage.removeItem("cart");
                renderCartItems();
                renderCartTotals();
            };
        }
    } catch(e) {
        console.error("Error inicializando carrito:", e);
    }
});

/* ============================================================
   CART23_LIVEENGINE_v1  Update Live Engine
   ============================================================ */

function updateCartItemQuantity(id, newQty) {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const item = cart.find(p => p.id == id);
    if (!item) return;

    if (newQty <= 0) {
        cart = cart.filter(p => p.id != id);
    } else {
        item.qty = newQty;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartItems();
    renderCartTotals();
}

function attachQuantityListeners() {
    const qtyInputs = document.querySelectorAll(".cart-qty-input");
    qtyInputs.forEach(input => {
        input.oninput = () => {
            const id = input.getAttribute("data-id");
            const value = parseInt(input.value);
            if (!isNaN(value)) {
                updateCartItemQuantity(id, value);
            }
        };
    });
}

/* Hook: después de renderCartItems */
const _renderItems_live = renderCartItems;
renderCartItems = function() {
    _renderItems_live();
    attachQuantityListeners();
};

/* ====================================================================
   CART24_ULTRA_CORE_v1  Motor central avanzado del carrito
   ==================================================================== */

/* ---------------------- CORRECCIÓN DE CARRITO --------------------- */
function sanitizeCart() {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // eliminar productos inválidos
    cart = cart.filter(item => item && item.id && item.qty && item.qty > 0);

    // cantidades mínimas
    cart.forEach(i => {
        if (i.qty < 1) i.qty = 1;
        if (i.qty > 99) i.qty = 99;
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    return cart;
}

/* ---------------------- ELIMINACIÓN RÁPIDA ------------------------ */
function removeFromCart(id) {
    let cart = sanitizeCart();
    cart = cart.filter(item => item.id != id);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartItems();
    renderCartTotals();
}

/* ---------------------- BOTÓN X ELIMINAR ------------------------ */
function attachRemoveButtons() {
    const removeBtns = document.querySelectorAll(".cart-remove");
    removeBtns.forEach(btn => {
        btn.onclick = () => {
            const id = btn.getAttribute("data-id");
            removeFromCart(id);
        };
    });
}

/* ---------------------- SYNC ENGINE ------------------------------- */
function syncCart() {
    try {
        sanitizeCart();
        renderCartItems();
        renderCartTotals();
    } catch (e) {
        console.error("Sync error:", e);
    }
}

/* ---------------------- REWRITE PREMIUM DEL RENDER ---------------- */
const _renderItems_core = renderCartItems;
renderCartItems = function() {
    _renderItems_core();

    // listeners avanzados
    attachQuantityListeners();
    attachRemoveButtons();

    // anti-desincronización
    syncCart();
};

/* ---------------------- AUTO-REPAIR ENGINE ------------------------ */
setInterval(() => {
    try { sanitizeCart(); }
    catch(e) { console.error("Repair loop:", e); }
}, 5000);

/* ---------------------- BOOTSEQUENCE ------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
    sanitizeCart();
    syncCart();
});

/* ===========================================================================
   CART25_FINAL_v1  Finalización total del carrito
   =========================================================================== */

/* ------------------- CARGA Y VALIDACIÓN SEGURA ------------------- */
function getSafeCart() {
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (!Array.isArray(cart)) cart = [];
    } catch (e) {
        cart = [];
    }
    return cart;
}

/* ------------------- CANTIDADES PREMIUM -------------------------- */
function updateQty(id, qty) {
    qty = parseInt(qty);
    if (isNaN(qty) || qty < 1) qty = 1;
    if (qty > 99) qty = 99;

    let cart = getSafeCart();
    const item = cart.find(x => x.id == id);
    if (item) item.qty = qty;

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartItems();
    renderCartTotals();
}

/* ------------------- LISTENERS DE CANTIDAD ----------------------- */
function attachQuantityListeners() {
    const inputs = document.querySelectorAll(".cart-qty");
    inputs.forEach(inp => {
        inp.onchange = () => updateQty(inp.dataset.id, inp.value);
    });
}

/* ------------------- RENDER PREMIUM FINAL ------------------------ */
function renderCartTotals() {
    const totalNode = document.getElementById("cart-total");
    const cart = getSafeCart();

    if (!totalNode) return;

    let total = 0;
    cart.forEach(item => {
        if (item.price && item.qty) {
            total += item.price * item.qty;
        }
    });

    totalNode.textContent = total.toFixed(2) + " €";
}

/* ------------------- ESTADO CARRITO VACÍO ---------------------- */
function renderEmptyState() {
    const wrap = document.getElementById("cart-items");
    if (!wrap) return;

    wrap.innerHTML = `
        <div class="empty-cart">
            <h3>Tu carrito está vacío</h3>
            <a href="../catalog/index.html" class="btn-gold">Volver al catálogo</a>
        </div>
    `;
}

/* ------------------- NUEVA VERSIÓN DEL RENDER -------------------- */
const _renderCartItems_final = renderCartItems;

renderCartItems = function() {
    const cart = getSafeCart();

    if (!cart.length) {
        renderEmptyState();
        renderCartTotals();
        return;
    }

    _renderCartItems_final();

    attachQuantityListeners();
    attachRemoveButtons();
    renderCartTotals();
};

/* ------------------- BOOTSEQUENCE FINAL --------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    sanitizeCart();
    renderCartItems();
    renderCartTotals();
});
