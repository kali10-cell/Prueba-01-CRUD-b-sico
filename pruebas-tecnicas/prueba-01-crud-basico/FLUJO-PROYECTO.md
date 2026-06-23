# Flujo del proyecto - Prueba 01: CRUD basico

## 1. Objetivo del proyecto

El objetivo es construir una aplicacion web sencilla para gestionar tareas personales.

La app permite:

- Ver tareas guardadas.
- Crear una tarea con titulo obligatorio y descripcion opcional.
- Marcar una tarea como completada o pendiente.
- Eliminar una tarea.
- Persistir los datos en Supabase.

La idea principal es demostrar que entiendo un flujo CRUD completo conectado a una base de datos real.

---

## 2. Stack usado

Use Next.js con Pages Router porque para este ejercicio es suficiente y mantiene la estructura simple.

Tambien use Supabase como backend porque permite tener base de datos Postgres y API REST automaticamente sin crear un servidor propio.

La app no tiene autenticacion porque el enunciado indica que no es necesaria para esta prueba.

---

## 3. Estructura principal

```txt
pages/index.js
lib/supabaseClient.js
.env.local
```

### `pages/index.js`

Contiene la pantalla principal del CRUD:

- Estado local de tareas.
- Formulario de creacion.
- Carga inicial desde Supabase.
- Acciones para completar y eliminar tareas.
- Mensajes de error para el usuario.

### `lib/supabaseClient.js`

Centraliza la conexion con Supabase.

Esto evita repetir la configuracion en varios archivos y deja claro donde se inicializa el cliente.

### `.env.local`

Guarda las variables de entorno publicas necesarias para conectar desde el frontend:

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Uso `NEXT_PUBLIC_` porque el cliente de Supabase se ejecuta en el navegador. En Next.js, las variables que necesita el navegador deben llevar ese prefijo.

---

## 4. Base de datos

La tabla usada es `tareas`.

```sql
create table tareas (
  id uuid default gen_random_uuid() primary key,
  titulo text not null,
  descripcion text,
  completada boolean default false,
  created_at timestamp with time zone default now()
);
```

### Por que esta estructura

- `id`: identifica cada tarea de forma unica.
- `titulo`: es obligatorio porque una tarea sin titulo no tiene sentido.
- `descripcion`: es opcional para permitir detalles extra.
- `completada`: guarda si la tarea esta pendiente o terminada.
- `created_at`: permite ordenar las tareas por fecha de creacion.

---

## 5. Permisos de Supabase

Como esta prueba no usa login ni RLS, la app necesita que el rol publico pueda operar sobre la tabla.

Se dieron permisos a `anon` y `authenticated`:

```sql
grant select, insert, update, delete on public.tareas to anon;
grant select, insert, update, delete on public.tareas to authenticated;
```

Esto permite que la app pueda leer, crear, actualizar y borrar tareas usando la llave publica.

En un proyecto real con usuarios, no dejaria la tabla abierta asi. Activaria RLS, agregaria una columna `user_id` y crearia politicas para que cada usuario solo vea sus propias tareas.

---

## 6. Flujo de la aplicacion

### Paso 1: La app carga

Cuando el usuario entra en la pagina, `useEffect` ejecuta `cargarTareas()`.

Esa funcion consulta Supabase:

```js
supabase
  .from('tareas')
  .select('*')
  .order('created_at', { ascending: false });
```

Esto trae las tareas mas recientes primero.

### Paso 2: El usuario crea una tarea

El formulario pide:

- Titulo.
- Descripcion opcional.

Antes de guardar, valido que el titulo no este vacio.

Si es valido, inserto la tarea:

```js
supabase
  .from('tareas')
  .insert({ titulo, descripcion })
  .select()
  .single();
```

Uso `.select().single()` para recibir la tarea creada y agregarla inmediatamente al estado local sin recargar la pagina.

### Paso 3: El usuario completa una tarea

Cuando pulsa completar, se actualiza el campo `completada` con el valor contrario:

```js
update({ completada: !tarea.completada })
```

Despues actualizo el estado local para que la interfaz refleje el cambio al momento.

### Paso 4: El usuario elimina una tarea

Cuando pulsa eliminar, se borra por `id`:

```js
delete().eq('id', id)
```

Si Supabase responde sin error, quito esa tarea del estado local.

---

## 7. Manejo de errores

Cada operacion revisa si Supabase devuelve `error`.

Si hay error, se muestra un mensaje en pantalla en vez de romper la app.

Esto es importante porque en una entrevista tecnica no basta con que funcione el caso feliz. Tambien hay que demostrar que se controla lo que pasa cuando falla la base de datos, los permisos o la conexion.

---

## 8. Decisiones importantes

### Por que no hardcodear las llaves

Las llaves de Supabase no van escritas directamente en el codigo.

Van en `.env.local` para separar configuracion del codigo fuente.

### Por que usar estado local

Uso `useState` para que la interfaz se actualice sin recargar la pagina.

Cuando creo, completo o elimino una tarea, actualizo el estado local despues de confirmar que Supabase respondio correctamente.

### Por que no hay autenticacion

No se implemento autenticacion porque el enunciado dice que no hace falta.

Si se pidiera autenticacion, agregaria:

- Supabase Auth.
- Columna `user_id` en `tareas`.
- RLS activado.
- Politicas por usuario.
- Proteccion de rutas si fuera necesario.

---

## 9. Como defenderlo en entrevista

Si me preguntan donde se inicializa Supabase:

> En `lib/supabaseClient.js`. Ahi creo el cliente con la URL y la llave publica desde variables de entorno.

Si me preguntan por que uso `NEXT_PUBLIC_`:

> Porque el cliente se usa desde el navegador. Next.js solo expone al frontend las variables que empiezan por `NEXT_PUBLIC_`.

Si me preguntan que pasa si falla Supabase:

> La app guarda el error en estado y lo muestra en pantalla. No deja la pagina rota ni silenciosa.

Si me preguntan como se actualiza la lista:

> Al crear, uso la respuesta de Supabase y agrego la nueva tarea al estado local. Al completar, actualizo la tarea en el estado. Al eliminar, la filtro del estado.

Si me preguntan por seguridad:

> Para esta prueba no hay login y el enunciado permite no activar RLS. En produccion activaria RLS y cada tarea tendria `user_id`.

---

## 10. Como probar el proyecto

1. Levantar Supabase local.
2. Confirmar que existe la tabla `tareas`.
3. Confirmar que `.env.local` tiene:

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

4. Ejecutar Next.js:

```bash
npm run dev
```

5. Abrir:

```txt
http://localhost:3000
```

6. Probar el CRUD:

- Crear una tarea.
- Recargar la pagina y comprobar que persiste.
- Marcarla como completada.
- Volverla a pendiente.
- Eliminarla.

---

## 11. Resumen final

Este proyecto cumple el flujo principal de la prueba tecnica:

- Tiene CRUD funcional.
- Usa Supabase para persistencia.
- Usa variables de entorno.
- Maneja errores visibles.
- Actualiza la interfaz sin recargar.
- Mantiene una estructura simple y defendible para nivel junior.
