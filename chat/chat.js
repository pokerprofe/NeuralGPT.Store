const path = require('path');
const fs = require('fs');

module.exports = function(server, app) {
  console.log('[chat] Chat module starting...');

  const io = require('socket.io')(server, {
    cors: { origin: '*' }
  });

  const LOG_PATH = path.join(__dirname, '..', '..', 'database', 'chatlog.json');

  function readLog() {
    if (!fs.existsSync(LOG_PATH)) return [];
    try {
      const raw = fs.readFileSync(LOG_PATH, 'utf8') || '[]';
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  function writeLog(log) {
    try {
      fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2), 'utf8');
    } catch {}
  }

  io.on('connection', (socket) => {
    // Load history
    const history = readLog();
    socket.emit('chat_history', history);

    // New message
    socket.on('chat_message', (msg) => {
      if (!msg || !msg.text || !msg.nick) return;

      const log = readLog();
      const entry = {
        id: Date.now(),
        nick: msg.nick.substring(0, 40),
        text: msg.text.substring(0, 500),
        ts: new Date().toISOString()
      };

      log.push(entry);
      writeLog(log);

      io.emit('chat_message', entry);
    });
  });

  console.log('[chat] Chat ready at socket /');
};
