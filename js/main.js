document.addEventListener("DOMContentLoaded", () => {
  // ===== AOS =====
  if (window.AOS) AOS.init();

  // ===== Patologías: "Ninguna" vs las demás =====
  const ningunaCheckbox = document.getElementById("ningunaPatologia");
  const otrasCheckboxes = document.querySelectorAll(".otraPatologia");

  if (ningunaCheckbox && otrasCheckboxes.length) {
    ningunaCheckbox.addEventListener("change", () => {
      if (ningunaCheckbox.checked) otrasCheckboxes.forEach(cb => (cb.checked = false));
    });

    otrasCheckboxes.forEach(cb => {
      cb.addEventListener("change", () => {
        if (cb.checked) ningunaCheckbox.checked = false;
      });
    });
  }

  // ===== Slider simple (Quiénes somos) =====
  const sliderImgs = document.querySelectorAll(".slider-img");
  if (sliderImgs.length) {
    let index = 0;

    const show = (i) => {
      sliderImgs.forEach(img => img.classList.remove("activa"));
      sliderImgs[i].classList.add("activa");
    };

    show(index);
    setInterval(() => {
      index = (index + 1) % sliderImgs.length;
      show(index);
    }, 3000);
  }

  // ===== Zoom imagen horarios =====
  const zoomables = document.querySelectorAll(".imagen-zoomable");
  const overlay = document.getElementById("overlay");
  const imgBig = document.getElementById("imagen-ampliada");

  if (zoomables.length && overlay && imgBig) {
    zoomables.forEach(img => {
      img.addEventListener("click", () => {
        imgBig.src = img.src;
        overlay.style.display = "flex";
        overlay.setAttribute("aria-hidden", "false");
      });
    });

    overlay.addEventListener("click", (e) => {
      if (e.target !== imgBig) {
        overlay.style.display = "none";
        overlay.setAttribute("aria-hidden", "true");
        imgBig.src = "";
      }
    });
  }

  // ===== Form inscripción: guardar + enviar WhatsApp =====
  const formIns = document.getElementById("form-inscripcion");

  // 🔧 CAMBIA ESTE NÚMERO SI ES OTRO
  const WHATSAPP_PHONE = "573024221645"; // formato internacional, sin + ni espacios

  if (formIns) {
    formIns.addEventListener("submit", (e) => {
      e.preventDefault();

      // Datos
      const datos = {
        nombre: document.getElementById("nombre-insc")?.value?.trim() || "",
        apellidos: document.getElementById("apellidos-insc")?.value?.trim() || "",
        documento: document.getElementById("documento-insc")?.value?.trim() || "",
        edad: document.getElementById("edad-insc")?.value?.trim() || "",
        genero: document.getElementById("genero-insc")?.value || "",
        telefono: document.getElementById("telefono-insc")?.value?.trim() || "",
        objetivo: document.getElementById("objetivo-insc")?.value?.trim() || ""
      };

      // Patologías
      const patologias = [];
      document.querySelectorAll('input[name="patologias"]:checked').forEach(cb => patologias.push(cb.value));

      const otra = document.getElementById("otra-patologia")?.value?.trim();
      if (otra) patologias.push("Otra: " + otra);

      // Guardar en localStorage (por si quieres usarlo después)
      localStorage.setItem("datosInscripcion", JSON.stringify(datos));
      localStorage.setItem("patologias", patologias.join(", "));

      // Mensaje WhatsApp (bonito y claro)
      const nombreCompleto = `${datos.nombre} ${datos.apellidos}`.trim();
      const patologiasTxt = patologias.length ? patologias.join(", ") : "No especificadas";

      const mensaje =
`Hola 👋 Club Amateur, quiero inscribirme.

📌 Datos:
• Nombre: ${nombreCompleto || "N/A"}
• Documento: ${datos.documento || "N/A"}
• Edad: ${datos.edad || "N/A"}
• Género: ${datos.genero || "N/A"}
• Teléfono: ${datos.telefono || "N/A"}
• Objetivo: ${datos.objetivo || "N/A"}

🩺 Condiciones médicas:
• ${patologiasTxt}

¿Me ayudan con la información para iniciar?`;

      // Abrir WhatsApp con texto prellenado
      const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(mensaje)}`;
      window.open(url, "_blank", "noopener,noreferrer");

      // Limpieza opcional
      formIns.reset();

      // Scroll al contacto (opcional)
      document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  // ===== Link activo en el menú según scroll =====
  const navLinks = [...document.querySelectorAll(".nav__link")];
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if (navLinks.length && sections.length) {
    const obs = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      const id = "#" + visible.target.id;
      navLinks.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === id));
    }, { rootMargin: "-40% 0px -55% 0px", threshold: [0.1, 0.2, 0.4, 0.6] });

    sections.forEach(s => obs.observe(s));
  }
});
document.getElementById("menuToggle")
.addEventListener("click", () => {
  document.getElementById("menu")
  .classList.toggle("show");
});
