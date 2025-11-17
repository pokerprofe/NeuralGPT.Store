const fs = require('fs');
const path = require('path');
const stateFile = path.join(__dirname, 'neural_state.json');

function readState(){
  return JSON.parse(fs.readFileSync(stateFile,'utf8'));
}

function writeState(data){
  fs.writeFileSync(stateFile, JSON.stringify(data, null, 2));
}

function pulse(){
  const st = readState();
  st.last_update = Date.now();
  st.events_processed++;
  st.mood = pickMood();
  writeState(st);
  return st;
}

function pickMood(){
  const moods = ['neutral','focused','charged','alert','stable'];
  return moods[Math.floor(Math.random()*moods.length)];
}

function loadAgents(list){
  const st = readState();
  st.agents_loaded = list.length || 0;
  writeState(st);
}

function systemHealth(){
  const st = readState();
  return {
    ok: true,
    core: st,
    load: {
      cpu: Math.random().toFixed(2),
      ram: Math.random().toFixed(2),
      io: Math.random().toFixed(2)
    }
  };
}

module.exports = { pulse, loadAgents, systemHealth };
