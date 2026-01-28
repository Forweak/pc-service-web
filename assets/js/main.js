// JS mínimo para abrir WhatsApp con mensaje predefinido para "Comprar"
(function(){
  const WA_BASE = 'https://wa.me/5491123981806'; // reemplaza si cambias el número
  function makeMessage(name){
    return encodeURIComponent(`Hola! Quisiera comprar: ${name}. ¿Está disponible? Gracias.`);
  }


    // WhatsApp "Comprar"
    document.querySelectorAll('.btn-ws').forEach(btn=>{
      btn.addEventListener('click', function(ev){
        ev.preventDefault();
        const item = btn.getAttribute('data-name') || 'servicio';
        const url = WA_BASE + '?text=' + makeMessage(item);
        window.open(url, '_blank', 'noopener');
      });
    });

    // ======= ALINEAR BOTONES / PRECIOS =======
    // Tomamos todos los card-footer y les asignamos el mismo alto
    const cardFooters = document.querySelectorAll('.card-footer');
    let maxHeight = 0;
    cardFooters.forEach(footer=>{
      const h = footer.offsetHeight;
      if(h > maxHeight) maxHeight = h;
    });
    cardFooters.forEach(footer=>{
      footer.style.minHeight = maxHeight + 'px';
    });

    // También podemos alinear todas las cards al mismo alto si querés
    const cards = document.querySelectorAll('.card');
    let maxCardHeight = 0;
    cards.forEach(card=>{
      const h = card.offsetHeight;
      if(h > maxCardHeight) maxCardHeight = h;
    });
    cards.forEach(card=>{
      card.style.height = maxCardHeight + 'px';
    });

  });
})();

document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const msg = document.getElementById("formMessage");
  msg.textContent = "¡Solicitud enviada! Nos pondremos en contacto pronto.";
  msg.classList.remove("sr-only");
  this.reset();
});

/* ========================= */
/* CHECKOUT LOGIC */
/* ========================= */

document.addEventListener("DOMContentLoaded", () => {
  // Ejecutar solo en checkout.html
  if (!window.location.pathname.includes("checkout")) return;

  const params = new URLSearchParams(window.location.search);
  const producto = params.get("producto");

  // Elementos existentes en tu HTML
  const productNameEl = document.querySelector(".summary-card h3");
  const statusEl = document.querySelector(".summary-card .status");

  // Si entran sin producto → volver al inicio
  if (!producto) {
    window.location.href = "index.html";
    return;
  }

  // Convertir "Ensamble-PC" → "Ensamble Pc"
  const productoLegible = producto
    .replace(/-/g, " ")
    .replace(/\b\w/g, l => l.toUpperCase());

  // Insertar datos
  if (productNameEl) {
    productNameEl.textContent = productoLegible;
  }

  if (statusEl) {
    statusEl.textContent = "Pago pendiente de confirmación";
  }
});

const payBtn = document.querySelector(".btn-pagar");

if (payBtn) {
  payBtn.addEventListener("click", async () => {
    payBtn.disabled = true;
    payBtn.textContent = "Redirigiendo…";

    const productName = document.querySelector(".summary-card h3").textContent;

    // Mapeo simple (después se puede mejorar)
    const prices = {
      "Ensamble Pc": 30000,
      "Formateo Windows": 5000,
      "Limpieza Gpu": 25000
    };

    const price = prices[productName] || 0;

    const response = await fetch("/create-preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: productName,
        price
      })
    });

    const data = await response.json();

    if (data.init_point) {
      window.location.href = data.init_point;
    } else {
      alert("Error al iniciar el pago");
    }
  });
}