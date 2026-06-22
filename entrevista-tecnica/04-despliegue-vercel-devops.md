# Despliegue, Vercel y DevOps

Preguntas sobre despliegue de aplicaciones web. Un área que muchos junior infravaloran pero que diferencia mucho en entrevistas.

---

## Conceptos generales

### ¿Qué es CI/CD?
**Respuesta esperada:** Integración Continua (CI) y Despliegue Continuo (CD). CI: cada push al repositorio dispara automáticamente tests y validaciones. CD: si CI pasa, el código se despliega automáticamente a producción o staging. El objetivo es detectar errores rápido y eliminar pasos manuales de despliegue. Vercel implementa CD automáticamente: cada push a `main` hace un deploy a producción.

**Señal de alerta:** "Lo hago manual con FTP." — No necesariamente malo para proyectos personales, pero en una empresa es un antipatrón.

**Pregunta de seguimiento:** ¿Qué tests se suelen ejecutar en la fase de CI?

---

### ¿Qué es un CDN y para qué sirve?
**Respuesta esperada:** Content Delivery Network. Red de servidores distribuidos geográficamente. En vez de servir todos los recursos desde un único servidor, el CDN sirve los assets (imágenes, JS, CSS) desde el servidor más cercano al usuario. Reduce la latencia y mejora el tiempo de carga. Vercel tiene un CDN global integrado que sirve automáticamente los assets estáticos de Next.js.

**Señal de alerta:** Confundirlo con un servidor normal. Un CDN no ejecuta lógica de negocio, solo sirve contenido estático de forma eficiente.

**Pregunta de seguimiento:** ¿Qué tipo de contenido tiene más sentido servir desde un CDN?

---

### ¿Qué es una función serverless?
**Respuesta esperada:** Función que se ejecuta en la nube bajo demanda, sin mantener un servidor permanentemente activo. El proveedor gestiona la infraestructura, escalado y disponibilidad. Solo se paga por el tiempo de ejecución. Las API Routes de Next.js se convierten automáticamente en funciones serverless en Vercel. Limitación: "cold start" (primera invocación tras un periodo de inactividad es más lenta).

**Señal de alerta:** "Es como un servidor normal pero más barato." — No gestionar el estado entre llamadas es la diferencia fundamental. Cada invocación es stateless.

**Pregunta de seguimiento:** ¿Por qué una función serverless no puede mantener una conexión WebSocket permanente?

---

## Vercel

### ¿Cómo funciona el flujo de despliegue en Vercel?
**Respuesta esperada:** 1) Conectas tu repositorio de GitHub/GitLab. 2) Cada push a cualquier rama crea un **Preview Deployment** con URL única para revisar los cambios. 3) Cada push (o merge) a la rama de producción (`main`) actualiza el **Production Deployment**. Vercel detecta automáticamente que es un proyecto Next.js y lo configura. El build se ejecuta en sus servidores, genera los assets estáticos y despliega las funciones serverless.

**Señal de alerta:** No conocer los Preview Deployments — son una de las funcionalidades más valiosas para revisar cambios en equipo antes de llegar a producción.

**Pregunta de seguimiento:** ¿Cómo compartirías un Preview Deployment con un cliente para que revise los cambios?

---

### ¿Cómo gestionas las variables de entorno en Vercel?
**Respuesta esperada:** En el dashboard de Vercel → Settings → Environment Variables. Puedes definir variables diferentes para Production, Preview y Development. Las variables sin prefijo `NEXT_PUBLIC_` solo están disponibles en el servidor. Vercel las inyecta en el proceso de build y en las funciones serverless. Nunca se guardan en el repositorio.

**Señal de alerta:** Guardar la `.env.local` en el repositorio o hardcodear claves en el código. Esto expone credenciales en el historial de git aunque luego las borres.

**Pregunta de seguimiento:** ¿Cómo harías para que una variable de entorno esté disponible solo en el entorno de Preview pero no en Production?

---

### ¿Qué son las Edge Functions de Vercel?
**Respuesta esperada:** Funciones que se ejecutan en el edge de la red de Vercel (muy cerca del usuario, distribuidas globalmente), con latencia mínima. Usan el Edge Runtime de Next.js, que es más limitado que Node.js (no tiene acceso a todas las APIs de Node). El middleware de Next.js se ejecuta en el edge. Son ideales para redirecciones, auth checks y personalización de contenido con latencia mínima.

**Señal de alerta:** Intentar usar librerías de Node.js (como `fs` o drivers de base de datos que requieren Node) en el edge runtime — no está soportado.

**Pregunta de seguimiento:** ¿Qué harías si necesitas acceder a la base de datos desde el middleware?

---

### ¿Cómo configuras un dominio personalizado en Vercel?
**Respuesta esperada:** En el dashboard de Vercel → Settings → Domains → añadir el dominio. Vercel genera los registros DNS necesarios (normalmente un registro A o CNAME). Se configuran en el panel de tu proveedor de dominios (GoDaddy, Namecheap, etc.). Vercel gestiona automáticamente el certificado SSL/TLS (HTTPS). El proceso suele tardar unos minutos en propagarse.

**Señal de alerta:** No saber qué son los registros DNS o pensar que Vercel también vende dominios. Los dominios se compran por separado.

**Pregunta de seguimiento:** ¿Qué es un registro CNAME y para qué sirve?

---

## Git y colaboración

### ¿Cuál es tu flujo de trabajo con Git en un equipo?
**Respuesta esperada:** Feature branch workflow: cada nueva funcionalidad o fix se hace en una rama separada (`feature/nombre` o `fix/nombre`). Cuando está lista, se abre un Pull Request para revisión de código. Un compañero revisa, comenta y aprueba. Se mergea a `main` y se despliega automáticamente. Nunca se hace commit directamente en `main`.

**Señal de alerta:** "Trabajo siempre en main." — En un equipo es un antipatrón que causa conflictos constantemente y hace imposible el code review.

**Pregunta de seguimiento:** ¿Cómo resolverías un conflicto de merge?

---

### ¿Qué diferencia hay entre `git merge` y `git rebase`?
**Respuesta esperada:** `merge` integra dos ramas creando un commit de merge, preservando el historial completo. `rebase` reaplica los commits de una rama encima de otra, creando un historial lineal. `rebase` produce un historial más limpio pero reescribe los commits (nunca hacer `rebase` de ramas compartidas). En la mayoría de equipos se usa merge o squash merge para Pull Requests.

**Señal de alerta:** No conocer la diferencia o decir que siempre se debe usar uno u otro sin entender el contexto.

**Pregunta de seguimiento:** ¿Por qué es peligroso hacer `git rebase` en una rama que ya está en remoto y la usan otros?

---

### ¿Qué información mínima debe tener el README de un proyecto?
**Respuesta esperada:** Descripción del proyecto, tecnologías usadas, requisitos previos (Node version, etc.), instrucciones de instalación y arranque en local, variables de entorno necesarias (sin los valores), URL del deploy si existe, y si hay tests, cómo ejecutarlos.

**Señal de alerta:** Un README vacío o con solo el nombre del proyecto. En una empresa, si no puedes correr el proyecto localmente en 5 minutos siguiendo el README, el equipo pierde tiempo valioso.

**Pregunta de seguimiento:** ¿Qué añadirías al README si el proyecto tiene una base de datos con migraciones?
