const ENTIDADES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const esc = (valor = '') => String(valor).replace(/[&<>"']/g, (c) => ENTIDADES[c]);

export const lista = (items = [], fn) => items.map(fn).join('');

// Reemplaza {clave} en un texto: formatear('Up to {n} travelers', { n: 6 })
export const formatear = (plantilla, valores = {}) =>
  plantilla.replace(/\{(\w+)\}/g, (original, clave) => (clave in valores ? String(valores[clave]) : original));

// Escapa el texto y convierte *palabra* en <em>palabra</em> (acento en cursiva)
export const enfatizar = (texto = '') => esc(texto).replace(/\*(.+?)\*/g, '<em>$1</em>');

// Quita los asteriscos de acento para usar el texto plano (aria-label, título)
export const textoPlano = (texto = '') => String(texto).replace(/\*/g, '');

export const limitar = (valor, min, max) => Math.min(max, Math.max(min, valor));

export const reducirMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function marcarImagenesRotas(raiz) {
  raiz.querySelectorAll('img:not(.visor-imagen)').forEach((img) => {
    img.addEventListener('error', () => img.classList.add('rota'), { once: true });
  });
}