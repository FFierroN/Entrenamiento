# Ingeniería inversa de Hevy (web) — 2026-11-04

Dos fases:
1. **Estática (sin sesión):** REA capturó `https://hevy.com/login` y se analizaron los chunks JS públicos de Next.js.
2. **Autenticada:** con sesión iniciada por Felipe, un script CDP navegó (solo lectura) por inicio, rutinas, ejercicios, perfil, crear rutina, un perfil público, un entreno público y el progreso de un ejercicio, y guardó las respuestas JSON de `api.hevyapp.com`. No se guardaron cabeceras de autenticación.

Leyenda: **[O]** observado en respuesta real de la API · **[C]** visto en el código · **[I]** inferencia · **[?]** desconocido.

> La cuenta usada está vacía (0 rutinas, 0 entrenos), así que el esquema de **entreno** se confirmó con un entreno público de otro usuario. El esquema de **rutina** aún sale del código (no hay ninguna rutina para observar).

## 1. Arquitectura

| Pieza | Detalle |
|---|---|
| Frontend | Next.js (Pages Router) en Vercel **[C]** |
| API | REST JSON en `https://api.hevyapp.com`, cliente axios **[O]** |
| Auth | Email/contraseña, Google, Apple; token `auth2.0-token` **[C]** |
| Pagos | Paddle **[O]** |
| Medios | Vídeos y miniaturas de ejercicios en S3 (`pump-app.s3.eu-west-2.amazonaws.com/exercise-assets/…`) **[O]** |
| Registro de entrenos | La web no crea entrenos; solo los lee. El registro en vivo es de la app móvil **[C]** |

Cada página hace varias llamadas comunes en cada carga (`user/account`, `v2/user_preferences`, `user_subscription`, `paddle_prices`, `user_key_values`, `hevy_trainer/program`, `client_invites`, `clients_coach`) **[O]**.

## 2. Páginas → llamadas de API observadas **[O]**

| Página | Llamadas propias |
|---|---|
| `/` (feed) | `feed_workouts_paged`, `recommended_users`, `workout_count`, `follow_counts`, `user_workouts_paged?username&limit=2&offset=0` |
| `/routines` | `POST routines_sync_batch` (body `{}` → `{updated[], deleted[], isMore}`), `routine_folders`, `custom_exercise_templates`, `exercise_template_units` |
| `/exercise` | `custom_exercise_templates`, `exercise_template_units` (la biblioteca base va **embebida en el JS**, no se pide a la API) |
| `/exercise/:templateId` | `user_exercise_history_paged?exerciseTemplateId&offset`, `user_exercise_sets/:templateId/:fechaDesdeISO` |
| `/profile` | `user_calendar_workouts/:año/:mes`, `user_workout_metrics/duration/:unixDesde/:unixHasta`, `user_workout_images/:username/5`, `workout_count` |
| `/user/:username` | `user_profile/:username`, `user_workouts_paged` |
| `/workout/:id` | `workout/:id` |

Otros endpoints vistos en el código **[C]**: `POST routine` (`{routine}`), `PUT/DELETE routine/:id`, `POST routine_copy`, `POST/PUT routine_folder`, `PUT routine_folder_order`, `PUT routine_locations`, `POST/PUT/DELETE custom_exercise_template`.

## 3. Modelo de datos

### Plantilla de ejercicio
- ID de la biblioteca base: 8 caracteres hex (ej. `79D0BB3A` = Press de Banca con barra) **[O]**
- Campos: `exercise_template_id, title, es_title (+14 idiomas), muscle_group, other_muscles[], exercise_type, equipment_category, media_type, url (vídeo), thumbnail_url, priority, custom_exercise_image_url` **[O]**
- **muscle_group** **[C]**: abdominals, shoulders, biceps, triceps, forearms, quadriceps, hamstrings, calves, glutes, abductors, adductors, lats, upper_back, traps, lower_back, chest, cardio, neck, full_body, other
- **equipment_category** **[C]**: none, barbell, dumbbell, kettlebell, machine, plate, resistance_band, suspension, other
- **exercise_type** **[C]** (decide qué campos tiene cada serie): `weight_reps`, `reps_only`, `bodyweight_reps`, `bodyweight_assisted_reps`, `duration`, `weight_duration`, `distance_duration`, `short_distance_weight`, `floors_duration`, `steps_duration`

### Entreno realizado **[O]**
```
Workout {
  id (uuid), short_id, name, description, routine_id, user_id, username,
  start_time (unix s), end_time (unix s), created_at, updated_at,
  estimated_volume_kg, include_warmup_sets, nth_workout, is_private,
  media[], image_urls[], apple_watch, wearos_watch,
  like_count, comment_count, comments[] ...        ← social, no lo necesitamos
  exercises: [{
    id, exercise_template_id, title, es_title, muscle_group, other_muscles[],
    exercise_type, equipment_category, notes, pinned_notes[{id, content, createdAt}],
    rest_seconds, superset_id (null | id), volume_doubling_enabled,
    sets: [{
      id, index, indicator (normal|warmup|dropset|failure),
      weight_kg, reps, rpe, duration_seconds, distance_meters, custom_metric,
      completed_at (ISO), prs[], yearly_prs[], personalRecords[]
    }]
  }]
}
```
Observaciones: el entreno **guarda una copia de los datos del ejercicio** (título, músculo…), no solo el ID; el peso se guarda **siempre en kg** (la conversión a lb es de interfaz); las notas fijadas (`pinned_notes`) persisten entre sesiones de un mismo ejercicio.

### Rutina **[C/I]**
```
Routine { id, title, folder_id (null = sin carpeta), index (orden), notes?,
  exercises: [{ exercise_template_id, exercise_type, rest_seconds (def. 90), superset_id?, notes?,
    sets: [{ indicator, weight_kg?, reps?, rep_range?{start,end}, duration_seconds?, distance_meters? }] }] }
RoutineFolder { id, title, index }
```

### Preferencias del usuario **[O]**
`language, first_weekday, rpe_enabled, superset_scrolling, plate_calculator_enabled, inline_set_timer_enabled, volume_includes_warmup_sets, default_workout_visibility_public`.

## 4. Lógica de negocio **[C]**

- **1RM estimado** = peso / porcentaje[reps]: 1→100 %, 2→97 %, 3→94 %, 4→92 %, 5→89 %, 6→86 %, 8→81 %, 10→75 %, 12→71 %, 15→67 %, 20→60 %, 30→50 % (más de 30 reps → 50 %).
- **Duración estimada de una rutina**: por serie, 45 s (o `duration_seconds`) + `rest_seconds`; los dropsets no suman descanso.
- **Récords personales**: `best_1rm`, `best_weight`, `best_volume`, `best_reps`, `best_duration`, `best_distance` (anuales y totales, por serie).
- **Volumen** = peso × reps (los calentamientos cuentan o no según la preferencia del usuario).
- **Buscador**: filtro por grupo muscular + equipo + texto, en el idioma del usuario.
- **Rutinas**: se ordenan con `index` dentro de su carpeta; mover una rutina actualiza `routine_locations`.

## 5. Qué nos llevamos (propuesta)

1. **Biblioteca de ejercicios** propia (semilla en español) + ejercicios personalizados, con el mismo esquema de tipo/músculo/equipo.
2. **Rutinas** en carpetas: ejercicios, series objetivo (peso, reps o rango), descanso, superseries, tipo de serie y notas fijadas.
3. **Registro rápido** (lo que la web de Hevy no tiene): empezar un entreno desde una rutina, con cada serie pre-rellenada con la última vez, marcar con un toque y temporizador de descanso.
4. **Seguimiento**: historial por ejercicio, 1RM estimado, PRs, volumen por sesión y semana, calendario y racha.
5. Guardar **copia del ejercicio en el entreno** y el **peso en kg**, como hace Hevy, para que el historial no se rompa si se edita la plantilla.

## 6. Límites y pendientes

- Esquema de rutina sin confirmar con datos reales (la cuenta no tiene rutinas). Se confirmaría creando una rutina de prueba.
- `user_exercise_sets` y `user_workout_metrics` devolvieron `[]` (sin datos propios): se conoce la URL, no la forma de la respuesta.
- La biblioteca base de ejercicios va embebida en el JS de 7,4 MB; no se extrajo completa.
- Evidencias REA: captura de login `ev_d525fbe0…`, export de scripts `ev_87cb749f…`, análisis JS `ev_31715b25…`. El modo «connect» de REA falló con la sesión autenticada (`execution_failure`), por eso la fase 2 se hizo con un script CDP propio.
