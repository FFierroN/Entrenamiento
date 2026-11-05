# Entreno

PWA personal para seguir mi rutina semanal de gimnasio: registrar series de forma rápida, con temporizador de descanso, historial y progreso por ejercicio. Funciona sin internet y los datos se quedan en el propio teléfono.

## Funciones
- **Hoy:** muestra el día de la rutina que toca según el día de la semana.
- **Entreno:** cada serie viene pre-rellenada con lo que hiciste la última vez; tocas ✓ y arranca el descanso.
- **Tipos de serie:** normal, calentamiento (C), dropset (D) y al fallo (F). Toca el número de la serie para cambiarlo.
- **Historial y progreso:** volumen, 1RM estimado, récords (🏆) y gráfica por ejercicio.
- **Guía de ejercicios:** explicación, consejos, errores comunes y foto de referencia (Wikimedia Commons, con créditos). Cada ejercicio de la rutina tiene un botón «ⓘ Ver cómo se hace».
- **Editor de rutina:** días, ejercicios, series, reps, peso, descanso y notas.
- **Copia de seguridad:** exportar e importar en JSON desde Ajustes.

## Probar en local
```
node dev-server.mjs
```
Abre http://localhost:5173

## Estructura
| Archivo | Qué hace |
|---|---|
| `index.html` | Estructura base, navegación y temporizador |
| `styles.css` | Estilos (tema oscuro, pensado para móvil) |
| `js/app.js` | Pantallas, navegación y acciones |
| `js/store.js` | Guardado en `localStorage` |
| `js/stats.js` | 1RM estimado, récords y volumen |
| `js/timer.js` | Temporizador de descanso |
| `js/rutina.js` | Rutina incluida en la app |
| `js/guia.js` | Guía de ejercicios (explicaciones y créditos de fotos) |
| `img/ejercicios/` | Fotos de referencia (licencias libres, Wikimedia Commons) |
| `tools/convertir-fotos.ps1` | Redimensiona fotos a JPG de 600 px |
| `sw.js` | Service worker (modo sin conexión) |
| `manifest.webmanifest` | Datos para instalar la app |
| `icons/logo.jpg` | Logo original de la app |
| `tools/generar-iconos.ps1` | Genera los íconos a partir del logo |
| `docs/` | Informe de ingeniería inversa de Hevy |
