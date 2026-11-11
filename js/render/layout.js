import { esc, lista } from '../utils.js';

export function renderEncabezado(el, agencia, opciones) {
  const t = agencia.textos;

  el.innerHTML = `
    <div class="contenedor">
      <a class="marca" href="#inicio">${esc(agencia.marca.nombre)}<span>${esc(agencia.marca.complemento)}</span></a>
      <div class="encabezado-acciones">
        <nav id="nav-principal" class="nav" aria-label="${esc(t.navAria)}">
          <ul class="nav-lista">
            ${lista(agencia.navegacion, (item) => `<li><a href="${esc(item.destino)}">${esc(item.texto)}</a></li>`)}
            <li><a class="btn btn-claro btn-chico" href="#reservar">${esc(t.reservar)}</a></li>
          </ul>
        </nav>
        <div class="idioma" role="group" aria-label="${esc(t.idioma)}">
          ${lista(opciones.idiomas, (i) => `
            <button class="idioma-boton" type="button" data-idioma="${esc(i.codigo)}"
              lang="${esc(i.codigo)}" aria-label="${esc(i.nombre)}"
              aria-pressed="${i.codigo === opciones.actual}">${esc(i.corto)}</button>`)}
        </div>
        <button class="menu-boton" type="button" aria-expanded="false" aria-controls="nav-principal">${esc(t.menu)}</button>
      </div>
    </div>`;

  // Menú móvil
  const boton = el.querySelector('.menu-boton');
  const nav = el.querySelector('.nav');

  const alternar = (abrir) => {
    nav.classList.toggle('abierto', abrir);
    boton.setAttribute('aria-expanded', String(abrir));
    boton.textContent = abrir ? t.cerrar : t.menu;
  };

  boton.addEventListener('click', () => alternar(!nav.classList.contains('abierto')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) alternar(false); });
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('abierto')) { alternar(false); boton.focus(); }
  });

  // Selector de idioma
  const botonesIdioma = [...el.querySelectorAll('.idioma-boton')];
  el.querySelector('.idioma').addEventListener('click', async (e) => {
    const elegido = e.target.closest('[data-idioma]');
    if (!elegido || elegido.getAttribute('aria-pressed') === 'true') return;

    botonesIdioma.forEach((b) => { b.disabled = true; });
    await opciones.alCambiar(elegido.dataset.idioma);
    // Si el cambio falló, el encabezado sigue siendo este: se reactivan los botones
    botonesIdioma.forEach((b) => { b.disabled = false; });
  });
}

export function renderPie(el, agencia) {
  const { contacto, textos: t } = agencia;
  el.innerHTML = `
    <div class="contenedor pie-grid">
      <div>
        <p class="marca">${esc(agencia.marca.nombre)}<span>${esc(agencia.marca.complemento)}</span></p>
        <p class="pie-texto">${esc(agencia.descripcionCorta)}</p>
      </div>
      <div>
        <h2 class="pie-titulo">${esc(t.contacto)}</h2>
        <ul class="pie-lista">
          <li><a href="mailto:${esc(contacto.email)}">${esc(contacto.email)}</a></li>
          <li><a href="https://wa.me/${esc(contacto.whatsapp)}" target="_blank" rel="noopener">WhatsApp ${esc(contacto.whatsappVisible)}</a></li>
          <li>${esc(contacto.ciudad)}</li>
        </ul>
      </div>
      <div>
        <h2 class="pie-titulo">${esc(t.redes)}</h2>
        <ul class="pie-lista">
          ${lista(agencia.redes, (r) => `<li><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.nombre)}</a></li>`)}
        </ul>
      </div>
    </div>
    <div class="contenedor pie-legal">
      <p>© ${new Date().getFullYear()} ${esc(agencia.nombre)}</p>
    </div>`;
}