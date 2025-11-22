document.getElementById("btn-donate").addEventListener("click", () => {
    const amount = parseFloat(document.getElementById("amount").value);

    if (!amount || amount < 1) {
        alert("Introduce una cantidad válida.");
        return;
    }

    const donation = [{
        id: "donation",
        name: "Donación al proyecto",
        price: amount,
        qty: 1
    }];

    localStorage.setItem("cart", JSON.stringify(donation));

    window.location.href = "../pay/index.html";
});
