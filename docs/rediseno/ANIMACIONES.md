# Animaciones — Fuerza con propósito

## Sistema implementado

- `css/animations.css`: tokens de movimiento, microinteracciones, menú y chatbot; se carga después de los estilos de la landing.
- `js/animations.js`: entradas con IntersectionObserver y Web Animations API, registro de contenido dinámico y apertura/cierre de preguntas frecuentes.
- `js/landing.js`: registra las tarjetas después de cargar la API; anima apertura/cierre y éxito del formulario, conservando foco y bloqueo del fondo.
- `js/chatbot.js`: evita foco en el panel cerrado, devuelve foco al cerrar desde dentro y permite Escape; no utiliza un temporizador que pueda enfocar el chat después de cerrarlo.

## Movimiento

- Portada escalonada: etiqueta, H1, descripción y acciones; la fotografía principal permanece visible desde el inicio.
- Etiqueta de fotografía, beneficios, Nosotros, detalles diagonales, encabezados, FAQ y cierre: desplazamiento ascendente corto y opacidad. Cada entrada ocurre una sola vez por carga.
- Planes: registro posterior a la API, desfase de 70 ms y elevación de 4 px exclusivamente con ratón.
- Botones: respuesta al pulsar y desplazamiento de flecha; se excluye el indicador de envío.
- Menú: transición en ambos sentidos de 220 ms. Su contenido cerrado queda inerte en móvil y vuelve a estar disponible en escritorio.
- FAQ: animación de altura de 220 ms, giro del símbolo y soporte de clics rápidos. Se mantiene el elemento nativo `details`.
- Modal: entrada de 220 ms, salida de 180 ms, confirmación de envío. Durante el cierre conserva su comportamiento modal y al terminar devuelve el foco al plan seleccionado.
- Chat: desplazamiento de 12 px y opacidad durante 220 ms; se elimina la pulsación decorativa continua de la notificación.

## Accesibilidad y mejora progresiva

- El contenido no se oculta esperando al observador; sin JavaScript sigue siendo legible y las FAQ funcionan de forma nativa.
- El H1 nunca pierde opacidad; las demás entradas parten de opacidad parcial, no de invisibilidad.
- `prefers-reduced-motion` evita animaciones JS y transiciones CSS. Cambiar la preferencia durante una animación finaliza el movimiento y preserva el estado del componente.
- Foco visible, controles cerrados fuera del recorrido de tabulación, foco contenido en menú/modal y retorno al cerrar.
- Las animaciones de entrada no alteran el flujo del documento. Solo FAQ anima altura, para abrir/cerrar el contenido en su lugar.
- Sin dependencias adicionales, listeners de scroll continuos, parallax ni control artificial del desplazamiento.

## Verificación ejecutada

Chrome automatizado con Playwright y servidor estático local temporal:

- Viewports 360, 390, 768, 1024 y 1440 px: recorrido por las secciones y ausencia de desbordamiento horizontal.
- Planes obtenidos de la API real y entradas ejecutadas una sola vez; volver a la sección no las repite.
- FAQ: abrir, cerrar, clics rápidos alternados y uso de Enter.
- Modal: validación, tabulación circular, Escape, foco restaurado y estados de error/éxito con respuestas simuladas, sin crear solicitudes reales.
- Menú: apertura/cierre, teclado y cambio de móvil a escritorio.
- Chat: apertura, foco, Escape y contenido cerrado inerte.
- Movimiento reducido al cargar y al activarlo durante una animación.
- API de planes simulada con retraso y con fallo; tarjetas tardías registradas correctamente.
- Contenido y FAQ con JavaScript desactivado.
- Revisión visual de capturas del menú móvil y formulario de escritorio.
- Sintaxis de los tres archivos JavaScript y `git diff --check`.

La prueba del chatbot cubre su interfaz, no la respuesta del servicio PHP/Gemini. No se realizaron mediciones formales de FPS o Lighthouse.
