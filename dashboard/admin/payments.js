(async function(){
  const qs = id => document.getElementById(id);

  async function loadConfig(){
    try{
      const res = await fetch("/api/admin/pay/config");
      const data = await res.json();
      if(!data.ok) return;

      qs("p_merchantName").value = data.merchantName || "";
      qs("p_gateway").value = data.gateway || "";
      qs("p_merchantStatus").textContent =
        data.merchantIdMasked ? ("Current: " + data.merchantIdMasked) : "Merchant not configured.";
    }catch(e){}
  }

  qs("p_save").addEventListener("click", async ()=>{
    const body = {
      merchantName: qs("p_merchantName").value.trim(),
      merchantId: qs("p_merchantId").value.trim(),
      gateway: qs("p_gateway").value.trim(),
      gatewayMerchantId: qs("p_gatewayMerchantId").value.trim(),
      adminPassword: qs("p_adminPwd").value
    };

    const box = qs("p_status");
    box.textContent = "Saving...";
    try{
      const res = await fetch("/api/admin/pay/config",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify(body)
      });
      const data = await res.json();
      if(!res.ok || !data.ok){
        box.textContent = data.error || "Error saving configuration.";
        return;
      }
      box.textContent = "Configuration saved.";
      qs("p_merchantId").value = "";
      qs("p_gatewayMerchantId").value = "";
      loadConfig();
    }catch(e){
      box.textContent = "Network error.";
    }
  });

  loadConfig();
})();
