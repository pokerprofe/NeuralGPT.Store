const fs = require('fs');
const path = require('path');

function saveLead(body, type = 'vendor') {
  const file = path.join(__dirname, 'data', type + '_leads.json');
  const leads = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
  leads.push({
    ...body,
    date: new Date().toISOString()
  });
  fs.writeFileSync(file, JSON.stringify(leads, null, 2));
  return true;
}

module.exports = { saveLead };
