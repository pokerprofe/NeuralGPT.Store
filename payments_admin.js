const fs = require("fs");
const path = require("path");

const MASTER = "Prozerg1@#";
const confPath = path.join(__dirname, "payments", "gpay_config.json");

function load(){
  if(!fs.existsSync(confPath)) return {};
  try { return JSON.parse(fs.readFileSync(confPath)); }
  catch { return {}; }
}

function save(cfg){
  fs.writeFileSync(confPath, JSON.stringify(cfg,null,2));
}

function mask(id){
  if(!id || !id.trim()) return "";
  const s = id.trim();
  if(s.length <= 4) return "****";
  return "****" + s.slice(-4);
}

module.exports = (app)=>{

  app.get("/api/admin/pay/config", (req,res)=>{
    const cfg = load();
    res.json({
      ok:true,
      merchantName: cfg.merchantName || "NeuralGPT.Store",
      gateway: cfg.gateway || "",
      merchantIdMasked: mask(cfg.merchantId || "")
    });
  });

  app.post("/api/admin/pay/config", (req,res)=>{
    const body = req.body || {};
    if(body.adminPassword !== MASTER){
      return res.status(401).json({ok:false, error:"Unauthorized"});
    }

    const cfg = {
      merchantName: body.merchantName || "NeuralGPT.Store",
      merchantId: body.merchantId || "",
      gateway: body.gateway || "",
      gatewayMerchantId: body.gatewayMerchantId || ""
    };

    save(cfg);
    res.json({ok:true});
  });

};
