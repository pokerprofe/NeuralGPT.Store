const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'logs');

function scan(){
  if (!fs.existsSync(dir)) return { threats:0, last:[], ok:true };

  const files = fs.readdirSync(dir).filter(f=>f.endsWith('.log'));
  let entries = [];

  for(const f of files){
    const lines = fs.readFileSync(path.join(dir,f),'utf8').split('\\n');
    entries = entries.concat(lines.filter(x=>x.includes('ATTEMPT')));
  }

  return {
    ok:true,
    threats: entries.length,
    last: entries.slice(-20)
  };
}

module.exports = { scan };
