import { esc, lista } from '../utils.js';

export function renderActividades(el, p, t) {
  el.innerHTML = `
    <div class="contenedor">
      <div class="cabecera-seccion">
        <h2>${esc(t.actividades.titulo)}</h2>
        <p>${esc(t.actividades.intro)}</p>
      </div>
      <ul class="lista-actividades">
        ${lista(p.actividades, (a) => `
          <li class="actividad">
            <figure class="actividad-figura">
              <img src="${esc(a.imagen)}" alt="${esc(a.alt)}" loading="lazy" width="800" height="600">
            </figure>
            <div class="actividad-texto">
              <p class="actividad-momento">${esc(a.momento)}</p>
              <h3>${esc(a.titulo)}</h3>
              <p>${esc(a.descripcion)}</p>
            </div>
          </li>`)}
      </ul>
    </div>`;
}