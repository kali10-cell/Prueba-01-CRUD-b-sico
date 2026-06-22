# Prueba Técnica — Notas Privadas

**Empresa:** NoteVault (startup ficticia)
**Puesto:** Desarrollador/a Web Junior-Mid
**Tiempo estimado:** 3-4 horas
**Nivel:** Junior-Mid

---

## Contexto

NoteVault es una app de notas personales donde cada usuario tiene sus notas privadas. Acabamos de decidir migrar la autenticación a Supabase Auth y necesitamos una implementación limpia que sea segura.

El requisito más importante es la seguridad: **ningún usuario debe poder ver las notas de otro usuario**, ni aunque manipule las peticiones directamente.

---

## Lo que debes construir

Una aplicación web con autenticación donde cada usuario gestiona sus propias notas privadas.

### Funcionalidades requeridas

**Autenticación:**
- [ ] Registro con email y contraseña
- [ ] Login con email y contraseña
- [ ] Logout
- [ ] Redirección automática: usuarios no autenticados van al login, usuarios autenticados no ven el login

**Notas:**
- [ ] Ver la lista de notas del usuario autenticado (solo las suyas)
- [ ] Crear una nueva nota con título y contenido
- [ ] Eliminar una nota propia

**Seguridad:**
- [ ] Row Level Security (RLS) configurado correctamente en Supabase
- [ ] Un usuario nunca puede ver, editar ni borrar notas de otro usuario, aunque intente manipular las peticiones

### Funcionalidades opcionales (valoradas, no obligatorias)
- [ ] Editar el contenido de una nota
- [ ] Mostrar el email del usuario autenticado en la interfaz
- [ ] Página de perfil básica

### Lo que NO necesitas construir
- Recuperación de contraseña (aunque Supabase lo soporta)
- OAuth (Google, GitHub, etc.)
- Tests automatizados

---

## Stack requerido

- **Next.js** (sin TypeScript)
- **Supabase** — Auth + Base de datos con RLS
- **Vercel** — para el deploy

---

## Base de datos

Estructura recomendada:

```sql
-- La tabla de usuarios la gestiona Supabase Auth automáticamente (auth.users)
-- Solo necesitas crear la tabla de notas:

create table notas (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  titulo text not null,
  contenido text,
  created_at timestamp with time zone default now()
);

-- Activar RLS (obligatorio para esta prueba)
alter table notas enable row level security;

-- Políticas de acceso (debes implementarlas tú)
-- Pista: necesitas políticas para SELECT, INSERT y DELETE
```

**Importante:** Las políticas RLS son parte del enunciado. Debes implementarlas tú. Si no sabes cómo, consulta la documentación de Supabase sobre Row Level Security.

---

## Credenciales de prueba para la defensa

Crea al menos **dos usuarios de prueba** en tu app y ponlos en el README:

```
Usuario 1: test1@ejemplo.com / contraseña123
Usuario 2: test2@ejemplo.com / contraseña123
```

Durante la defensa demostrarás que el Usuario 1 no puede ver las notas del Usuario 2.

---

## Criterios de evaluación

| Criterio | Peso |
|---|---|
| Seguridad: RLS correctamente configurado y funcionando | Muy alto |
| Autenticación: flujo completo de registro, login y logout | Alto |
| Redirección: protección de rutas privadas | Alto |
| Notas: CRUD básico funcionando para el usuario autenticado | Alto |
| Manejo de errores de autenticación (email ya registrado, contraseña incorrecta) | Medio |
| Código legible y organizado | Medio |
| README con instrucciones y credenciales de prueba | Medio |

---

## Entregables

1. **Repositorio en GitHub** con el código
2. **Deploy en Vercel** (funcionando)
3. **README.md** rellenado (con credenciales de prueba incluidas)

Plazo: **48 horas**.

---

## Pregunta que te harán en la defensa

*"Abre las DevTools de Chrome. Encuentra la petición a Supabase que trae las notas. ¿Qué pasaría si cambias el `user_id` en esa petición para intentar ver las notas de otro usuario?"*

Prepárate para responder esto y demostrarlo en vivo.
