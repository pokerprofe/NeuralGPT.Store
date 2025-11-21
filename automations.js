const fs = require("fs");
const path = require("path");
const multer = require("multer");

const dbFile = path.join(__dirname, "../database/automations.json");
const mapsDir = path.join(__dirname, "../uploads/automations/maps");
const blueDir = path.join(__dirname, "../uploads/automations/blueprints");

function loadDB(){
  try{
    if(!fs.existsSync(dbFile)) return [];
    const raw = fs.readFileSync(dbFile, "utf8") || "[]";
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  }catch(e){
    return [];
  }
}
function saveDB(list){
  fs.writeFileSync(dbFile, JSON.stringify(list, null, 2), "utf8");
}

function makeStorage(targetDir){
  return multer.diskStorage({
    destination:(req,file,cb)=>cb(null, targetDir),
    filename:(req,file,cb)=>{
      const ts = Date.now();
      const safe = file.originalname.replace(/[^\w\.\-]/g,"_");
      cb(null, ts + "_" + safe);
    }
  });
}

module.exports = (app)=>{
  if(!fs.existsSync(mapsDir)) fs.mkdirSync(mapsDir, {recursive:true});
  if(!fs.existsSync(blueDir)) fs.mkdirSync(blueDir, {recursive:true});

  const uploadMap = multer({storage:makeStorage(mapsDir)});
  const uploadBlue = multer({storage:makeStorage(blueDir)});

  // Subir mapa visual (imagen)
  app.post("/api/admin/automations/upload-map", uploadMap.single("file"), (req,res)=>{
    const list = loadDB();
    const id = "auto_" + Date.now();
    const body = req.body || {};
    list.push({
      id,
      type:"map",
      title: body.title || "Automation Map",
      notes: body.notes || "",
      visibility: body.visibility || "private",
      filename: req.file ? req.file.filename : null,
      url: req.file ? "/uploads/automations/maps/" + req.file.filename : null,
      createdAt: new Date().toISOString()
    });
    saveDB(list);
    return res.json({ok:true, id});
  });

  // Subir blueprint (documento)
  app.post("/api/admin/automations/upload-blueprint", uploadBlue.single("file"), (req,res)=>{
    const list = loadDB();
    const id = "auto_" + Date.now();
    const body = req.body || {};
    list.push({
      id,
      type:"blueprint",
      title: body.title || "Agent Blueprint",
      notes: body.notes || "",
      visibility: body.visibility || "private",
      filename: req.file ? req.file.filename : null,
      url: req.file ? "/uploads/automations/blueprints/" + req.file.filename : null,
      createdAt: new Date().toISOString()
    });
    saveDB(list);
    return res.json({ok:true, id});
  });

  // Listar todo
  app.get("/api/admin/automations/list", (req,res)=>{
    const list = loadDB().sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ok:true, items:list});
  });

  // Detalle simple
  app.get("/api/admin/automations/:id", (req,res)=>{
    const list = loadDB();
    const item = list.find(x=>x.id === req.params.id);
    if(!item) return res.status(404).json({ok:false});
    res.json({ok:true, item});
  });
};
