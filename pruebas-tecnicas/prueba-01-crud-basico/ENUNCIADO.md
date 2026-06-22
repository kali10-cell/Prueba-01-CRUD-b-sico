# Prueba Técnica — Gestor de Tareas

**Empresa:** TaskFlow (startup ficticia)
**Puesto:** Desarrollador/a Web Junior
**Tiempo estimado:** 2-3 horas
**Nivel:** Junior

---

## Contexto

En TaskFlow estamos construyendo una herramienta de gestión de tareas sencilla para equipos pequeños. Necesitamos un prototipo funcional para mostrárselo a inversores la próxima semana.

No buscamos una app perfecta — buscamos código limpio, una UI usable y que el candidato entienda lo que ha construido.

---

## Lo que debes construir

Una aplicación web donde el usuario pueda gestionar su lista de tareas personal.

### Funcionalidades requeridas

**Obligatorias:**
- [ ] Ver la lista de tareas existentes
- [ ] Crear una nueva tarea con título (requerido) y descripción (opcional)
- [ ] Marcar una tarea como completada / no completada
- [ ] Eliminar una tarea
- [ ] Las tareas deben persistir en Supabase (si cierras el navegador, siguen ahí)

**Opcionales (valoradas positivamente, no obligatorias):**
- [ ] Editar el título o descripción de una tarea existente
- [ ] Filtrar tareas por estado (todas / pendientes / completadas)
- [ ] Indicador de cuántas tareas quedan pendientes
- [ ] Animación o feedback visual al completar una tarea

### Lo que NO necesitas construir
- Login o autenticación (la app es de un solo usuario por ahora)
- Tests automatizados
- Diseño elaborado (funcional y responsive es suficiente)

---

## Stack requerido

- **Next.js** (sin TypeScript) — versión Pages Router o App Router, tú decides
- **Supabase** — para persistir las tareas
- **Vercel** — para el deploy

No uses librerías de UI como Material UI o Chakra. CSS modules, Tailwind o CSS plano están bien.

---

## Base de datos

Deberás crear en Supabase la tabla necesaria. Aquí tienes la estructura mínima recomendada, pero puedes adaptarla:

```sql
create table tareas (
  id uuid default gen_random_uuid() primary key,
  titulo text not null,
  descripcion text,
  completada boolean default false,
  created_at timestamp with time zone default now()
);
```

No es necesario activar RLS para esta prueba (no hay autenticación). Si lo activas, asegúrate de que funcione con la `anon key`.

---

## Criterios de evaluación

El código será revisado prestando atención a:

| Criterio | Peso |
|---|---|
| Funcionalidad: las 5 operaciones funcionan correctamente | Alto |
| Manejo de errores: la app no explota si algo falla | Alto |
| Código legible: nombres de variables/funciones claros, sin código muerto | Medio |
| UI responsive: se ve bien en móvil y escritorio | Medio |
| README: instrucciones claras de setup local + URL del deploy | Medio |
| Funcionalidades opcionales implementadas | Bajo |

---

## Entregables

1. **Repositorio en GitHub** (público) con el código
2. **Deploy funcionando en Vercel** con la URL en el README
3. **README.md** rellenado con la plantilla proporcionada

Plazo: **48 horas** desde la entrega del enunciado.

---

## Preguntas frecuentes

**¿Puedo usar IA?** Sí. La defensa técnica posterior evaluará que entiendes lo que has entregado.

**¿El diseño importa mucho?** No mucho. Que sea usable y responsive es suficiente. Un diseño elaborado no compensa funcionalidades rotas.

**¿Qué pasa si no termino todo?** Entrega lo que tengas funcionando. En el README explica qué te faltó y cómo lo habrías implementado.
