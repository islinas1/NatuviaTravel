import { esc } from '../utils.js';

let observador; // se reemplaza si la barra se vuelve a renderizar (cambio de idioma)

export function renderBarra(el, p, t, { ocultarCon = [] } = {}) {
  el.setAttribute('aria-label', t.barra.aria);
  el.innerHTML = `
    <div class="barra-interior">
      <div class="barra-info">
        <span class="barra-nombre">${esc(p.nombre)}</span>
        <span class="barra-meta">${esc(p.duracion.etiqueta)}</span>
      </div>
      <span class="barra-precio"><span class="barra-desde">${esc(t.barra.desde)}</span>${esc(p.precio.texto)}</span>
      <a class="btn btn-claro btn-chico" href="#reservar">${esc(t.reservar)}</a>
    </div>`;

  // Visible solo cuando no se ve el hero, la reserva ni el pie
  const enPantalla = new Set();
  const actualizar = () => {
    const visible = enPantalla.size === 0;
    el.classList.toggle('visible', visible);
    el.inert = !visible;
  };

  observador?.disconnect();
  if (!('IntersectionObserver' in window)) { el.hidden = true; return; }

  observador = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => (e.isIntersecting ? enPantalla.add(e.target) : enPantalla.delete(e.target)));
    actualizar();
  });
  ocultarCon.filter(Boolean).forEach((seccion) => observador.observe(seccion));
  actualizar();
}