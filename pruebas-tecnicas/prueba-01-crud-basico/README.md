# Gestor de tareas

## Que es esto?

Es una aplicacion web sencilla para gestionar una lista personal de tareas. Permite crear tareas con titulo y descripcion, marcarlas como completadas o pendientes, eliminarlas y mantener los datos guardados en Supabase.

El objetivo del proyecto es demostrar un CRUD completo conectado a una base de datos real, con manejo basico de errores y una interfaz usable.

## Demo

Deploy: https://buscar-trabajo.vercel.app

Repositorio: https://github.com/kali10-cell/Prueba-01-CRUD-b-sico

Credenciales de prueba: no aplica, esta prueba no usa login ni autenticacion.

## Tecnologias usadas

- Next.js con Pages Router.
- Supabase como base de datos.
- Vercel para deploy.
- React con `useState` y `useEffect`.
- CSS en objetos JavaScript dentro de la pagina principal.

## Como correrlo en local

```bash
# 1. Clonar el repositorio
git clone https://github.com/kali10-cell/Prueba-01-CRUD-b-sico.git
cd Prueba-01-CRUD-b-sico

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus credenciales de Supabase

# 4. Arrancar en desarrollo
npm run dev
```

Despues abre:

```txt
http://localhost:3000
```

## Variables de entorno necesarias

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Tambien se mantiene compatibilidad con:

```txt
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Uso variables `NEXT_PUBLIC_` porque el cliente de Supabase se ejecuta en el navegador. En Next.js, solo las variables con ese prefijo estan disponibles en el frontend.

## Tabla necesaria en Supabase

```sql
create table tareas (
  id uuid default gen_random_uuid() primary key,
  titulo text not null,
  descripcion text,
  completada boolean default false,
  created_at timestamp with time zone default now()
);
```

Para esta prueba no se usa autenticacion ni RLS. En local se dieron permisos a la tabla para poder operar con la llave publica:

```sql
grant select, insert, update, delete on public.tareas to anon;
grant select, insert, update, delete on public.tareas to authenticated;
```

En un proyecto real con usuarios, activaria RLS y cada tarea tendria un `user_id`.

## Decisiones tecnicas

Use Pages Router porque el ejercicio es pequeno y una sola pagina cubre bien el flujo solicitado. No hacia falta App Router ni una estructura mas compleja para resolver este CRUD.

Centralice la conexion a Supabase en `lib/supabaseClient.js` para no repetir configuracion y para que sea facil explicar donde se inicializa el cliente durante una entrevista tecnica.

Use `useEffect` con array vacio para cargar las tareas una vez al montar la pagina. Despues de crear, completar o eliminar una tarea, actualizo el estado local para que la interfaz cambie sin recargar.

Valido que el titulo no este vacio antes de insertar porque la base de datos tambien lo exige con `titulo text not null`. Asi el usuario recibe feedback antes de enviar datos invalidos.

Cada operacion revisa el `error` de Supabase y lo muestra en pantalla. Esto evita que la app falle silenciosamente si hay problemas de permisos, conexion o tabla.

No implemente autenticacion porque el enunciado indica que no es necesaria. Si el proyecto creciera, agregaria Supabase Auth, una columna `user_id`, RLS y politicas para que cada usuario solo acceda a sus tareas.

## Que use de IA y para que

Use IA como apoyo para revisar el flujo del ejercicio, corregir la configuracion de variables de entorno y preparar la defensa tecnica del proyecto.

Tambien la use para validar errores de Supabase durante el desarrollo, especialmente el problema de permisos sobre la tabla `tareas`.

El codigo final lo revise entendiendo cada parte: inicializacion del cliente, carga de datos, insercion, actualizacion, eliminacion y manejo de errores.

## Que mejoraria con mas tiempo

- Agregaria edicion de titulo y descripcion.
- Agregaria filtros por estado: todas, pendientes y completadas.
- Agregaria tests para comprobar crear, completar y eliminar tareas.
- Separaria la UI en componentes pequenos como `FormularioTarea` y `TareaItem`.
- Mejoraria la accesibilidad con labels visibles y estados de carga mas detallados.
- Si hubiera usuarios reales, implementaria autenticacion y RLS.

## Lo que aprendi con esta prueba

Reforce el flujo completo de conectar Next.js con Supabase desde el frontend usando variables de entorno. Tambien entendi mejor la diferencia entre crear una tabla y dar permisos para que la llave publica pueda operar sobre ella.

La parte mas importante fue comprobar que un CRUD no termina cuando el codigo compila: tambien hay que validar tabla, permisos, errores y persistencia real.
