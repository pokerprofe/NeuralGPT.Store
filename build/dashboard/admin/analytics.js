(async function(){

  const res = await fetch('/api/admin/analytics');
  const data = await res.json();

  if(!data.ok) return;

  document.getElementById('a_visits').innerText = data.stats.visits;
  document.getElementById('a_users').innerText = data.stats.users;
  document.getElementById('a_subs').innerText = data.stats.subscribers;
  document.getElementById('a_vendors').innerText = data.stats.vendors;
  document.getElementById('a_models').innerText = data.stats.models;

  // traffic graph
  const ctx = document.getElementById('chartTraffic').getContext('2d');
  const points = data.stats.dailyTraffic.map(d => d.count);
  const labels = data.stats.dailyTraffic.map(d => d.day);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label:'Visits',
        data: points,
        borderColor:'#f4c857',
        backgroundColor:'rgba(244,200,87,0.15)',
        borderWidth:2,
        fill:true,
        tension:0.25
      }]
    },
    options:{
      plugins:{legend:{display:false}},
      scales:{
        x:{ticks:{color:'#f4f4f4'}},
        y:{ticks:{color:'#f4f4f4'}}
      }
    }
  });

})();
