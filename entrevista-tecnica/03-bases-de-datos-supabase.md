# Bases de Datos y Supabase

Preguntas sobre bases de datos relacionales y Supabase. Muy frecuentes en entrevistas fullstack.

---

## Bases de datos — Conceptos generales

### ¿Qué diferencia hay entre una base de datos SQL y NoSQL?
**Respuesta esperada:** SQL (relacional): datos estructurados en tablas con esquema fijo, relaciones mediante claves foráneas, garantías ACID. Ejemplos: PostgreSQL, MySQL. NoSQL: documentos, clave-valor, grafos — esquema flexible, escalan horizontalmente con más facilidad. Ejemplos: MongoDB, Redis. Supabase usa PostgreSQL (SQL). No hay un "mejor" absoluto: SQL para datos relacionados y consistencia; NoSQL para escala masiva o datos no estructurados.

**Señal de alerta:** "NoSQL es más moderno y mejor." — Depende del caso. Para la mayoría de apps web con datos relacionados, SQL es más apropiado.

**Pregunta de seguimiento:** ¿Cuándo elegirías una base de datos NoSQL sobre PostgreSQL?

---

### ¿Qué es una clave primaria y una clave foránea?
**Respuesta esperada:** Clave primaria (PRIMARY KEY): identifica de forma única cada fila de una tabla. Clave foránea (FOREIGN KEY): referencia a la clave primaria de otra tabla, establece relaciones entre tablas. En Supabase las tablas tienen por defecto una columna `id` (UUID o bigint) como clave primaria.

**Señal de alerta:** No entender que la clave foránea *hace referencia* a otra tabla, no contiene los datos.

**Pregunta de seguimiento:** ¿Qué pasa si intentas borrar un registro que tiene filas relacionadas en otra tabla?

---

### ¿Qué es un JOIN y cuándo lo usas?
**Respuesta esperada:** Combina filas de dos o más tablas basándose en una condición de relación. Tipos más comunes: INNER JOIN (solo filas que tienen coincidencia en ambas tablas), LEFT JOIN (todas las filas de la tabla izquierda, con o sin coincidencia en la derecha). En Supabase se puede hacer con el cliente JS usando la sintaxis de relaciones o con queries SQL directas.

**Señal de alerta:** Hacer múltiples queries separadas para unir datos que deberían obtenerse con un JOIN — menos eficiente y propenso a inconsistencias.

**Pregunta de seguimiento:** ¿Cómo harías en Supabase una query que traiga los posts junto con el nombre del autor?

---

## Supabase — Cliente y queries

### ¿Qué es Supabase y qué ofrece?
**Respuesta esperada:** Plataforma open-source que proporciona una base de datos PostgreSQL con una API REST y en tiempo real generada automáticamente, autenticación, almacenamiento de archivos (Storage) y funciones serverless (Edge Functions). Es la alternativa open-source a Firebase. La capa gratuita es generosa para proyectos pequeños.

**Señal de alerta:** "Es como MongoDB pero en la nube." — No, es PostgreSQL (relacional). La confusión con Firebase/MongoDB es común.

**Pregunta de seguimiento:** ¿Qué ventajas tiene usar Supabase frente a Firebase?

---

### ¿Cómo haces una consulta básica con el cliente de Supabase?
**Respuesta esperada:** Se usa el cliente `@supabase/supabase-js`. Primero se inicializa con la URL y la clave pública (`anon key`). Las queries son encadenables y devuelven `{ data, error }`.

```js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// SELECT
const { data, error } = await supabase
  .from('tareas')
  .select('*')
  .eq('completada', false)
  .order('created_at', { ascending: false });

// INSERT
const { data, error } = await supabase
  .from('tareas')
  .insert({ titulo: 'Nueva tarea', user_id: userId });
```

**Señal de alerta:** No manejar el `error` — si la query falla silenciosamente, la app se rompe sin feedback claro.

**Pregunta de seguimiento:** ¿Cómo filtrarías por un campo que puede ser null?

---

### ¿Qué es Row Level Security (RLS) y por qué es crítico?
**Respuesta esperada:** RLS es una característica de PostgreSQL que permite definir políticas de acceso a nivel de fila. Sin RLS, cualquiera con la `anon key` (que es pública) puede leer o escribir cualquier dato. Con RLS activado, se definen políticas que determinan qué filas puede ver/modificar cada usuario según su identidad (JWT de Supabase Auth). Es la primera línea de defensa de seguridad en Supabase.

```sql
-- Solo el propietario puede ver sus tareas
CREATE POLICY "usuarios ven sus tareas" ON tareas
  FOR SELECT USING (auth.uid() = user_id);
```

**Señal de alerta:** "Controlo el acceso en el frontend." — El frontend se puede manipular. RLS protege a nivel de base de datos, que es la única defensa real.

**Pregunta de seguimiento:** ¿Qué pasa si alguien desactiva el JavaScript de tu web y hace peticiones directas a la API de Supabase?

---

### ¿Cómo funciona la autenticación en Supabase?
**Respuesta esperada:** Supabase Auth gestiona el registro, login y sesiones con JWT (JSON Web Tokens). Soporta email/password, magic links, OAuth (Google, GitHub, etc.). El cliente JS gestiona automáticamente el token en localStorage. En Next.js hay que usar `@supabase/ssr` o `@supabase/auth-helpers-nextjs` para que las cookies de sesión funcionen correctamente en SSR.

```js
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
});

// Obtener usuario actual
const { data: { user } } = await supabase.auth.getUser();

// Logout
await supabase.auth.signOut();
```

**Señal de alerta:** Guardar el token JWT manualmente en localStorage sin usar el cliente de Supabase — es redundante y propenso a errores.

**Pregunta de seguimiento:** ¿Cómo protegerías una página de Next.js para que solo usuarios autenticados puedan acceder?

---

### ¿Qué es Supabase Realtime?
**Respuesta esperada:** Permite suscribirse a cambios en la base de datos en tiempo real mediante WebSockets. Cuando un registro se inserta, actualiza o borra, todos los clientes suscritos reciben el cambio al instante. Útil para chats, notificaciones, dashboards en vivo. Funciona activando la "replication" en la tabla deseada.

```js
const channel = supabase
  .channel('cambios-tareas')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'tareas' },
    (payload) => console.log(payload)
  )
  .subscribe();
```

**Señal de alerta:** Olvidar cancelar la suscripción al desmontar el componente — causa memory leaks.

**Pregunta de seguimiento:** ¿Cómo desuscribirías el canal al desmontar el componente en React?

---

### ¿Qué es Supabase Storage?
**Respuesta esperada:** Sistema de almacenamiento de archivos (imágenes, PDFs, etc.) integrado en Supabase, basado en S3. Se organiza en "buckets" (públicos o privados). Tiene políticas de acceso similares a RLS. Las URLs de archivos públicos se pueden generar directamente; para los privados se generan URLs firmadas con expiración.

```js
// Subir archivo
const { data, error } = await supabase.storage
  .from('avatares')
  .upload(`${userId}/avatar.jpg`, file);

// Obtener URL pública
const { data } = supabase.storage
  .from('avatares')
  .getPublicUrl(`${userId}/avatar.jpg`);
```

**Señal de alerta:** Subir archivos directamente al bucket sin validar el tipo y tamaño en el servidor — riesgo de seguridad y costes inesperados.

**Pregunta de seguimiento:** ¿Cómo configurarías el bucket para que solo el propietario pueda subir su propio avatar?

---

### ¿Qué diferencia hay entre la `anon key` y la `service_role key` de Supabase?
**Respuesta esperada:** `anon key`: clave pública, segura de exponer al cliente. Respeta RLS. `service_role key`: clave de administrador, bypasea RLS completamente. Nunca debe ir al frontend ni a variables `NEXT_PUBLIC_`. Solo se usa en el servidor (API Routes, Edge Functions). Con ella tienes acceso total a la base de datos.

**Señal de alerta:** Poner la `service_role key` en el código del cliente o en una variable `NEXT_PUBLIC_`. Esto da acceso completo a cualquiera que abra las DevTools.

**Pregunta de seguimiento:** ¿En qué caso necesitarías usar la `service_role key`?

---

## Diseño de base de datos

### ¿Cómo diseñarías la base de datos para una app de tareas con usuarios?
**Respuesta esperada:** Mínimo dos tablas: `users` (gestionada por Supabase Auth) y `tareas` con columnas `id`, `user_id` (FK a auth.users), `titulo`, `descripcion`, `completada`, `created_at`. RLS que limita cada usuario a ver solo sus tareas. Si hay categorías, una tabla `categorias` con FK en `tareas`.

**Señal de alerta:** Guardar todo en una sola tabla o no añadir `user_id` — no hay forma de saber a quién pertenece cada tarea.

**Pregunta de seguimiento:** ¿Añadirías índices? ¿En qué columnas y por qué?
