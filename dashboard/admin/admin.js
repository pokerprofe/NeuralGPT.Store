async function api(path) {
  const res = await fetch(path);
  const data = await res.json();
  return data;
}

async function loadStats() {
  try {
    const visits = await api('/api/stats/overview');
    const users = await api('/api/stats/users');
    const models = await api('/api/stats/models');
    const chat = await api('/api/stats/chat');

    document.querySelector('#statsVisits .value').textContent =
      visits?.stats?.visits ?? 0;

    document.querySelector('#statsUsers .value').textContent =
      users?.count ?? 0;

    document.querySelector('#statsModels .value').textContent =
      models?.total ?? 0;

    document.querySelector('#statsChat .value').textContent =
      chat?.messages ?? 0;

  } catch (e) {
    console.error('Dashboard error', e);
  }
}

document.addEventListener('DOMContentLoaded', loadStats);
