const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'database');
const ADS_FILE = 'ads.json';

function readAds() {
  const p = path.join(DATA_DIR, ADS_FILE);
  if (!fs.existsSync(p)) return [];
  try {
    const raw = fs.readFileSync(p, 'utf8') || '[]';
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function getActiveAds() {
  const ads = readAds();
  return ads
    .filter(a => a.isActive !== false)
    .sort((a, b) => {
      const pa = typeof a.priority === 'number' ? a.priority : 1;
      const pb = typeof b.priority === 'number' ? b.priority : 1;
      return pb - pa;
    })
    .slice(0, 10);
}

module.exports = function(app) {
  console.log('[ads_public] Public ads module loaded.');

  // All active ads (max 10)
  app.get('/api/ads/public', (req, res) => {
    const ads = getActiveAds().map(a => ({
      id: a.id,
      title: a.title,
      advertiser: a.advertiser,
      imageUrl: a.imageUrl,
      targetUrl: a.targetUrl,
      position: a.position || 'sidebar'
    }));
    res.json({ ok: true, ads });
  });

  // Ads filtered by position (sidebar, header, footer, inline)
  app.get('/api/ads/public/:position', (req, res) => {
    const position = req.params.position || 'sidebar';
    const ads = getActiveAds()
      .filter(a => (a.position || 'sidebar') === position)
      .map(a => ({
        id: a.id,
        title: a.title,
        advertiser: a.advertiser,
        imageUrl: a.imageUrl,
        targetUrl: a.targetUrl,
        position: a.position || 'sidebar'
      }));
    res.json({ ok: true, ads });
  });

  console.log('[ads_public] Routes ready at /api/ads/public*');
};
