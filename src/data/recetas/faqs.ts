import type { FaqItem, Receta } from "@/types/receta";

/**
 * FAQ por receta (People Also Ask).
 * Se fusionan en getRecetaById para no tocar cada ficha de datos.
 * Si no hay entrada curada, se genera un fallback específico de la receta.
 */
export const FAQ_POR_RECETA: Record<string, FaqItem[]> = {
  "gazpacho-andaluz": [
    {
      pregunta: "¿Cuánto dura el gazpacho en la nevera?",
      respuesta:
        "Bien tapado, aguanta 2–3 días en nevera. Remueve antes de servir: el aceite puede separarse un poco. Si ves olor ácido raro o burbujas, descártalo.",
    },
    {
      pregunta: "¿Se puede congelar el gazpacho?",
      respuesta:
        "Sí, hasta 1–2 meses. Descongela en nevera y vuelve a triturar o batir: la textura mejora. Ajusta sal y vinagre al servir.",
    },
    {
      pregunta: "¿El gazpacho lleva pan?",
      respuesta:
        "La versión andaluza clásica sí: un poco de pan del día anterior aporta cuerpo. Si lo prefieres sin gluten, omítelo y reduce un poco el agua.",
    },
    {
      pregunta: "¿Gazpacho o salmorejo?",
      respuesta:
        "El gazpacho es más líquido, con pepino y pimiento, y se bebe. El salmorejo es más espeso (más pan y tomate), se come a cuchara y suele llevar jamón y huevo.",
    },
  ],
  "salmorejo-cordobes": [
    {
      pregunta: "¿Se puede congelar el salmorejo?",
      respuesta:
        "Sí. Congélalo sin el remate de jamón y huevo. Al descongelar, bate de nuevo y añade el aceite si hace falta para recuperar cremosidad.",
    },
    {
      pregunta: "¿Qué pan usar para el salmorejo cordobés?",
      respuesta:
        "Telera o pan candeal del día anterior. La miga debe absorber el jugo de tomate sin hacerse papilla. Evita pan de molde industrial.",
    },
    {
      pregunta: "¿Por qué mi salmorejo queda líquido?",
      respuesta:
        "Falta pan o el tomate suelta demasiada agua. Añade más miga remojada y vuelve a triturar. El AOVE en hilo también espesará la emulsión.",
    },
    {
      pregunta: "¿Cuánto dura el salmorejo en la nevera?",
      respuesta:
        "2–3 días bien tapado. Sirve siempre frío y añade jamón y huevo duro en el momento para que no se reseque.",
    },
  ],
  "ajoblanco-malagueno": [
    {
      pregunta: "¿El ajoblanco lleva leche?",
      respuesta:
        "No. Es una sopa fría de almendras, pan, ajo, agua, vinagre y aceite. A veces la textura recuerda a la nata, pero no lleva lácteos.",
    },
    {
      pregunta: "¿Con qué se sirve el ajoblanco?",
      respuesta:
        "Clásico malagueño: uvas moscatel peladas o daditos de melón. También queda bien con manzana verde en juliana.",
    },
    {
      pregunta: "¿Se pueden usar almendras con piel?",
      respuesta:
        "Mejor peladas (o escaldarlas y quitar la piel): si no, el color queda grisáceo y el sabor más amargo.",
    },
  ],
  torrijas: [
    {
      pregunta: "¿Qué pan es mejor para las torrijas?",
      respuesta:
        "Pan del día anterior, de miga prieta (telera). Si está muy fresco se deshace al empapar; si está muy duro, remoja la leche un poco más.",
    },
    {
      pregunta: "¿Se pueden hacer torrijas al horno?",
      respuesta:
        "Sí: pincela con un poco de aceite o mantequilla y hornea a 180 °C hasta dorar. Quedan menos grasientas, aunque menos tradicionales.",
    },
    {
      pregunta: "¿Cuánto duran las torrijas?",
      respuesta:
        "Mejor el mismo día. En nevera 1–2 días; recalienta suavemente o sírvelas frías con miel. No congelan del todo bien.",
    },
    {
      pregunta: "¿Torrijas con leche o vino?",
      respuesta:
        "En Andalucía lo habitual es leche aromatizada con canela y limón. Hay versiones con vino dulce; ambas se rebozan en huevo y se fríen.",
    },
  ],
  "espinacas-con-garbanzos": [
    {
      pregunta: "¿Las espinacas con garbanzos son de Cuaresma?",
      respuesta:
        "Sí, es un plato típico de vigilia en Sevilla y Andalucía, pero se come todo el año como tapa o guarnición.",
    },
    {
      pregunta: "¿Puedo usar garbanzos de bote?",
      respuesta:
        "Sí, bien escurridos y enjuagados. Si los cocinas en seco, reserva un poco de caldo para mojar el sofrito.",
    },
    {
      pregunta: "¿Llevan comino?",
      respuesta:
        "El toque sevillano clásico lleva comino y pimentón. Ajusta a gusto: un poco de comino basta para no tapar las espinacas.",
    },
  ],
  "solomillo-al-whisky": [
    {
      pregunta: "¿Qué whisky usar para el solomillo al whisky?",
      respuesta:
        "Uno económico de mezcla está bien: al flambear o reducir se pierde el matiz fino. Evita licores muy dulces.",
    },
    {
      pregunta: "¿Se puede sustituir el whisky?",
      respuesta:
        "Puedes usar brandy o coñac. El sabor cambia, pero la técnica (sellar carne y reducir salsa) es la misma.",
    },
    {
      pregunta: "¿Cómo queda la carne jugosa?",
      respuesta:
        "No la sobrecocines: sella a fuego fuerte y termina en la salsa solo unos minutos. Deja reposar 2 minutos antes de servir.",
    },
  ],
  "pescaito-frito": [
    {
      pregunta: "¿A qué temperatura freír el pescaito?",
      respuesta:
        "Aceite muy caliente, unos 180 °C. Si no tienes termómetro, cuando al echar un trozo de pan burbujee con fuerza al momento.",
    },
    {
      pregunta: "¿Qué pescados lleva el pescaito frito?",
      respuesta:
        "Mezcla típica gaditana/malagueña: boquerones, salmonetes, calamares, chocos o limas. Lo importante es tamaño pequeño y fritura rápida.",
    },
    {
      pregunta: "¿Cómo evitar que quede aceitoso?",
      respuesta:
        "Seca bien el pescado, enharina ligero, fríe en tandas sin amontonar y escurre en papel. No tapes: el vapor reblandece.",
    },
  ],
  "flamenquines-cordobeses": [
    {
      pregunta: "¿Qué carne llevan los flamenquines?",
      respuesta:
        "Filetes finos de lomo de cerdo, rellenos de jamón serrano, empanados y fritos. Algunos llevan queso; el clásico cordobés es jamón.",
    },
    {
      pregunta: "¿Cómo evitar que se abran al freír?",
      respuesta:
        "Enrolla apretado, asegura con palillos o film, enfría 15 minutos y empaniza con doble capa huevo-pan.",
    },
    {
      pregunta: "¿Se pueden hornear?",
      respuesta:
        "Sí, a 200 °C hasta dorar, pincelados con aceite. Quedan más ligeros; la corteza será menos crujiente que fritos.",
    },
  ],
  "croquetas-de-puchero": [
    {
      pregunta: "¿Qué carne se usa en las croquetas de puchero?",
      respuesta:
        "Sobras del puchero: pollo, ternera, jamón o tocino picados finos, enriquecidos con caldo en la bechamel.",
    },
    {
      pregunta: "¿Por qué se rompen al freír?",
      respuesta:
        "La masa estaba caliente o poco firme. Enfría bien la bechamel, forma croquetas frías y usa doble empanado. Aceite a 170–180 °C.",
    },
    {
      pregunta: "¿Se pueden congelar las croquetas?",
      respuesta:
        "Sí, ya formadas y empanadas (antes de freír). Fríe directamente desde congeladas a fuego medio-alto un poco más de tiempo.",
    },
  ],
  "huevos-a-la-flamenca": [
    {
      pregunta: "¿Los huevos a la flamenca van al horno?",
      respuesta:
        "Sí: el sofrito de tomate/guisantes va en cazuelita y los huevos se cuajan al horno o a fuego suave hasta la clara cuajada.",
    },
    {
      pregunta: "¿Qué acompañamiento llevan?",
      respuesta:
        "A menudo chorizo, jamón o guisantes. Sirve con pan para mojar el tomate. Es tapa y plato único ligero.",
    },
  ],
  "boquerones-en-vinagre": [
    {
      pregunta: "¿Cuánto tiempo en vinagre los boquerones?",
      respuesta:
        "Hasta que la carne pase de traslúcida a blanca (suele ser varias horas en nevera). Escurre y aliña con ajo, perejil y AOVE.",
    },
    {
      pregunta: "¿Hay riesgo de anisakis?",
      respuesta:
        "Congela el pescado fresco a -20 °C al menos 5 días antes del marinado, o compra ya ultracongelado apto para crudo/marinados.",
    },
    {
      pregunta: "¿Cuánto duran en la nevera?",
      respuesta:
        "Una vez aliñados, 2–3 días bien tapados. Conserva siempre en frío.",
    },
  ],
  "calamares-a-la-andaluza": [
    {
      pregunta: "¿Calamares a la andaluza o a la romana?",
      respuesta:
        "A la andaluza suelen ir enharinados (a veces con gasificada) y fritos; a la romana llevan rebozado más tipo tempura/clara. Ambos se sirven con limón.",
    },
    {
      pregunta: "¿Cómo quedan crujientes?",
      respuesta:
        "Calamar muy seco, harina ligera, aceite caliente y tandas pequeñas. Sirve al momento; no los dejes reposar en el aceite.",
    },
  ],
  "remojon-granadino": [
    {
      pregunta: "¿El remojón lleva bacalao?",
      respuesta:
        "Sí, bacalao desalado desmigado, con naranja, aceitunas, huevo y cebolleta. Es ensalada granadina de invierno y Semana Santa.",
    },
    {
      pregunta: "¿Cómo desalizar el bacalao?",
      respuesta:
        "Según el corte, 24–48 h en agua fría en nevera, cambiando el agua varias veces. Prueba antes de montar la ensalada.",
    },
  ],
  pestinos: [
    {
      pregunta: "¿Los pestiños son de Semana Santa o Navidad?",
      respuesta:
        "En Andalucía se asocian sobre todo a Semana Santa y ferias, aunque en muchas casas también se hacen en Navidad.",
    },
    {
      pregunta: "¿Por qué se abren al freír?",
      respuesta:
        "Masa poco reposada o aceite poco caliente. Deja reposar la masa, sella bien los pliegues y fríe a temperatura media-alta.",
    },
    {
      pregunta: "¿Miel o azúcar?",
      respuesta:
        "Ambos son tradicionales: baño de miel o rebozado de azúcar y sésamo. La miel deja el pestiño más brillante y húmedo.",
    },
  ],
  "migas-andaluzas": [
    {
      pregunta: "¿Las migas llevan pan duro?",
      respuesta:
        "Sí: pan del día anterior desmigado, humedecido y rehogado con ajo y aceite. Acompaña con pimientos, chorizo o uvas según zona.",
    },
    {
      pregunta: "¿Cómo evitar que queden pastosas?",
      respuesta:
        "No te pases de agua al humedecer y remueve a fuego medio hasta que se desgranen y tuesten ligeramente.",
    },
  ],
  "porra-antequerana": [
    {
      pregunta: "¿En qué se diferencia la porra del salmorejo?",
      respuesta:
        "La porra antequerana es aún más espesa y suele llevar pimiento; el remate típico es atún y huevo. El salmorejo cordobés es más de tomate y pan.",
    },
    {
      pregunta: "¿Se sirve fría?",
      respuesta:
        "Sí, bien fría, como el resto de sopas-cremas andaluzas de verano. Deja reposar en nevera para redondear el sabor.",
    },
  ],
  "berza-jiennense": [
    {
      pregunta: "¿Qué lleva la berza jiennense?",
      respuesta:
        "Garbanzos, verdura (acelgas o berza), y embutido o costilla según casa. Es guiso de cuchara de Jaén, contundente y de invierno.",
    },
    {
      pregunta: "¿Hace falta remojar los garbanzos?",
      respuesta:
        "Si son secos, sí (una noche). Con garbanzos cocidos de bote, acorta el tiempo y añade el caldo al final para no pasarlos.",
    },
  ],
  "rabo-de-toro-cordobes": [
    {
      pregunta: "¿Cuánto tarda el rabo de toro?",
      respuesta:
        "Es un guiso lento: suele necesitar 2–3 horas a fuego suave hasta que la carne se separe del hueso. No lo apresures.",
    },
    {
      pregunta: "¿Con qué se acompaña?",
      respuesta:
        "Patatas fritas o pan para mojar la salsa. Un tinto de Córdoba o Montilla-Moriles encaja muy bien.",
    },
  ],
  "mantecados-de-estepa": [
    {
      pregunta: "¿Por qué se deshacen los mantecados?",
      respuesta:
        "Es su textura: manteca y harina tostada. Envuélvelos en papel y manipúlalos con cuidado; al morder deben fundirse.",
    },
    {
      pregunta: "¿Se pueden hacer sin manteca de cerdo?",
      respuesta:
        "Puedes probar mantequilla, pero el mantecado de Estepa tradicional lleva manteca. El sabor y la miga cambian.",
    },
  ],
  "carrillada-pedro-ximenez": [
    {
      pregunta: "¿Cuánto se cocina la carrillada?",
      respuesta:
        "Hasta que esté muy tierna al pincho, normalmente 1,5–2,5 h a fuego suave según el tamaño. La salsa de Pedro Ximénez debe espesar sin quemarse.",
    },
    {
      pregunta: "¿Se puede hacer en olla rápida?",
      respuesta:
        "Sí, reduce el tiempo según tu olla y termina la salsa destapada para concentrar el dulzor del vino.",
    },
  ],
  "puchero-andaluz": [
    {
      pregunta: "¿Qué es la pringá del puchero?",
      respuesta:
        "Las carnes cocidas (pollo, ternera, tocino, chorizo…) desmenuzadas, que se sirven en montadito o aparte del caldo y las verduras.",
    },
    {
      pregunta: "¿Se aprovecha el caldo?",
      respuesta:
        "Sí: caldo para sopa, carnes para ropa vieja o croquetas, y garbanzos al día siguiente. El puchero da varios platos.",
    },
  ],
  "gambas-al-ajillo": [
    {
      pregunta: "¿Cuánto se cocinan las gambas al ajillo?",
      respuesta:
        "Muy poco: cuando cambian de color y se rizan (1–2 minutos). Si se pasan, quedan gomosas.",
    },
    {
      pregunta: "¿Qué aceite usar?",
      respuesta:
        "AOVE suave o de oliva para freír a fuego medio-alto. El ajo debe dorarse sin quemarse; la guindilla es al gusto.",
    },
  ],
  "serranito-sevillano": [
    {
      pregunta: "¿Qué lleva un serranito de Sevilla?",
      respuesta:
        "Pan de picos o viena, lomo o pollo a la plancha, jamón, pimiento frito y a menudo tomate. Cada barra tiene su variante.",
    },
    {
      pregunta: "¿Se puede hacer con pollo?",
      respuesta:
        "Sí, el serranito de pollo es habitual. Sala bien, plancha fuerte y monta al momento para que el pan no se empape.",
    },
  ],
  "tocino-de-cielo": [
    {
      pregunta: "¿El tocino de cielo lleva harina?",
      respuesta:
        "No: es yema y almíbar, con caramelo. La textura es firme y brillante, distinta del flan con huevo entero.",
    },
    {
      pregunta: "¿Por qué se cuaja mal?",
      respuesta:
        "Almíbar demasiado caliente al añadir las yemas, o baño María demasiado fuerte. Cocina suave y deja enfriar del todo antes de desmoldar.",
    },
  ],
  "potaje-de-vigilia-andaluz": [
    {
      pregunta: "¿El potaje de vigilia lleva carne?",
      respuesta:
        "No: es de Cuaresma, con garbanzos, espinacas o verdura y a menudo bacalao. El sofrito lleva pimentón y ajo.",
    },
    {
      pregunta: "¿Se puede preparar de un día para otro?",
      respuesta:
        "Sí, incluso mejora. Guárdalo en nevera y añade un chorrito de AOVE al recalentar.",
    },
  ],
  "espeto-de-sardinas": [
    {
      pregunta: "¿Hace falta espeto de playa?",
      respuesta:
        "Lo ideal es brasa y caña, pero en casa puedes usar horno fuerte o parrilla muy caliente. Lo importante es sardina fresca y poco tiempo.",
    },
    {
      pregunta: "¿Se limpian las sardinas?",
      respuesta:
        "Tradicionalmente se espetan enteras, solo lavadas y saladas. Quien prefiera puede eviscerarlas antes.",
    },
  ],
  "polvorones-de-estepa": [
    {
      pregunta: "¿Cuál es la diferencia entre polvorón y mantecado?",
      respuesta:
        "Ambos llevan manteca y harina tostada; el polvorón suele ir más compacto y almendra, y se envuelve en papel. La frontera varía según obrador.",
    },
    {
      pregunta: "¿Cuánto duran?",
      respuesta:
        "Semanas en lugar fresco y seco, bien envueltos. Evita humedad: se reblandecen.",
    },
  ],
  "arroz-a-banda-andaluz": [
    {
      pregunta: "¿Qué significa arroz a banda?",
      respuesta:
        "El arroz se cocina en caldo de pescado y se sirve 'aparte' (a banda) del pescado. En Andalucía hay versiones costeras muy sabrosas.",
    },
    {
      pregunta: "¿Qué arroz usar?",
      respuesta:
        "Variedad de grano redondo o bomba. El punto es meloso o suelto según gusto, siempre con fumet intenso.",
    },
  ],
};

/** FAQ genérica pero personalizada con datos reales de la receta. */
export function buildFallbackFaq(receta: Receta): FaqItem[] {
  const n = receta.nombre;
  const total = receta.tiempoPreparacion + receta.tiempoCoccion;
  const items: FaqItem[] = [
    {
      pregunta: `¿Cuánto se tarda en hacer ${n}?`,
      respuesta: `Unos ${total} minutos en total (${receta.tiempoPreparacion} de preparación y ${receta.tiempoCoccion} de cocción), para ${receta.raciones} raciones. Dificultad ${receta.dificultad}.`,
    },
  ];

  switch (receta.categoria) {
    case "sopas-frias":
      items.push(
        {
          pregunta: `¿${n} se toma frío?`,
          respuesta: `Sí. Refrigéralo al menos 1 hora y sirve muy frío. Prueba sal y vinagre justo antes de llevarlo a la mesa.`,
        },
        {
          pregunta: `¿Cuánto dura ${n} en la nevera?`,
          respuesta: `Bien tapado, 2–3 días. Remueve o bate un momento si el aceite se ha separado.`,
        },
      );
      break;
    case "ensaladas":
      items.push(
        {
          pregunta: `¿Se puede preparar ${n} con antelación?`,
          respuesta: `Puedes cortar y cocer lo necesario antes, pero aliña al final para que no se pase de líquido ni pierda crujiente.`,
        },
        {
          pregunta: `¿${n} se sirve frío o templado?`,
          respuesta: `Según la receta: muchas ensaladas andaluzas van templadas (patata, pescado) o frescas. Sigue el punto de la elaboración.`,
        },
      );
      break;
    case "tapas":
      items.push(
        {
          pregunta: `¿${n} se sirve como tapa o plato?`,
          respuesta: `Funciona como tapa para compartir y, con más ración y pan, como plato ligero. Ajusta cantidades a tu mesa.`,
        },
        {
          pregunta: `¿Se puede recalentar ${n}?`,
          respuesta:
            receta.tiempoCoccion > 0
              ? `Sí, mejor a fuego suave o horno bajo para no resecar. Las frituras pierden crujiente: sírvelas al momento si puedes.`
              : `Es mejor montarlo al momento. Si sobra, conserva en nevera y termina el aliño o el montaje justo antes de servir.`,
        },
      );
      break;
    case "guisos":
      items.push(
        {
          pregunta: `¿${n} mejora de un día para otro?`,
          respuesta: `Sí, muchos guisos andaluces ganan reposo en nevera. Recalienta a fuego suave y añade un chorrito de caldo o agua si ha espesado demasiado.`,
        },
        {
          pregunta: `¿Se puede congelar ${n}?`,
          respuesta: `En general sí, hasta 2–3 meses. Descongela en nevera y rectifica sal. Las patatas pueden ablandarse un poco al descongelar.`,
        },
      );
      break;
    case "pescados":
      items.push(
        {
          pregunta: `¿Qué pescado elegir para ${n}?`,
          respuesta: `Lo más fresco posible, de lonja o confianza. Si la receta admite sustitutos, elige piezas de tamaño y grasa similares.`,
        },
        {
          pregunta: `¿Cómo sé si el punto de ${n} es correcto?`,
          respuesta: `La carne debe quedar jugosa y opaca, sin resecarse. En frituras, dorado rápido; en guisos, que se separe con facilidad sin deshacerse.`,
        },
      );
      break;
    case "arroces":
      items.push(
        {
          pregunta: `¿Qué tipo de arroz usar en ${n}?`,
          respuesta: `Arroz de grano redondo o bomba. Mide el caldo (aprox. 2–3 partes por 1 de arroz según el estilo) y no remuevas en exceso si buscas grano suelto.`,
        },
        {
          pregunta: `¿${n} queda caldoso o seco?`,
          respuesta: `Sigue el estilo de la receta. Ajusta el último chorro de caldo al final: es más fácil añadir líquido que recuperarlo.`,
        },
      );
      break;
    case "postres":
      items.push(
        {
          pregunta: `¿Cuánto dura ${n}?`,
          respuesta: `Lo ideal es el mismo día o al siguiente. Conserva en recipiente hermético, en lugar fresco; si lleva crema o leche, mejor en nevera.`,
        },
        {
          pregunta: `¿Se puede hacer ${n} con antelación?`,
          respuesta: `Muchos dulces andaluces aguantan bien 24 h. Los fritos pierden crujiente: si puedes, fríe cerca del momento de servir.`,
        },
      );
      break;
    default:
      items.push({
        pregunta: `¿Es difícil hacer ${n}?`,
        respuesta: `Está marcada como dificultad ${receta.dificultad}. Con mise en place y el modo cocina de la ficha, los pasos se siguen sin perder el hilo.`,
      });
  }

  items.push({
    pregunta: `¿${n} es típico de ${receta.provincia}?`,
    respuesta: `Sí, forma parte de la cocina de ${receta.provincia} y de la tradición andaluza. En la ficha tienes historia, ingredientes y el paso a paso completo.`,
  });

  return items.slice(0, 4);
}

export function getFaqForReceta(receta: Receta): FaqItem[] {
  const curated = FAQ_POR_RECETA[receta.id];
  if (!curated?.length) return buildFallbackFaq(receta);
  if (curated.length >= 3) return curated;
  // Completar hasta 3–4 con fallback sin duplicar preguntas
  const seen = new Set(curated.map((c) => c.pregunta));
  const extra = buildFallbackFaq(receta).filter((f) => !seen.has(f.pregunta));
  return [...curated, ...extra].slice(0, 4);
}
