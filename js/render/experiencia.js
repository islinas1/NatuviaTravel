import { esc, lista } from '../utils.js';

export function renderExperiencia(el, p) {
  const e = p.experiencia;
  el.innerHTML = `
    <div class="contenedor">
      <div class="cabecera-seccion">
        <h2>${esc(e.titulo)}</h2>
        <p>${esc(e.introduccion)}</p>
      </div>
      <div class="experiencia-grid">
        <p class="destacado">
          <span class="destacado-cifra">${esc(e.destacado.cifra)}</span>
          <span class="destacado-texto">${esc(e.destacado.texto)}</span>
        </p>
        <ul class="puntos">
          ${lista(e.puntos, (x, i) => `
            <li>
              <span class="punto-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
              <div><h3>${esc(x.titulo)}</h3><p>${esc(x.descripcion)}</p></div>
            </li>`)}
        </ul>
      </div>
    </div>`;
}