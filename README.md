# Informe: desarrollo y publicación del sitio web de Natuvia Travel

**Nov 10, 2026 @Ezequiel**

## Introducción

Se desarrolló y publicó un sitio web informativo de una sola página para la agencia de viajes Natuvia Travel, dedicada al turismo de naturaleza y aventura en Bolivia. El sitio presenta un único paquete, Guanaco Chaco Expedition, una expedición de dos días y una noche al Parque Nacional y Área Natural de Manejo Integrado Kaa-lya del Gran Chaco, en Santa Cruz.

La actividad principal del paquete es el avistamiento ético del guanaco chaqueño, especie en peligro crítico con alrededor de 200 individuos remanentes. Por ello, el diseño convierte al guanaco en el protagonista visual, mientras que el resto de la fauna y el paisaje cumplen un papel secundario.

El público objetivo principal son viajeros estadounidenses interesados en la fotografía de fauna y la conservación. En consecuencia, el sitio se muestra en inglés por defecto e incluye una versión completa en español. Este informe describe la estructura del sitio, las tecnologías utilizadas, las decisiones de diseño y el proceso de publicación en internet.

## Estructura del sitio

El sitio es una página única que se arma en el navegador a partir de archivos de datos. El archivo HTML contiene solo contenedores vacíos, y el JavaScript los completa con la información guardada en archivos JSON; este enfoque se conoce como renderizado del lado del cliente.

**Figura 1**
*Flujo de renderizado del sitio*

> **El mismo código arma la página en los dos idiomas a partir de archivos JSON**
> - **Archivos JSON** (data/en y data/es): todo el texto
> - **main.js**: elige el idioma, carga con fetch
> - **Módulos de render**: uno por sección, generan el HTML
> - **index.html**: contenedores vacíos, reciben el HTML
> 
> *(el botón EN | ES pide los datos del otro idioma)*

**Nota.** Al cambiar de idioma, `main.js` carga los JSON del otro idioma y vuelve a dibujar las secciones sin recargar la página.

### Organización de los archivos

El proyecto separa el contenido, la presentación y la lógica en carpetas distintas, como se resume en la Tabla 1.

**Tabla 1**
*Carpetas del proyecto y su función*

| Carpeta o archivo | Contenido | Función |
| :--- | :--- | :--- |
| `index.html` | Estructura base con contenedores vacíos | Punto de entrada de la página |
| `css/` | `tokens.css`, `base.css`, `components.css` | Colores, tipografía, estilos generales y de cada sección |
| `js/main.js` | Script principal | Carga los datos y ordena el dibujado de cada sección |
| `js/render/` | Un módulo por sección (hero, itinerario, galería, reserva, etc.) | Convierte los datos en HTML |
| `data/en/` y `data/es/` | `agencia.json` y `paquetes/guanaco-chaco.json` | Todo el texto del sitio en inglés y en español |
| `assets/img/` | Fotografías y mapa de la ruta | Material visual |

Gracias a esta separación, agregar otro paquete turístico solo requiere crear un nuevo archivo JSON con la misma forma. Para mostrarlo basta con abrir la página con el parámetro `?paquete=` seguido de su identificador, sin modificar el HTML ni el código.

## Secciones de la página

La página presenta la información en el siguiente orden de lectura:

1. Encabezado con navegación, selector de idioma EN | ES y botón de reserva.
2. Portada (hero) con la fotografía del guanaco, el titular y dos llamados a la acción: reservar y ver el itinerario.
3. Ficha del viaje con destino, duración, modalidad, tamaño del grupo y precio.
4. Propuesta de valor, con la cifra de unos 200 guanacos remanentes y tres motivos numerados.
5. Sección del telescopio, dedicada exclusivamente al guanaco.
6. Actividades destacadas: safari $4 \times 4$, astrofotografía, acecho en pozas e interpretación botánica.
7. Carrusel "Más del Chaco", con fauna y paisajes secundarios.
8. Itinerario por día y mapa de la ruta.
9. Alojamiento en campamento, compromisos de sostenibilidad e información práctica.
10. Formulario de reserva y pie de página con datos de contacto.

## Tecnologías utilizadas

El sitio se construyó con tecnologías web estándar, sin frameworks ni paso de compilación, para que fuera liviano y fácil de mantener. La Tabla 2 resume cada herramienta y su uso.

**Tabla 2**
*Tecnologías y herramientas utilizadas*

| Tecnología | Uso en el proyecto |
| :--- | :--- |
| **HTML5** | Estructura semántica de la página: encabezado, secciones, formulario y pie |
| **CSS3** | Diseño con variables (tokens), Grid y Flexbox, posicionamiento sticky, animaciones y consultas de medios para el diseño responsivo |
| **JavaScript (módulos ES)** | Carga de datos con fetch, dibujado de cada sección, selector de idioma, efecto del telescopio, carrusel y formulario |
| **JSON** | Almacenamiento de todo el contenido en inglés y en español |
| **Google Fonts** | Tipografías Cormorant Garamond (títulos) y Work Sans (texto) |
| **Git y GitHub** | Control de versiones y alojamiento del código fuente |
| **Render** | Publicación del sitio como sitio estático en internet |
| **Visual Studio Code y Live Server** | Edición del código y servidor local de pruebas |

El código JavaScript se dividió en módulos ES, que permiten organizar el código en archivos independientes que se importan entre sí mediante `import` y `export` (Mozilla, s.f.). Cada sección de la página tiene su propio módulo en la carpeta `js/render/`.

Una consecuencia de usar módulos y archivos JSON es que la página no funciona al abrir `index.html` con doble clic. El navegador bloquea esas cargas en direcciones `file://`, por lo que durante el desarrollo se usó un servidor local (Live Server) y, en producción, un servidor web.

## Diseño visual e interacción

El diseño busca transmitir calma, naturaleza y observación paciente, en línea con un turismo de bajo impacto. Para definir la estructura se tomó como referencia a Natural Habitat Adventures, agencia estadounidense de viajes de fauna cuyas páginas organizan cada viaje en resumen, itinerario, alojamiento, precios e información previa (Natural Habitat Adventures, s.f.).

### Paleta y tipografía

Se usó la paleta de cinco verdes y un tono hueso definida para el proyecto: `#344E41`, `#3A5A40`, `#588157`, `#A3B18A` y `#DAD7CD`. Los títulos usan *Cormorant Garamond*, una tipografía con serifa de aire editorial, y los textos usan *Work Sans* por su buena lectura en pantallas pequeñas.

### Elementos de interacción

*   **Vista por el telescopio.** En la sección del guanaco, la fotografía aparece primero dentro de un círculo pequeño con una retícula, como si se viera por un telescopio terrestre de 20-60x. Al hacer scroll, el círculo se abre hasta mostrar la imagen completa, lo que refuerza la idea de observar sin acercarse.
*   **Carrusel controlado por el scroll.** En la sección "Más del Chaco", la página se fija en pantalla y el scroll vertical desplaza las fotos en horizontal. Si el usuario deja de hacer scroll, las fotos avanzan solas cada 3,5 segundos; el avance se puede pausar.
*   **Barra flotante de reserva.** Una barra con el precio y el botón de reserva aparece al dejar la portada y se oculta en la sección de reserva y en el pie.
*   **Selector de idioma.** Cambia entre inglés y español sin recargar la página, conserva la posición del usuario y recuerda la elección para la próxima visita.
*   **Formulario de reserva.** En inglés abre el correo del usuario con la solicitud redactada; en español abre WhatsApp.

### Diseño responsivo y accesibilidad

El diseño parte de pantallas móviles y se adapta a tabletas y computadoras mediante consultas de medios; se probó a 390 y 1440 píxeles de ancho. En móvil, el menú se oculta tras un botón y el carrusel muestra una foto principal por pantalla.

Se cuidó el contraste de los textos según las pautas WCAG del W3C (World Wide Web Consortium [W3C], 2023). Además, todas las imágenes tienen texto alternativo, los controles funcionan con teclado y las animaciones se desactivan cuando el usuario tiene activada la opción de reducir movimiento en su sistema.

## Publicación en internet

El sitio se publicó en dos etapas: primero se subió el código a un repositorio de GitHub y después se conectó ese repositorio con Render, que lo sirve como sitio estático. Como el proyecto no necesita compilación, Render publica los archivos tal como están.

### Subida del código a GitHub

1. Se creó un repositorio público vacío llamado `natuvia-travel` en GitHub.
2. Se verificó que `index.html` estuviera en la raíz del proyecto y que los nombres de los archivos coincidieran exactamente con los usados en los JSON, porque el servidor distingue mayúsculas de minúsculas.
3. Desde la terminal de Visual Studio Code se inicializó el repositorio local con `git init`, se registraron los archivos con `git add` y `git commit`, y se enviaron a GitHub con `git push`.

### Publicación en Render

Render configura un sitio estático con dos datos: el comando de compilación y la carpeta que se publica (Render, s.f.). El procedimiento fue el siguiente:

1. Se creó una cuenta en Render vinculada a GitHub y se autorizó a la aplicación de Render a leer el repositorio `natuvia-travel`.
2. Se eligió la opción **New +** y luego **Static Site**, y se seleccionó el repositorio.
3. Se dejó vacío el comando de compilación y se indicó como carpeta de publicación la raíz del proyecto (`.`), donde está `index.html`.
4. Render publicó el sitio en una dirección con el formato `natuvia-travel.onrender.com`, servida con HTTPS.

### Actualizaciones y registro en Google

Cada vez que se envía un cambio a la rama principal con `git push`, Render vuelve a publicar el sitio de forma automática. Por último, el sitio se registró en Google Search Console: se verificó la propiedad con una etiqueta HTML y se enviaron los archivos `sitemap.xml` y `robots.txt` para facilitar su indexación.

## Conclusiones

Se obtuvo un sitio bilingüe, responsivo y publicado en internet que presenta el paquete Guanaco Chaco Expedition con el guanaco como protagonista. El uso de tecnologías web estándar, sin frameworks, permitió un sitio liviano que se publica sin compilación.

Separar el contenido en archivos JSON fue la decisión de estructura más útil: el mismo código muestra el sitio en dos idiomas y puede mostrar nuevos paquetes sin cambios en la programación. La publicación mediante GitHub y Render deja un flujo simple de mantenimiento, en el que cada cambio enviado al repositorio se publica de forma automática.

Como trabajo pendiente queda reemplazar las fotografías de muestra por imágenes reales con su crédito y licencia, y confirmar la indexación del sitio en Google, que depende de los tiempos de rastreo del buscador.

## Referencias

Mozilla. (s.f.). *Módulos JavaScript*. MDN Web Docs. https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Módulos

Natural Habitat Adventures. (s.f.). *Natural Habitat Adventures*. https://www.nathab.com/

Render. (s.f.). *Static sites: When and how*. https://render.com/tutorials/web-service-vs-static-site/static-sites

World Wide Web Consortium. (2023). *Web Content Accessibility Guidelines (WCAG) 2.2*. https://www.w3.org/TR/WCAG22/
