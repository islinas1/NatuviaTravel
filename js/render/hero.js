import { esc, lista, enfatizar, textoPlano } from '../utils.js';

const CLASES_CTA = { primario: 'btn btn-claro', secundario: 'btn btn-contorno' };

const ICONO_RETICULA = `
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">
    <circle cx="16" cy="16" r="11"/>
    <path d="M16 2v7M16 23v7M2 16h7M23 16h7"/>
  </svg>`;

export function renderHero(el, paquete) {
  const { hero } = paquete;
  const lineas = Array.isArray(hero.titulo) ? hero.titulo : [hero.titulo];

  el.innerHTML = `
    <img class="hero-imagen" src="${esc(hero.imagen)}" alt="${esc(hero.alt)}" fetchpriority="high">
    <div class="hero-contenido">
      <div>
        <p class="hero-paquete entrar" style="--d:0.15s">${esc(paquete.nombre)}, ${esc(paquete.duracion.etiqueta)}</p>
        <h1 class="hero-titulo" aria-label="${esc(lineas.map(textoPlano).join(' '))}">
          ${lista(lineas, (linea, i) => `<span class="linea" aria-hidden="true"><span style="--d:${(0.3 + i * 0.12).toFixed(2)}s">${enfatizar(linea)}</span></span>`)}
        </h1>
        <p class="hero-bajada entrar" style="--d:0.75s">${esc(hero.bajada)}</p>
        <div class="hero-acciones entrar" style="--d:0.9s">
          ${lista(hero.ctas, (cta) => `<a class="${CLASES_CTA[cta.tipo] ?? CLASES_CTA.secundario}" href="${esc(cta.destino)}">${esc(cta.texto)}</a>`)}
        </div>
      </div>
      ${hero.coordenadas ? `
        <p class="hero-dato entrar" style="--d:1.05s">
          ${ICONO_RETICULA}
          <span>${esc(hero.coordenadas)}</span>
          <span>${esc(paquete.destino.corto)}</span>
        </p>` : ''}
    </div>`;

  // La foto aparece suavemente cuando termina de cargar (sin cuadro vacío mientras tanto)
  const imagen = el.querySelector('.hero-imagen');
  const mostrar = () => imagen.classList.add('cargada');
  if (imagen.complete && imagen.naturalWidth) mostrar();
  else imagen.addEventListener('load', mostrar, { once: true });
}