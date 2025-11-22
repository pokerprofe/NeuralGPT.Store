document.addEventListener("DOMContentLoaded", () => {
    const bubble = document.getElementById("irene-bubble");
    const panel = document.getElementById("irene-panel");
    const messages = document.getElementById("irene-messages");
    const sendBtn = document.getElementById("irene-send");
    const input = document.getElementById("irene-input");

    bubble.addEventListener("click", () => {
        panel.classList.toggle("hidden");
    });

    async function sendMessageToIrene(msg) {
        messages.innerHTML += <div><b>Tú:</b> </div>;
        input.value = "";

        const res = await fetch("/api/butler/guide", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ section: msg.toLowerCase() })
        });

        const data = await res.json();
        messages.innerHTML += <div><b>Irene:</b> </div>;
        messages.scrollTop = messages.scrollHeight;
    }

    sendBtn.addEventListener("click", () => {
        const msg = input.value.trim();
        if (msg.length > 0) sendMessageToIrene(msg);
    });
});
