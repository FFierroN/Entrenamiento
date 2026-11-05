// Rutina incluida en la app: "Método Zero".
// Se carga la primera vez y cada vez que cambia `version` (si no la editaste desde la app).
//
// Campos de cada ejercicio:
//   type:    weight_reps = peso y reps · reps_only = solo reps · duration = tiempo (s) · check = solo marcar
//   sets / reps / seconds / rest (descanso en s) / notes
//   warmup:  true → sus series son de calentamiento (no cuentan para récords)
//   guia:    ids de la guía de ejercicios (js/guia.js) para el botón "Ver cómo se hace"
//   weekly:  objetivos por semana del programa (índice 0 = semana 1)
//            { reps: [...], sets: [...], goal: true (= total de reps del día), notes: { semana: "texto" } }
// weekday: 0 = domingo, 1 = lunes … 6 = sábado

// Ayuda para escribir menos: ejercicio base con valores por defecto.
const ex = (id, name, o = {}) => ({ id, name, type: "reps_only", sets: 3, reps: "", seconds: null, weight: null, rest: 90, notes: "", ...o });

export const RUTINA_INICIAL = {
  version: "metodo-zero-2",
  name: "Método Zero",
  days: [
    {
      id: "tiron-empuje", weekday: 1, title: "Tirón y empuje",
      exercises: [
        ex("te-c1", "Escápulas: retracción y protracción de pie", { guia: ["escapulas"], warmup: true, sets: 2, reps: "10", rest: 30 }),
        ex("te-c2", "Escápulas: retracción y protracción colgando en barra", { guia: ["escapulas"], warmup: true, sets: 2, reps: "10", rest: 30 }),
        ex("te-c3", "Escápulas: retracción y protracción a 90 grados", { guia: ["escapulas"], warmup: true, sets: 2, reps: "10", rest: 30 }),
        ex("te-c4", "Escápulas: retracción y protracción en posición push up", { guia: ["escapulas"], warmup: true, sets: 2, reps: "10", rest: 30 }),
        ex("te-1", "Dominada australiana", { guia: ["dominada-australiana"], sets: 5, reps: "12-15", rest: 90,
          notes: "Elige el ángulo que más te acomode. En la semana 3, varía el ángulo para hacerlo más difícil. Descansa lo que necesites." }),
        ex("te-2", "Push up", { guia: ["push-up"], sets: 5, reps: "10-12", rest: 90,
          notes: "Variante que puedas administrar, sin llegar al fallo. En semanas siguientes avanza a una superficie más plana." }),
        ex("te-3", "Dominada excéntrica", { guia: ["dominada-excentrica"], sets: 5, reps: "5", rest: 60,
          notes: "Baja en al menos 6 s. En semanas posteriores, baja 6 s, sostén un poco abajo y sube sin apoyar." }),
        ex("te-4", "Push up excéntrica", { guia: ["push-up-excentrica"], sets: 5, reps: "5", rest: 60,
          notes: "Baja en al menos 6 s. En semanas posteriores usa el suelo (no el plano inclinado), sostén abajo y sube sin apoyar las rodillas." }),
        ex("te-5", "Medio hollow", { guia: ["hollow"], type: "duration", sets: 5, seconds: 20, rest: 30,
          notes: "Descansa 30 s como mucho. Variante con pataditas: 50 patadas × 5 con 20-30 s de descanso. En semanas siguientes intenta el hollow completo (brazos sobre la cabeza)." }),
        ex("te-f", "Final: jumping jacks + trote suave", { guia: ["jumping-jacks","trote"], type: "check", sets: 2, rest: 60,
          notes: "Cada ronda: 15 jumping jacks, 2 min de trote suave, 15 jumping jacks, 2 min de trote suave y 15 jumping jacks." }),
      ],
    },
    {
      id: "piernas", weekday: 2, title: "Piernas",
      exercises: [
        ex("pi-c1", "Split squat elevado", { guia: ["split-squat"], warmup: true, sets: 2, reps: "10", rest: 0,
          notes: "10 por pierna y pasa directo a la sentadilla isométrica." }),
        ex("pi-c2", "Sentadilla isométrica", { guia: ["sentadilla-isometrica"], type: "duration", warmup: true, sets: 2, seconds: 20, rest: 60,
          notes: "Tras los dos movimientos, descansa 45 s a 1 min y repite todo." }),
        ex("pi-1", "Sentadilla", { guia: ["sentadilla"], sets: 5, reps: "10-15", rest: 60,
          notes: "En la semana siguiente aumenta hasta 25 repeticiones." }),
        ex("pi-2", "Estocada", { guia: ["estocada"], sets: 4, reps: "6-10", rest: 45,
          notes: "Reps por pierna (4 series por cada pierna). Descansa 30-45 s al cambiar de pierna. En semanas siguientes sube a 15-20 por pierna y puedes reducir el descanso." }),
        ex("pi-3", "Puente glúteo", { guia: ["puente-gluteo"], sets: 4, reps: "15-20", rest: 60,
          notes: "Sostén arriba 2 s apretando fuerte los glúteos. En semanas siguientes hasta 25 reps sosteniendo hasta 5 s." }),
        ex("pi-4", "Elevación de gemelos (calf raise)", { guia: ["gemelos"], sets: 4, reps: "15", rest: 45,
          notes: "Alterna con la elevación de tibial. En semanas siguientes sube a 20-25 reps." }),
        ex("pi-5", "Elevación de tibial (tibialis raise)", { guia: ["tibial"], sets: 4, reps: "15", rest: 45,
          notes: "En semanas siguientes sube a 20-25 reps." }),
        ex("pi-f", "Final: climbers + trote + jumping jacks", { guia: ["mountain-climbers","trote","jumping-jacks"], type: "check", sets: 1, rest: 0,
          notes: "15 climbers por pierna, 2 min de trote, 15 climbers por pierna, 15 jumping jacks y 2 min de trote." }),
      ],
    },
    {
      id: "estiramientos", weekday: 3, title: "Estiramientos",
      exercises: [
        ex("es-1", "Estiramiento de gemelo", { guia: ["estir-gemelo"], type: "duration", sets: 2, seconds: 30, rest: 10, notes: "Por cada pierna." }),
        ex("es-2", "Estiramiento de isquiotibiales", { guia: ["estir-isquios"], type: "duration", sets: 2, seconds: 30, rest: 10, notes: "Por cada pierna." }),
        ex("es-3", "Estiramiento de cuádriceps", { guia: ["estir-cuadriceps"], type: "duration", sets: 2, seconds: 30, rest: 10, notes: "Por cada pierna." }),
        ex("es-4", "Estiramiento de psoas", { guia: ["estir-psoas"], type: "duration", sets: 2, seconds: 30, rest: 10, notes: "Por cada lado." }),
        ex("es-5", "Postura del niño", { guia: ["postura-nino"], type: "duration", sets: 2, seconds: 45, rest: 10,
          notes: "Estira zona lumbar y dorsales. Ideal hacerlo a diario." }),
        ex("es-6", "Estiramiento cobra", { guia: ["cobra"], type: "duration", sets: 2, seconds: 30, rest: 10, notes: "Estira los abdominales." }),
        ex("es-7", "Estiramiento de cadena posterior", { guia: ["cadena-posterior"], type: "duration", sets: 2, seconds: 30, rest: 10,
          notes: "Toda la parte posterior del cuerpo. Sirve también para pausas activas en el trabajo." }),
        ex("es-8", "Estiramiento de tríceps y dorsal", { guia: ["estir-triceps"], type: "duration", sets: 2, seconds: 30, rest: 10, notes: "Por cada brazo." }),
      ],
    },
    {
      id: "fullbody", weekday: 4, title: "Fullbody",
      exercises: [
        ex("fb-1", "Nadadores", { guia: ["nadadores"], sets: 4, reps: "6-8", rest: 45,
          notes: "Sostén la contracción al menos 2 s en cada repetición, apretando fuerte. Descanso 30-45 s (más si lo necesitas)." }),
        ex("fb-2", "Push up excéntrica", { guia: ["push-up-excentrica"], sets: 5, reps: "5", rest: 60,
          notes: "Baja en al menos 6 s. En semanas posteriores usa el suelo, sostén abajo y sube sin apoyar las rodillas." }),
        ex("fb-3", "Toques de hombro", { guia: ["toques-hombro"], sets: 4, reps: "10", rest: 0,
          notes: "10 por lado y pasa directo a los mountain climbers. Si cuesta, hazlo en una superficie ligeramente elevada." }),
        ex("fb-4", "Mountain climbers", { guia: ["mountain-climbers"], sets: 4, reps: "10", rest: 60, notes: "10 por pierna, después de los toques de hombro." }),
        ex("fb-5", "Box squat", { guia: ["box-squat"], sets: 4, reps: "10-15", rest: 60,
          notes: "En semanas siguientes aumenta 3-5 reps por serie y, si quieres, una serie más." }),
        ex("fb-6", "Burpees", { guia: ["burpees"], sets: 4, reps: "8", rest: 60 }),
        ex("fb-f", "Final: climbers + trote + jumping jacks", { guia: ["mountain-climbers","trote","jumping-jacks"], type: "check", sets: 1, rest: 0,
          notes: "10-12 climbers por pierna, 2 min de trote, vuelve al inicio, 10-12 climbers por pierna y 20 jumping jacks." }),
      ],
    },
    {
      id: "mision", weekday: 5, title: "Misión repeticiones",
      exercises: [
        ex("mi-1", "Misión: step up", { guia: ["step-up"], rest: 0,
          notes: "Reps por pierna. Ve de 5 en 5 o de 10 en 10 alternando piernas. Da igual las series y el tiempo: termina las reps con calidad.",
          weekly: { goal: true, reps: [50, 50, 75, 85, 100, 110, 120, 130, 140, 150, 100, 120],
            notes: { 11: "Peldaño al menos 15 cm más alto que el anterior." } } }),
        ex("mi-2", "Misión: puente glúteo", { guia: ["puente-gluteo"], rest: 0,
          weekly: { goal: true, reps: [50, 50, 75, 85, 100, 110, 120, 130, 140, 150, 170, 200] } }),
        ex("mi-3", "Misión: elevación de gemelos", { guia: ["gemelos"], rest: 45, notes: "Alterna con la elevación de tibial.",
          weekly: { reps: [15, 15, 20, 20, 25, 25, 25, 25, 30, 30, 30, 30], sets: [4, 4, 4, 4, 4, 4, 5, 5, 4, 4, 5, 5] } }),
        ex("mi-4", "Misión: elevación de tibial", { guia: ["tibial"], rest: 45,
          weekly: { reps: [15, 15, 20, 20, 25, 25, 25, 25, 30, 30, 30, 30], sets: [4, 4, 4, 4, 4, 4, 5, 5, 4, 4, 5, 5] } }),
        ex("mi-5", "Misión: nadadores", { guia: ["nadadores"], rest: 0,
          weekly: { goal: true, reps: [25, 25, 35, 40, 50, 60, 70, 80, 90, 100, 110, 120] } }),
        ex("mi-6", "Misión: push up excéntrico", { guia: ["push-up-excentrica","push-up"], rest: 0,
          weekly: { goal: true, reps: [30, 35, 45, 15, 20, 25, 30, 35, 40, 50, 60, 70],
            notes: { 4: "Desde la semana 4: push ups normales desde el piso." } } }),
        ex("mi-7", "Misión: dominada australiana", { guia: ["dominada-australiana"], rest: 0,
          weekly: { goal: true, reps: [30, 40, 45, 50, 60, 70, 80, 90, 100, 100, 110, 120],
            notes: { 7: "Con los pies en altura para hacerlo más desafiante." } } }),
      ],
    },
  ],
};
