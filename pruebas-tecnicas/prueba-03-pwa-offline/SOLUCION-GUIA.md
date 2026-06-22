# Guía de Solución — Prueba 03: PWA Offline

**DOCUMENTO PARA EL PROFESOR — No compartir con alumnos**

---

## Arquitectura recomendada

```
/pages
  index.js          → lista de recetas
  recetas/[id].js   → detalle de receta
/lib
  supabaseClient.js
/public
  manifest.json     → generado por next-pwa o manual
  icon-192.png
  icon-512.png
  sw.js             → generado por next-pwa (no editar manualmente)
next.config.js      → configuración de next-pwa
```

---

## Configuración completa esperada

### next.config.js

```js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      // Cache primero para assets estáticos
      urlPattern: /^https:\/\/.*\.supabase\.co\/.*$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'supabase-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24, // 24 horas
        },
      },
    },
  ],
});

module.exports = withPWA({});
```

**Por qué NetworkFirst para Supabase:** queremos datos frescos cuando hay conexión, pero fallback a caché cuando no hay. Cache First haría que los datos nunca se actualizaran.

### manifest.json (en /public)

```json
{
  "name": "CocinaFácil — Recetas",
  "short_name": "Recetas",
  "description": "Recetas de cocina que funcionan offline",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#f97316",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Indicador online/offline

```js
// Hook personalizado
import { useState, useEffect } from 'react';

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Estado inicial real
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
```

---

## Criterios de instalabilidad (lo que Lighthouse comprueba)

Para que Chrome muestre el banner de instalación, la app debe:
1. Tener un manifest con `name`, `short_name`, `start_url`, `display: standalone`
2. Tener iconos de al menos 192x192 y 512x512
3. Tener un Service Worker registrado
4. Servirse sobre HTTPS

Si alguno falta, Lighthouse marcará "Not installable".

---

## Errores comunes

- `disable: process.env.NODE_ENV === 'development'` no puesto → el SW en local cachea cosas y rompe el hot reload de Next.js
- Manifest sin los iconos correctos → no installable
- No añadir el `<link rel="manifest">` en `_document.js` (aunque `next-pwa` lo hace automáticamente si está configurado)
- No manejar el estado de hidratación del `navigator.onLine` → error de SSR porque `window` no existe en el servidor

---

## Preguntas de defensa

1. **"Abre DevTools → Application → Service Workers. ¿Está registrado el SW? ¿Qué versión es?"**
   - Deben ver el SW activo. Si no está, hay un problema de configuración.

2. **"Activa el modo offline en DevTools y recarga la página. ¿Qué ves?"**
   - La lista de recetas debe aparecer (cacheada). Si no, la caché no funciona.

3. **"¿Qué estrategia de caché elegiste para las peticiones a Supabase y por qué?"**
   - Respuesta buena: NetworkFirst porque quiero datos frescos cuando hay conexión y fallback a caché cuando no.
   - Respuesta mediocre: CacheFirst. Funciona offline pero los datos pueden quedar obsoletos indefinidamente.

4. **"¿Qué pasaría si actualizas una receta en Supabase? ¿Cuándo lo vería el usuario?"**
   - Con NetworkFirst: lo ve la próxima vez que tenga conexión (o tras 24h de expiración de caché).
   - Con CacheFirst: no lo ve hasta que la caché expire o el Service Worker se actualice.

5. **"¿Cómo verificas que la app es installable? ¿Qué criterios debe cumplir?"**
   - Ver sección de criterios de instalabilidad arriba.

6. **"¿Por qué el Service Worker no funciona en localhost durante el desarrollo?"**
   - `next-pwa` lo desactiva intencionalmente. La razón: el SW en desarrollo puede cachear respuestas y romper el hot module replacement.

---

## Puntuación detallada

| Ítem | Puntos |
|---|---|
| App funciona offline después de primera visita con conexión | 7 pts |
| App es installable (Lighthouse confirma) | 5 pts |
| Manifest correcto (iconos, colores, display standalone) | 3 pts |
| Indicador online/offline funcional | 3 pts |
| Estrategia de caché justificada en README | 3 pts |
| Lighthouse PWA score ≥ 70 | 2 pts |
| Código organizado | 2 pts |
| **Total** | **25 pts** |

Escala: 22+ excelente / 17-21 bien / 12-16 suficiente / <12 insuficiente
