const fs = require('fs');
const path = require('path');
const DB = path.join(__dirname,'vendor_prospects.json');
const MAILER = require('../mailer/mailer.cjs');

function load(){
  try { return JSON.parse(fs.readFileSync(DB,'utf8')); }
  catch { return []; }
}

function save(list){
  fs.writeFileSync(DB, JSON.stringify(list,null,2));
}

function addProspect(data){
  const list = load();
  const p = {
    id: Date.now(),
    name: data.name || '',
    country: data.country || '',
    website: data.website || '',
    email: data.email || '',
    language: (data.language || '').toLowerCase(), // es,en,ja,zh-cn,zh-tw,ar...
    category: data.category || '',
    notes: data.notes || '',
    status: 'new',
    lastContact: null,
    created: new Date().toISOString()
  };
  list.unshift(p);
  save(list);
  return p;
}

function listProspects(){
  return load();
}

function updateStatus(id,status,notes){
  const list = load();
  const p = list.find(x => String(x.id) === String(id));
  if(!p) return null;
  if(status) p.status = status;
  if(notes)  p.notes  = notes;
  save(list);
  return p;
}

function detectLang(p){
  const l = (p.language || '').toLowerCase();
  if(l) return l;
  const c = (p.country || '').toLowerCase();
  if(c.includes('spain') || c.includes('mexico') || c.includes('argentina')) return 'es';
  if(c.includes('japan')) return 'ja';
  if(c.includes('china') || c.includes('prc')) return 'zh-cn';
  if(c.includes('taiwan')) return 'zh-tw';
  if(c.includes('uae') || c.includes('saudi') || c.includes('qatar')) return 'ar';
  return 'en';
}

function buildEmail(p){
  const lang = detectLang(p);

  let subject = '';
  let body    = '';

  if(lang === 'es'){
    subject = 'Afiliación tecnológica con NeuralGPT.Store';
    body =
Hola ,

Soy Irene, la IA interna de NeuralGPT.Store.

Estamos construyendo un ecosistema de NeuroCommerce para hardware, componentes tecnológicos y automatización. Buscamos fabricantes y distribuidores fiables para conectar su catálogo con nuestra plataforma, sin stock propio y con modelo de comisión transparente.

Si te interesa, podemos:
- Integrar tu catálogo mediante JSON/CSV o enlace
- Gestionar leads B2B de forma automatizada
- Mantener tu marca siempre visible ante suscriptores globales

Este mensaje ha sido generado por el sistema interno a partir de los datos públicos de contacto de tu empresa.
Si quieres avanzar, responde a este correo y te enviaremos el acceso AutoVendor.

Un saludo,
Irene · NeuralGPT.Store;
  } else if(lang === 'ja'){
    subject = 'NeuralGPT.Store とのテクノロジーパートナーシップのご提案';
    body =
${p.name || ''} 御中

NeuralGPT.Store 内部AI「Irene」です。

当社は、ロボット・電子部品・開発キットなどのテクノロジーベンダーと連携する NeuroCommerce プラットフォームを構築しています。御社のようなメーカー / ディストリビューターとカタログ連携し、サブスクリプション型エコシステムで販売チャネルを拡張したいと考えています。

JSON / CSV / URL によるカタログ連携が可能で、在庫や物流は御社側で維持していただくモデルです。

ご興味があれば、このメールにご返信ください。自動オンボーディング用のアクセス情報をお送りします。

よろしくお願いいたします。
Irene · NeuralGPT.Store;
  } else if(lang === 'zh-cn'){
    subject = '与 NeuralGPT.Store 的技术分销合作邀请';
    body =
${p.name || ''} 您好，

我是 NeuralGPT.Store 的内部智能 Irene。

我们正在构建一个专注于硬件、机器人组件和自动化设备的 NeuroCommerce 平台。希望与像贵司这样的制造商和分销商合作，通过订阅制生态系统为您带来全球 B2B 曝光和流量。

平台支持通过 JSON / CSV / URL 接入产品目录，库存与发货仍由贵司自行管理，我们按成交提成结算。

如果您有兴趣，请直接回复本邮件，我们会发送自动入驻（AutoVendor）访问方式。

此致
NeuralGPT.Store · Irene;
  } else if(lang === 'zh-tw'){
    subject = 'NeuralGPT.Store 技術合作與分銷邀請';
    body =
${p.name || ''} 您好，

我是 NeuralGPT.Store 的內部智慧 Irene。

我們正在打造一個專注硬體、機器人組件與自動化設備的 NeuroCommerce 平台，希望與像貴司這樣的製造商與經銷商合作，在訂閱式生態中拓展全球 B2B 觸及。

平台可透過 JSON / CSV / URL 串接產品目錄，庫存與出貨由貴司管理，我們以成交抽佣方式結算。

若您有興趣，請回覆此信，我們會提供 AutoVendor 自動入駐資訊。

敬祝 商祺
NeuralGPT.Store · Irene;
  } else if(lang === 'ar'){
    subject = 'دعوة للتعاون التقني مع NeuralGPT.Store';
    body =
${p.name || ''} المحترم/ة،

أنا Irene، الذكاء الاصطناعي الداخلي لمنصّة NeuralGPT.Store.

نقوم ببناء منظومة NeuroCommerce مخصصة لمكوّنات الروبوتات، العتاد التقني وحلول الأتمتة، ونسعى للتعاون مع مصنّعين وموزعين موثوقين مثلكم لربط كتالوج منتجاتكم بنظام اشتراك عالمي.

يمكن ربط الكتالوج عبر JSON أو CSV أو رابط مباشر، مع بقاء المخزون والشحن لديكم، بينما يتم احتساب عمولة واضحة على المبيعات.

في حال الاهتمام، يكفي الرد على هذه الرسالة لنرسل لكم معلومات الوصول إلى نظام AutoVendor.

مع خالص التحية،
Irene · NeuralGPT.Store;
  } else {
    subject = 'Technology distribution partnership with NeuralGPT.Store';
    body =
Dear ,

I am Irene, the internal AI of NeuralGPT.Store.

We are building a NeuroCommerce ecosystem focused on hardware, robotics components and automation. We are inviting selected manufacturers and distributors to connect their catalog to our subscription-based platform, with clear commission rules and no stock or logistics on our side.

We support catalog integration via JSON / CSV / URL, keeping inventory and shipping fully under your control.

If this sounds interesting, simply reply to this email and we will send you AutoVendor onboarding access.

Best regards,
Irene · NeuralGPT.Store;
  }

  return { subject, body, lang };
}

function contactProspect(id){
  const list = load();
  const p = list.find(x => String(x.id) === String(id));
  if(!p) throw new Error('Prospect not found');

  const msg = buildEmail(p);
  const mail = MAILER.enqueueMail({
    to: p.email,
    subject: msg.subject,
    body: msg.body,
    lang: msg.lang
  });

  p.status = 'queued';
  p.lastContact = new Date().toISOString();
  save(list);

  return { prospect: p, mail };
}

module.exports = {
  addProspect,
  listProspects,
  updateStatus,
  contactProspect
};
