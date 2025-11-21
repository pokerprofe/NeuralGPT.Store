const jwt = require('./jwt_handler.cjs');

function protect(role) {
  return (req,res,next)=>{
    const token = req.headers['authorization']?.replace('Bearer ','') || '';
    const data = jwt.verify(token);
    if (!data) return res.status(401).json({ok:false,msg:'No autorizado'});
    if (role && data.role !== role) return res.status(403).json({ok:false,msg:'Acceso denegado'});
    req.user = data;
    next();
  };
}

module.exports = { protect };
