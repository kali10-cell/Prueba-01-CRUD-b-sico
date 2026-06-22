# Guía de Solución — Prueba 04: Fullstack completa

**DOCUMENTO PARA EL PROFESOR — No compartir con alumnos**

---

## Arquitectura recomendada

```
/pages
  index.js              → feed público de recomendaciones
  login.js
  registro.js
  perfil/[username].js  → página de perfil pública
  perfil/editar.js      → editar mi perfil (ruta protegida)
  nueva.js              → publicar recomendación (ruta protegida)

/lib
  supabaseClient.js

/components
  TarjetaRecomendacion.js
  BotonLike.js
  FormularioPerfil.js
  NavBar.js
```

---

## Diseño de base de datos esperado

```sql
-- Tabla de perfiles (uno por usuario de auth)
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique,
  bio text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- Tabla de recomendaciones
create table recomendaciones (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  titulo_libro text not null,
  resena text not null,
  portada_url text,
  created_at timestamp with time zone default now()
);

-- Tabla de likes (relación muchos a muchos)
create table likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  recomendacion_id uuid references recomendaciones(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  unique(user_id, recomendacion_id)  -- evita duplicados a nivel de BD
);
```

**El `unique(user_id, recomendacion_id)` en `likes` es la pieza clave** para evitar duplicados. Un alumno que lo valide solo en el frontend no ha resuelto el problema correctamente.

---

## Políticas RLS esperadas

```sql
-- PROFILES
alter table profiles enable row level security;

create policy "perfiles son publicos" on profiles
  for select using (true);

create policy "usuario actualiza su perfil" on profiles
  for update using (auth.uid() = id);

create policy "usuario crea su perfil" on profiles
  for insert with check (auth.uid() = id);

-- RECOMENDACIONES
alter table recomendaciones enable row level security;

create policy "recomendaciones son publicas" on recomendaciones
  for select using (true);

create policy "usuario crea sus recomendaciones" on recomendaciones
  for insert with check (auth.uid() = user_id);

create policy "usuario borra sus recomendaciones" on recomendaciones
  for delete using (auth.uid() = user_id);

-- LIKES
alter table likes enable row level security;

create policy "likes son publicos" on likes
  for select using (true);

create policy "usuario da likes" on likes
  for insert with check (auth.uid() = user_id);

create policy "usuario quita sus likes" on likes
  for delete using (auth.uid() = user_id);
```

---

## Supabase Storage — Configuración esperada

Dos buckets:
1. `avatares` — imágenes de perfil
2. `portadas` — imágenes de portadas de libros

```sql
-- Política para avatares (el usuario solo sube su propio avatar)
create policy "usuarios suben su avatar" on storage.objects
  for insert with check (
    bucket_id = 'avatares' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatares son publicos" on storage.objects
  for select using (bucket_id = 'avatares');
```

---

## Flujo de likes esperado

```js
// Verificar si el usuario ya dio like
const { data: likeExistente } = await supabase
  .from('likes')
  .select('id')
  .eq('user_id', user.id)
  .eq('recomendacion_id', recomendacionId)
  .single();

if (likeExistente) {
  // Quitar like
  await supabase.from('likes').delete().eq('id', likeExistente.id);
} else {
  // Dar like
  await supabase.from('likes').insert({
    user_id: user.id,
    recomendacion_id: recomendacionId,
  });
}
```

El constraint `unique` en la BD es la defensa real contra duplicados. El código de arriba es para UX (saber si mostrar "❤️" o "🤍").

---

## Query del feed con datos relacionados

```js
const { data } = await supabase
  .from('recomendaciones')
  .select(`
    *,
    profiles(username, avatar_url),
    likes(count)
  `)
  .order('created_at', { ascending: false });
```

---

## Errores comunes en esta prueba

- **No crear la tabla `profiles`** y usar `auth.users` directamente — no se puede acceder a `auth.users` con la `anon key`
- **No crear el perfil automáticamente al registrar** — el usuario se queda sin perfil. Solución: trigger en PostgreSQL o crear el perfil manualmente tras el signup
- **Subir archivos sin validar tipo/tamaño** — acepta cualquier archivo incluyendo ejecutables
- **No usar el `unique constraint` en likes** — duplicados si el usuario hace click rápido
- **Bucket de Storage público pero sin política de upload** — cualquiera puede subir archivos
- **No manejar el estado de carga al subir imágenes** — la UX es confusa

---

## Trigger para crear perfil automáticamente (solución avanzada)

```sql
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

Si el alumno implementa esto, es una señal de nivel superior. La mayoría creará el perfil manualmente en el callback del signup.

---

## Preguntas de defensa

1. **"Muéstrame el esquema de tu base de datos. ¿Por qué tienes una tabla `profiles` separada de `auth.users`?"**
   - Respuesta esperada: Supabase gestiona `auth.users` internamente y no se puede modificar. `profiles` extiende los datos del usuario con información pública.

2. **"¿Cómo evitas que un usuario dé like dos veces a la misma recomendación?"**
   - Respuesta correcta: constraint `unique(user_id, recomendacion_id)` en la tabla `likes`. La validación en frontend es para UX, no para seguridad.
   - Respuesta incorrecta: "compruebo en el frontend si ya existe el like antes de insertarlo." — Race condition posible y no es seguro.

3. **"Si alguien hace una petición directa a Supabase para borrar la recomendación de otro usuario, ¿qué pasa?"**
   - Con RLS correcto: error 403. La política solo permite borrar donde `auth.uid() = user_id`.

4. **"¿Cómo subiste las imágenes a Storage? Muéstrame el código."**
   - Deben mostrar el `supabase.storage.from('bucket').upload()` con la ruta que incluye el `user_id`.

5. **"Si la app tuviera 10.000 usuarios, ¿qué cambiarías?"**
   - No hay respuesta perfecta. Se valora que piensen en: paginación del feed (obligatorio), índices en `created_at` y `user_id`, caché, CDN para imágenes. Un alumno que diga "no cambiaría nada" demuestra falta de reflexión.

6. **"¿Qué fue lo más difícil de esta prueba?"**
   - Evalúa la capacidad de reflexión. Respuesta honesta > respuesta que intenta impresionar.

---

## Puntuación detallada

| Ítem | Puntos |
|---|---|
| Auth completo (login, registro, logout, rutas protegidas) | 4 pts |
| Feed público funcionando con datos reales | 3 pts |
| Crear/borrar recomendaciones (solo las propias) | 3 pts |
| Sistema de likes sin duplicados (con constraint en BD) | 4 pts |
| Supabase Storage: avatares y portadas funcionando | 3 pts |
| RLS correcto en todas las tablas | 4 pts |
| Diseño de BD coherente (FKs, estructura) | 2 pts |
| README con SQL y decisiones técnicas | 2 pts |
| **Total** | **25 pts** |

Escala: 22+ excelente — listo para el mercado laboral / 17-21 bien / 12-16 necesita práctica / <12 insuficiente
