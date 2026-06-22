# Guía de Solución — Prueba 02: Autenticación

**DOCUMENTO PARA EL PROFESOR — No compartir con alumnos**

---

## Arquitectura recomendada

```
/pages
  index.js          → redirige a /notas si hay sesión, si no a /login
  login.js          → formulario de login + enlace a registro
  registro.js       → formulario de registro
  notas.js          → lista de notas (ruta protegida)

/lib
  supabaseClient.js

/components
  ProtectedRoute.js (opcional — wrapper que redirige si no hay sesión)
```

---

## Implementación clave

### Auth: login y registro

```js
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
if (error) {
  setError(error.message); // mostrar al usuario
} else {
  router.push('/notas');
}

// Registro
const { data, error } = await supabase.auth.signUp({ email, password });

// Logout
await supabase.auth.signOut();
router.push('/login');
```

### Protección de rutas

```js
// En la página protegida (notas.js)
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabaseClient';

export default function Notas() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/login');
      } else {
        setUser(session.user);
      }
    });
  }, []);

  if (!user) return null; // o un spinner

  return <div>Notas de {user.email}...</div>;
}
```

Alternativa más robusta: usar middleware de Next.js para proteger rutas.

### RLS — Políticas esperadas

```sql
-- Activar RLS
alter table notas enable row level security;

-- El usuario solo ve sus notas
create policy "usuarios ven sus notas" on notas
  for select using (auth.uid() = user_id);

-- El usuario solo puede crear notas propias
create policy "usuarios crean sus notas" on notas
  for insert with check (auth.uid() = user_id);

-- El usuario solo puede borrar sus notas
create policy "usuarios borran sus notas" on notas
  for delete using (auth.uid() = user_id);
```

---

## El punto más crítico de esta prueba

**El RLS.** Un alumno que entregue auth funcional pero sin RLS ha fallado el requisito principal. Si alguien abre las DevTools y hace una petición manual con `curl` o Postman usando la `anon key`, debería recibir solo sus propias notas (o vacío).

Demuéstralo en la defensa:
1. Crea notas con el Usuario 1
2. Obtén su JWT desde las DevTools (Application → Local Storage → supabase)
3. Intenta acceder a las notas del Usuario 2 modificando el `user_id` en la petición
4. Con RLS correcto, recibirás array vacío — las políticas filtran a nivel de BD

---

## Errores comunes

- Activar RLS pero no crear las políticas → nadie puede leer nada (error 403)
- No añadir `user_id` en el INSERT → la política de INSERT falla
- Comparar `user_id` con el ID del objeto `user` en vez de `auth.uid()` en la política
- Proteger rutas solo con CSS o condicionales de React → un usuario que borra el `display:none` ve el contenido
- No manejar el estado de carga mientras se verifica la sesión → flash de contenido no autorizado

---

## Preguntas de defensa

1. **"Abre las DevTools. ¿Dónde guarda Supabase la sesión del usuario?"**
   - Respuesta: en localStorage bajo la clave `supabase.auth.token` o similar.

2. **"¿Qué pasaría si alguien usara la `anon key` de Supabase directamente desde Postman para hacer un SELECT a la tabla de notas sin estar autenticado?"**
   - Con RLS bien configurado: recibirá un array vacío (la política `auth.uid() = user_id` no se cumple para una petición anónima).

3. **"Muéstrame la política RLS que configuraste. Explica qué hace `auth.uid()`."**
   - `auth.uid()` devuelve el UUID del usuario autenticado según el JWT de la petición.

4. **"¿Cómo proteges la ruta `/notas` para que no sea accesible sin sesión?"**
   - Si usó `useEffect` + redirect: bien, pero tiene flash. Si usó middleware: mejor. Si solo usó un condicional sin redirect: insuficiente.

5. **"¿Qué mensaje ves si intentas registrarte con un email ya existente?"**
   - Deben tener manejo de errores que muestre el mensaje de Supabase al usuario.

6. **"Si el token de sesión expira, ¿qué pasa? ¿Cómo lo gestionas?"**
   - Respuesta honesta válida: "Supabase lo renueva automáticamente si el refresh token es válido. No lo gestioné manualmente." Eso está bien.

---

## Puntuación detallada

| Ítem | Puntos |
|---|---|
| RLS configurado y funcionando (bloqueando acceso cruzado) | 6 pts |
| Login funciona con manejo de errores | 4 pts |
| Registro funciona con manejo de errores | 3 pts |
| Logout funciona | 2 pts |
| Redirección correcta (protección de ruta privada) | 3 pts |
| CRUD de notas funcionando (solo las del usuario) | 4 pts |
| Código organizado | 2 pts |
| README con credenciales de prueba | 1 pt |
| **Total** | **25 pts** |

Escala: 22+ excelente / 17-21 bien / 12-16 suficiente / <12 insuficiente
