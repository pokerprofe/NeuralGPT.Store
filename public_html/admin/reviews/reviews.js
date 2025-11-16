async function loadReviews(){
  try{
    const data = await fetch('/server/reviews/reviews.json');
    const list = await data.json();
    const tb = document.querySelector('tbody');
    tb.innerHTML = '';

    list.forEach(r=>{
      const tr = document.createElement('tr');
      tr.innerHTML = \
        <td>\</td>
        <td>\</td>
        <td>\ ★</td>
        <td>\</td>
        <td>\</td>
      \;
      tb.appendChild(tr);
    });
  }catch(e){
    console.log('Review panel error');
  }
}

document.addEventListener('DOMContentLoaded', loadReviews);
