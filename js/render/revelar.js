import { reducirMovimiento } from '../utils.js';

// Elementos que aparecen suavemente al entrar en pantalla
const SELECTORES = [
  '.cabecera-seccion', '.destacado', '.puntos > li', '.actividad',
  '.panel-titulo', '.bloque', '.ruta-mapa', '.ruta-paradas', '.alojamiento-grid > *',
  '.acordeon', '.reserva-grid > *', '.pie-grid > *',
].join(',');

let observador;

export function activarRevelados(raiz = document) {
  if (!('IntersectionObserver' in window) || reducirMovimiento()) return;
  document.documentElement.classList.add('con-revelado');

  observador?.disconnect();
  observador = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      observador.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  raiz.querySelectorAll(SELECTORES).forEach((elemento) => {
    const hermanos = [...elemento.parentElement.children].filter((h) => h.matches(SELECTORES));
    elemento.style.setProperty('--i', Math.min(hermanos.indexOf(elemento), 5));
    elemento.classList.add('revelar');
    observador.observe(elemento);
  });
}