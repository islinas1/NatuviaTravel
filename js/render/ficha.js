import { esc, lista, formatear } from '../utils.js';

export function renderFicha(el, p, t) {
  const f = t.ficha;
  const datos = [
    [f.destino, `${p.destino.corto}, ${p.destino.region}`],
    [f.duracion, p.duracion.etiqueta],
    [f.modalidad, p.modalidadCorta],
    [f.grupo, formatear(f.grupoValor, { n: p.grupoMax })],
    [f.precio, p.precio.texto],
  ];

  el.innerHTML = `
    <div class="contenedor">
      <dl>
        ${lista(datos, ([titulo, valor]) => `<div><dt>${esc(titulo)}</dt><dd>${esc(valor)}</dd></div>`)}
      </dl>
    </div>`;
}