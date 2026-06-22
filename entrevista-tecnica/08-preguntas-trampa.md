# Preguntas trampa clásicas

Estas 10 preguntas parecen sencillas pero tienen una trampa. La mayoría de candidatos las responden mal porque reaccionan rápido en vez de pensar. Estúdialas y entiende por qué la respuesta obvia es incorrecta.

---

### 1. "¿Next.js es mejor que React?"

**La trampa:** La pregunta asume que son competidores.

**La respuesta incorrecta:** "Sí, Next.js es más moderno y tiene más funcionalidades."

**La respuesta correcta:** Next.js *es* React. Es un framework construido sobre React que añade routing, SSR, optimizaciones y convenciones. No son comparables directamente: React es la librería de UI; Next.js decide cómo se estructura y sirve la app. Es como preguntar si Django es mejor que Python.

---

### 2. "¿Cuándo usarías `useEffect` con array de dependencias vacío `[]`?"

**La trampa:** La respuesta "cuando quiero que se ejecute solo una vez" es correcta pero incompleta.

**La respuesta incorrecta:** "Para ejecutar el efecto solo al montar el componente."

**La respuesta correcta:** Eso es correcto, pero hay que añadir que se ejecuta al montar *y la función de cleanup se ejecuta al desmontar*. Si metes algo en ese useEffect que no tiene cleanup y el componente se monta y desmonta (por navegación, renderizado condicional), puedes tener memory leaks o comportamientos inesperados. Mencionar esto demuestra que entiendes el ciclo de vida completo.

---

### 3. "¿Es malo usar `index` como `key` en listas de React?"

**La trampa:** La respuesta intuitiva es "sí, siempre es malo".

**La respuesta incorrecta:** "Sí, siempre hay que usar un ID único."

**La respuesta correcta:** Depende. El índice como key *es malo* cuando la lista puede reordenarse, filtrarse o tener elementos eliminados/insertados — React no puede distinguir qué elemento cambió y produce bugs de renderizado. Pero es *aceptable* para listas estáticas que nunca cambian de orden ni contenido. La respuesta matizada demuestra comprensión real.

---

### 4. "¿Hay algo malo en llamar a `setState` dentro de un `useEffect`?"

**La trampa:** La respuesta correcta no es ni "sí" ni "no".

**La respuesta incorrecta:** "No, es normal actualizar el estado en un efecto."

**La respuesta correcta:** No es malo per se, pero hay que tener cuidado. Si el estado que actualizas está en las dependencias del efecto, creas un bucle infinito: el efecto se ejecuta → actualiza el estado → el estado está en dependencias → el efecto se vuelve a ejecutar. La clave es tener claro qué entra en las dependencias y por qué.

---

### 5. "¿Las variables de entorno `NEXT_PUBLIC_` son seguras?"

**La trampa:** La pregunta implica que sí, porque las "has configurado" en el servidor.

**La respuesta incorrecta:** "Sí, están en el servidor y son seguras."

**La respuesta correcta:** No, son exactamente lo contrario. `NEXT_PUBLIC_` significa que se exponen al cliente — cualquiera puede verlas en el código fuente o en las DevTools. Son adecuadas para cosas que no son secretas (URL pública de Supabase, clave `anon`). Para claves secretas (`service_role`, API keys privadas) se usa una variable sin ese prefijo, que solo está disponible en el servidor.

---

### 6. "¿`const` hace que un objeto sea inmutable?"

**La trampa:** `const` y inmutabilidad suenan relacionados pero no lo son.

**La respuesta incorrecta:** "Sí, con `const` no puedes cambiar el objeto."

**La respuesta correcta:** `const` impide *reasignar* la referencia (no puedes hacer `obj = otraCosa`), pero el objeto en sí es perfectamente mutable: puedes modificar sus propiedades, añadir nuevas o borrarlas. Para inmutabilidad real necesitas `Object.freeze()` o librerías como Immer.

---

### 7. "¿RLS en Supabase me protege aunque no tenga validación en el frontend?"

**La trampa:** La respuesta correcta contradice la intuición de que "algo puede fallar".

**La respuesta incorrecta:** "No, siempre hay que validar también en el frontend por si acaso."

**La respuesta correcta:** Sí, RLS protege a nivel de base de datos independientemente del frontend. Si alguien hace una petición directa a la API de Supabase saltándose tu interfaz, RLS aplica igualmente — el usuario solo puede ver/modificar lo que las políticas permiten. La validación en frontend es para UX (feedback inmediato al usuario), no para seguridad.

---

### 8. "¿SSR es siempre mejor para SEO que CSR?"

**La trampa:** La respuesta intuitiva es "sí", y en 2019 era correcta, pero el contexto ha cambiado.

**La respuesta incorrecta:** "Sí, SSR siempre es mejor para SEO."

**La respuesta correcta:** En general sí, pero Google hoy día ejecuta JavaScript y puede indexar apps CSR. La diferencia en SEO entre SSR y CSR bien implementado es menor de lo que era. La ventaja real de SSR hoy es el rendimiento percibido (el usuario ve contenido antes) y la fiabilidad en buscadores que *no* son Google. Dar una respuesta matizada demuestra que estás al día.

---

### 9. "¿Una PWA puede reemplazar completamente a una app nativa?"

**La trampa:** Invita a una respuesta absoluta.

**La respuesta incorrecta:** "Sí, las PWA son igual de buenas que las apps nativas hoy día."

**La respuesta correcta:** Depende del caso de uso. Una PWA puede reemplazar muchas apps nativas para funciones web (noticias, ecommerce, dashboards). Pero tiene limitaciones: acceso limitado a hardware (Bluetooth, NFC, sensores avanzados), peor integración con el OS en iOS (Apple limita deliberadamente las PWA), no aparece en App Store (aunque sí en Google Play con Trusted Web Activities). Para apps que necesitan acceso profundo al hardware o distribución en App Store, la nativa sigue ganando.

---

### 10. "¿Es malo hacer muchas peticiones a Supabase desde el cliente?"

**La trampa:** La respuesta correcta no es solo "sí" o "no".

**La respuesta incorrecta:** "Sí, hay que hacer todas las peticiones desde el servidor."

**La respuesta correcta:** Depende. Peticiones desde el cliente (navegador) son perfectamente válidas y el patrón habitual con Supabase — de hecho es su modelo principal. El problema es hacer *N+1 queries* (una petición por cada elemento de una lista) o hacer queries innecesarias que podrían consolidarse. Hacer peticiones al servidor para luego llamar a Supabase añade latencia sin beneficio si los datos son del usuario autenticado y RLS está bien configurado. La API Route tiene sentido cuando necesitas la `service_role` key o lógica que no puede exponerse al cliente.
