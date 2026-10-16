Actúa como director de arte, diseñador UX/UI y desarrollador frontend sénior. Rediseña e implementa la landing existente de Peru Gym para que tenga una identidad propia, una presentación profesional y un recorrido claro hacia la elección de un plan.

Usa la captura original para entender el negocio y la imagen de propuesta, si se adjunta, como referencia de dirección visual. Construye una interfaz real con HTML, CSS y componentes; nunca uses una captura completa como fondo de la página.

1. REVISA EL PROYECTO ANTES DE EDITAR

Identifica el stack, los estilos, los componentes, las rutas, los recursos y los flujos de inscripción e inicio de sesión. Conserva las integraciones y la funcionalidad existente. Trabaja con la tecnología del proyecto y evita dependencias innecesarias.

La captura muestra textos secundarios pequeños, acceso a sesión repetido, fotografías con superposiciones que distraen y poco contraste entre secciones. Comprueba también si el espacio vacío a la derecha procede del layout o de la captura antes de corregirlo. Mejora las causas reales.

2. DIRECCIÓN CREATIVA: “FUERZA CON PROPÓSITO”

Crea una estética deportiva editorial: contundente, cercana y disciplinada. Mantén el nombre Peru Gym, el lema “Más fuerte cada día” y la asociación entre rojo y negro.

La personalidad debe surgir de titulares condensados, fotografía de entrenamiento, grandes superficies limpias y un motivo discreto de dos barras diagonales que sugiera avance. Repite ese motivo en pocos lugares: botones, separadores o etiquetas. Evita convertirlo en decoración omnipresente.

Usa el logotipo original si existe un archivo adecuado y acompáñalo de un nombre legible. No estires ni improvises una versión del escudo a partir de la miniatura. Un wordmark tipográfico puede funcionar como alternativa provisional.

3. SISTEMA VISUAL

Define variables o tokens reutilizables:
- Negro carbón: #101112.
- Grafito: #202326.
- Marfil: #F3F0E9.
- Blanco: #FFFFFF.
- Rojo principal: #C8102E.
- Texto secundario claro: #BFC2C5; sobre fondos claros, #52565A.

Reserva el rojo para llamadas a la acción, palabras clave y pequeños detalles. Combina un hero oscuro con secciones claras y un cierre oscuro.

Usa Barlow Condensed para titulares y Manrope para cuerpo, o alternativas equivalentes disponibles en el proyecto. Máximo dos familias, con fallbacks y carga eficiente. H1 de 72–104 px en escritorio y 44–56 px en móvil; cuerpo de 16–18 px; interlineado de 1.5–1.65. Usa tamaños fluidos y evita mayúsculas en párrafos.

Aplica un contenedor centrado de aproximadamente 1200 px, retícula de 12 columnas en escritorio, 4 en móvil y escala de espaciado basada en 8 px. Márgenes móviles de 20–24 px y separación entre secciones de 80–112 px en escritorio, 48–64 px en móvil. Prioriza alineación, proximidad, contraste, repetición y espacio libre.

Usa bordes finos, radios de 4–8 px e iconos de una misma familia. Sustituye los emojis decorativos. Evita sombras pesadas, efectos de vidrio, degradados multicolor y bloques idénticos para todas las secciones.

4. ESTRUCTURA DE LA LANDING

A. Navegación
Logo/nombre, Nosotros, Planes y Contacto. Un solo enlace de “Iniciar sesión” y botón principal “Únete ahora”. Si el logo lleva al inicio, no dupliques ese destino sin necesidad. En móvil, menú accesible y compacto.

B. Hero
Composición asimétrica con texto a la izquierda y fotografía protagonista a la derecha. Usa una imagen de entrenamiento creíble y autorizada; protege la lectura del texto con composición o una capa localizada.
Titular: “MÁS FUERTE. CADA DÍA.”
Texto de apoyo: “Construye fuerza, disciplina y confianza. Encuentra tu ritmo en Peru Gym.”
CTA principal: “Encuentra tu plan”, con destino a la sección de planes.
CTA secundario: “Conoce el gimnasio”, con destino a Nosotros.
Mantén “Ver video” solo si existe un video real y funcional.

C. Beneficios
Una franja ligera con cuatro pilares: Equipamiento, Entrenadores, Planes para ti y Comunidad. Usa iconos consistentes o numeración editorial 01–04. Redacta descripciones breves usando únicamente servicios confirmados.

D. Nosotros
Alterna imagen y texto respecto al hero.
Titular propuesto: “LA FUERZA SE CONSTRUYE EN COMUNIDAD.”
Explica en pocas líneas qué ofrece el gimnasio. Da protagonismo a una fotografía real cuando esté disponible. No superpongas sellos gigantes sobre las personas.
Las cifras “+10K”, “+20” y similares solo se publican si tienen una fuente verificable; si falta, omítelas y documenta el pendiente.

E. Planes
Titular: “TU OBJETIVO. TU PLAN.”
La captura muestra Interdiario a S/ 80/mes, Diario a S/ 100/mes y Premium a S/ 250/mes. Consérvalos salvo que la fuente vigente del proyecto indique otros importes; informa cualquier diferencia.

Usa tres tarjetas alineadas, con nombre, precio dominante, periodicidad, beneficios comparables y botones a la misma altura. Destaca Diario mediante el color, sin afirmar “Más popular” si no hay evidencia. En móvil, apílalas y deja toda la información visible.

Respeta las condiciones reales. La captura menciona “plan PRO” dentro de Premium aunque no muestra un plan con ese nombre: verifica la referencia antes de publicarla y no asumas que equivale a Diario. Si falta el dato, muestra solo prestaciones confirmadas y registra el pendiente.

F. Contacto y cierre
Titular: “EMPIEZA HOY. SUPÉRATE MAÑANA.”
Un CTA claro conectado al flujo real de inscripción o contacto. Incluye ubicación, horarios, teléfono o WhatsApp únicamente si están confirmados y disponibles. No inventes números ni destinos.

G. Footer
Nombre/logo, enlaces útiles, contactos verificados y año dinámico. Mantén una composición compacta.

5. INTERACCIÓN, ACCESIBILIDAD Y RENDIMIENTO

Todos los enlaces y botones deben funcionar. Si falta una integración, dirige el CTA a una alternativa real disponible y documenta lo pendiente; no simules un envío exitoso.

Usa HTML semántico, un único H1, jerarquía ordenada, texto alternativo útil y navegación por teclado. Incluye foco visible, estados hover/active y controles táctiles de al menos 44 × 44 px. Busca contraste de al menos 4.5:1 en texto normal y 3:1 en texto grande; comprueba las combinaciones finales.

El menú móvil debe exponer su estado, controlar bien el foco y poder cerrarse con Escape. Respeta prefers-reduced-motion. Limita las transiciones a cambios sutiles de 150–250 ms.

Optimiza fotografías, usa tamaños responsivos y reserva sus dimensiones. Carga diferida bajo el primer pantallazo y prioriza la imagen principal. Evita video automático pesado, carruseles innecesarios y animaciones que bloqueen la lectura.

6. ENTREGA Y CRITERIOS DE ACEPTACIÓN

Implementa el rediseño completo; no te quedes en recomendaciones. Valida a 360, 390, 768, 1024 y 1440 px. Comprueba que no haya desbordamiento horizontal, textos cortados, imágenes deformadas ni controles superpuestos.

Verifica navegación, planes, inscripción, contacto e inicio de sesión, junto con la compilación y las comprobaciones existentes del proyecto. Realiza una revisión visual real en móvil y escritorio; no afirmes comprobaciones que no hayas ejecutado.

Entrega los cambios, capturas de escritorio y móvil, un resumen de las decisiones visuales y una lista breve de datos o integraciones pendientes. La prioridad es una marca coherente, contenido legible y una decisión de compra fácil de entender.
