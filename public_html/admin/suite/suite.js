const modules = [
  { name:'NeuroWriter', desc:'Intelligent writing suite', url:'#' },
  { name:'DataOracle', desc:'Predictive analysis engine', url:'#' },
  { name:'AtlasMind', desc:'Knowledge & research AI', url:'#' },
  { name:'Marketing AI', desc:'Advertising & growth tools', url:'#' },
  { name:'RealEstate GPT', desc:'Property analysis engine', url:'#' },
  { name:'MotherCore', desc:'Internal admin AI system', url:'#' }
];

window.onload = ()=>{
  const c = document.getElementById('suite-container');
  modules.forEach(m=>{
    const div = document.createElement('div');
    div.className='card';
    div.innerHTML = 
      <h3>\</h3>
      <p>\</p>
      <button onclick='openModule("\")'>Open</button>
    ;
    c.appendChild(div);
  });
};

function openModule(url){ alert('Coming soon: ' + url); }
