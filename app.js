/**
 * UCB Contact Landing - Interactive Logic
 * Spec-Driven Development Implementation
 */

// Temporizador para el toast flotante
let toastTimer = null;

/**
 * Copia un correo electrónico al portapapeles con compatibilidad extendida
 * para WebViews móviles (TikTok, Instagram, Safari, Chrome).
 * @param {string} email - Correo a copiar
 * @param {HTMLElement} btn - Botón que disparó la acción
 */
async function copyEmail(email, btn) {
  let copiedSuccessfully = false;

  // Intento 1: API moderna del portapapeles
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(email);
      copiedSuccessfully = true;
    } catch (err) {
      console.warn("Fallo navigator.clipboard, usando fallback textarea:", err);
    }
  }

  // Intento 2: Fallback compatible con WebViews
  if (!copiedSuccessfully) {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = email;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      copiedSuccessfully = document.execCommand("copy");
      document.body.removeChild(textarea);
    } catch (fallbackErr) {
      console.error("Error al copiar mediante fallback:", fallbackErr);
    }
  }

  if (copiedSuccessfully) {
    // Animación visual en el botón
    const originalContent = btn.innerHTML;
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:16px;height:16px;color:#0B7A75;">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span style="color:#0B7A75;font-weight:800;">¡Listo!</span>
    `;
    btn.style.borderColor = "#0B7A75";
    btn.disabled = true;

    showToast(`Copiado: ${email}`);

    setTimeout(() => {
      btn.innerHTML = originalContent;
      btn.style.borderColor = "";
      btn.disabled = false;
    }, 2000);
  } else {
    showToast("Por favor selecciona y copia el correo manualmente.");
  }
}

/**
 * Muestra notificación toast flotante
 * @param {string} message - Mensaje a mostrar
 */
function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");

  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.classList.add("active");

  if (toastTimer) clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("active");
  }, 2600);
}

/**
 * Compartir la página usando Web Share API nativa del teléfono o copiando el URL
 */
async function shareLanding() {
  const shareData = {
    title: "Internacionalización UCB - Contactos y Redes",
    text: "Canales oficiales y contactos de Internacionalización y Cooperación Global UCB",
    url: window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.warn("Error al compartir:", err);
      }
    }
  } else {
    // Fallback copiando la URL actual
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Enlace copiado al portapapeles");
      } else {
        showToast("Comparte este enlace desde tu navegador");
      }
    } catch (e) {
      showToast("Comparte este enlace desde tu navegador");
    }
  }
}
