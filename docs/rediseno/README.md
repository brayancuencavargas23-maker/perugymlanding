# Peru Gym — Fuerza con propósito

## Implementación

- HTML, CSS y JavaScript nativos; se mantienen las APIs de configuración, planes y solicitudes, y el chatbot PHP.
- Logo SVG existente, Barlow Condensed y Manrope, carbón/marfil/rojo, fotografía protagonista y motivo de barras diagonales.
- Portada, beneficios, nosotros, planes, preguntas frecuentes, contacto, footer y formulario renovados.
- Planes consultados el 24/09/2026: Interdiario S/ 80, Diario S/ 100, Premium S/ 250. Se conserva la fuente dinámica.
- Navegación por teclado, foco visible, escape y foco contenido en menú/modal, movimiento reducido y estados de carga/error.

## Verificación

Chrome automatizado con Playwright, servidor estático local temporal (Apache no estaba disponible).

- Viewports 360, 390, 768, 1024 y 1440: sin desbordamiento horizontal, imágenes cargadas.
- Revisión visual de capturas completas en móvil y escritorio.
- Tres planes obtenidos de la API real.
- Menú móvil y Escape, FAQ, validación de campos, apertura/cierre y reapertura del formulario.
- Respuestas de envío simuladas: error y éxito. No se crearon solicitudes en producción.
- Apertura del chatbot; su respuesta PHP/Gemini no se verificó con el servidor estático.
- El mapa externo no se visualizó en las capturas del entorno; la tarjeta incluye un enlace directo a Google Maps como alternativa visible.
- Estado alternativo al fallar la API de planes.
- Sin errores de JavaScript durante las pruebas; comprobación de sintaxis con Node.

## Datos pendientes

- Confirmar dirección, teléfono, correo y horarios oficiales. Se retiraron los datos de ejemplo y las coordenadas SEO de Lima; el mapa conserva las coordenadas existentes del proyecto.
- Aclarar “Todo en plan PRO” en Premium: esa prestación ambigua se omite, sin asumir equivalencia con Diario.
- Confirmar licencias y procedencia de las fotografías configuradas en Cloudinary; preferir imágenes propias del gimnasio.
- Confirmar métricas y certificaciones antes de publicarlas. Se retiraron las cifras sin fuente.
- Proporcionar documentos y destinos legales reales. No se incluyen enlaces vacíos.
- Configurar canonical/Open Graph con el dominio público definitivo (se retiraron URLs de localhost).
- Comprobar que la información comercial del backend del chatbot coincida con los datos oficiales.
- No existe un destino de inicio de sesión confirmado en esta landing.

## Capturas

- `escritorio.png`: 1440 px.
- `movil.png`: 390 px.
