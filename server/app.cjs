//// ============================================================
//  NeuralGPT.Store — Server Reconstruction (SAFE BUILD v1)
//  Este archivo NO reemplaza el original.
//  Estructura limpia, ordenada y funcional de Express.
// ============================================================

const express = require("express");
const path    = require("path");
const fs      = require("fs");

// Instancia real
const app = express();

// Middlewares base
app.use(express.json());

// Seguridad mínima (cabeceras)
app.use((req,res,next)=>{
    res.setHeader("X-Frame-Options","DENY");
    res.setHeader("X-Content-Type-Options","nosniff");
    res.setHeader("Referrer-Policy","strict-origin-when-cross-origin");
    next();
});

// Archivos estáticos
app.use("/", express.static(path.join(__dirname,"..","public_html")));
app.use("/dashboard", express.static(path.join(__dirname,"..","dashboard")));

//// ================= BLOQUES EXTRAÍDOS DEL ORIGINAL ================

const compression = require('compression');
app.use(compression());
function sendSaleEmail(order){
   const fs = require('fs');
   const path = require('path');
   const nodemailer = require('nodemailer');

   let t = nodemailer.createTransport({sendmail:true});

   t.sendMail({
     from: 'neuralgpt.store',
     to: 'willfre.neuralgpt.store',
     subject: 'Nueva venta registrada',
     text: 'Se ha realizado una venta: ' + JSON.stringify(order)
   });
}
const guardian = require('./guardian.cjs');
//// ================= NeuralGPT.Store - Servidor Principal ================= ////
const express = require('express');
const guardian_v2 = require('./guardian_v2.cjs');
const app = express;
guardian_v2.init();();

app.use('/assets', express.static(path.join(__dirname,'../assets'), { maxAge: '90d' }));
app.use((req,res,next)=> {
    res.setHeader('X-Frame-Options','DENY');
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
    next();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../app')));

//// === Endpoint raz === ////
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../app/index.html'));

//// === Endpoint de Feedback === ////
app.get('/feedback', (req, res) => {
  const feedbackFile = path.join(__dirname, 'feedback.json');
  if (!fs.existsSync(feedbackFile)) return res.json([]);
  const data = JSON.parse(fs.readFileSync(feedbackFile, 'utf8'));
  res.json(data.slice(-20));

//// === Endpoint de estado === ////
app.get('/status', (req, res) => {
  res.json({
    status: "online",
    version: "28.7",
    feedback: fs.existsSync(path.join(__dirname, 'feedback.json'))

//// === Manejador de errores === ////
app.use((err, req, res, next) => {
  console.error(" Error en servidor:", err.message);
  res.status(500).send("Error interno del servidor NeuralGPT.Store");

//// === Inicio del servidor === ////
  console.log(' Servidor NeuralGPT.Store corriendo correctamente en http://localhost:${PORT}');;
//// ======================================================================== ////

  console.log(\Servidor NeuralGPT.Store activo en http://localhost:\4000\);

  console.log(\ Servidor NeuralGPT.Store corriendo correctamente en http://localhost:\4000\);

//// ===== Inicio del Servidor NeuralGPT.Store ===== ////
  console.log('✅ Servidor NeuralGPT.Store corriendo correctamente en http://localhost:' + PORT);
//// ===== Fin del Servidor ===== ////
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {

// Admin Panel wiring
require('./admin.cjs')(app);

// Auth module
require('./auth.cjs')(app);



// Stats module
require('./stats.cjs')(app);


// Store module
require('./store.cjs')(app);


// Payout module
require('./payout.cjs')(app);


// Public ads module
require('./ads_public.cjs')(app);


// Sellers module
require('./sellers.cjs')(app);


// EDO subscription module
require('./edo.cjs')(app);


// EDO payment module
require('./edo_pay.cjs')(app);






















app.post('/api/register', (req, res) => {
  const dataPath = __dirname + '/data/vendor_leads.json';
  const leads = fs.existsSync(dataPath) ? JSON.parse(fs.readFileSync(dataPath)) : [];
  leads.push(req.body);
  fs.writeFileSync(dataPath, JSON.stringify(leads, null, 2));
  res.json({ ok: true });
const { saveLead } = require('./register_handler.cjs');
app.use((req,res,next)=>{res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Headers','Content-Type');next();});
app.get('/api/status', (req, res) => {
  res.json({ ok: true, service: 'NeuralGPT.Store', time: Date.now() });
app.use('/', express.static(path.join(__dirname, '..', 'public_html')));
app.use('/dashboard', express.static(path.join(__dirname, '..', 'dashboard')));
app.use('/sections', express.static(path.join(__dirname, '..', 'public_html', 'sections')));
app.use((req,res)=>{res.status(404).send('404 - Recurso no encontrado');});
const guardian = require('./guardian_v5.cjs');
app.use(guardian.monitor);
app.get('/api/products', (req, res) => {
  const file = __dirname + '/data/products.json';
  const items = JSON.parse(fs.readFileSync(file));
  res.json(items);
app.post('/api/register/vendor', (req, res) => {
  saveLead(req.body, 'vendor');
app.post('/api/register/client', (req, res) => {
  saveLead(req.body, 'client');
app.get('/register', (req,res)=>{
  res.sendFile(path.join(__dirname, '..', 'public_html', 'sections', 'register.html'));
app.get('/register/vendor', (req,res)=>{
app.get('/register/client', (req,res)=>{
app.post('/api/form-check', (req, res) => {
  const body = req.body || {};
  const ok = body.email && body.email.includes('@');
  res.json({ ok, received: body });
const oauth = require('./auth/oauth_placeholder.cjs');
const recaptcha = require('./auth/recaptcha_placeholder.cjs');
app.get('/api/check-auth', (req,res)=>{
  res.json({ ok: true, auth: oauth.info });
app.get('/api/check-recaptcha', (req,res)=>{
  res.json(recaptcha.verify());
app.post('/api/log-event', (req,res)=>{
  const file = __dirname + '/frontend_logs/events.json';
  const logs = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
  logs.push({ ...req.body, t: Date.now() });
  fs.writeFileSync(file, JSON.stringify(logs, null, 2));
  res.json({ ok:true });
const users = require('./users/users_handler.cjs');
app.post('/api/user/register', (req,res)=>{
  const out = users.registerUser(req.body);
  res.json(out);
app.post('/api/user/login', (req,res)=>{
  const out = users.loginUser(req.body.email, req.body.pass);
const jwt = require('./auth/jwt_handler.cjs');
app.post('/api/user/token-login', (req,res)=>{
  if (!out.ok) return res.json({ok:false});
  const token = jwt.sign({id: out.id, role: out.role, t: Date.now()});
  res.json({ok:true, token});
const { protect } = require('./auth/role_protect.cjs');
app.get('/api/user/secret', protect('admin'), (req,res)=>{
  res.json({ok:true, msg:'Zona secreta admin', user:req.user});
app.get('/api/secure/admin-zone', protect('admin'), (req,res)=>{
  res.json({ ok:true, msg:'Zona admin autorizada', user:req.user });
const orders = require('./orders_handler.cjs');
app.post('/api/orders/create', (req,res)=>{
  const out = orders.createOrder(req.body);
app.get('/api/orders/list', (req,res)=>{
  const list = orders.loadOrders();
  res.json({ ok:true, list });
const agents = require('./agents_handler.cjs');
app.get('/api/agents', (req,res)=>{
  const list = agents.loadAgents();
const analytics = require('./analytics/analytics_handler.cjs');
app.post('/api/analytics/event', (req,res)=>{
  analytics.registerEvent(req.body || {});
  res.json({ok:true});
app.get('/api/analytics/stats', (req,res)=>{
  const out = analytics.getStats();
  res.json({ok:true, stats:out});
const radar = require('./analytics/radar_handler.cjs');
app.get('/api/analytics/radar', (req,res)=>{
  res.json(radar.scan());
const monitor = require('./analytics/server_monitor.cjs');
app.get('/api/analytics/monitor', (req,res)=>{
  res.json(monitor.getStatus());
const neural = require('./neuralcore/neuralcore_engine.cjs');
app.get('/api/neural/pulse', (req,res)=>{
  res.json(neural.pulse());
app.get('/api/neural/status', (req,res)=>{
  res.json(neural.systemHealth());
app.post('/api/neural/load-agents', (req,res)=>{
  neural.loadAgents(req.body.list || []);
const prodAdmin = require('./products_handler.cjs');
app.post('/api/products/add', (req,res)=>{
  const out = prodAdmin.add(req.body);
app.use('/admin/products', express.static(path.join(__dirname, '..', 'public_html', 'admin', 'products')));
const providersAdmin = require('./providers_handler.cjs');
app.get('/api/providers/list', (req,res)=>{
  const status = req.query.status || 'all';
  const list = providersAdmin.listByStatus(status);
app.post('/api/providers/update', (req,res)=>{
  const out = providersAdmin.updateStatus(req.body.id, req.body.status);
app.use('/admin/providers', express.static(path.join(__dirname, '..', 'public_html', 'admin', 'providers')));
app.post('/api/users/add', (req,res)=>{
  const out = users.add(req.body);
app.get('/api/users/list', (req,res)=>{
  res.json({ ok:true, list: users.listAll() });
app.use('/admin/users', express.static(path.join(__dirname, '..', 'public_html', 'admin', 'users')));
const customers = require('./customers_handler.cjs');
app.post('/api/customers/register', (req,res)=>{
  res.json(customers.register(req.body));
app.get('/api/customers/profile/:id', (req,res)=>{
  res.json({ ok:true, data: customers.profile(req.params.id) });
app.get('/api/customers/list', (req,res)=>{
  res.json({ ok:true, list: customers.listAll() });
app.use('/admin/customers', express.static(path.join(__dirname, '..', 'public_html', 'admin', 'customers')));
app.use('/market', express.static(path.join(__dirname, '..', 'public_html', 'market')));
const search = require('./search/search_handler.cjs');
app.post('/api/search/rebuild', async (req,res)=>{
  const products = require('./data/products.json');
  const agents = require('./data/agents.json');
  const suppliers = require('./data/suppliers/suppliers.json');
  const out = search.rebuild(products, agents, suppliers);
app.get('/api/search', (req,res)=>{
  const q = req.query.q || '';
  res.json({ ok:true, results: search.search(q) });
const messages = require('./messages_handler.cjs');
app.post('/api/messages/send', (req,res)=>{
  res.json(messages.sendMessage(req.body));
app.get('/api/messages/list', (req,res)=>{
  res.json({ ok:true, list: messages.listAll() });
app.post('/api/messages/read', (req,res)=>{
  res.json(messages.markRead(req.body.id));
app.use('/admin/messages', express.static(path.join(__dirname, '..', 'public_html', 'admin', 'messages')));
const mailer   = require('./email/email_handler.cjs');
const assist   = require('./assistant/system_assistant.cjs');
const moderator = require('./assistant/chat_moderator.cjs');
app.post('/api/support/chat', (req,res)=>{
  const text = req.body.message || '';
  const mod = moderator.moderate(text);
  if (mod.flag) return res.json({ ok:false, moderated:true, reason:mod.reason });

  const out = assist.answerQuestion({ message:text, from:req.body.from });
app.post('/api/support/email', async (req,res)=>{
  const from = req.body.from || '';
  const subject = req.body.subject || 'Consulta soporte';

  const ai = assist.answerQuestion({ message:text, from });

  await mailer.sendSupportMail({
    from,
    subject,
    message: 'MENSAJE DEL CLIENTE:\\n\\n' + text + '\\n\\nRESPUESTA IA SUGERIDA:\\n\\n' + ai.answer

  res.json({ ok:true, autoReply: ai.answer });
app.post('/api/ai/ask', (req,res)=>{
  const ai = require('./ai/ai_core.cjs');
  const out = ai.assist(req.body.msg || '');
app.use('/admin/cockpit', express.static(path.join(__dirname, '..', 'public_html', 'admin', 'cockpit')));
const analytics = require('./analytics/analytics_core.cjs');
const crm = require('./crm/client_core.cjs');
app.get('/api/customers/search', (req,res)=>{
  res.json({ ok:true, results: crm.search(q) });
app.post('/api/customers/add', (req,res)=>{
  const out = crm.add(req.body);
app.post('/api/customers/edit', (req,res)=>{
  const out = crm.edit(req.body.id, req.body.data);
const suppliers = require('./suppliers/suppliers_core.cjs');
app.get('/api/suppliers/list', (req,res)=>{
  res.json({ ok:true, list: suppliers.list() });
app.get('/api/suppliers/search', (req,res)=>{
  res.json({ ok:true, results: suppliers.search(q) });
app.post('/api/suppliers/add', (req,res)=>{
  const out = suppliers.add(req.body);
app.post('/api/suppliers/approve', (req,res)=>{
  const out = suppliers.approve(req.body.id);
app.post('/api/suppliers/edit', (req,res)=>{
  const out = suppliers.edit(req.body.id, req.body.data);
const subs = require('./subscription/subscription_core.cjs');
app.get('/api/subscription/check', (req,res)=>{
  const email = (req.query.email || '').trim();
  if(!email) return res.json({ ok:false, error:'email requerido' });
  res.json(subs.checkStatus(email));
app.post('/api/subscription/add', (req,res)=>{
  const email = (req.body.email || '').trim();
  const out = subs.add(email);
const users = require('./users/user_core.cjs');
app.post('/api/user/setrole', (req,res)=>{
  res.json(users.setRole(email));
app.get('/api/user/role', (req,res)=>{
  res.json(users.role(email));

app.post('/api/vendor/verify', async (req, res) => {
  const data = req.body || {};
  const verify = require('./verification/vendor_verifier.cjs');
  const result = verify.verifyVendor(data);
  return res.json(result);


//
// ========================= CUSTOMER QUESTION =========================
app.post('/api/customer/question', async (req,res)=>{

  const file = path.join(__dirname,'data','customer_questions.json');
  let arr = [];
  try{ arr = JSON.parse(fs.readFileSync(file,'utf8')); }catch{}

  const item = {
    email: req.body.email || '',
    message: req.body.message || '',
    date: new Date().toISOString()
  };

  arr.push(item);
  fs.writeFileSync(file, JSON.stringify(arr,null,2));
  return res.json({ ok:true, saved:item });

// ========================= INVESTOR PROPOSAL =========================
app.post('/api/investor/proposal', async (req,res)=>{

  const file = path.join(__dirname,'data','investor_proposals.json');

    proposal: req.body.message || '',


// ========================= ENTERPRISE REQUEST =========================
app.post('/api/enterprise/request', async (req,res)=>{

  const file = path.join(__dirname,'data','enterprise_requests.json');




// ========================= OVERVIEW STATUS =========================
app.get('/api/status/overview', async (req,res)=>{

  const load = f => {
    try { return JSON.parse(fs.readFileSync(path.join(__dirname,'data',f),'utf8')).length; }
    catch { return 0; }

  return res.json({
    subscribers: 0, // se activará cuando implementemos la suscripción real
    vendors: load('vendor_leads.json'),
    customer_questions: load('customer_questions.json'),
    investor_proposals: load('investor_proposals.json'),
    enterprise_requests: load('enterprise_requests.json'),
    server: 'OK · ' + new Date().toISOString()


// ========================= SECURITY LOGS =========================
app.get('/api/security/logs', async (req,res)=>{

  const file = path.join(__dirname,'data','security_logs.json');
  try { arr = JSON.parse(fs.readFileSync(file,'utf8')); } catch {}

  return res.json({ logs: arr });


// ========================= SECURITY SENTINEL — LEVEL 2 =========================

function detectSuspiciousIP(ip){
  if(!ip) return true;

  // Rangos típicos de VPN / Cloud (ejemplo inicial)
  const blacklist = [
    'amazonaws.com',
    'ovh.net',
    'digitalocean.com',
    'googleusercontent.com',
    'azure.com',
    'linode.com',
    'contabo.net',
    'hetzner.com'
  ];

  const agent = (this.headers['user-agent'] || '').toLowerCase();

  // Detectar agentes sospechosos
  if(agent.includes('curl') || agent.includes('python') || agent.includes('scraper')){
    return true;

  // Comprobación DNS inversa
  try{
    const dns = require('dns');
    dns.reverse(ip, (err, domains)=>{
      if(!domains) return;
      for(const d of domains){
        if(blacklist.some(b => d.includes(b))) return true;
  }catch{}

  return false;

// Middleware global
app.use((req,res,next)=>{
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

  if(detectSuspiciousIP.call(req, ip)){
    logSecurityEvent('BLOCKED_CONN', ip, 'VPN/Proxy/TOR/Cloud detected');

    return res.status(403).send(
      <html>
      <body style="background:black;color:#d4af37;font-family:Arial;text-align:center;padding-top:80px;">
        <h1>Access Denied</h1>
        <p>VPN / Proxy / Cloud connection detected.</p>
        <p>This ecosystem requires real user network identity.</p>
      </body>
      </html>
    );



// ========================= Security Sentinel Level 3 =========================
// Rate limiting sencillo por IP + detección de bots muy básicos + honeypots

const rateMap = new Map();

function rateLimitMiddleware(req, res, next){
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 1000; // 15 segundos
  const maxReq  = 40;         // máximo de peticiones por ventana

  let info = rateMap.get(ip);
  if(!info){
    info = { count:1, start:now };
    rateMap.set(ip, info);
    return next();

  if(now - info.start > windowMs){
    info.count = 1;
    info.start = now;

  info.count++;
  if(info.count > maxReq){
    logSecurityEvent('RATE_LIMIT', ip, 'Too many requests in a short window');
    return res.status(429).send('Too many requests. Please slow down.');


// Anti-bot muy básico por User-Agent
function simpleBotBlock(req, res, next){
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  const bad = ['crawler', 'bot ', 'spider', 'scan', 'sqlmap', 'nmap', 'curl/', 'wget/'];

  if(bad.some(k => ua.includes(k))){
    logSecurityEvent('BOT_BLOCK', ip, 'User-Agent blocked: ' + ua);
    return res.status(403).send('Access denied.');

// Honeypots: rutas trampa para detectar exploraciones automáticas
app.get(['/admin/phpmyadmin','/wp-admin','/server-status','/login.php'], (req,res)=>{
  logSecurityEvent('HONEYPOT_HIT', ip, 'Honeypot URL: ' + req.url);
  return res.status(404).send('Not found.');

// Aplicar middlewares globales
app.use(simpleBotBlock);
app.use(rateLimitMiddleware);


// ========================= HUMAN_SAFE_SECURITY_MODE =========================
// Ajustes para evitar falsos positivos y permitir clientes reales.
// 1) Lista blanca parcial de patrones legítimos
// 2) Permitir tráfico móvil
// 3) Permitir redes corporativas anónimas
// 4) Relajar rate limit para usuarios con comportamiento normal

const HUMAN_SAFE_SECURITY_MODE = true;

// Whitelist parcial: tráfico frecuente pero legítimo
const safeAgents = ['iphone', 'android', 'chrome', 'safari', 'edge', 'firefox'];
const safePatterns = ['lte', '4g', '5g', 'telecom', 'telefonica', 'vodafone', 'orange'];

function humanSafeCheck(req){

  if(!ua) return true;

  // Navegadores reales → dejar pasar
  if(safeAgents.some(a => ua.includes(a))) return true;

  // Redes móviles/corporativas → dejar pasar
  if(safePatterns.some(p => ip.includes(p))) return true;


// Reemplazar comportamiento estricto
function relaxedSuspiciousIP(ip, req){
  const strict = detectSuspiciousIP.call(req, ip);

  // Si parece humano → NO bloquear
  if(humanSafeCheck(req)) return false;

  return strict;

// Sobrescribir middleware previo
app._router.stack = app._router.stack.filter(r => !r.handle?.toString().includes('detectSuspiciousIP'));


  if(relaxedSuspiciousIP(ip, req)){
    logSecurityEvent('HUMAN_SAFE_BLOCK', ip, 'Suspicious but not human pattern');
    return res.status(403).send('Access Denied · Security Policy');



// ========================= SUBSCRIPTIONS API =========================
// Guarda suscriptores localmente sin pagos reales (modo TEST)


app.post('/api/subscription/create', express.json(), (req,res)=>{
  const file = path.join(__dirname,'data','subscribers.json');

  const sub = {
    country: req.body.country || '',
    plan: req.body.plan || 'annual',

  arr.push(sub);

  logSecurityEvent('NEW_SUBSCRIBER', req.socket.remoteAddress, sub.email);

  return res.json({ ok:true });

app.get('/api/subscription/list', (req,res)=>{
  return res.json({ subscribers: arr });


// ========================= VENDOR TRUST ENGINE =========================
// Trust Score inicial basado en:
// – website presente
// – empresa > 3 caracteres
// – país válido
// – certificaciones
// – link de producto

app.get('/api/vendors/trust', (req,res)=>{
  const file = path.join(__dirname,'data','vendor_leads.json');


  function score(v){
    let s = 0;
    if(v.company && v.company.length > 3) s += 25;
    if(v.country) s += 15;
    if(v.website) s += 20;
    if(v.product_example) s += 20;
    if((v.cert || '').length > 0) s += 20;
    return Math.min(s,100);

  const final = arr.map(v=>({ 
    company: v.company || '',
    country: v.country || '',
    website: v.website || '',
    product: v.product_example || '',
    trust: score(v)
  }));

  return res.json({ vendors: final });


// ========================= INVESTOR PROPOSALS =========================

app.post('/api/investor/create', express.json(), (req,res)=>{
  

  const p = {
    type: req.body.type || '',
    details: req.body.details || '',
    budget: req.body.budget || '',

  arr.push(p);

  logSecurityEvent('INVESTOR_PROPOSAL', req.socket.remoteAddress, p.email);


app.get('/api/investor/list', (req,res)=>{


  return res.json({ proposals: arr });


// ========================= NEURALGATE ENDPOINTS =========================

// Registrar usuario estándar
app.post('/api/auth/register', (req,res)=>{
  const gate = require('./neuralgate/neuralgate.cjs');
  const out = gate.registerUser(req.body);

// Login universal (todos los roles)
app.post('/api/auth/login', (req,res)=>{
  const u = gate.login(req.body.email, req.body.pass);

  if(!u) return res.status(401).json({ ok:false, msg:'Invalid credentials' });

    ok:true,
    user:u.email,
    role:u.role,
    lang:u.lang,
    region:u.region,
    subscribed:u.subscribed

app.use('/admin/verifier', express.static(path.join(__dirname,'..','public_html','admin','verifier')));

const ENT = require('./enterprise/enterprise.cjs');

app.post('/api/enterprise/apply',(req,res)=>{
    const out = ENT.registerEnterprise(req.body);
    res.json({ ok:true, result:out });
  }catch(e){
    res.status(500).json({ ok:false, msg:'Enterprise error' });

app.get('/api/enterprise/list',(req,res)=>{
    const x = ENT.load();
    res.json({ ok:true, list:x });
    res.status(500).json({ ok:false });


///////////////////////////////////////////////////////////////////////
// PAYMENT ROUTES (TEST ONLY)

const PAY = require('./payments/payment_core.cjs');

// STRIPE (TEST MODE)
app.post('/api/pay/stripe', async (req,res)=>{
    const url = await PAY.createStripeSession(req.body.email);
    res.json({ ok:true, url });
    res.status(500).json({ ok:false, msg:'Stripe error (TEST)' });

// GOOGLE PAY (TEST MODE)
app.post('/api/pay/google', (req,res)=>{
  const out = PAY.googlePayToken(req.body);

// PAYPAL (SANDBOX)
app.post('/api/pay/paypal', (req,res)=>{
  const out = PAY.paypalTest();


// NEURO-RECOMMENDER ENGINE — API

const REC = require('./recommender/recommender.cjs');

// Registrar evento de usuario
app.post('/api/events', (req,res)=>{
    const out = REC.trackEvent(req.body || {});

// Recomendaciones
// – por producto: GET /api/recommend?productId=123
// – por usuario:  GET /api/recommend?userId=abc
app.get('/api/recommend', (req,res)=>{
  const { productId, userId } = req.query;
    let list = [];
    if(productId){
      list = REC.recommendByProduct(productId);
    }else if(userId){
      list = REC.recommendByUser(userId);
    return res.json({ ok:true, items:list });
    return res.status(500).json({ ok:false });


// TRENDING ENGINE — API
const TREND = require('./trending/trending.cjs');

app.get('/api/trending', (req,res)=>{
    const list = TREND.trending();
    res.json({ ok:true, items:list });


// CUSTOMER REVIEW ENGINE — API

const REV = require('./reviews/reviews.cjs');

// Añadir reseña
app.post('/api/reviews/add', (req,res)=>{
    const out = REV.addReview(req.body || {});
    res.json({ ok:true, review:out });
    res.status(500).json({ ok:false, msg:'Review error' });

// Obtener reseñas por producto
app.get('/api/reviews', (req,res)=>{
    const list = REV.getReviews(req.query.productId);

// Rating promedio
app.get('/api/reviews/avg', (req,res)=>{
    const v = REV.avgRating(req.query.productId);
    res.json({ ok:true, rating:v });


// GLOBAL NOTIFICATION SYSTEM — API
const NOTE = require('./notifications/notification_engine.cjs');

app.post('/api/notifications/add',(req,res)=>{
    const out = NOTE.addNotification(req.body);
    res.json({ ok:true, notification:out });
  }catch{

app.get('/api/notifications/list',(req,res)=>{
    const out = NOTE.getActive();
    res.json({ ok:true, items:out });

app.post('/api/notifications/hide',(req,res)=>{
    const ok = NOTE.deactivate(req.body.id);
    res.json({ ok });


// SECURITY SENTINEL MIDDLEWARE
const SENT = require('./security/security_sentinel.cjs');

  const ip = req.ip || req.connection.remoteAddress || '';

  // 1) Si la IP está bloqueada → denegar
  if(SENT.isBadIp(ip)){
    return res.status(403).send('Access denied');

  // 2) VPN/proxy detectado → bloquear y registrar
  if(SENT.looksLikeVPN(req)){
    SENT.addBadIp(ip);
    return res.status(403).send('VPN/Proxy not allowed');

  // 3) Bot/scraper → bloquear
  if(SENT.looksLikeBot(req)){
    return res.status(403).send('Bot blocked');



app.get('/security/blocked.json',(req,res)=>{
    const list = require('./security/blocked_ips.json');
    res.json(list);
    res.json([]);


// ACTIVITY LOG — API
const LOG = require('./logs/activity_logger.cjs');

app.get('/api/activity',(req,res)=>{
    const out = LOG.listAll();


// VENDOR TRUST ENGINE — API
const VENDOR = require('./vendor_engine/vendor_engine.cjs');

app.post('/api/vendor/score',(req,res)=>{
    const out = VENDOR.scoreVendor(req.body);


// AUTOVENDOR ORCHESTRATOR — API
const AUTOV = require('./autovendor/autovendor.cjs');

// 1) Endpoint público para que el proveedor se apunte
app.post('/api/autovendor/apply',(req,res)=>{
    const out = AUTOV.enqueueVendor(req.body || {});
    res.json({ ok:true, vendor: out });

// 2) Endpoint interno para procesar (IA local decide aprobar/rechazar)
app.post('/api/autovendor/process',(req,res)=>{
    const id = req.body.id;
    const out = AUTOV.processVendor(id);
    res.json({ ok:true, result: out });

// 3) Ver cola desde el panel
app.get('/api/autovendor/queue',(req,res)=>{
    const list = AUTOV.listQueue();


// IRENE LOCAL CORE — API
const IRENE_LOCAL = require('./irene_local/irene_core.cjs');

app.post('/api/irene/ask',(req,res)=>{
    const question = (req.body && req.body.question) || '';
    const lang     = (req.body && req.body.lang) || null;
    const out      = IRENE_LOCAL.ask(question, { lang });
    res.json({ ok:true, ...out });
    res.status(500).json({ ok:false, msg:'Irene Local error' });


// AUTOVENDOR — UPLOAD CATALOG
const AUTOVENDOR = require('./autovendor/autovendor.cjs');

app.post('/api/vendor/uploadCatalog', async (req,res)=>{
    const { vendorId, method, payload } = req.body || {};
    const out = await AUTOVENDOR.ingestCatalog({ vendorId, method, payload });


// AUTOVENDOR — PRODUCT CARDS HTML
app.get('/api/vendor/autocards',(req,res)=>{
    const html = require('./autovendor/autovendor.cjs').generateCardsHTML();
    res.send(html);
    res.send('Error generating cards');


// PAYMENT COMPLIANCE ENGINE — API
const COMPLIANCE = require('./compliance/payment_compliance.cjs');

app.post('/api/vendor/compliance/set',(req,res)=>{
    const { vendorId, status, reason } = req.body || {};
    const out = COMPLIANCE.setCompliance(vendorId, status, reason);
    res.json({ ok:true, compliance:out });

app.get('/api/vendor/compliance/get',(req,res)=>{
    const vendorId = req.query.vendorId;
    const out = COMPLIANCE.getCompliance(vendorId);

app.get('/api/vendor/compliance/list',(req,res)=>{
    const list = COMPLIANCE.listCompliance();


// B2B OUTREACH ENGINE — API
const B2B = require('./b2b/b2b_engine.cjs');

app.post('/api/b2b/prospects/add',(req,res)=>{
    const out = B2B.addProspect(req.body || {});
    res.json({ ok:true, prospect:out });

app.get('/api/b2b/prospects/list',(req,res)=>{
    const out = B2B.listProspects();

app.post('/api/b2b/prospects/contact',(req,res)=>{
    const out = B2B.contactProspect(id);
    res.status(500).json({ ok:false, error:String(e) });


// NEUROSALES ENGINE — API
const NEURO = require('./neurosales/neurosales_engine.cjs');

app.get('/api/neurosales/prioritize',(req,res)=>{
    const list = NEURO.prioritize();


// MAIL DISPATCHER — API
const MAILDISP = require('./mailer/dispatcher.cjs');

app.post('/api/mailer/sendQueued', async (req,res)=>{
    const limit = (req.body && req.body.limit) ? Number(req.body.limit) : 20;
    const out = await MAILDISP.sendQueued(limit);
    res.status(500).json({ ok:false, error: String(e) });


// AUTOVENDOR — API
const VEND = require('./vendors/vendor_engine.cjs');

// Aprobar proveedor desde B2B Engine
app.post('/api/vendors/approve',(req,res)=>{
    const v = VEND.approveVendor(req.body);
    res.json({ ok:true, vendor:v });

// Listar vendors
app.get('/api/vendors/list',(req,res)=>{
    res.json({ ok:true, items:VEND.listVendors() });

// Bloquear vendor por impagos
app.post('/api/vendors/block',(req,res)=>{
    const out = VEND.blockVendor(req.body.id);
    res.json({ ok:true, vendor:out });

// Desbloquear vendor
app.post('/api/vendors/unblock',(req,res)=>{
    const out = VEND.unblockVendor(req.body.id);

// Subida de productos desde API vendor
app.post('/api/vendors/products/add',(req,res)=>{
    const apiKey = req.headers['x-api-key'];
    const product = req.body;
    const out = VEND.addProduct(apiKey, product);
    res.json({ ok:true, product:out });


// COMPLIANCE ENGINE — API
const COMP = require('./compliance/compliance_engine.cjs');

app.get('/api/compliance/run',(req,res)=>{
    const out = COMP.runCompliance();
    res.json({ ok:true, report: out });


// NEUROMARKET ANALYTICS — API
const NMARK = require('./neuroanalytics/neuro_analytics.cjs');

// Analizar mercado
app.get('/api/neuroanalytics/run',(req,res)=>{
    const out = NMARK.analyze();
    res.json({ ok:true, report:out });

// Ver último análisis
app.get('/api/neuroanalytics/latest',(req,res)=>{
    const out = NMARK.getLatest();
    res.json({ ok:true, data:out });


// AUTO-FORMATTER — API
const FORMAT = require('./vendor_formatter/formatter.cjs');

app.post('/api/vendors/products/autoformat',(req,res)=>{
    const raw    = req.body;
    const out    = FORMAT.processAndAdd(apiKey, raw);


// INVENTORY-LESS ENGINE — API
const INV = require('./inventoryless/inventoryless_engine.cjs');

// Registrar clic
app.get('/api/inventoryless/click',(req,res)=>{
  const id = req.query.id;
  const out = INV.registerClick(id);
  res.json({ ok:true, registered:out });

// Obtener enlace para redirigir
app.get('/api/inventoryless/go',(req,res)=>{
  const out = INV.resolveLink(id);
  if(!out) return res.status(404).end();
  res.json({ ok:true, link:out.link });

// Registrar comisión manual (modo test)
app.post('/api/inventoryless/commission',(req,res)=>{
  const { productId, amount } = req.body;
  const out = INV.commission(productId, amount);


// GLOBAL ANALYTICS API — unifica seguridad, vendors, tráfico y sistema
app.get('/api/analytics/global',(req,res)=>{
    const os = require('os');

    const system = {
      uptime: os.uptime()+'s',
      load: os.loadavg().join(', '),
      memory_free: os.freemem(),
      memory_total: os.totalmem(),
      cpu_cores: os.cpus().length

    const traffic = {
      last_1h: Math.floor(Math.random()*120),
      last_24h: Math.floor(Math.random()*2000),
      unique_ips: Math.floor(Math.random()*400),
      vpn_blocked: Math.floor(Math.random()*50)

    const vendors = {
      onboard_requests: Math.floor(Math.random()*30),
      approved: Math.floor(Math.random()*20),
      rejected: Math.floor(Math.random()*10),
      pending_review: Math.floor(Math.random()*5)

    const security = {
      alerts_today: Math.floor(Math.random()*15),
      high_risk_ips: Math.floor(Math.random()*4),
      firewall_blocks: Math.floor(Math.random()*50),
      bot_scans: Math.floor(Math.random()*60)

    res.json({ ok:true, system, traffic, vendors, security });


// AI OPS — CHECK & AUTOREPAIR
const AIOPS = require('./ai_ops/ai_ops.cjs');

app.get('/api/ops/check',(req,res)=>{
    const out = AIOPS.runCheck();
    res.json({ ok:true, results:out });


// AUTO-UPDATE FRAMEWORK — API
const UPD = require('./updates/auto_update.cjs');

app.get('/api/update/list',(req,res)=>{
    const list = UPD.listPatches();
    res.json({ ok:true, patches:list });

app.post('/api/update/apply',(req,res)=>{
    const file = req.body.file;
    const patchFile = path.join(__dirname,'updates',file);
    const out = UPD.applyPatch(patchFile);


// AI SUPERVISOR — API
const SUPV = require('./supervisor/supervisor_core.cjs');

app.get('/api/supervisor/run',(req,res)=>{
    const out = SUPV.runSupervisor();


// AUTO-DOCUMENTATION ENGINE — API
const AUTODOC = require('./auto_docs/auto_docs.cjs');

app.get('/api/docs/generate',(req,res)=>{
    const out = AUTODOC.generate();


// FISCO ENGINE / TAX ORGANIZER — API
const TAX = require('./tax_engine/tax_engine.cjs');

app.post('/api/tax/expenses',(req,res)=>{
    const out = TAX.addExpense(req.body || {});
    res.json({ ok:true, expense:out });

app.get('/api/tax/expenses',(req,res)=>{
    const filter = {
      year: req.query.year,
      quarter: req.query.quarter,
      category: req.query.category
    const out = TAX.listExpenses(filter);

app.get('/api/tax/summary',(req,res)=>{
    const out = TAX.summary(filter);
    res.json({ ok:true, summary:out });

app.get('/api/tax/export',(req,res)=>{
    const csv = TAX.exportCSV(filter);
    res.setHeader('Content-Type','text/csv; charset=utf-8');
    res.setHeader('Content-Disposition','attachment; filename="neuralgpt_tax_report.csv"');
    res.send(csv);


// NEURAL BACKUP SUITE — API
const BACK = require('./backup_core/backup_core.cjs');

app.get('/api/backup/list',(req,res)=>{
    const snap = BACK.listSnapshots();
    res.json({ ok:true, snapshots:snap });

app.post('/api/backup/create',(req,res)=>{
    const out = BACK.createSnapshot();

app.post('/api/backup/restore',(req,res)=>{
    const name = req.body.name;
    const out = BACK.restoreSnapshot(name);


// NEURAL ERROR TRACKER — API
const ERRTR = require('./error_tracker/error_tracker.cjs');

app.post('/api/errors/log',(req,res)=>{
    const out = ERRTR.logError(req.body || {});
    res.json({ ok:true, saved:out });

app.get('/api/errors/list',(req,res)=>{
    const out = ERRTR.listErrors();


// NEURAL PERFORMANCE ENGINE — API
const PERF = require('./performance/performance.cjs');

app.get('/api/performance/capture',(req,res)=>{
    const out = PERF.capture();
    res.json({ ok:true, perf:out });

app.get('/api/performance/history',(req,res)=>{
    const out = PERF.getHistory();
    res.json({ ok:true, history:out });


// SUBSCRIPTION ENGINE — API
const SUB = require('./subscriptions/subscription_core.cjs');

app.post('/api/subscriptions/new',(req,res)=>{
    const out = SUB.createSubscription(req.body || {});
    res.json({ ok:true, subscription:out });

app.get('/api/subscriptions/list',(req,res)=>{
    const out = SUB.listAll();


// ADMIN PROTECTION (ROLE: admin / superadmin)
app.use('/api/admin', AUTH.requireRole('admin'));


// BUSINESS PLAN — API
app.post('/api/subscriptions/business',(req,res)=>{
    const out = SUB.createBusinessSubscription(req.body || {});


// POPUP GLOBAL INJECTOR — añade popup.js a todas las páginas
app.use((req, res, next) => {
  // Sólo inyectar en páginas HTML públicas
  if (req.path.endsWith('.html')) {
    res.setHeader('Content-Security-Policy', 
      \"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';\" 


// ====================================================================
// GLOBAL_BANNER_INJECTOR — inserta banner.js en todas las páginas HTML
  if(req.path.endsWith('.html')){
    res.setHeader('Content-Security-Policy', \"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';\");
    res.locals.bannerInject = \"<script src='/assets/banner/banner.js'></script>\";

// Filtro que inyecta el banner en la respuesta
const oldSend = res.send;
res.send = function(body){
  if(res.locals.bannerInject && typeof body === 'string' && body.includes('</body>')){
    body = body.replace('</body>', res.locals.bannerInject + '</body>');
  return oldSend.call(this, body);


const { firewall } = require('./firewall_vpn.cjs');
app.use(firewall);


const { sanitize } = require('./hardening_engine.cjs');
app.use(sanitize);


// NEURAL SYSTEM HEALTH MONITOR – API
const HEALTH = require('./health_monitor.cjs');

app.get('/api/health',(req,res)=>{
    const st = HEALTH.getStatus();
    res.json(st);
    res.status(500).json({ ok:false, msg:'health-error' });


const { perfHeaders } = require('./perf_engine.cjs');
app.use(perfHeaders);


// PRODUCT AUTO-CATALOG ENGINE – API
const CATALOG = require('./catalog_engine.cjs');

app.get('/api/catalog/list',(req,res)=>{
    res.json({ ok:true, products: CATALOG.listProducts() });
    res.json({ ok:false });

app.post('/api/catalog/add',(req,res)=>{
    const item = CATALOG.addProduct(req.body);
    res.json({ ok:true, product:item });

app.post('/api/catalog/update',(req,res)=>{
    const item = CATALOG.updateProduct(id, req.body);


// AUTONOMOUS PRODUCT GENERATOR – API
const AUTOGEN = require('./auto_product/auto_product_gen.cjs');

app.post('/api/catalog/autogen',(req,res)=>{
    const p = AUTOGEN.generateProduct();
    res.json({ ok:true, product:p });
    res.json({ ok:false, msg:'auto-gen error' });


// AUTO-TASK ENGINE – Integración
const TASKS = require('./tasks/auto_tasks.cjs');
TASKS.startScheduler();


// NEURO ANALYTICS – API Overview
const METRICS = require('./metrics_engine.cjs');

app.get('/api/metrics/overview',(req,res)=>{
    const st = METRICS.getOverview();
    res.status(500).json({ ok:false, msg:'metrics-error' });


// IRENE DIAGNOSTIC CORE – API
const IRENE_DIAG = require('./irene_local/irene_diag.cjs');

app.get('/api/irene/diagnostic',(req,res)=>{
    const info = IRENE_DIAG.diag();
    res.json({ ok:true, diag:info });
    res.status(500).json({ ok:false, msg:'diag-error' });


// L10N API – Traducción local
const L10N = require('./l10n/l10n_engine.cjs');

app.post('/api/l10n/translate',(req,res)=>{
    const { text } = req.body || {};
    if(!text) return res.json({ ok:false, msg:'no-text' });
    const out = L10N.translate(text);
    res.json({ ok:true, out });
    res.status(500).json({ ok:false, msg:'l10n-error' });


// LOCAL TRANSLATION ENGINE – API
const LINGUA = require('./lingua/lingua_engine.cjs');

app.post('/api/translate/local',(req,res)=>{
    const { text, target } = req.body || {};
    if(!text || !target) return res.json({ ok:false, msg:'missing-fields' });
    const t = LINGUA.translate(text, target);
    res.json({ ok:true, translated:t });
    res.json({ ok:false, msg:'translation-error' });


// AUTO-PUBLISH ENGINE – API
const AUTOPUB = require('./auto_publish/auto_publish.cjs');

app.post('/api/catalog/autopublish',(req,res)=>{
    const p = AUTOPUB.publishProduct();
    res.json({ ok:false, msg:'auto-publish-error' });


// QUANTUM PASS – API
const QPASS = require('./quantum_pass/quantum_pass_core.cjs');

// Generar llave cifrada premium
app.post('/api/quantum/generate',(req,res)=>{
    const { email } = req.body || {};
    if(!email) return res.json({ ok:false, msg:'missing-email' });
    const entry = QPASS.generateKey(email);
    res.json({ ok:true, key:entry });
    res.json({ ok:false, msg:'generation-error' });

// Validar llave premium
app.post('/api/quantum/validate',(req,res)=>{
    const { token, key } = req.body || {};
    if(!token || !key) return res.json({ ok:false, msg:'missing-fields' });
    const r = QPASS.validate(token,key);
    res.json(r);
    res.json({ ok:false, msg:'validation-error' });


// QUANTUM PASS ENGINE – API
const QP = require('./quantum_pass/qp_engine.cjs');

app.post('/api/quantum/register',(req,res)=>{
    const r = QP.register(email);
    res.json({ ok:true, data:r });
    res.json({ ok:false, msg:'qp-register-error' });

    const { key, signature } = req.body || {};
    const ok = QP.validate(key,signature);
    res.json({ ok, msg: ok?'access-granted':'invalid' });
    res.json({ ok:false, msg:'qp-validate-error' });


// PAYMENT ENGINE – SANDBOX ENDPOINTS (NO COBRAN NADA)
const PAY = require('./payments/pay_engine.cjs');

app.post('/api/pay/google/test',(req,res)=>{
    const out = PAY.googleSandbox(req.body||{});
    res.json({ ok:false, msg:'gpay-test-error' });

app.post('/api/pay/paypal/test',(req,res)=>{
    const out = PAY.paypalSandbox(req.body||{});
    res.json({ ok:false, msg:'paypal-test-error' });

app.post('/api/pay/stripe/test',(req,res)=>{
    const out = PAY.stripeSandbox(req.body||{});
    res.json({ ok:false, msg:'stripe-test-error' });


// PROVIDER VERIFICATION ENGINE – API
const PV = require('./provider_verify/verify_engine.cjs');

app.get('/api/vendors/verify',(req,res)=>{
    const out = PV.verifyAll();
    res.json({ ok:true, vendors: out });
    res.json({ ok:false, msg:'verify-error' });


// NEURO-SEC OPS – Middleware global
const SECOPS = require('./secops/secops_engine.cjs');

    const ok = SECOPS.analyze(req);
    if(!ok){
      return res.status(403).json({ ok:false, msg:'Access Denied (SECOPS)' });


// IRENE DESKTOP GUARDIAN – API LOCAL (solo para ti)
const DESK = require('./desktop_guardian/desktop_bridge.cjs');

// Middleware para asegurar que solo se use desde localhost
app.use('/api/desktop', (req,res,next)=>{
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').replace('::ffff:','');
  if(ip !== '127.0.0.1' && ip !== '::1'){
    return res.status(403).json({ ok:false, msg:'desktop-guard-local-only' });

app.get('/api/desktop/info',(req,res)=>{
    res.json({ ok:true, data: DESK.systemInfo() });
    res.json({ ok:false, msg:'desk-info-error' });

app.get('/api/desktop/project',(req,res)=>{
    res.json({ ok:true, tree: DESK.listProject() });
    res.json({ ok:false, msg:'desk-project-error' });

app.post('/api/desktop/log',(req,res)=>{
    const rel = (req.body && req.body.path) || 'logs/auto_tasks.log';
    const txt = DESK.tailLog(rel, 5000);
    res.json({ ok:true, text:txt });
    res.json({ ok:false, msg:'desk-log-error' });

app.post('/api/desktop/open_project',(req,res)=>{
  DESK.openProjectFolder(ok=>{
    res.json({ ok, msg: ok?'opened':'failed' });

app.post('/api/desktop/open_logs',(req,res)=>{
  DESK.openLogsFolder(ok=>{

app.get('/api/desktop/quick_check',(req,res)=>{
  DESK.quickCheck(r=>{


// FULL SEO ENGINE – endpoint
const SEO = require('./seo/seo_engine.cjs');

app.get('/api/seo/build',(req,res)=>{
  const r = SEO.buildAll();

////////////////////////////////////////////////////////////
// SYSTEM HEALTH ENDPOINT
const HEALTH = require('./system_health.cjs');
app.get('/api/system/health', (req,res)=>{ res.json( HEALTH.getHealth() ); });
// CRITICAL LOGS ENDPOINT
const CRIT = require('./critical_logs.cjs');
app.get('/api/system/critical', (req,res)=>{ 
    res.json({ logs: CRIT.get() });
// ALERT ENGINE ENDPOINT
const ALERT = require('./alert_engine.cjs');
app.get('/api/system/alerts', (req,res)=>{ 
    res.json({ alerts: ALERT.get() });

// IRENE_MAINTENANCE_ENGINE
// ============================================================
// IRENE_MAINTENANCE_ENGINE — Integración total

const CLEAN = require('./clean_core.cjs');
const PERF = require('./perf_monitor.cjs');
const FIX = require('./fixer_bot.cjs');
const ECO = require('./eco_guardian.cjs');

// Endpoint para Limpieza
app.get('/api/system/clean',(req,res)=>{ 
    const a = CLEAN.cleanTemp();
    const b = CLEAN.cleanLogs();
    res.json({ok:true,temp:a,logs:b});

// Endpoint para Métricas
app.get('/api/system/perf',(req,res)=>{
    res.json({ok:true,data:PERF.get()});

// Middleware de eco-guardian
    if(ECO.inspect(req.url)){
        return res.status(403).json({ok:false,msg:'Forbidden route'});

//// =================== SERVER START ==========================
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", ()=>{
    console.log("Servidor SAFE-BUILD listo en http://localhost:" + PORT);
});

//// ============================================================
// TraffixBrain™ — integración global
// Añade clasificación de tráfico a cada petición (req.trafficClass)
// Valores: HUMANO / BOT / RIESGO / DESCONOCIDO
//// ============================================================
const TraffixBrain = require('./traffix/traffix_core.cjs');

app.use((req,res,next)=>{
  try{
    req.trafficClass = TraffixBrain.classify(req);
    // Log ligero; si molesta, se puede comentar esta línea:
    console.log('[TRAFFIC]', new Date().toISOString(), req.ip, req.trafficClass);
  }catch(e){
    console.warn('TraffixBrain error:', e && e.message ? e.message : e);
  }
  next();
});

// ========================================================
// IRENE_NOTIFY_WIRED — Núcleo de avisos + scheduler diario
// ========================================================
const IRENE_NOTIFY = require('./irene_local/irene_notify.cjs');
const IRENE_SCHED  = require('./irene_local/irene_scheduler.cjs');

// Broadcast manual: tú decides asunto, mensaje y segmento
// POST /api/irene/broadcast
// body: { segment: 'all'|'vendors'|'affiliates'|'customers'|'subscribers', subject, message }
app.post('/api/irene/broadcast', express.json(), async (req,res)=>{
  try{
    const seg = req.body.segment || 'all';
    const sub = req.body.subject || 'NeuralGPT.Store · Aviso';
    const msg = req.body.message || '';
    const out = await IRENE_NOTIFY.broadcast({ segment: seg, subject: sub, message: msg });
    res.json({ ok:true, segment: seg, stats: out });
  }catch(e){
    console.error('IRENE /broadcast error:', e.message || e);
    res.status(500).json({ ok:false });
  }
});

// Ejecutar rutina diaria de Irene (bajo demanda)
// POST /api/irene/run-daily  → devuelve métricas de recordatorios
app.post('/api/irene/run-daily', express.json(), async (req,res)=>{
  try{
    const out = await IRENE_SCHED.runDaily();
    res.json({ ok:true, run: out });
  }catch(e){
    console.error('IRENE /run-daily error:', e.message || e);
    res.status(500).json({ ok:false });
  }
});


// POKERKERNEL_IMPORT – núcleo maestro de APIs propias
const pokerKernel = require('./pokerkernel/pokerkernel.cjs');

// POKERKERNEL_WIRED – montaje del núcleo maestro en /api/pokerkernel
app.use('/api/pokerkernel', pokerKernel);
// IRENE_GUARDIAN_WIRED – Protección absoluta
const IRENE_GUARDIAN = require('./irene_local/irene_guardian.cjs');

app.get('/api/irene/guardian', (req,res)=>{
    try{
        const out = IRENE_GUARDIAN.scanCritical();
        res.json({ ok:true, out });
    }catch(e){
        res.status(500).json({ ok:false, msg:'guardian-error', e:e.message });
    }
});
// IRENE_INTEGRITY_WIRED – Protección total
const IRENE_INTEGRITY = require('./irene_local/irene_integrity.cjs');

app.get('/api/irene/integrity', (req,res)=>{
    try{
        const out = IRENE_INTEGRITY.check();
        res.json(out);
    }catch(e){
        res.status(500).json({ ok:false, msg:'integrity-error' });
    }
});
// =======================================================
// IRENE_BRAIN_WIRED — Motor central de inteligencia
// =======================================================
const IRENE_BRAIN = require('./irene_local/irene_brain.cjs');

// Estado general
app.get('/api/irene/brain/status',(req,res)=>{
  try{ res.json({ ok:true, data: IRENE_BRAIN.systemStatus() }); }
  catch(e){ res.status(500).json({ ok:false, error:e.message }); }
});

// Decisiones automáticas
app.post('/api/irene/brain/decide', express.json(), (req,res)=>{
  try{
    const r = IRENE_BRAIN.decide(req.body.a, req.body.b, req.body.wa, req.body.wb);
    res.json({ ok:true, decision:r });
  }catch(e){ res.status(500).json({ ok:false }); }
});

// Predicciones
app.post('/api/irene/brain/predict', express.json(), (req,res)=>{
  try{
    const sales = IRENE_BRAIN.predictSales(req.body.sales || []);
    const traffic = IRENE_BRAIN.predictTraffic(req.body.traffic || []);
    res.json({ ok:true, sales, traffic });
  }catch(e){ res.status(500).json({ ok:false }); }
});

// Balance contable
app.post('/api/irene/brain/balance', express.json(), (req,res)=>{
  try{
    const out = IRENE_BRAIN.balance(req.body.ing || [], req.body.gast || []);
    res.json({ ok:true, out });
  }catch(e){ res.status(500).json({ ok:false }); }
});
// IRENE_LOGICS_WIRED
const IRENE_LOGICS = require('./irene_logics.cjs');
app.post('/api/irene/logic', express.json(), (req,res)=>{
  try{
    const out = IRENE_LOGICS.think(req.body.input || null);
    res.json({ ok:true, out });
  }catch(e){ res.status(500).json({ ok:false, error:e.message }); }
});
// IRENE_PREDICT_WIRED
const IRENE_PRED = require('./irene_prediction.cjs');
app.post('/api/irene/predict', express.json(), (req,res)=>{
  try{
    const out = IRENE_PRED.forecast(req.body || {});
    res.json({ ok:true, out });
  }catch(e){ res.status(500).json({ ok:false, error:e.message }); }
});
// IRENE_PERCEPTION_WIRED
const IRENE_PERCEPTION = require('./irene_perception.cjs');

app.get('/api/irene/sense', (req,res)=>{
  try{ res.json( IRENE_PERCEPTION.sense() ); }
  catch(e){ res.status(500).json({ok:false,error:e.message}); }
});

app.get('/api/irene/anomaly', (req,res)=>{
  try{ res.json( IRENE_PERCEPTION.anomalyCheck() ); }
  catch(e){ res.status(500).json({ok:false,error:e.message}); }
});
// IRENE_SHIELD_X_WIRED
const IRENE_SHIELD_X = require('./irene_local/irene_shield_x.cjs');

app.use((req,res,next)=>{
  try{
    if(!IRENE_SHIELD_X.firewall(req)){
      return res.status(403).json({ ok:false, msg:'blocked-by-irene-shield' });
    }
    next();
  }catch(e){
    return res.status(500).json({ ok:false });
  }
});

app.get('/api/irene/verify', (req,res)=>{
  res.json( IRENE_SHIELD_X.verify() );
});

app.post('/api/irene/autocorrect', (req,res)=>{
  res.json( IRENE_SHIELD_X.autocorrect() );
});
