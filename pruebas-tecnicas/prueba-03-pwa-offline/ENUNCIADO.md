# Prueba Técnica — App de Recetas Offline

**Empresa:** CocinaFácil (startup ficticia)
**Puesto:** Desarrollador/a Web Mid
**Tiempo estimado:** 3-4 horas
**Nivel:** Mid

---

## Contexto

CocinaFácil es una app de recetas de cocina. Nuestros usuarios la usan en la cocina, donde el WiFi a veces falla. El equipo ha decidido que la app **debe funcionar offline**: si un usuario ya cargó las recetas una vez, debe poder verlas aunque no tenga conexión.

Además, queremos que la app sea **instalable** (que aparezca el botón "Añadir a pantalla de inicio" en Chrome/Android).

---

## Lo que debes construir

Una Progressive Web App de recetas que funcione sin conexión a internet.

### Funcionalidades requeridas

**App base:**
- [ ] Página principal con lista de recetas (cargadas desde Supabase)
- [ ] Página de detalle de cada receta (título, ingredientes, pasos)
- [ ] Navegación entre lista y detalle

**PWA:**
- [ ] La app funciona offline después de haber sido visitada con conexión (las recetas ya cargadas se ven sin internet)
- [ ] La app es instalable (cumple los criterios de instalabilidad de Chrome)
- [ ] Indicador visual de estado online/offline (el usuario sabe si tiene conexión)
- [ ] Web App Manifest correcto (nombre, iconos, colores, display standalone)

### Funcionalidades opcionales
- [ ] Página de error offline elegante cuando se intenta acceder a una receta no cacheada
- [ ] Botón "Guardar receta para offline" que cachea una receta específica a petición del usuario
- [ ] Notificación cuando vuelve la conexión

### Lo que NO necesitas construir
- Autenticación
- CRUD de recetas (solo lectura es suficiente)
- Tests

---

## Stack requerido

- **Next.js** (sin TypeScript) + **`next-pwa`**
- **Supabase** — para almacenar las recetas
- **Vercel** — para el deploy

**Nota importante:** Las PWA con Service Worker requieren HTTPS para funcionar. En Vercel tienes HTTPS automáticamente. En local, `next-pwa` está configurado para desactivarse en desarrollo por defecto — esto es correcto.

---

## Base de datos

```sql
create table recetas (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  descripcion text,
  ingredientes text[],  -- array de strings
  pasos text[],         -- array de strings con los pasos
  imagen_url text,
  tiempo_minutos integer,
  created_at timestamp with time zone default now()
);

-- RLS: acceso de solo lectura para todos (anon)
alter table recetas enable row level security;
create policy "recetas son publicas" on recetas
  for select using (true);
```

Crea al menos 5-6 recetas de ejemplo para que la app tenga contenido.

---

## Configuración de next-pwa

Aquí tienes la configuración base. Deberás adaptarla:

```js
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  // Aquí puedes añadir runtimeCaching personalizado
});

module.exports = withPWA({
  // tu configuración de Next.js
});
```

---

## Criterios de evaluación

| Criterio | Peso |
|---|---|
| La app funciona offline (recetas ya vistas disponibles sin conexión) | Muy alto |
| La app es instalable y el manifest está correcto | Alto |
| Indicador online/offline visible y funcional | Alto |
| Lighthouse PWA score: mínimo 70 puntos | Alto |
| Estrategia de caché justificada en el README | Medio |
| Código organizado | Medio |
| UI usable | Bajo |

---

## Cómo verificar que funciona offline

1. Abre la app en Chrome con conexión
2. Navega a varias recetas
3. Abre DevTools → Application → Service Workers → "Offline" checkbox
4. Recarga la página — las recetas visitadas deben seguir apareciendo

---

## Entregables

1. **Repositorio en GitHub**
2. **Deploy en Vercel** (la PWA solo funciona completamente en HTTPS)
3. **README.md** con:
   - Instrucciones de setup
   - Qué estrategia de caché elegiste y por qué
   - Captura del score de Lighthouse PWA

Plazo: **48 horas**.

---

## Pregunta que te harán en la defensa

*"Explícame qué estrategia de caché elegiste para las peticiones a Supabase y por qué. ¿Cuándo quedaría desactualizado el contenido?"*
