import { esc, lista } from '../utils.js';

export function renderSostenibilidad(el, p) {
  const s = p.sostenibilidad;
  el.innerHTML = `
    <div class="contenedor">
      <div class="cabecera-seccion">
        <h2>${esc(s.titulo)}</h2>
        <p>${esc(s.introduccion)}</p>
      </div>
      <ul class="puntos puntos-grid">
        ${lista(s.compromisos, (c) => `<li><div><h3>${esc(c.titulo)}</h3><p>${esc(c.descripcion)}</p></div></li>`)}
      </ul>
    </div>`;
}