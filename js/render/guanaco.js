import { esc, limitar, reducirMovimiento } from '../utils.js';

// Retícula del telescopio: el trazo no se deforma al escalar (non-scaling-stroke)
const RETICULA = `
  <svg class="campo-reticula" viewBox="0 0 100 100" fill="none" stroke="currentColor" aria-hidden="true">
    <circle cx="50" cy="50" r="49.6" stroke-width="1.25" vector-effect="non-scaling-stroke"/>
    <g stroke-width="1" vector-effect="non-scaling-stroke">
      <path d="M50 1.5v9M50 89.5v9M1.5 50h9M89.5 50h9" vector-effect="non-scaling-stroke"/>
      <path d="M47 50h6M50 47v6" vector-effect="non-scaling-stroke"/>
    </g>
  </svg>`;

const suavizar = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

let controlador; // permite limpiar los listeners si la sección se vuelve a renderizar

export function renderCapituloGuanaco(el, p, t) {
  const g = p.guanaco;
  el.innerHTML = `
    <div class="campo-escenario">
      <div class="campo-lente">
        <img class="campo-imagen" src="${esc(g.imagen)}" alt="${esc(g.alt)}" loading="lazy">
      </div>
      ${RETICULA}
      ${g.lente ? `<p class="campo-etiqueta" aria-hidden="true">${esc(g.lente)}</p>` : ''}
      ${g.pista ? `<p class="campo-pista" aria-hidden="true">${esc(g.pista)}</p>` : ''}
      <div class="contenedor campo-texto">
        <h2>${esc(g.titulo)}</h2>
        <p>${esc(g.texto)}</p>
        ${g.credito ? `<p class="credito">${esc(t.foto)}: ${esc(g.credito)}</p>` : ''}
      </div>
    </div>`;

  // Punto de la foto donde está el animal: el lente se centra ahí
  el.style.setProperty('--enfoque', g.enfoque || '50% 50%');

  controlador?.abort();
  controlador = new AbortController();

  // Sin animación: la foto se muestra completa y el texto visible
  if (reducirMovimiento()) {
    el.classList.add('estatico');
    el.style.setProperty('--radio', '200vmax');
    el.style.setProperty('--p', '1');
    el.style.setProperty('--retic-op', '0');
    el.style.setProperty('--texto-op', '1');
    return;
  }
  el.classList.remove('estatico');

  let pendiente = false;

  const actualizar = () => {
    pendiente = false;
    const caja = el.getBoundingClientRect();
    const recorrido = el.offsetHeight - window.innerHeight;
    const progreso = recorrido > 0 ? limitar(-caja.top / recorrido, 0, 1) : 1;

    // El lente se abre durante el 75 % del recorrido; luego aparece el texto
    const apertura = suavizar(limitar(progreso / 0.75, 0, 1));
    const ancho = window.innerWidth;
    const alto = window.innerHeight;
    const radioMin = Math.min(ancho, alto) * (ancho < 700 ? 0.34 : 0.24);
    const radioMax = Math.hypot(ancho, alto) / 2 + 4;
    const radio = radioMin + (radioMax - radioMin) * apertura;

    el.style.setProperty('--radio', `${radio.toFixed(1)}px`);
    el.style.setProperty('--p', apertura.toFixed(3));
    el.style.setProperty('--retic-op', (1 - limitar((apertura - 0.7) / 0.25, 0, 1)).toFixed(3));
    el.style.setProperty('--texto-op', limitar((progreso - 0.74) / 0.18, 0, 1).toFixed(3));
  };

  const pedir = () => {
    if (!pendiente) { pendiente = true; requestAnimationFrame(actualizar); }
  };

  window.addEventListener('scroll', pedir, { passive: true, signal: controlador.signal });
  window.addEventListener('resize', pedir, { signal: controlador.signal });
  actualizar();
}