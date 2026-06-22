# [Nombre del proyecto]

> Copia este archivo como `README.md` en tu proyecto y rellena cada sección. No borres los comentarios en cursiva — te guían qué escribir.

---

## ¿Qué es esto?

*Describe en 2-3 frases qué hace la app. Imagina que se lo explicas a alguien que no te ha visto trabajar.*

---

## Demo

- **Deploy:** [URL de Vercel aquí]
- **Repositorio:** [URL de GitHub aquí]

*Si hay credenciales de prueba para acceder, ponlas aquí.*

---

## Tecnologías usadas

- Next.js (Pages Router / App Router — indica cuál)
- Supabase (Auth / Base de datos / Storage — indica qué usaste)
- Vercel
- *Cualquier otra librería relevante*

---

## Cómo correrlo en local

```bash
# 1. Clonar el repositorio
git clone [URL]
cd [nombre-proyecto]

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus credenciales de Supabase

# 4. Arrancar en desarrollo
npm run dev
```

### Variables de entorno necesarias

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

*Si necesitas crear tablas en Supabase, describe aquí los pasos o incluye el SQL.*

---

## Decisiones técnicas

*Esta sección es importante. Explica el POR QUÉ de tus decisiones, no el qué.*

**Ejemplos de lo que deberías escribir aquí:**
- "Usé SSR en la página de detalle porque los datos cambian frecuentemente y necesitamos SEO."
- "Elegí guardar el estado del formulario en el componente y no en Context porque solo lo usa un componente."
- "Usé `useEffect` con array vacío para cargar los datos al montar porque solo necesitamos cargarlos una vez."

---

## Qué usé de IA y para qué

*Sé honesto. Esto no penaliza — muestra que sabes usar herramientas modernas.*

Ejemplos:
- "Usé ChatGPT para entender cómo configurar las políticas RLS de Supabase."
- "Usé Copilot para autocompletar los fetch calls a Supabase."
- "No usé IA, lo implementé consultando la documentación oficial."

---

## Qué mejoraría con más tiempo

*Muestra que eres capaz de evaluar tu propio trabajo.*

- [ ] *Algo que no llegaste a implementar*
- [ ] *Algo que funciona pero podrías hacer mejor*
- [ ] *Tests*
- [ ] *Otro*

---

## Lo que aprendí con esta prueba

*Opcional pero muy valorado. 2-3 frases sobre algo nuevo que aprendiste o algo que entendiste mejor.*
