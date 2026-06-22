# JavaScript — Fundamentos

Preguntas de nivel junior a mid sobre JavaScript core. Son las más frecuentes en cualquier entrevista web.

---

## Closures y scope

### ¿Qué es un closure y para qué sirve?
**Respuesta esperada:** Un closure es una función que recuerda el entorno (las variables) en el que fue creada, aunque ese entorno ya no esté activo. Se usa para encapsular datos, crear funciones de fábrica, o mantener estado privado sin usar clases.

```js
function contador() {
  let count = 0;
  return function () {
    count++;
    return count;
  };
}
const incrementar = contador();
incrementar(); // 1
incrementar(); // 2
```

**Señal de alerta:** "Es cuando una función está dentro de otra." — Eso describe la sintaxis, no el concepto. Si no mencionan que la función interna *accede* a variables de la externa después de que ésta haya terminado, no lo han entendido.

**Pregunta de seguimiento:** ¿Por qué `count` no se resetea a 0 cada vez que llamas a `incrementar()`?

---

### ¿Cuál es la diferencia entre `var`, `let` y `const`?
**Respuesta esperada:**
- `var`: scope de función, se eleva (hoisting) con valor `undefined`, permite redeclarar
- `let`: scope de bloque, se eleva pero no se inicializa (temporal dead zone), no permite redeclarar
- `const`: igual que `let` pero no permite reasignación (ojo: los objetos sí son mutables)

**Señal de alerta:** "Con `const` no puedes cambiar el valor." — Incompleto. Un array o un objeto declarado con `const` sí puede modificarse internamente. Solo no puedes reasignar la referencia.

**Pregunta de seguimiento:** ¿Qué pasa si haces `const arr = [1,2,3]; arr.push(4);`?

---

### ¿Qué es el hoisting?
**Respuesta esperada:** JavaScript mueve las declaraciones de variables y funciones al principio de su scope antes de ejecutar el código. Las funciones declaradas con `function` se elevan completas (nombre y cuerpo). Las variables con `var` se elevan pero con valor `undefined`. Las de `let`/`const` se elevan pero no se pueden usar antes de su declaración (temporal dead zone).

**Señal de alerta:** "El hoisting sube el código." — Demasiado vago. Hay diferencia importante entre lo que pasa con `var` y con `let`/`const`.

**Pregunta de seguimiento:** ¿Por qué esto da `undefined` y no un error? `console.log(x); var x = 5;`

---

## Asincronía

### ¿Cómo funciona el event loop?
**Respuesta esperada:** JavaScript es single-thread. El event loop permite ejecutar código asíncrono sin bloquear: el hilo principal ejecuta el call stack. Las operaciones asíncronas (timers, peticiones) se delegan a Web APIs del navegador/Node. Cuando terminan, su callback se pone en la cola (queue). El event loop solo mueve callbacks de la cola al call stack cuando éste está vacío.

**Señal de alerta:** "El event loop ejecuta código asíncrono en paralelo." — No hay paralelismo real en el hilo JS. Todo pasa en el mismo hilo, el event loop solo gestiona cuándo se ejecuta cada callback.

**Pregunta de seguimiento:** ¿Qué se imprime primero? `setTimeout(() => console.log('A'), 0); console.log('B');`

---

### ¿Qué diferencia hay entre una Promise y async/await?
**Respuesta esperada:** `async/await` es azúcar sintáctico sobre Promises. Por debajo hacen lo mismo. La ventaja de `async/await` es que el código se lee de forma secuencial y el manejo de errores con `try/catch` es más natural que encadenar `.catch()`.

```js
// Con Promises
fetch('/api/datos')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// Con async/await
async function cargarDatos() {
  try {
    const res = await fetch('/api/datos');
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

**Señal de alerta:** "async/await es más moderno y mejor." — No es "mejor", es una cuestión de legibilidad. En algunos casos (Promise.all) las Promises son más expresivas.

**Pregunta de seguimiento:** ¿Cómo harías dos peticiones en paralelo con async/await?

---

### ¿Cómo ejecutas varias promesas en paralelo?
**Respuesta esperada:** Con `Promise.all([p1, p2, p3])`. Lanza todas en paralelo y espera a que todas resuelvan. Si una falla, falla todo. Si quieres que sigan aunque alguna falle, usa `Promise.allSettled`.

**Señal de alerta:** Usar `await` en un bucle `for...of` sin más — esto ejecuta las promesas en secuencia, no en paralelo. Es un error de rendimiento muy común.

**Pregunta de seguimiento:** ¿Qué diferencia hay entre `Promise.all` y `Promise.allSettled`?

---

## Inmutabilidad y estructuras de datos

### ¿Qué significa que un objeto es mutable en JS?
**Respuesta esperada:** En JavaScript los objetos y arrays se pasan por referencia. Mutarlos cambia el original. En React esto es especialmente importante: si mutas el estado directamente, React no detecta el cambio. Por eso se usan patrones como spread (`{...obj, clave: nuevoValor}`) para crear nuevos objetos en vez de modificar el existente.

**Señal de alerta:** "Los objetos son mutables, los primitivos no." — Correcto pero incompleto. Lo importante es entender por qué importa en React y cómo manejarlo.

**Pregunta de seguimiento:** ¿Por qué `setState(obj)` donde `obj` es el mismo objeto no rerenderiza el componente?

---

### ¿Qué hace el operador spread `...` y cuándo lo usas?
**Respuesta esperada:** Expande un iterable (array, objeto) en sus elementos individuales. Usos habituales: copiar arrays/objetos, mergear objetos, pasar arrays como argumentos, actualizar estado en React de forma inmutable.

```js
const original = { a: 1, b: 2 };
const copia = { ...original, b: 3 }; // { a: 1, b: 3 }
```

**Señal de alerta:** Confundirlo con rest parameters (que también usan `...` pero recogen argumentos).

**Pregunta de seguimiento:** ¿El spread hace una copia profunda o superficial?

---

## Módulos y organización

### ¿Qué diferencia hay entre `export default` y `export`?
**Respuesta esperada:** `export default` exporta un único valor por módulo, se importa con cualquier nombre. `export` (named export) puede haber varios por módulo, se importa con llaves y el nombre exacto. Next.js usa ambos: los componentes de página típicamente usan `export default`, las utilidades usan named exports.

**Señal de alerta:** No saber que pueden coexistir en el mismo archivo, o confundir la sintaxis de importación.

**Pregunta de seguimiento:** ¿Cómo importarías ambos tipos del mismo archivo?

---

## Miscelánea frecuente

### ¿Qué es el optional chaining `?.` y por qué es útil?
**Respuesta esperada:** Permite acceder a propiedades anidadas de un objeto sin que explote si alguna es `null` o `undefined`. Devuelve `undefined` en vez de lanzar un error. Muy útil cuando trabajas con datos de una API que pueden venir incompletos.

```js
const ciudad = usuario?.direccion?.ciudad; // undefined si algo es null
```

**Señal de alerta:** No conocerlo o confundirlo con el nullish coalescing operator `??`.

**Pregunta de seguimiento:** ¿Qué diferencia hay entre `?.` y `??`?

---

### ¿Qué es la desestructuración y cómo la usas en React?
**Respuesta esperada:** Permite extraer valores de arrays u objetos en variables de forma concisa. En React se usa constantemente: para los props, para el resultado de `useState`, para los datos de Supabase, etc.

```js
// Objeto
const { nombre, edad } = usuario;

// Array
const [count, setCount] = useState(0);

// Props
function Tarjeta({ titulo, descripcion }) { ... }
```

**Señal de alerta:** Solo conocerla para objetos y no para arrays, o no saber darle un alias (`const { nombre: name } = usuario`).

**Pregunta de seguimiento:** ¿Cómo desestructurarías un objeto con un nombre de propiedad que es una palabra reservada?

---

### ¿Qué diferencia hay entre `==` y `===`?
**Respuesta esperada:** `===` compara valor y tipo sin conversión. `==` hace coerción de tipos antes de comparar, lo que produce resultados sorprendentes (`0 == false` es `true`). En la práctica, siempre usar `===`.

**Señal de alerta:** "Son prácticamente lo mismo." — No lo son. La coerción de tipos es fuente clásica de bugs.

**Pregunta de seguimiento:** ¿Qué devuelve `null == undefined`? ¿Y `null === undefined`?

---

### ¿Qué es `this` en JavaScript?
**Respuesta esperada:** `this` hace referencia al contexto de ejecución. Su valor depende de cómo se llama la función, no de dónde se define. En funciones normales varía según el contexto; en arrow functions hereda el `this` del scope donde fueron definidas. En React con componentes de clase era importante; con hooks y funciones ya no es un problema habitual.

**Señal de alerta:** "Es el objeto donde está la función." — No siempre. En modo estricto una función suelta tiene `this = undefined`.

**Pregunta de seguimiento:** ¿Por qué las arrow functions no tienen su propio `this`?

---

### ¿Qué es el localStorage y cuándo lo usarías?
**Respuesta esperada:** API del navegador para guardar datos clave-valor de forma persistente (sobrevive al cierre del navegador). Solo guarda strings, así que hay que usar `JSON.stringify`/`JSON.parse`. Se usa para preferencias del usuario, tokens de sesión simples, estado ligero. No es seguro para datos sensibles (accesible desde JS, vulnerable a XSS). Supabase gestiona la sesión automáticamente, pero a veces se usa para preferencias de UI.

**Señal de alerta:** Proponer localStorage para guardar contraseñas o tokens de auth cuando hay una solución mejor (cookies httpOnly, Supabase session).

**Pregunta de seguimiento:** ¿Qué diferencia hay entre localStorage y sessionStorage?

---

### ¿Qué son los Web Workers?
**Respuesta esperada:** Permiten ejecutar código JavaScript en un hilo separado, sin bloquear el hilo principal. Útiles para cálculos pesados. Se comunican con el hilo principal mediante mensajes. No tienen acceso al DOM.

**Señal de alerta:** Confundirlos con Service Workers, que son distintos (interceptan peticiones de red, permiten funcionalidad offline).

**Pregunta de seguimiento:** ¿Qué diferencia hay entre un Web Worker y un Service Worker?
