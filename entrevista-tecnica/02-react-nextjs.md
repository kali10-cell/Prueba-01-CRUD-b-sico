# React y Next.js

Preguntas sobre React y el framework Next.js. Son el núcleo de cualquier entrevista para posiciones frontend o fullstack con este stack.

---

## React — Hooks

### ¿Para qué sirve `useState`?
**Respuesta esperada:** Permite añadir estado local a un componente funcional. Devuelve un array con el valor actual y una función para actualizarlo. Cuando se llama al setter, React rerenderiza el componente con el nuevo valor.

```js
const [nombre, setNombre] = useState('');
```

**Señal de alerta:** "Guarda datos en el componente." — Correcto pero incompleto. Lo clave es que al actualizar el estado *dispara un renderizado*. No entender esto lleva a bugs donde el estado "no se actualiza" porque leen el valor antiguo.

**Pregunta de seguimiento:** ¿Qué pasa si llamas a `setNombre` con el mismo valor que ya tiene?

---

### ¿Para qué sirve `useEffect` y cuándo se ejecuta?
**Respuesta esperada:** Permite ejecutar efectos secundarios (peticiones a la API, suscripciones, manipulación del DOM) después de que el componente se renderice. Se controla con el array de dependencias:
- Sin array: se ejecuta en cada render
- Array vacío `[]`: solo al montar el componente
- Con dependencias `[valor]`: cuando cambia alguna dependencia

Puede devolver una función de limpieza que se ejecuta antes del siguiente efecto o al desmontar.

**Señal de alerta:** Poner una petición a la API dentro de un `useEffect` sin array de dependencias — causa un bucle infinito si la respuesta actualiza el estado.

**Pregunta de seguimiento:** ¿Por qué a veces ves advertencias sobre "missing dependencies" en el array?

---

### ¿Para qué sirve `useContext`?
**Respuesta esperada:** Permite consumir un contexto React sin prop drilling (pasar props por varios niveles de componentes). Se crea un contexto con `createContext`, se envuelve la app con un Provider que provee el valor, y cualquier componente hijo puede leerlo con `useContext`.

**Señal de alerta:** Proponer Context para todo el estado de la app — no es un reemplazo de Redux o Zustand para estado complejo, porque rerenderiza todos los consumidores cuando el valor cambia.

**Pregunta de seguimiento:** ¿Cuándo usarías Context y cuándo buscarías otra solución de estado?

---

### ¿Para qué sirve `useMemo` y `useCallback`?
**Respuesta esperada:** Son optimizaciones de rendimiento. `useMemo` memoriza el resultado de un cálculo costoso para no repetirlo en cada render. `useCallback` memoriza una función para que su referencia no cambie en cada render (útil cuando se pasa como prop a componentes hijos memorizados con `React.memo`). Ambos solo recalculan cuando cambian sus dependencias.

**Señal de alerta:** Usarlos en todos lados "por si acaso". Tienen un coste propio y solo valen la pena cuando hay un problema real de rendimiento identificado.

**Pregunta de seguimiento:** ¿Cuándo tiene sentido usar `React.memo` en un componente?

---

### ¿Qué son las reglas de los Hooks?
**Respuesta esperada:** 1) Solo llamar hooks en el nivel superior (no dentro de condicionales, bucles o funciones anidadas). 2) Solo llamar hooks desde componentes funcionales de React o desde custom hooks. Estas reglas existen porque React identifica los hooks por su orden de llamada en cada render, y si ese orden cambia, el estado se corrompe.

**Señal de alerta:** No conocer la razón de las reglas. Si no entienden por qué, no sabrán qué pasa cuando las rompen.

**Pregunta de seguimiento:** ¿Qué error obtendrías si pones un hook dentro de un `if`?

---

## React — Renderizado y ciclo de vida

### ¿Cuándo se rerenderiza un componente?
**Respuesta esperada:** Cuando cambia su estado (`useState`), cuando cambian sus props, o cuando se rerenderiza su componente padre (incluso si sus props no cambiaron, a menos que use `React.memo`). El contexto también puede disparar rerenderizados.

**Señal de alerta:** "Cuando se llama a setState." — Incompleto. Un componente hijo se rerenderiza aunque sus props no hayan cambiado si el padre se rerenderiza.

**Pregunta de seguimiento:** ¿Cómo evitarías que un componente hijo se rerenderice innecesariamente?

---

### ¿Qué es el Virtual DOM?
**Respuesta esperada:** React mantiene una representación ligera del DOM en memoria (Virtual DOM). Cuando cambia el estado, React recalcula el Virtual DOM, lo compara con el anterior (diffing/reconciliación) y solo aplica al DOM real los cambios mínimos necesarios. Esto es más eficiente que manipular el DOM directamente.

**Señal de alerta:** "El Virtual DOM es más rápido que el DOM." — No siempre. Es más predecible y fácil de razonar, pero tiene un coste propio. Frameworks como Svelte demuestran que se puede ser más rápido sin Virtual DOM.

**Pregunta de seguimiento:** ¿Para qué sirve la prop `key` en listas?

---

## Next.js — Renderizado

### ¿Qué diferencia hay entre SSR, SSG, ISR y CSR?
**Respuesta esperada:**
- **CSR** (Client Side Rendering): el HTML llega vacío, React renderiza en el navegador. Bueno para apps privadas con mucha interactividad. SEO malo.
- **SSG** (Static Site Generation): HTML generado en tiempo de build. Muy rápido, ideal para contenido que no cambia. Malo para contenido dinámico.
- **SSR** (Server Side Rendering): HTML generado en el servidor en cada petición. Bueno para SEO con contenido dinámico. Más lento que SSG.
- **ISR** (Incremental Static Regeneration): SSG con revalidación. Las páginas estáticas se regeneran en background cada X segundos. Lo mejor de SSG y SSR.

**Señal de alerta:** Decir que SSR siempre es mejor. Cada estrategia tiene su caso de uso. Un portfolio puede ser SSG puro; un ecommerce usa ISR; un dashboard privado puede ser CSR.

**Pregunta de seguimiento:** ¿Cuándo elegirías ISR sobre SSR?

---

### ¿Qué diferencia hay entre el App Router y el Pages Router de Next.js?
**Respuesta esperada:** Pages Router (versión clásica): las páginas van en `/pages`, usa `getStaticProps`/`getServerSideProps` para data fetching, todo es Client Component por defecto. App Router (desde Next 13): las páginas van en `/app`, usa React Server Components por defecto (el fetch ocurre en el servidor sin enviar JS al cliente), los Client Components se marcan explícitamente con `'use client'`. El App Router es el futuro, pero muchos proyectos siguen en Pages Router.

**Señal de alerta:** No saber qué versión están usando o pensar que son intercambiables sin cambios.

**Pregunta de seguimiento:** ¿Por qué en el App Router no puedes usar hooks directamente en un Server Component?

---

### ¿Qué son las API Routes en Next.js?
**Respuesta esperada:** Permiten crear endpoints de backend dentro del propio proyecto Next.js, sin necesitar un servidor separado. En Pages Router van en `/pages/api/`. En App Router van en `/app/api/` como Route Handlers. Son funciones serverless que se despliegan automáticamente en Vercel. Se usan para lógica que no debe exponerse al cliente: llamar a APIs con claves secretas, validar datos, webhooks.

**Señal de alerta:** Poner claves de API privadas en componentes de React (se exponen al cliente). Eso va en API Routes con variables de entorno del servidor.

**Pregunta de seguimiento:** ¿Cuándo usarías una API Route en vez de llamar a Supabase directamente desde el componente?

---

### ¿Cómo funciona `next/image` y por qué usarlo?
**Respuesta esperada:** Componente de Next.js que optimiza imágenes automáticamente: las convierte a WebP/AVIF, las redimensiona según el tamaño de pantalla, las carga de forma lazy por defecto, y las sirve desde la CDN de Vercel. Mejora los Core Web Vitals (especialmente LCP). Requiere especificar `width` y `height` para evitar Cumulative Layout Shift.

**Señal de alerta:** Usar `<img>` nativo porque "es más sencillo". Correcto, pero en Next.js lo pagas en rendimiento y en Lighthouse score.

**Pregunta de seguimiento:** ¿Qué pasa si la imagen viene de un dominio externo como Supabase Storage?

---

### ¿Qué son los middlewares en Next.js?
**Respuesta esperada:** Código que se ejecuta antes de que la petición llegue a la página o API Route, en el edge (cerca del usuario). Se define en `middleware.js` en la raíz. Se usa para: redirecciones, protección de rutas (verificar sesión), reescritura de URLs, A/B testing, internacionalización.

**Señal de alerta:** Poner lógica pesada en el middleware — se ejecuta en el edge con un runtime limitado (no tiene acceso a Node.js completo, no puede hacer queries a bases de datos directamente).

**Pregunta de seguimiento:** ¿Cómo protegerías una ruta privada con middleware y Supabase Auth?

---

### ¿Cómo manejas las variables de entorno en Next.js?
**Respuesta esperada:** Se definen en archivos `.env.local` (no se sube a git). Las variables con prefijo `NEXT_PUBLIC_` son accesibles en el cliente. Las que no tienen ese prefijo solo están disponibles en el servidor (API Routes, Server Components, getServerSideProps). En Vercel se configuran en el dashboard del proyecto.

**Señal de alerta:** Exponer la `service_role` key de Supabase con `NEXT_PUBLIC_`. Esa clave da acceso total a la base de datos y nunca debe ir al cliente.

**Pregunta de seguimiento:** ¿Qué variables de Supabase son seguras de exponer al cliente?

---

## Next.js — Navegación y optimización

### ¿Qué diferencia hay entre `<Link>` de Next.js y una etiqueta `<a>` normal?
**Respuesta esperada:** `<Link>` hace navegación del lado del cliente (SPA navigation): carga solo el JS y datos de la nueva página sin recargar el navegador completo. También hace prefetch automático de páginas visibles en el viewport. La etiqueta `<a>` normal hace una recarga completa del navegador, perdiendo el estado de la app.

**Señal de alerta:** "Son prácticamente iguales." — No lo son. El `<Link>` es fundamental para el rendimiento percibido de la app.

**Pregunta de seguimiento:** ¿Cuándo usarías una etiqueta `<a>` normal en vez de `<Link>`?

---

### ¿Qué son los dynamic routes en Next.js?
**Respuesta esperada:** Permiten crear páginas cuya URL contiene parámetros variables. En Pages Router: archivos con nombre `[id].js`. En App Router: carpetas `[id]/`. Next.js expone el parámetro a través de `params` en el componente. Con `generateStaticParams` (App Router) o `getStaticPaths` (Pages Router) se pueden prerenderizar en build time.

**Señal de alerta:** No saber cómo acceder al parámetro o confundir `params` con `searchParams` (los query strings).

**Pregunta de seguimiento:** ¿Cómo crearías una ruta para `/blog/[categoria]/[slug]`?

---

### ¿Qué es el `layout.js` en el App Router?
**Respuesta esperada:** Componente que define la estructura compartida de un grupo de páginas (navbar, sidebar, footer). Se renderiza una vez y no se desmonta al navegar entre páginas hijas, lo que mejora el rendimiento. Puede anidarse: un layout raíz para toda la app y layouts específicos para secciones.

**Señal de alerta:** Confundirlo con `template.js` (que sí se desmonta y remonta en cada navegación).

**Pregunta de seguimiento:** ¿Cómo aplicarías un layout diferente para la sección de admin vs la sección pública?
