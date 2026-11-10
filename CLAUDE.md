# Entreno — PWA personal de seguimiento de rutinas

## Contexto
- App de uso exclusivamente personal (Felipe). No es pública ni comercial: sin cuentas, sin backend, sin analítica.
- Los datos viven en `localStorage` del dispositivo (`entreno:v1`). El respaldo es exportar/importar JSON.

## Stack y reglas
- HTML + CSS + JavaScript puro con módulos ES. **Sin dependencias ni paso de build**; no añadir frameworks ni paquetes npm sin preguntar.
- Interfaz y textos en español. Pensada primero para móvil.
- Pesos siempre en kg. Las sesiones guardan una copia del nombre y tipo del ejercicio; el historial se agrupa por `key` (nombre normalizado, ver `stats.key`).
- Tipos de ejercicio: `weight_reps`, `reps_only`, `duration`, `check` (solo marcar). Tipos de serie: `normal`, `warmup`, `dropset`, `failure`.

## Rutina
- La rutina incluida es **Método Zero** (programa de 12 semanas, calistenia) en `js/rutina.js`, con 5 grupos: Tirón y empuje, Piernas, Estiramientos, Fullbody y Misión repeticiones. No van atados a un día: al abrir un grupo se pregunta la fecha para el registro.
- Solo la sección **Misión repeticiones** tiene objetivos por semana (`weekly`); las progresiones de las demás van en `notes`.
- La semana del programa se calcula desde `state.programStart` (lunes de inicio) y se puede cambiar en Ajustes.
- Al cambiar la rutina, **sube `version`** para que se recargue en el dispositivo (solo si el usuario no la editó desde la app).

## Guía de ejercicios
- `js/guia.js`: explicaciones propias en español + foto por ejercicio. Cada ejercicio de la rutina enlaza con `guia: [ids]`.
- Fotos solo con licencia libre de Wikimedia Commons, guardadas en `img/ejercicios/` (`tools/convertir-fotos.ps1`) y siempre con crédito (autor, licencia, enlace). No copiar textos ni fotos con copyright.
- Si no hay foto libre, el ejercicio usa `video` (búsqueda en YouTube).
- DAREBEE: solo enlaces (`darebee: {slug, similar?}`), abiertos con Google Translate. Sus términos prohíben incluir su material en apps: no copiar sus imágenes ni textos.

## Service worker
- Si cambias archivos de la app, sube `CACHE` en `sw.js` y añade los archivos nuevos a `ASSETS`.

## Íconos
- Se generan desde `icons/logo.jpg` con `powershell -ExecutionPolicy Bypass -File tools/generar-iconos.ps1` (192, 512 y apple-touch 180).

## Publicación
- GitHub Pages desde `main` (raíz): https://ffierron.github.io/Entrenamiento/ — cada `git push` a `main` republica.

## Probar
- `node dev-server.mjs` → http://localhost:5173 (configuración `entreno` en `.claude/launch.json`).
