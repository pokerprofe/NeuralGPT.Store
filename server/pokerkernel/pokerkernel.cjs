// =====================================================
// POKERKERNEL – Núcleo maestro de APIs propias
// Solo local. Sin APIs externas. Sin pagos.
// Punto central para vendors, affiliates, products, etc.
// =====================================================
const express = require('express');
const router  = express.Router();

// JSON para todas las rutas del kernel
router.use(express.json());

// Ping rápido del kernel
router.get('/ping', (req,res)=>{
  res.json({ ok:true, kernel:'PokerKernel', t:Date.now() });
});

// ===== ESPACIOS RESERVADOS (se irán llenando poco a poco) =====

// Vendors API (proveedores)
router.use('/vendors', (req,res,next)=>{ next(); });

// Affiliates API (afiliados)
router.use('/affiliates', (req,res,next)=>{ next(); });

// Products API
router.use('/products', (req,res,next)=>{ next(); });

// Campaigns / Notificaciones masivas
router.use('/campaigns', (req,res,next)=>{ next(); });

// Escritorio / Desktop bridge (Irene local)
router.use('/desktop', (req,res,next)=>{ next(); });

// Mantenimiento y AutoOps
router.use('/maintenance', (req,res,next)=>{ next(); });

// Analítica interna
router.use('/analytics', (req,res,next)=>{ next(); });

// =====================================================
// Fin del núcleo inicial. Irene lo irá poblando.
// =====================================================
module.exports = router;
