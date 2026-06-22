# Guía de Solución — Prueba 01: CRUD básico

**DOCUMENTO PARA EL PROFESOR — No compartir con alumnos**

---

## Arquitectura recomendada

```
/pages
  index.js          (lista de tareas + formulario de creación)
  
/lib
  supabaseClient.js (inicialización del cliente de Supabase)

/components
  TareaItem.js      (componente de una tarea individual)
  FormularioTarea.js (formulario de creación/edición)
```

O en App Router:
```
/app
  page.js
/lib
  supabaseClient.js
/components
  ...
```

Ambas estructuras son válidas. Lo importante es que haya separación de responsabilidades.

---

## Implementación clave esperada

### Cliente de Supabase

```js
// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default supabase;
```

### Operaciones CRUD

```js
// Leer tareas
const { data, error } = await supabase
  .from('tareas')
  .select('*')
  .order('created_at', { ascending: false });

// Crear tarea
const { data, error } = await supabase
  .from('tareas')
  .insert({ titulo, descripcion })
  .select()
  .single();

// Actualizar (marcar completada)
const { error } = await supabase
  .from('tareas')
  .update({ completada: !tarea.completada })
  .eq('id', tarea.id);

// Eliminar
const { error } = await supabase
  .from('tareas')
  .delete()
  .eq('id', id);
```

---

## Puntos clave que el alumno debe haber resuelto

1. **Manejo del `error`** — Si no verifica `if (error)` tras cada operación, penalizar.
2. **Actualización optimista o reactiva** — Al crear/borrar, la lista debe actualizarse sin recargar la página. Puede hacerse con estado local (`useState`) o volviendo a hacer fetch.
3. **Variables de entorno** — Las claves de Supabase deben estar en `.env.local` y NO hardcodeadas.
4. **Responsive** — Al menos que no se rompa en móvil.

---

## Errores comunes que verás

- Guardar las claves de Supabase directamente en el código fuente
- No manejar el estado de carga (spinner/disabled mientras se hace el fetch)
- `useEffect` sin array de dependencias → bucle infinito
- No actualizar el estado local tras una operación (la lista no refleja los cambios hasta refrescar)

---

## Preguntas de defensa

Estas preguntas se hacen al alumno durante la revisión oral del código. El objetivo es verificar que entiende lo que ha entregado, no memorizar.

1. **"Muéstrame dónde inicializas el cliente de Supabase. ¿Por qué usas `NEXT_PUBLIC_` en las variables de entorno?"**
   - Respuesta esperada: porque el cliente se usa en el navegador (frontend), y las variables sin ese prefijo solo están disponibles en el servidor.

2. **"Si ahora mismo alguien hace una petición directa a tu API de Supabase desde Postman, ¿puede leer o borrar todas las tareas?"**
   - Respuesta esperada: Sí, porque no hay RLS activado. Debería reconocer esta limitación y explicar cómo se resolvería con RLS y autenticación.

3. **"¿Qué pasa si la petición a Supabase falla? ¿Qué ve el usuario?"**
   - Buena respuesta: muestra un mensaje de error. Respuesta mediocre: "no pasa nada" o "se queda igual".

4. **"¿Cómo actualizas la lista tras crear una tarea? Explícame el flujo."**
   - Puede ser: re-fetch completo, o añadir el nuevo item al estado local. Ambos son válidos. Lo que no vale es no tener respuesta.

5. **"¿Por qué estructuraste el proyecto así? ¿Habrías cambiado algo?"**
   - No hay respuesta incorrecta, pero debe reflexionar sobre sus propias decisiones.

6. **"¿Qué añadirías si tuvieras que añadir autenticación ahora?"**
   - Respuesta esperada: Supabase Auth, RLS en la tabla, columna `user_id`, protección de rutas.

---

## Criterios de puntuación detallados

| Ítem | Puntos |
|---|---|
| Las 5 operaciones (leer, crear, completar, eliminar) funcionan | 2 pts c/u = 10 pts |
| Manejo de errores con feedback al usuario | 3 pts |
| Código legible y organizado | 3 pts |
| Variables de entorno correctas | 2 pts |
| UI responsive | 2 pts |
| README completo con deploy | 2 pts |
| Funcionalidades opcionales | hasta 3 pts extra |
| **Total base** | **22 pts** |

Escala: 18+ excelente / 14-17 bien / 10-13 suficiente / <10 insuficiente
