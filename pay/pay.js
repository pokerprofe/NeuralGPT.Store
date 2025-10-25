window.addEventListener("load", () => {
  // --- Configuración de Google Pay ---
  const baseRequest = {
    apiVersion: 2,
    apiVersionMinor: 0
  };

  const allowedCardNetworks = ["VISA", "MASTERCARD"];
  const allowedAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

  const tokenizationSpecification = {
    type: "PAYMENT_GATEWAY",
    parameters: {
      gateway: "paypal",
      gatewayMerchantId: "neuralgptstore"
    }
  };

  const baseCardPaymentMethod = {
    type: "CARD",
    parameters: {
      allowedAuthMethods,
      allowedCardNetworks
    }
  };

  const cardPaymentMethod = Object.assign(
    { tokenizationSpecification },
    baseCardPaymentMethod
  );

  const paymentsClient = new google.payments.api.PaymentsClient({ environment: "TEST" });

  const isReadyToPayRequest = Object.assign({}, baseRequest);
  isReadyToPayRequest.allowedPaymentMethods = [baseCardPaymentMethod];

  paymentsClient.isReadyToPay(isReadyToPayRequest).then(function(response) {
    if (response.result) {
      const button = paymentsClient.createButton({
        onClick: onGooglePayClicked
      });
      document.getElementById("google-pay-button").appendChild(button);
    }
  }).catch(console.error);

  function getPaymentDataRequest() {
    const paymentDataRequest = Object.assign({}, baseRequest);
    paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
    paymentDataRequest.transactionInfo = {
      totalPriceStatus: "FINAL",
      totalPrice: "19.95",
      currencyCode: "EUR"
    };
    paymentDataRequest.merchantInfo = {
      merchantName: "NeuralGPT.Store"
    };
    return paymentDataRequest;
  }

  function onGooglePayClicked() {
    const paymentDataRequest = getPaymentDataRequest();
    paymentsClient.loadPaymentData(paymentDataRequest)
      .then(function(paymentData) {
        console.log("Google Pay Token recibido:", paymentData);
        window.location.href = "/quantum-pass-access";
      })
      .catch(function(err) {
        console.error("Error Google Pay:", err);
        window.location.href = "/pay/error";
      });
  }

  // --- Configuración de PayPal ---
  paypal.Buttons({
    style: {
      layout: "horizontal",
      color: "gold",
      shape: "rect",
      label: "paypal"
    },
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: "19.95",
            currency_code: "EUR"
          }
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        console.log("Pago completado por " + details.payer.name.given_name);
        window.location.href = "/quantum-pass-access";
      });
    },
    onCancel: function(data) {
      window.location.href = "/pay/error";
    }
  }).render("#paypal-button");
});
