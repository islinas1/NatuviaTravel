import { esc, lista } from '../utils.js';

export function renderInfo(el, p, t) {
  el.innerHTML = `
    <div class="contenedor">
      <div class="cabecera-seccion">
        <h2>${esc(t.info.titulo)}</h2>
        <p>${esc(t.info.intro)}</p>
      </div>
      <div class="acordeon">
        ${lista(p.infoPractica, (grupo, i) => `
          <details ${i === 0 ? 'open' : ''}>
            <summary>${esc(grupo.titulo)}</summary>
            <div class="acordeon-cuerpo">
              <ul class="lista-columnas">${lista(grupo.items, (item) => `<li>${esc(item)}</li>`)}</ul>
            </div>
          </details>`)}
      </div>
    </div>`;
}