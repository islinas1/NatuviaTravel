import { esc, marcarImagenesRotas } from './utils.js';
import { renderEncabezado, renderPie } from './render/layout.js';
import { renderHero } from './render/hero.js';
import { renderFicha } from './render/ficha.js';
import { renderExperiencia } from './render/experiencia.js';
import { renderCapituloGuanaco } from './render/guanaco.js';
import { renderActividades } from './render/actividades.js';
import { renderGaleria } from './render/galeria.js';
import { renderItinerario } from './render/itinerario.js';
import { renderAlojamiento } from './render/alojamiento.js';
import { renderSostenibilidad } from './render/sostenibilidad.js';
import { renderInfo } from './render/info.js';
import { renderReserva } from './render/reserva.js';
import { renderBarra } from './render/barra.js';
import { activarRevelados } from './render/revelar.js';

const IDIOMAS = [
  { codigo: 'en', corto: 'EN', nombre: 'English' },
  { codigo: 'es', corto: 'ES', nombre: 'Español' },
];
const CODIGOS = IDIOMAS.map((i) => i.codigo);
const IDIOMA_POR_DEFECTO = 'en';
const PAQUETE_POR_DEFECTO = 'guanaco-chaco';
const CLAVE_IDIOMA = 'natuvia-idioma';

const ERRORES = {
  en: {
    titulo: "We couldn't load the expedition",
    ayuda: "Make sure the site is served from a server (local or published). Opening index.html with a double click won't work because the browser blocks reading the JSON files.",
  },
  es: {
    titulo: 'No pudimos cargar la expedición',
    ayuda: 'Revisa que el sitio se esté sirviendo desde un servidor (local o publicado). Abrir index.html con doble clic no funciona porque el navegador bloquea la lectura de los archivos JSON.',
  },
};

const estado = { idioma: IDIOMA_POR_DEFECTO, id: PAQUETE_POR_DEFECTO };
const $ = (id) => document.getElementById(id);

function idiomaGuardado() {
  try { return localStorage.getItem(CLAVE_IDIOMA); } catch { return null; }
}

function guardarIdioma(codigo) {
  try { localStorage.setItem(CLAVE_IDIOMA, codigo); } catch { /* sin almacenamiento: no pasa nada */ }
}

// Prioridad del idioma: ?lang= en la URL > elección guardada > idioma por defecto
function leerParametros() {
  const params = new URLSearchParams(location.search);
  const pedido = params.get('lang') ?? idiomaGuardado();
  const idioma = CODIGOS.includes(pedido) ? pedido : IDIOMA_POR_DEFECTO;
  const id = params.get('paquete') ?? PAQUETE_POR_DEFECTO;
  return { idioma, id: /^[a-z0-9-]+$/.test(id) ? id : PAQUETE_POR_DEFECTO };
}

async function cargarJSON(ruta) {
  const respuesta = await fetch(ruta);
  if (!respuesta.ok) throw new Error(`${ruta} (${respuesta.status})`);
  return respuesta.json();
}

const cargarDatos = (idioma, id) =>
  Promise.all([
    cargarJSON(`data/${idioma}/agencia.json`),
    cargarJSON(`data/${idioma}/paquetes/${id}.json`),
  ]);

function renderizar(agencia, paquete) {
  const t = agencia.textos;

  document.documentElement.lang = estado.idioma;
  document.title = `${paquete.nombre} | ${agencia.nombre}`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', paquete.hero.bajada);
  $('saltar').textContent = t.saltar;
  $('ficha').setAttribute('aria-label', t.ficha.aria);

  renderEncabezado($('encabezado'), agencia, {
    idiomas: IDIOMAS,
    actual: estado.idioma,
    alCambiar: cambiarIdioma,
  });
  renderHero($('inicio'), paquete);
  renderFicha($('ficha'), paquete, t);
  renderExperiencia($('experiencia'), paquete);
  renderCapituloGuanaco($('guanaco'), paquete, t);
  renderActividades($('actividades'), paquete, t);
  renderGaleria($('galeria'), paquete, t);
  renderItinerario($('itinerario'), paquete, t);
  renderAlojamiento($('alojamiento'), paquete);
  renderSostenibilidad($('sostenibilidad'), paquete);
  renderInfo($('info'), paquete, t);
  renderReserva($('reservar'), paquete, agencia);
  renderPie($('pie'), agencia);
  renderBarra($('barra-viaje'), paquete, t, {
    ocultarCon: [$('inicio'), $('reservar'), $('pie')],
  });

  marcarImagenesRotas(document);
  activarRevelados(document);
}

// El encabezado se vuelve sólido al dejar el borde superior
function vigilarEncabezado() {
  const encabezado = $('encabezado');
  let pendiente = false;
  const actualizar = () => {
    encabezado.classList.toggle('solido', window.scrollY > 24);
    pendiente = false;
  };
  window.addEventListener('scroll', () => {
    if (!pendiente) { pendiente = true; requestAnimationFrame(actualizar); }
  }, { passive: true });
  actualizar();
}

async function cambiarIdioma(codigo) {
  if (codigo === estado.idioma || !CODIGOS.includes(codigo)) return;
  const scroll = window.scrollY;

  try {
    const [agencia, paquete] = await cargarDatos(codigo, estado.id);
    estado.idioma = codigo;
    guardarIdioma(codigo);

    const url = new URL(location.href);
    url.searchParams.set('lang', codigo);
    history.replaceState(null, '', url);

    renderizar(agencia, paquete);

    // Mantener al usuario donde estaba y devolver el foco al selector
    window.scrollTo({ top: scroll, behavior: 'instant' });
    document.querySelector('.idioma-boton[aria-pressed="true"]')?.focus();
  } catch (error) {
    // Si falla, la página se queda en el idioma actual sin romperse
    console.error(error);
  }
}

async function iniciar() {
  const { idioma, id } = leerParametros();
  estado.idioma = idioma;
  estado.id = id;
  document.documentElement.lang = idioma;
  vigilarEncabezado();

  try {
    const [agencia, paquete] = await cargarDatos(idioma, id);
    renderizar(agencia, paquete);
    if (location.hash) $(location.hash.slice(1))?.scrollIntoView();
  } catch (error) {
    console.error(error);
    const textos = ERRORES[idioma];
    $('contenido').innerHTML = `
      <section class="contenedor seccion estado-error" role="alert">
        <h1>${esc(textos.titulo)}</h1>
        <p>${esc(error.message)}</p>
        <p>${esc(textos.ayuda)}</p>
      </section>`;
  }
}

iniciar();