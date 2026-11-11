import { esc, lista } from '../utils.js';

export function renderAlojamiento(el, p) {
  const a = p.alojamiento;
  el.innerHTML = `
    <div class="contenedor alojamiento-grid">
      <div>
        <h2>${esc(a.titulo)}</h2>
        <p class="alojamiento-texto">${esc(a.descripcion)}</p>
      </div>
      <ul class="lista-marcas">
        ${lista(a.puntos, (x) => `<li>${esc(x)}</li>`)}
      </ul>
    </div>`;
}