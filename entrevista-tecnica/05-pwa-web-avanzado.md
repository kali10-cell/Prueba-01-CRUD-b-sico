# PWA y Web Avanzado

Preguntas sobre Progressive Web Apps y conceptos web avanzados. Especialmente relevantes para posiciones que requieren conocimiento de rendimiento y experiencia de usuario.

---

## PWA — Conceptos

### ¿Qué es una PWA y qué la diferencia de una web normal?
**Respuesta esperada:** Una Progressive Web App es una web que cumple ciertos criterios para comportarse como una app nativa: se puede instalar en el dispositivo, funciona offline o con conexión limitada, recibe notificaciones push, y carga rápido. No requiere publicación en app stores. Técnicamente se logra con un Service Worker, un Web App Manifest y HTTPS. La palabra "progressive" indica que mejora progresivamente según las capacidades del navegador.

**Señal de alerta:** "Es una app que funciona offline." — Solo uno de los criterios. Una PWA sin instalabilidad ni manifest no es una PWA completa.

**Pregunta de seguimiento:** ¿Qué ventajas tiene una PWA frente a una app nativa para Android/iOS?

---

### ¿Qué es un Service Worker?
**Respuesta esperada:** Script JavaScript que el navegador registra en segundo plano, separado de la página. Actúa como proxy entre la app y la red: puede interceptar peticiones de red, gestionar una caché, manejar notificaciones push y sincronización en background. Se ejecuta aunque la web esté cerrada. Solo funciona en HTTPS (o localhost para desarrollo).

**Señal de alerta:** Confundirlo con un Web Worker. El Service Worker controla peticiones de red; el Web Worker ejecuta código en un hilo separado sin acceso a red.

**Pregunta de seguimiento:** ¿Cómo se registra un Service Worker en una app Next.js?

---

### ¿Qué es el Web App Manifest?
**Respuesta esperada:** Archivo JSON (`manifest.json` o `site.webmanifest`) que describe la app para el navegador: nombre, iconos (en varios tamaños), color de tema, orientación, `start_url`, y `display` (standalone, fullscreen, etc.). Con `display: standalone` la PWA instalada se abre sin la barra del navegador, pareciendo una app nativa.

```json
{
  "name": "Mi App",
  "short_name": "App",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**Señal de alerta:** No incluir iconos en múltiples tamaños — Android e iOS requieren tamaños específicos para mostrar el icono correctamente al instalar.

**Pregunta de seguimiento:** ¿Qué criterios debe cumplir una web para que Chrome muestre el banner de instalación?

---

## Estrategias de caché

### ¿Qué estrategias de caché existen en un Service Worker?
**Respuesta esperada:**
- **Cache First**: busca en caché primero, va a red solo si no está. Ideal para assets estáticos (JS, CSS, imágenes).
- **Network First**: va a la red primero, usa caché como fallback. Ideal para datos que cambian frecuentemente (API responses).
- **Stale While Revalidate**: devuelve la versión cacheada inmediatamente mientras actualiza la caché en background. Balance entre velocidad y frescura.
- **Network Only**: siempre va a la red. Para peticiones que nunca deben cachearse (analytics, pagos).
- **Cache Only**: solo caché. Raramente útil solo.

**Señal de alerta:** "Cacheo todo con Cache First." — Las API responses que cambian frecuentemente cacheadas con Cache First muestran datos obsoletos indefinidamente.

**Pregunta de seguimiento:** ¿Qué estrategia usarías para las imágenes de perfil de usuarios?

---

### ¿Cómo funciona `next-pwa`?
**Respuesta esperada:** Plugin para Next.js que genera automáticamente el Service Worker y lo configura con Workbox (librería de Google para Service Workers). Se instala como dependencia, se configura en `next.config.js`, y genera automáticamente las estrategias de caché para los assets de Next.js. Se puede personalizar con opciones como `runtimeCaching` para definir estrategias para rutas específicas.

```js
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development'
});

module.exports = withPWA({ /* config de Next.js */ });
```

**Señal de alerta:** No desactivar PWA en desarrollo (`disable: process.env.NODE_ENV === 'development'`) — el Service Worker en desarrollo puede cachear respuestas antiguas y causar confusión.

**Pregunta de seguimiento:** ¿Dónde se guarda el Service Worker generado por `next-pwa`?

---

## Rendimiento web

### ¿Qué son los Core Web Vitals?
**Respuesta esperada:** Métricas de Google para medir la experiencia de usuario:
- **LCP** (Largest Contentful Paint): cuánto tarda en aparecer el contenido principal. < 2.5s es bueno.
- **INP** (Interaction to Next Paint): tiempo de respuesta a interacciones del usuario. < 200ms.
- **CLS** (Cumulative Layout Shift): cuánto se mueven los elementos mientras carga. < 0.1.

Afectan al SEO (Google los usa en su ranking). Lighthouse los mide. En Next.js, usar `next/image` con dimensiones correctas mejora CLS; SSR/SSG mejoran LCP.

**Señal de alerta:** No conocerlos o conocer los nombres pero no qué miden ni cómo mejorarlos.

**Pregunta de seguimiento:** ¿Qué causa un CLS alto y cómo lo evitarías?

---

### ¿Qué es Lighthouse y cómo lo usas?
**Respuesta esperada:** Herramienta de auditoría de Google integrada en Chrome DevTools. Analiza una página y puntúa (0-100) en: Performance, Accessibility, Best Practices, SEO, y PWA. Genera un informe con problemas concretos y sugerencias de mejora. Se puede ejecutar también en CI con `@lhci/cli`. Muy útil para identificar qué mejorar antes de lanzar.

**Señal de alerta:** "Lo he visto pero nunca lo he usado." — En una empresa se ejecuta en cada PR para evitar regresiones de rendimiento.

**Pregunta de seguimiento:** ¿Qué puntuación mínima de Lighthouse sería aceptable para lanzar a producción?

---

### ¿Qué es el lazy loading y cómo se aplica?
**Respuesta esperada:** Técnica de carga diferida: los recursos (imágenes, componentes) se cargan solo cuando el usuario los necesita (al hacer scroll, al navegar). En Next.js: las imágenes con `next/image` tienen lazy loading por defecto. Los componentes se pueden cargar de forma dinámica con `next/dynamic`. Mejora el tiempo de carga inicial al reducir el JS enviado al navegador.

```js
import dynamic from 'next/dynamic';
const GraficoComplejo = dynamic(() => import('./GraficoComplejo'), {
  loading: () => <p>Cargando...</p>
});
```

**Señal de alerta:** Marcar como lazy el contenido "above the fold" (lo primero visible) — esto retrasa el LCP, que es justo lo contrario de lo que queremos.

**Pregunta de seguimiento:** ¿Cuándo NO usarías lazy loading en un componente?

---

## Accesibilidad y HTML semántico

### ¿Qué es HTML semántico y por qué importa?
**Respuesta esperada:** Usar las etiquetas HTML que describen el significado del contenido, no solo su apariencia: `<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`, `<button>` (no `<div onclick>`). Importa para: accesibilidad (lectores de pantalla navegan por landmarks semánticos), SEO (Google entiende mejor la estructura), y mantenibilidad del código.

**Señal de alerta:** "Uso `div` para todo y lo estilo con CSS." — Funciona visualmente pero rompe la accesibilidad y el SEO.

**Pregunta de seguimiento:** ¿Por qué es incorrecto usar `<div onclick>` en vez de `<button>`?

---

### ¿Qué es ARIA y cuándo se usa?
**Respuesta esperada:** Accessible Rich Internet Applications. Atributos HTML que añaden semántica a elementos que no la tienen nativamente. Ejemplo: `aria-label`, `aria-expanded`, `aria-live` para anuncios dinámicos. La regla de oro: usar HTML semántico nativo siempre que sea posible. ARIA solo cuando el HTML nativo no es suficiente (componentes UI complejos como modales, dropdowns).

**Señal de alerta:** "Añado `aria-label` a todo para mejorar la accesibilidad." — Añadir ARIA innecesario puede empeorar la accesibilidad si entra en conflicto con la semántica nativa.

**Pregunta de seguimiento:** ¿Cómo harías accesible un modal hecho con un `div`?
