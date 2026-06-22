# Prueba Técnica — Red Social de Libros

**Empresa:** Leemos (empresa mediana ficticia)
**Puesto:** Desarrollador/a Web Full Stack
**Tiempo estimado:** 6-8 horas
**Nivel:** Mid

---

## Contexto

Leemos es una plataforma donde los usuarios comparten recomendaciones de libros con la comunidad. Queremos construir un MVP funcional que podamos mostrar a nuestro equipo directivo la próxima semana.

Esta es nuestra prueba técnica estándar para candidatos mid. Evaluamos la capacidad de entregar un producto funcional, tomar buenas decisiones técnicas y documentar el trabajo.

**Esta prueba es más amplia que las anteriores. No esperamos perfección — esperamos que priorices correctamente y entregues algo que funcione.**

---

## Lo que debes construir

Una red social minimalista de recomendaciones de libros.

### Funcionalidades requeridas

**Autenticación:**
- [ ] Registro y login con email/contraseña (Supabase Auth)
- [ ] Logout
- [ ] Protección de rutas privadas

**Perfil de usuario:**
- [ ] El usuario puede subir una foto de avatar (Supabase Storage)
- [ ] El usuario puede editar su nombre de usuario (bio opcional)
- [ ] Página de perfil pública visible para todos

**Feed de recomendaciones:**
- [ ] Feed público con todas las recomendaciones ordenadas por fecha (más reciente primero)
- [ ] Cada recomendación muestra: portada del libro (imagen), título del libro, reseña corta del usuario, autor de la recomendación y fecha
- [ ] El usuario autenticado puede publicar una nueva recomendación (subir imagen de portada a Storage, título, reseña)
- [ ] El usuario puede borrar sus propias recomendaciones (no las de otros)

**Interacción:**
- [ ] Sistema de "me gusta" en las recomendaciones (solo usuarios autenticados)
- [ ] Contador de likes visible en cada recomendación
- [ ] Un usuario no puede dar like dos veces a la misma recomendación

### Funcionalidades opcionales
- [ ] Comentarios en las recomendaciones
- [ ] Paginación o infinite scroll en el feed
- [ ] Búsqueda por título de libro
- [ ] Que la app sea installable (PWA básica)

### Lo que NO necesitas construir
- Seguir a otros usuarios / sistema de followers
- Notificaciones
- Mensajes privados

---

## Stack requerido

- **Next.js** (sin TypeScript)
- **Supabase** — Auth, Base de datos, Storage
- **Vercel** — para el deploy

---

## Base de datos

Diseña tú el esquema. Aquí tienes las entidades mínimas:

- `profiles` — datos del perfil de usuario (vinculado a `auth.users`)
- `recomendaciones` — las recomendaciones de libros
- `likes` — relación entre usuarios y recomendaciones

**Se evaluará el diseño de la base de datos.** Debes incluir en el README el SQL de creación de tablas y las políticas RLS.

**RLS es obligatorio.** Cada tabla debe tener políticas que garanticen:
- Los perfiles son públicos (cualquiera puede leer)
- Solo el propietario puede actualizar su perfil
- Las recomendaciones son públicas pero solo el autor puede borrarlas
- Los likes: solo el usuario autenticado puede crear/borrar sus propios likes

---

## Criterios de evaluación

| Criterio | Peso |
|---|---|
| Funcionalidad completa (todas las features obligatorias) | Alto |
| Seguridad: RLS correcto en todas las tablas | Muy alto |
| Diseño de base de datos: tablas bien estructuradas, FKs correctas | Alto |
| Supabase Storage: imágenes de avatar y portadas funcionando | Alto |
| Código organizado y legible | Medio |
| README completo (setup, SQL, decisiones técnicas) | Medio |
| Deploy en Vercel funcionando | Medio |
| Performance: la app carga razonablemente rápido | Bajo |
| Funcionalidades opcionales | Extra |

---

## Entregables

1. **Repositorio en GitHub** (público)
2. **Deploy funcionando en Vercel**
3. **README.md** con:
   - Descripción y demo
   - Instrucciones de setup local
   - El SQL completo para crear las tablas y políticas RLS
   - Decisiones técnicas tomadas
   - Qué usaste de IA
   - Qué mejorarías con más tiempo

Plazo: **72 horas**.

---

## Credenciales de prueba

Crea al menos **dos usuarios de prueba** con recomendaciones distintas. Ponlas en el README para que podamos probar la app directamente.

---

## Lo que más peso tiene en la evaluación

1. **Que funcione** — una app con 4 features que funcionan bien vale más que 8 a medias
2. **Seguridad** — RLS correcto es no negociable para este puesto
3. **El README** — diferencia a los candidatos más que el código

---

## Preguntas que te harán en la defensa

*"Explícame el diseño de tu base de datos. ¿Por qué esa estructura?"*

*"¿Cómo implementaste los likes para evitar duplicados? ¿Dónde está esa validación?"*

*"Muéstrame las políticas RLS de la tabla de recomendaciones."*

*"Si la app tuviera 10.000 usuarios, ¿qué cambiarías?"*
