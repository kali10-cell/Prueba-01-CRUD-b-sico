# Rúbrica de Evaluación

Sirve para dos momentos: el **simulacro de entrevista** (el compañero evalúa al candidato) y la **defensa técnica de la prueba** (el profesor evalúa al alumno).

---

## Para el simulacro de entrevista

El entrevistador puntúa al candidato en estas tres dimensiones al final de la sesión:

### 1. Claridad de explicación (1-5)

| Puntuación | Descripción |
|---|---|
| 1 | Las respuestas son confusas o incoherentes. Difícil de seguir. |
| 2 | Se entiende la idea pero la explicación es desordenada o imprecisa. |
| 3 | Respuestas claras para alguien técnico. Usa ejemplos a veces. |
| 4 | Explica bien y con ejemplos concretos. Adapta el nivel. |
| 5 | Explicaciones claras, precisas y con ejemplos. Podría explicárselo a alguien no técnico. |

### 2. Gestión del "no sé" (1-5)

| Puntuación | Descripción |
|---|---|
| 1 | Inventa respuestas incorrectas con seguridad. |
| 2 | Se bloquea, se pone nervioso o evita la pregunta. |
| 3 | Dice "no sé" pero se queda ahí, sin más. |
| 4 | Dice "no sé" con naturalidad y explica cómo lo buscaría. |
| 5 | "No sé, pero lo averiguaría en [fuente específica] y creo que podría estar relacionado con [algo que sí sabe]." |

### 3. Profundidad técnica (1-5)

| Puntuación | Descripción |
|---|---|
| 1 | Solo conoce la superficie. No puede ir más allá de definiciones. |
| 2 | Entiende el concepto básico pero no los detalles ni los casos límite. |
| 3 | Buen conocimiento de los conceptos. Puede dar ejemplos del stack. |
| 4 | Entiende el concepto, sus limitaciones y casos de uso. Conecta ideas. |
| 5 | Profundidad real. Menciona trade-offs, alternativas y casos donde el enfoque falla. |

**Puntuación total: /15**

---

## Para la defensa técnica de la prueba

El profesor evalúa al alumno después de revisar el código entregado:

### 1. Funcionalidad (1-5)
- 1: No funciona o falta más de la mitad de los requisitos
- 3: Funciona el flujo principal con algún bug menor
- 5: Todo funciona según el enunciado, incluyendo casos de error

### 2. Calidad del código (1-5)
- 1: Código difícil de leer, variables sin nombre significativo, sin estructura
- 3: Código legible, estructura razonable, algún antipatrón
- 5: Código limpio, bien organizado, manejo de errores, sin código muerto

### 3. Comprensión en la defensa (1-5)
- 1: No puede explicar lo que ha entregado
- 3: Explica el flujo general pero no los detalles técnicos
- 5: Explica cada decisión técnica, reconoce qué mejoraría y por qué

### 4. README y documentación (1-5)
- 1: Sin README o README vacío
- 3: README con instrucciones de instalación y descripción básica
- 5: README completo con decisiones técnicas, uso de IA documentado, y mejoras pendientes

### 5. Seguridad y buenas prácticas (1-5)
- 1: Claves expuestas en el código, sin RLS, sin manejo de errores
- 3: Variables de entorno correctas, RLS básico
- 5: RLS bien configurado, sin claves expuestas, validación de inputs, manejo de errores en UI

**Puntuación total: /25**

| Rango | Calificación |
|---|---|
| 23-25 | Excelente — listo para el mercado laboral |
| 18-22 | Bueno — necesita pulir detalles |
| 13-17 | Suficiente — necesita más práctica |
| < 13 | Insuficiente — revisar conceptos base |
