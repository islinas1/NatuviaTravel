import { esc, lista, formatear } from '../utils.js';

function fechaLocalHoy() {
  const hoy = new Date();
  hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
  return hoy.toISOString().slice(0, 10);
}

export function renderReserva(el, p, agencia) {
  const t = agencia.textos.reserva;
  const { contacto, canalReserva } = agencia;
  const cantidades = Array.from({ length: p.grupoMax }, (_, i) => i + 1);

  // El canal que no es el principal se ofrece como alternativa
  const enlaceEmail = `<a href="mailto:${esc(contacto.email)}">${esc(contacto.email)}</a>`;
  const enlaceWhatsapp = `<a href="https://wa.me/${esc(contacto.whatsapp)}" target="_blank" rel="noopener">WhatsApp (${esc(contacto.whatsappVisible)})</a>`;
  const alterno = canalReserva === 'email' ? enlaceWhatsapp : enlaceEmail;

  el.innerHTML = `
    <div class="contenedor reserva-grid">
      <div>
        <h2>${esc(t.titulo)}</h2>
        <p class="reserva-texto">${esc(formatear(t.texto, { n: p.grupoMax }))}</p>
        <p class="precio">${esc(p.precio.texto)}</p>
        <p class="precio-nota">${esc(p.precio.nota)}, ${esc(p.precio.referencia)}</p>
      </div>

      <form class="formulario">
        <div class="campo-form">
          <label for="r-nombre">${esc(t.nombre)}</label>
          <input id="r-nombre" name="nombre" autocomplete="name" required>
        </div>
        <div class="campos-fila">
          <div class="campo-form">
            <label for="r-fecha">${esc(t.fecha)}</label>
            <input id="r-fecha" name="fecha" type="date" min="${fechaLocalHoy()}" required>
          </div>
          <div class="campo-form">
            <label for="r-personas">${esc(t.personas)}</label>
            <select id="r-personas" name="personas">
              ${lista(cantidades, (n) => `<option value="${n}">${n}</option>`)}
            </select>
          </div>
        </div>
        <div class="campo-form">
          <label for="r-comentario">${esc(t.comentarios)}</label>
          <textarea id="r-comentario" name="comentario" rows="3"></textarea>
        </div>
        <button class="btn btn-primario" type="submit">${esc(t.boton)}</button>
        <p class="form-ayuda">${formatear(esc(t.ayuda), { alterno })}</p>
      </form>
    </div>`;

  const form = el.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const datos = new FormData(form);
    const m = t.mensaje;
    const lineas = [
      formatear(m.saludo, { paquete: p.nombre }),
      `${m.nombre}: ${datos.get('nombre')}`,
      `${m.fecha}: ${datos.get('fecha')}`,
      `${m.personas}: ${datos.get('personas')}`,
    ];
    const comentario = datos.get('comentario').trim();
    if (comentario) lineas.push(`${m.comentarios}: ${comentario}`);

    if (canalReserva === 'email') {
      const asunto = encodeURIComponent(formatear(m.asunto, { paquete: p.nombre }));
      const cuerpo = encodeURIComponent(lineas.join('\r\n'));
      location.href = `mailto:${contacto.email}?subject=${asunto}&body=${cuerpo}`;
    } else {
      const texto = encodeURIComponent(lineas.join('\n'));
      window.open(`https://wa.me/${contacto.whatsapp}?text=${texto}`, '_blank', 'noopener');
    }
  });
}