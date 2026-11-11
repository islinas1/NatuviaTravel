import { esc, lista, formatear, limitar, reducirMovimiento } from '../utils.js';

const ESPERA_AUTO = 3500;   // ms sin scroll antes de pasar sola a la siguiente foto
const DURACION_PASO = 900;  // ms que dura el desplazamiento automático
const ESPERA_AJUSTE = 250;  // ms tras soltar el scroll antes de centrar la foto más cercana

const FLECHA = {
  anterior: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  siguiente: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
};

const dosCifras = (n) => String(n).padStart(2, '0');

let controlador; // limpia listeners y temporizadores si la sección se vuelve a renderizar

export function renderGaleria(el, p, t) {
  const g = p.galeria;
  const tc = t.carrusel;
  const total = g.imagenes.length;

  el.classList.add('carrusel');
  el.innerHTML = `
    <div class="carrusel-escenario">
      <div class="contenedor carrusel-cabecera">
        <div class="cabecera-seccion">
          <h2>${esc(g.titulo)}</h2>
          <p>${esc(g.intro)}</p>
        </div>
        <div class="carrusel-controles">
          <span class="carrusel-contador" aria-hidden="true"><span class="carrusel-actual">01</span> / ${dosCifras(total)}</span>
          <button class="carrusel-boton" type="button" data-paso="-1" aria-label="${esc(tc.anterior)}">${FLECHA.anterior}</button>
          <button class="carrusel-boton" type="button" data-paso="1" aria-label="${esc(tc.siguiente)}">${FLECHA.siguiente}</button>
          <button class="carrusel-pausa" type="button">${esc(tc.pausar)}</button>
        </div>
      </div>
      <div class="carrusel-ventana" role="region" aria-label="${esc(g.titulo)}">
        <ul class="carrusel-pista">
          ${lista(g.imagenes, (img, i) => `
            <li class="carrusel-item">
              <button class="galeria-item" type="button" data-indice="${i}"
                aria-label="${esc(formatear(t.ampliar, { nombre: img.pie }))}">
                <img src="${esc(img.imagen)}" alt="${esc(img.alt)}" loading="lazy" width="800" height="600">
              </button>
              <p class="galeria-pie">${esc(img.pie)}</p>
            </li>`)}
        </ul>
      </div>
      <div class="contenedor"><div class="carrusel-progreso"><span></span></div></div>
    </div>
    <dialog class="visor" aria-label="${esc(g.titulo)}">
      <figure class="visor-figura">
        <img class="visor-imagen" alt="">
        <figcaption class="visor-pie"></figcaption>
      </figure>
      <button class="btn btn-claro btn-chico visor-cerrar" type="button">${esc(t.cerrar)}</button>
    </dialog>`;

  const ventana = el.querySelector('.carrusel-ventana');
  const pista = el.querySelector('.carrusel-pista');
  const items = [...pista.children];
  const textoActual = el.querySelector('.carrusel-actual');
  const progresoBarra = el.querySelector('.carrusel-progreso span');
  const botonPausa = el.querySelector('.carrusel-pausa');
  const visor = el.querySelector('.visor');

  controlador?.abort();
  controlador = new AbortController();
  const { signal } = controlador;

  // Con "reducir movimiento" no se fija la sección: el carrusel se desliza a mano
  const libre = reducirMovimiento();
  el.classList.toggle('carrusel-libre', libre);

  let distancia = 0;      // cuánto se mueve la pista en horizontal (px)
  let posiciones = [];    // desplazamiento que deja cada foto en el margen izquierdo
  let activo = 0;
  let pausado = false;
  let enfocado = false;
  let automatico = false; // true mientras el scroll lo provoca el propio carrusel
  let xActual = 0;
  let temporizador;
  let finAutomatico;
  let ajuste;
  let pendiente = false;

  const medir = () => {
    // Cada foto se detiene alineada al margen izquierdo; la última marca el final del recorrido
    const inicio = items[0].offsetLeft;
    posiciones = items.map((item) => item.offsetLeft - inicio);
    distancia = posiciones[posiciones.length - 1];
    // La sección mide una pantalla más el recorrido de la pista: ese scroll extra mueve el carrusel
    el.style.height = libre ? '' : `${window.innerHeight + distancia}px`;
  };

  const recorrido = () => el.offsetHeight - window.innerHeight;

  const marcarActivo = (x) => {
    let cercano = 0;
    posiciones.forEach((pos, i) => {
      if (Math.abs(pos - x) < Math.abs(posiciones[cercano] - x)) cercano = i;
    });
    activo = cercano;
    textoActual.textContent = dosCifras(activo + 1);
    items.forEach((item, i) => item.classList.toggle('activo', i === activo));
  };

  const pintar = (x) => {
    const progreso = distancia ? x / distancia : 0;
    progresoBarra.style.transform = `scaleX(${progreso.toFixed(4)})`;
    marcarActivo(x);
  };

  const actualizar = () => {
    pendiente = false;
    if (libre) { pintar(ventana.scrollLeft); return; }
    const r = recorrido();
    const progreso = r > 0 ? limitar(-el.getBoundingClientRect().top / r, 0, 1) : 0;
    const x = progreso * distancia;
    xActual = x;
    pista.style.transform = `translate3d(${(-x).toFixed(1)}px, 0, 0)`;
    pintar(x);
  };

  const pedirActualizacion = () => {
    if (!pendiente) { pendiente = true; requestAnimationFrame(actualizar); }
  };

  // Lleva el carrusel a la foto i (da la vuelta al llegar al final)
  const irA = (i) => {
    const destino = (i + total) % total;
    if (libre) {
      ventana.scrollTo({ left: posiciones[destino], behavior: 'auto' });
      return;
    }
    const arriba = el.getBoundingClientRect().top + window.scrollY;
    const y = arriba + (distancia ? posiciones[destino] / distancia : 0) * recorrido();
    window.scrollTo({ top: Math.round(y), behavior: 'smooth' });
  };

  // La sección está fijada en pantalla (el usuario está "dentro" del carrusel)
  const fijado = () => {
    const caja = el.getBoundingClientRect();
    return caja.top <= 1 && caja.bottom >= window.innerHeight - 1;
  };

  const programar = () => {
    clearTimeout(temporizador);
    if (libre || pausado) return;
    temporizador = setTimeout(avanzarSolo, ESPERA_AUTO);
  };

  // Movimiento provocado por el carrusel: no cuenta como scroll del usuario
  const moverSolo = (i) => {
    automatico = true;
    clearTimeout(finAutomatico);
    finAutomatico = setTimeout(() => { automatico = false; programar(); }, DURACION_PASO);
    irA(i);
  };

  function avanzarSolo() {
    if (pausado || enfocado || visor.open || document.hidden || !fijado()) { programar(); return; }
    moverSolo(activo + 1);
  }

  // Si el usuario suelta el scroll a mitad de camino, la foto más cercana se acomoda al margen
  const acomodar = () => {
    if (libre || !fijado() || Math.abs(xActual - posiciones[activo]) < 2) return;
    moverSolo(activo);
  };

  // Scroll del usuario: mueve el carrusel y reinicia la espera del avance automático
  if (!libre) {
    window.addEventListener('scroll', () => {
      if (!automatico) {
        programar();
        clearTimeout(ajuste);
        ajuste = setTimeout(acomodar, ESPERA_AJUSTE);
      }
      pedirActualizacion();
    }, { passive: true, signal });
  } else {
    ventana.addEventListener('scroll', pedirActualizacion, { passive: true, signal });
  }

  window.addEventListener('resize', () => { medir(); actualizar(); }, { signal });

  // Pausa mientras se usa con teclado o el cursor está encima de las fotos
  ventana.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') enfocado = true; }, { signal });
  ventana.addEventListener('pointerleave', () => { enfocado = false; }, { signal });
  el.addEventListener('focusin', (e) => { if (e.target.matches(':focus-visible')) enfocado = true; }, { signal });
  el.addEventListener('focusout', () => { enfocado = false; }, { signal });

  el.querySelectorAll('.carrusel-boton').forEach((boton) => {
    boton.addEventListener('click', () => {
      irA(activo + Number(boton.dataset.paso));
      programar();
    }, { signal });
  });

  botonPausa.addEventListener('click', () => {
    pausado = !pausado;
    botonPausa.textContent = pausado ? tc.reanudar : tc.pausar;
    programar();
  }, { signal });

  // Visor ampliado
  const imagen = visor.querySelector('.visor-imagen');
  const pie = visor.querySelector('.visor-pie');

  pista.addEventListener('click', (e) => {
    const boton = e.target.closest('.galeria-item');
    if (!boton) return;
    const item = g.imagenes[Number(boton.dataset.indice)];
    imagen.src = item.imagen;
    imagen.alt = item.alt;
    pie.textContent = item.credito ? `${item.pie}. ${t.foto}: ${item.credito}` : item.pie;
    visor.showModal();
  }, { signal });

  visor.querySelector('.visor-cerrar').addEventListener('click', () => visor.close(), { signal });
  visor.addEventListener('click', (e) => { if (e.target === visor) visor.close(); }, { signal });

  signal.addEventListener('abort', () => {
    clearTimeout(temporizador);
    clearTimeout(finAutomatico);
    clearTimeout(ajuste);
  });

  medir();
  actualizar();
  programar();
  // Las fuentes pueden cambiar las medidas al terminar de cargar
  document.fonts?.ready.then(() => { if (!signal.aborted) { medir(); actualizar(); } });
}