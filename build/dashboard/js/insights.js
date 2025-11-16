document.addEventListener("DOMContentLoaded", () => {
    loadInsights();
});

async function loadInsights() {
    try {
        const res = await fetch("/api/admin/analytics");
        const data = await res.json();
        if(!data.ok) return;

        const st = data.stats;

        document.getElementById("ins_visits").innerText = st.visits;
        document.getElementById("ins_users").innerText = st.users;
        document.getElementById("ins_models").innerText = st.models;
        document.getElementById("ins_subs").innerText = st.subscribers;
        document.getElementById("ins_vendors").innerText = st.vendors;

        buildMiniChart(st.dailyTraffic);
    } catch (e) {
        console.error("Insights error:", e);
    }
}

function buildMiniChart(arr){
    const c = document.getElementById("ins_chart");
    const ctx = c.getContext("2d");
    const w = c.width, h = c.height;
    ctx.clearRect(0,0,w,h);

    const max = Math.max(...arr,10);
    const step = w / arr.length;

    ctx.strokeStyle = "#f4c857";
    ctx.lineWidth = 2;
    ctx.beginPath();
    arr.forEach((v,i)=>{
        const x = i * step;
        const y = h - (v/max)*h;
        if(i===0) ctx.moveTo(x,y);
        else ctx.lineTo(x,y);
    });
    ctx.stroke();
}
