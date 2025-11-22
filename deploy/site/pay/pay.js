function getCart() {
    try {
        const c = JSON.parse(localStorage.getItem("cart"));
        return Array.isArray(c) ? c : [];
    } catch {
        return [];
    }
}

function renderSummary() {
    const cart = getCart();
    let total = 0;
    let html = "";

    cart.forEach(item => {
        const qty = item.qty || 1;
        const line = item.price * qty;
        total += line;

        html += `
            <div class="sum-item">
                ${item.name}  ${qty} ud.  ${line.toFixed(2)} €
            </div>
        `;
    });

    document.getElementById("summary-items").innerHTML = html;
    document.getElementById("summary-total").innerHTML =
        total.toFixed(2) + " €";
}

document.addEventListener("DOMContentLoaded", () => {
    renderSummary();

    const form = document.getElementById("checkout-form");
    form.addEventListener("submit", e => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const address = document.getElementById("address").value.trim();
        const email = document.getElementById("email").value.trim();

        if (!name || !address || !email) {
            alert("Rellena todos los campos.");
            return;
        }

        localStorage.removeItem("cart");
        window.location.href = "confirm.html";
    });
});
