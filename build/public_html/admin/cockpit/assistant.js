async function askAI(){
  const q = document.getElementById('aiQ').value;
  const box = document.getElementById('aiA');
  try{
    const res = await fetch('/api/ai/ask',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ msg:q })
    });
    const data = await res.json();
    box.textContent = data.reply || JSON.stringify(data);
  }catch(e){
    box.textContent = 'Error comunicando con la IA interna.';
  }
}
