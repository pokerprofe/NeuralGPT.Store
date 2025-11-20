document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Interfaz NeuralGPT.Store lista");
  
  // Activar botones
  const buttons = document.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.style.cursor = "pointer";
    btn.addEventListener("click", () => {
      alert(🔹 Acción en desarrollo: \);
    });
  });

  // Activar links visuales
  const links = document.querySelectorAll("a");
  links.forEach(link => {
    link.style.color = "#FFD700";
    link.addEventListener("mouseover", () => link.style.opacity = "0.8");
    link.addEventListener("mouseout", () => link.style.opacity = "1");
  });

  // Mostrar logotipo dinámico en consola
  console.log(
███████╗██╗███╗   ██╗██╗   ██╗██████╗ 
██╔════╝██║████╗  ██║██║   ██║██╔══██╗
█████╗  ██║██╔██╗ ██║██║   ██║██║  ██║
██╔══╝  ██║██║╚██╗██║██║   ██║██║  ██║
██║     ██║██║ ╚████║╚██████╔╝██████╔╝
╚═╝     ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═════╝ 
  NeuralGPT.Store – Marketplace IA
);
});
