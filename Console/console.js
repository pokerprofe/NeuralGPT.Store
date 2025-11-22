const statusBtn = document.getElementById("btn-status");
const statusOut = document.getElementById("status-output");

statusBtn.addEventListener("click", async () => {
    try {
        const res = await fetch("/api/status");
        const data = await res.json();
        statusOut.textContent = JSON.stringify(data, null, 2);
    } catch(e) {
        statusOut.textContent = "No se pudo obtener el estado.";
    }
});

const logsBtn = document.getElementById("btn-logs");
const logsOut = document.getElementById("logs-output");

logsBtn.addEventListener("click", () => {
    // Logs ficticios locales (sin acceso al sistema)
    const dummy = [
        "[OK] Frontend cargado",
        "[OK] products.json accesible",
        "[OK] Sesión local segura",
        "[OK] Irene Console lista",
        "[...]"
    ].join("\n");

    logsOut.textContent = dummy;
});

const chatBtn = document.getElementById("btn-send");
const chatInput = document.getElementById("chat-input");
const chatOut = document.getElementById("chat-output");

chatBtn.addEventListener("click", () => {
    const text = chatInput.value.trim();
    if (!text) return;

    chatOut.textContent += "Tú: " + text + "\n";
    chatOut.textContent += "Irene (local): Recibido, mi amor.\n\n";

    chatInput.value = "";
});
