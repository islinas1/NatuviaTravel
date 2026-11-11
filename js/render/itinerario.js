import { esc, lista } from '../utils.js';

function renderBloque(b, t) {
  return `
    <li class="bloque${b.principal ? ' principal' : ''}">
      <p class="bloque-hora"><time>${esc(b.inicio)}</time>–<time>${esc(b.fin)}</time></p>
      <div class="bloque-cuerpo">
        <h4>${esc(b.titulo)}</h4>
        ${b.descripcion ? `<p>${esc(b.descripcion)}</p>` : ''}
        ${b.principal ? `<span class="marca-principal">${esc(t.itinerario.principal)}</span>` : ''}
      </div>
    </li>`;
}

function renderRuta(r) {
  return `
    <div class="ruta">
      <figure class="ruta-mapa">
        <img src="${esc(r.imagen)}" alt="${esc(r.alt)}" loading="lazy">
        <figcaption>${esc(r.leyenda)}</figcaption>
      </figure>
      <div class="ruta-paradas">
        <h3>${esc(r.titulo)}</h3>
        <ol>
          ${lista(r.paradas, (s) => `<li><span class="parada-lugar">${esc(s.lugar)}</span><span class="parada-detalle">${esc(s.detalle)}</span></li>`)}
        </ol>
      </div>
    </div>`;
}

function activarTabs(raiz) {
  const tabs = [...raiz.querySelectorAll('[role="tab"]')];

  const seleccionar = (tabActiva) => {
    tabs.forEach((tab) => {
      const activa = tab === tabActiva;
      tab.setAttribute('aria-selected', String(activa));
      tab.tabIndex = activa ? 0 : -1;
      raiz.querySelector(`#${tab.getAttribute('aria-controls')}`).hidden = !activa;
    });
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => seleccionar(tab));
    tab.addEventListener('keydown', (e) => {
      const paso = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!paso) return;
      e.preventDefault();
      const siguiente = tabs[(i + paso + tabs.length) % tabs.length];
      seleccionar(siguiente);
      siguiente.focus();
    });
  });
}

export function renderItinerario(el, p, t) {
  const { dias, introduccion } = p.itinerario;
  const ti = t.itinerario;

  el.innerHTML = `
    <div class="contenedor">
      <div class="cabecera-seccion">
        <h2>${esc(ti.titulo)}</h2>
        <p>${esc(introduccion)}</p>
      </div>
      <div class="tabs" role="tablist" aria-label="${esc(ti.tabsAria)}">
        ${lista(dias, (d, i) => `
          <button class="tab" type="button" role="tab" id="tab-dia-${d.dia}"
            aria-controls="panel-dia-${d.dia}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">
            ${esc(ti.dia)} ${d.dia}
          </button>`)}
      </div>
      ${lista(dias, (d, i) => `
        <div class="panel" role="tabpanel" id="panel-dia-${d.dia}" aria-labelledby="tab-dia-${d.dia}" tabindex="0" ${i === 0 ? '' : 'hidden'}>
          <h3 class="panel-titulo">${esc(d.titulo)}</h3>
          <ol class="linea-tiempo">${lista(d.bloques, (b) => renderBloque(b, t))}</ol>
        </div>`)}
      ${p.ruta ? renderRuta(p.ruta) : ''}
    </div>`;

  activarTabs(el);
}