const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'data', 'agents.json');

function loadAgents(){
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
}

module.exports = { loadAgents };
