(function () {
  let socket = null;

  function qs(id) { return document.getElementById(id); }

  function getNick() {
    return window.localStorage.getItem('neural_user_nick') || 'Guest';
  }

  function renderMessage(msg) {
    const box = qs('chatBox');
    if (!box) return;
    const div = document.createElement('div');
    div.className = 'chat-msg';
    div.innerHTML = '<b>' + msg.nick + '</b>: ' + msg.text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  function connect() {
    socket = io();

    socket.on('chat_history', (history) => {
      history.forEach(renderMessage);
    });

    socket.on('chat_message', (msg) => {
      renderMessage(msg);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    connect();

    const input = qs('chatInput');
    const btn = qs('sendBtn');

    btn.addEventListener('click', () => {
      const text = input.value.trim();
      if (!text) return;
      socket.emit('chat_message', {
        nick: getNick(),
        text
      });
      input.value = '';
    });

    input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') btn.click();
    });
  });
})();
