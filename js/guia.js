// Guía de ejercicios: explicaciones propias + fotos con licencia libre de Wikimedia Commons.
// Las fotos se guardan en img/ejercicios/ (redimensionadas) para que funcionen sin internet.
// Cada foto lleva su crédito, como exigen sus licencias (CC BY / CC BY-SA / GPL / dominio público).

const C = "https://commons.wikimedia.org/wiki/File:";
const foto = (archivo, autor, licencia, pagina) => ({ src: `img/ejercicios/${archivo}`, autor, licencia, fuente: C + pagina });

export const CATEGORIAS = ["Calentamiento", "Tirón y empuje", "Core", "Piernas", "Cardio", "Estiramientos"];

export const GUIA = [
  // ---------- Calentamiento ----------
  {
    id: "escapulas", nombre: "Retracción y protracción de escápulas", cat: "Calentamiento",
    musculos: "Trapecio, romboides, serrato anterior",
    foto: foto("escapulas.jpg", "U.S. Space Force photo by Van Ha", "Dominio público", "Guardian_Arena_2025-_Where_Space_Power_Meets_Warrior_Grit_(9262533).jpg"),
    pasos: [
      "Retracción: junta los omóplatos hacia atrás, como si quisieras sujetar un lápiz entre ellos.",
      "Protracción: sepáralos empujando hacia adelante, redondeando un poco la parte alta de la espalda.",
      "Hazlo en 4 posiciones: de pie, colgando de la barra, inclinado a 90 grados y en posición de push up.",
      "Colgando de la barra: brazos estirados todo el tiempo; solo se mueven los hombros (sube y baja el cuerpo unos centímetros).",
    ],
    consejos: ["Movimiento lento y controlado.", "Los codos no se doblan: el trabajo es solo de los omóplatos."],
    errores: ["Encoger los hombros hacia las orejas.", "Doblar los codos para ayudarte."],
  },
  {
    id: "split-squat", nombre: "Split squat elevado (búlgara)", cat: "Calentamiento",
    musculos: "Cuádriceps, glúteos, aductores",
    video: "bulgarian split squat sin peso técnica",
    pasos: [
      "De espaldas a un banco o escalón, apoya el empeine del pie de atrás encima.",
      "El pie de adelante queda a un paso largo del banco.",
      "Baja doblando la rodilla de adelante hasta que el muslo quede casi paralelo al suelo.",
      "Empuja con el talón de adelante para subir. Haz todas las reps y cambia de pierna.",
    ],
    consejos: ["Torso recto o levemente inclinado hacia adelante.", "La rodilla de adelante sigue la dirección de los dedos del pie."],
    errores: ["Poner el pie de adelante demasiado cerca del banco.", "Dejar que la rodilla se vaya hacia adentro."],
  },
  {
    id: "sentadilla-isometrica", nombre: "Sentadilla isométrica", cat: "Calentamiento",
    musculos: "Cuádriceps, glúteos",
    video: "sentadilla isométrica wall sit técnica",
    pasos: [
      "Baja a posición de sentadilla, con los muslos lo más cerca posible de quedar paralelos al suelo.",
      "Mantén la posición sin moverte durante el tiempo indicado.",
      "Puedes apoyar la espalda en una pared para hacerla más fácil (wall sit).",
    ],
    consejos: ["Respira de forma continua, no aguantes el aire.", "Peso repartido en todo el pie, sobre todo en los talones."],
    errores: ["Levantar los talones.", "Juntar las rodillas."],
  },

  // ---------- Tirón y empuje ----------
  {
    id: "dominada-australiana", nombre: "Dominada australiana (remo invertido)", cat: "Tirón y empuje",
    musculos: "Dorsales, romboides, bíceps, deltoides posterior",
    foto: foto("dominada-australiana.jpg", "Colossus Fitness", "CC BY 3.0", "Inverted_row.jpg"),
    pasos: [
      "Ponte bajo una barra baja (o mesa firme) y agárrala con las manos al ancho de los hombros.",
      "Estira el cuerpo en línea recta de talones a cabeza, con los talones apoyados en el suelo.",
      "Tira llevando el pecho hacia la barra y juntando los omóplatos.",
      "Baja controlando hasta estirar los brazos.",
    ],
    consejos: ["Más horizontal = más difícil; más vertical = más fácil.", "Aprieta glúteos y abdomen para no doblar la cadera."],
    errores: ["Dejar caer la cadera.", "Tirar con el cuello estirándolo hacia la barra."],
  },
  {
    id: "push-up", nombre: "Push up (flexión de brazos)", cat: "Tirón y empuje",
    musculos: "Pectorales, tríceps, deltoides anterior, core",
    foto: foto("push-up.jpg", "PTPioneer", "CC BY 2.0", "Girl_doing_push-ups_from_the_side.jpg"),
    pasos: [
      "Manos en el suelo algo más abiertas que los hombros, brazos estirados.",
      "Cuerpo recto de cabeza a talones, abdomen y glúteos apretados.",
      "Baja el pecho hacia el suelo con los codos a unos 45° del cuerpo.",
      "Empuja el suelo hasta volver a estirar los brazos.",
    ],
    consejos: ["Si cuesta, apoya las manos en una superficie elevada (banco, mesa); cuanto más plana, más difícil.", "Mira un poco por delante de las manos."],
    errores: ["Cadera caída o demasiado levantada.", "Codos abiertos a 90°, que cargan los hombros."],
  },
  {
    id: "dominada-excentrica", nombre: "Dominada excéntrica", cat: "Tirón y empuje",
    musculos: "Dorsales, bíceps, antebrazos",
    foto: foto("dominada.jpg", "PTPioneer", "CC BY 2.0", "Pull-ups_exercise_from_back.jpg"),
    pasos: [
      "Empieza arriba, con la barbilla sobre la barra (sube saltando o con un apoyo).",
      "Baja muy lento, en al menos 6 segundos, hasta estirar los brazos.",
      "Vuelve a subir con ayuda (salto o apoyo) y repite.",
    ],
    consejos: ["La fase de bajada es la que te hace más fuerte para lograr dominadas completas.", "Mantén los hombros 'abajo', lejos de las orejas."],
    errores: ["Dejarse caer al final.", "Balancear el cuerpo."],
  },
  {
    id: "push-up-excentrica", nombre: "Push up excéntrica", cat: "Tirón y empuje",
    musculos: "Pectorales, tríceps, deltoides anterior, core",
    foto: foto("push-up.jpg", "PTPioneer", "CC BY 2.0", "Girl_doing_push-ups_from_the_side.jpg"),
    pasos: [
      "Posición de push up (en el suelo o con las manos en una superficie inclinada).",
      "Baja el pecho muy lento, en al menos 6 segundos.",
      "Abajo, sostén un momento. Para subir puedes apoyar las rodillas al principio.",
      "Más adelante: sube sin apoyar las rodillas.",
    ],
    consejos: ["Cuenta los segundos en voz baja para no acelerar.", "Cuerpo recto durante toda la bajada."],
    errores: ["Bajar rápido la última parte.", "Dejar caer la cadera."],
  },

  // ---------- Core ----------
  {
    id: "hollow", nombre: "Medio hollow / hollow hold", cat: "Core",
    musculos: "Recto abdominal, oblicuos, flexores de cadera",
    video: "hollow body hold principiante técnica",
    pasos: [
      "Acostado boca arriba, pega la zona lumbar al suelo apretando el abdomen.",
      "Medio hollow: rodillas dobladas y elevadas, brazos estirados hacia los pies, hombros despegados del suelo.",
      "Hollow completo: piernas estiradas y brazos sobre la cabeza, formando una 'banana'.",
      "Sostén la posición el tiempo indicado.",
    ],
    consejos: ["Lo más importante es que la lumbar no se despegue del suelo.", "Variante con pataditas: alterna patadas cortas con las piernas estiradas."],
    errores: ["Arquear la zona lumbar.", "Tirar del cuello con la cabeza."],
  },
  {
    id: "nadadores", nombre: "Nadadores (superman)", cat: "Core",
    musculos: "Erectores espinales, glúteos, dorsales, deltoides posterior",
    foto: foto("nadadores.jpg", "Nikiwiki242", "CC BY-SA 4.0 (foto recortada y redimensionada)", "Salabhasana_(cropped).jpg"),
    pasos: [
      "Boca abajo, con los brazos estirados hacia adelante.",
      "Levanta a la vez pecho, brazos y piernas del suelo, apretando glúteos y espalda.",
      "Sostén arriba al menos 2 segundos, como si te plegaras hacia atrás.",
      "Variante 'nadador': mueve los brazos desde adelante hacia la cadera y de vuelta, sin tocar el suelo.",
    ],
    consejos: ["Mira al suelo para no forzar el cuello.", "Mejor poca altura con buena contracción que subir mucho con impulso."],
    errores: ["Hacer el movimiento con rebote.", "Echar la cabeza hacia atrás."],
  },
  {
    id: "toques-hombro", nombre: "Toques de hombro", cat: "Core",
    musculos: "Core (anti-rotación), hombros, tríceps",
    foto: foto("toques-hombro.jpg", "U.S. Army 10AAMDC by Sgt. Yesenia Cadavid", "Dominio público", "10th_AAMDC_host_%E2%80%9CKey_Leader_Physical_Readiness_Training%E2%80%9D_(8448514).jpg"),
    pasos: [
      "Posición de plancha alta (brazos estirados), pies algo separados.",
      "Levanta una mano y toca el hombro contrario.",
      "Vuelve a apoyar y repite con la otra mano.",
    ],
    consejos: ["La cadera no debe balancearse: imagina un vaso de agua sobre tu espalda.", "Más separación de pies = más fácil."],
    errores: ["Girar la cadera en cada toque.", "Hacerlo rápido perdiendo el control."],
  },
  {
    id: "mountain-climbers", nombre: "Mountain climbers (escaladores)", cat: "Core",
    musculos: "Core, flexores de cadera, hombros; eleva el pulso",
    foto: foto("mountain-climbers.jpg", "U.S. Army photo by Pfc. Cheshaon Jones", "Dominio público", "SETAF-AF_NCOs_conduct_physical_readiness_training_(9713992).jpg"),
    pasos: [
      "Posición de plancha alta, manos bajo los hombros.",
      "Lleva una rodilla hacia el pecho y vuelve atrás.",
      "Alterna las piernas a ritmo constante, como si corrieras en el sitio.",
    ],
    consejos: ["Si cuesta, apoya las manos en una superficie elevada.", "Cuenta cada pierna por separado (10 por pierna = 20 en total)."],
    errores: ["Subir mucho la cadera.", "Hombros por detrás de las manos."],
  },

  // ---------- Piernas ----------
  {
    id: "sentadilla", nombre: "Sentadilla (squat)", cat: "Piernas",
    musculos: "Cuádriceps, glúteos, isquiotibiales, core",
    foto: foto("sentadilla.jpg", "U.S. Marine Corps photo by Lance Cpl. Phuchung Nguyen", "Dominio público", "Marine_Corps_officer_candidate_participate_in_physical_training.jpg"),
    pasos: [
      "Pies al ancho de los hombros, puntas un poco hacia afuera.",
      "Lleva la cadera hacia atrás y abajo, como si te sentaras en una silla.",
      "Baja hasta que los muslos queden paralelos al suelo (o lo más que puedas con buena técnica).",
      "Empuja el suelo con todo el pie para subir.",
    ],
    consejos: ["Pecho arriba y espalda neutra.", "Brazos al frente o cruzados para equilibrarte."],
    errores: ["Rodillas hacia adentro.", "Levantar los talones.", "Redondear la espalda abajo."],
  },
  {
    id: "box-squat", nombre: "Box squat (sentadilla al cajón)", cat: "Piernas",
    musculos: "Cuádriceps, glúteos, isquiotibiales",
    foto: foto("box-squat.jpg", "BruceBlaus", "CC BY-SA 4.0 (redimensionada)", "Exercise_Chair_Squat.png"),
    pasos: [
      "Ponte delante de una silla, banco o cajón firme.",
      "Baja como en una sentadilla hasta tocar suavemente el asiento con los glúteos.",
      "Sin dejarte caer ni relajarte, empuja y vuelve a subir.",
    ],
    consejos: ["El cajón te marca la profundidad: siempre la misma en cada rep.", "Ideal para aprender la sentadilla con buena técnica."],
    errores: ["Sentarse del todo y perder la tensión.", "Echarse hacia adelante para levantarse con impulso."],
  },
  {
    id: "estocada", nombre: "Estocada (lunge)", cat: "Piernas",
    musculos: "Cuádriceps, glúteos, isquiotibiales",
    foto: foto("estocada.jpg", "Yashjoshi2102", "CC BY-SA 4.0 (redimensionada)", "Sakshi_Malik_fitness_(lunge).jpg"),
    pasos: [
      "De pie, da un paso largo hacia adelante.",
      "Baja hasta que ambas rodillas formen unos 90° (la de atrás casi toca el suelo).",
      "Empuja con el pie de adelante para volver a la posición inicial.",
      "Haz todas las reps de una pierna y luego cambia.",
    ],
    consejos: ["Torso recto.", "Si pierdes el equilibrio, separa un poco más los pies hacia los lados."],
    errores: ["Golpear la rodilla de atrás contra el suelo.", "Rodilla de adelante hacia adentro."],
  },
  {
    id: "puente-gluteo", nombre: "Puente glúteo", cat: "Piernas",
    musculos: "Glúteos, isquiotibiales, core",
    foto: foto("puente-gluteo.jpg", "Everkinetic", "CC BY-SA 3.0 (redimensionada)", "Bridge-2.png"),
    pasos: [
      "Boca arriba, rodillas dobladas y pies apoyados al ancho de la cadera.",
      "Empuja con los talones y sube la cadera hasta formar una línea recta de rodillas a hombros.",
      "Arriba, aprieta fuerte los glúteos y sostén 2 segundos (o lo que indique la rutina).",
      "Baja controlando.",
    ],
    consejos: ["Empuja con los talones, no con las puntas.", "Si sientes más los isquios, acerca un poco los pies a la cadera."],
    errores: ["Arquear la lumbar en vez de subir con los glúteos.", "Bajar de golpe."],
  },
  {
    id: "gemelos", nombre: "Elevación de gemelos (calf raise)", cat: "Piernas",
    musculos: "Gemelos y sóleo",
    foto: foto("gemelos.jpg", "GeorgeStepanek", "CC BY-SA 3.0 (redimensionada)", "DumbbellStandingCalfRaise.JPG"),
    pasos: [
      "De pie, con las puntas de los pies sobre un escalón y los talones en el aire (o en el suelo plano).",
      "Sube en puntas lo más alto que puedas.",
      "Sostén un instante arriba y baja lento, dejando que el talón baje del nivel del escalón.",
    ],
    consejos: ["Apóyate en una pared para el equilibrio.", "Recorrido completo: abajo estira, arriba aprieta."],
    errores: ["Rebotar.", "Hacer medio recorrido."],
  },
  {
    id: "tibial", nombre: "Elevación de tibial (tibialis raise)", cat: "Piernas",
    musculos: "Tibial anterior (parte delantera de la canilla)",
    video: "tibialis raise contra la pared técnica",
    pasos: [
      "Apoya la espalda en una pared con los pies a unos 30-50 cm de ella.",
      "Con las piernas estiradas, levanta las puntas de los pies hacia las canillas, dejando los talones en el suelo.",
      "Baja lento sin tocar del todo el suelo con las puntas y repite.",
    ],
    consejos: ["Más lejos de la pared = más difícil.", "Lo vas a sentir arder en la canilla: es normal."],
    errores: ["Doblar las rodillas.", "Hacerlo con rebote."],
  },
  {
    id: "step-up", nombre: "Step up (subida al cajón)", cat: "Piernas",
    musculos: "Cuádriceps, glúteos",
    foto: foto("step-up.jpg", "Everkinetic", "CC BY-SA 3.0 (redimensionada)", "Step-ups-2-2-553x1024.png"),
    pasos: [
      "Ponte frente a un escalón, banco o cajón firme.",
      "Apoya un pie completo arriba y empuja con esa pierna para subir.",
      "Baja controlando con la misma pierna.",
      "Haz 5 o 10 reps y cambia de pierna.",
    ],
    consejos: ["La pierna de arriba hace el trabajo: no te impulses con la de abajo.", "En la semana 11 el peldaño sube 15 cm: tómatelo con calma."],
    errores: ["Rodilla hacia adentro al subir.", "Dejarse caer al bajar."],
  },

  // ---------- Cardio ----------
  {
    id: "jumping-jacks", nombre: "Jumping jacks (saltos de tijera)", cat: "Cardio",
    musculos: "Cuerpo completo; cardio",
    foto: foto("jumping-jacks.jpg", "Lance Cpl. Ryan M. Joyner", "Dominio público", "Elementary_school_students_conduct_jumping_jacks_to_warm_up_USMC-120214-M-MA421-288.jpg"),
    pasos: [
      "De pie, pies juntos y brazos a los lados.",
      "Salta abriendo las piernas y subiendo los brazos por encima de la cabeza.",
      "Salta de nuevo volviendo a la posición inicial.",
    ],
    consejos: ["Aterriza suave sobre la parte delantera del pie.", "Ritmo constante y respiración regular."],
    errores: ["Caer con las piernas rígidas."],
  },
  {
    id: "trote", nombre: "Trote suave", cat: "Cardio",
    musculos: "Cardio",
    foto: foto("trote.jpg", "James Moore200", "CC BY-SA 4.0 (redimensionada)", "Jogger_on_the_street.jpg"),
    pasos: [
      "Corre a un ritmo en el que puedas hablar sin ahogarte.",
      "Pasos cortos y ligeros, brazos relajados a unos 90°.",
      "Si no tienes espacio, trota en el sitio.",
    ],
    consejos: ["Es un trote suave: no es una carrera."],
    errores: ["Ir demasiado rápido y no poder terminar el circuito."],
  },
  {
    id: "burpees", nombre: "Burpees", cat: "Cardio",
    musculos: "Cuerpo completo; cardio",
    foto: foto("burpees.jpg", "Marine Corps photo by Sgt. Ryan Young", "Dominio público", "Airborne_Burpee.jpg"),
    pasos: [
      "De pie, baja en cuclillas y apoya las manos en el suelo.",
      "Lleva los pies atrás de un salto a posición de plancha.",
      "(Opcional) haz un push up.",
      "Recoge los pies de un salto hacia las manos y salta hacia arriba con los brazos en alto.",
    ],
    consejos: ["Versión más fácil: lleva los pies atrás y adelante de a uno, sin saltar.", "Prioriza la técnica antes que la velocidad."],
    errores: ["Dejar caer la cadera en la plancha.", "Aterrizar con las rodillas rígidas."],
  },

  // ---------- Estiramientos ----------
  {
    id: "estir-gemelo", nombre: "Estiramiento de gemelo", cat: "Estiramientos",
    musculos: "Gemelos y sóleo",
    video: "estiramiento de gemelo contra la pared",
    pasos: [
      "Frente a una pared, apoya las manos en ella.",
      "Lleva una pierna atrás con la rodilla estirada y el talón pegado al suelo.",
      "Inclínate hacia la pared hasta sentir el estiramiento en la pantorrilla. Sostén y cambia de pierna.",
    ],
    consejos: ["Puntas mirando hacia la pared.", "Dobla un poco la rodilla de atrás para estirar el sóleo."],
    errores: ["Levantar el talón de atrás."],
  },
  {
    id: "estir-isquios", nombre: "Estiramiento de isquiotibiales", cat: "Estiramientos",
    musculos: "Isquiotibiales (parte trasera del muslo)",
    foto: foto("estir-isquios.jpg", "Shixart1985", "CC BY 2.0", "Woman_stretching_her_hamstrings_and_glutes_on_a_log_in_nature.jpg"),
    pasos: [
      "Apoya el talón de una pierna estirada sobre un escalón o banco bajo.",
      "Con la espalda recta, inclina el torso hacia adelante desde la cadera.",
      "Para cuando sientas el estiramiento detrás del muslo. Sostén y cambia de pierna.",
    ],
    consejos: ["Piensa en llevar el ombligo al muslo, no la cabeza a la rodilla."],
    errores: ["Redondear la espalda para llegar más lejos.", "Rebotar."],
  },
  {
    id: "estir-cuadriceps", nombre: "Estiramiento de cuádriceps", cat: "Estiramientos",
    musculos: "Cuádriceps (parte delantera del muslo)",
    foto: foto("estir-cuadriceps.jpg", "U.S. Marine Corps", "Dominio público", "USMC-09294.jpg"),
    pasos: [
      "De pie, apóyate en una pared si lo necesitas.",
      "Dobla una rodilla y toma el empeine con la mano del mismo lado.",
      "Lleva el talón hacia el glúteo con las rodillas juntas. Sostén y cambia de pierna.",
    ],
    consejos: ["Aprieta el glúteo de la pierna estirada para estirar más."],
    errores: ["Arquear la zona lumbar.", "Separar la rodilla hacia afuera."],
  },
  {
    id: "estir-psoas", nombre: "Estiramiento de psoas (flexor de cadera)", cat: "Estiramientos",
    musculos: "Psoas ilíaco, flexores de cadera",
    foto: foto("estir-psoas.jpg", "Hanako.R", "CC BY-SA 4.0 (redimensionada)", "J%C3%B3ga_Anjaneyasana.jpg"),
    pasos: [
      "Posición de estocada con la rodilla de atrás apoyada en el suelo (sobre algo blando).",
      "Lleva la cadera hacia adelante y abajo, manteniendo el torso recto.",
      "Para estirar más, sube el brazo del lado de la pierna de atrás. Sostén y cambia de lado.",
    ],
    consejos: ["Aprieta el glúteo de la pierna de atrás.", "Muy útil si pasas mucho tiempo sentado."],
    errores: ["Arquear la lumbar en vez de llevar la cadera adelante."],
  },
  {
    id: "postura-nino", nombre: "Postura del niño", cat: "Estiramientos",
    musculos: "Zona lumbar, dorsales, caderas",
    foto: foto("postura-nino.jpg", "Iveto", "CC BY-SA 4.0 (redimensionada)", "Balasana.JPG"),
    pasos: [
      "De rodillas, siéntate sobre los talones.",
      "Inclina el torso hacia adelante y apoya la frente en el suelo.",
      "Estira los brazos al frente (estira más los dorsales) o déjalos junto al cuerpo.",
      "Respira profundo y relaja la espalda.",
    ],
    consejos: ["Separa las rodillas si te molesta el abdomen.", "Ideal para hacerlo a diario."],
    errores: ["Aguantar la respiración."],
  },
  {
    id: "cobra", nombre: "Estiramiento cobra", cat: "Estiramientos",
    musculos: "Abdominales, flexores de cadera, pecho",
    foto: foto("cobra.jpg", "Marcocarvalho", "CC BY 3.0", "Raja_bhujangasana_2.jpg"),
    pasos: [
      "Boca abajo, manos apoyadas bajo los hombros.",
      "Empuja el suelo para levantar el pecho, dejando la cadera apoyada.",
      "Sube solo hasta donde no moleste la zona lumbar. Sostén respirando.",
    ],
    consejos: ["Hombros lejos de las orejas.", "Puedes dejar los codos un poco doblados."],
    errores: ["Forzar la espalda hasta sentir dolor lumbar.", "Despegar la cadera del suelo."],
  },
  {
    id: "cadena-posterior", nombre: "Estiramiento de cadena posterior", cat: "Estiramientos",
    musculos: "Isquiotibiales, gemelos, espalda",
    foto: foto("cadena-posterior.jpg", "Nemonoman (Wikipedia en inglés)", "GPL", "Fb1.jpg"),
    pasos: [
      "De pie, pies juntos o al ancho de la cadera.",
      "Inclínate hacia adelante desde la cadera y deja colgar el torso y los brazos.",
      "Relaja el cuello. Dobla un poco las rodillas si no llegas lejos.",
      "Para subir, hazlo lento, vértebra a vértebra.",
    ],
    consejos: ["Sirve también como pausa activa en el trabajo."],
    errores: ["Rebotar para llegar al suelo."],
  },
  {
    id: "estir-triceps", nombre: "Estiramiento de tríceps y dorsal", cat: "Estiramientos",
    musculos: "Tríceps, dorsales",
    foto: foto("estir-triceps.jpg", "Tyler Read", "CC BY 2.0", "Girl_stretching_triceps_in_a_park.jpg"),
    pasos: [
      "Sube un brazo y dobla el codo para que la mano caiga detrás de la cabeza.",
      "Con la otra mano, empuja suavemente el codo hacia atrás y hacia la cabeza.",
      "Inclina un poco el torso hacia el lado contrario para estirar también el dorsal. Sostén y cambia de brazo.",
    ],
    consejos: ["Mantén la cabeza recta, sin empujarla hacia adelante."],
    errores: ["Arquear la espalda baja."],
  },
];

export const guiaPorId = (id) => GUIA.find((g) => g.id === id);
