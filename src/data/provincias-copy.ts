import type { Provincia } from "@/types/receta";

/** Introducciones SEO para landings /provincia/[slug] */
export const PROVINCIA_INTROS: Record<
  Provincia,
  { lead: string; cuerpo: string; keywords: string[] }
> = {
  Sevilla: {
    lead: "De la tapa de barra al puchero de domingo: la cocina sevillana es generosa, de sofrito y aceite.",
    cuerpo:
      "En Sevilla se come de pie y de sobremesa. Las espinacas con garbanzos, el solomillo al whisky, el serranito y los huevos a la flamenca definen la barra; en casa mandan el puchero, las torrijas y el gazpacho cuando aprieta el calor. Aquí encontrarás recetas típicas de Sevilla con pasos claros, tiempos reales y modo cocina para no perder el hilo entre sartén y pan.",
    keywords: [
      "comida típica de Sevilla",
      "qué comer en Sevilla",
      "tapas sevillanas",
      "recetas de Sevilla",
    ],
  },
  Córdoba: {
    lead: "Salmorejo, flamenquines y rabo de toro: Córdoba cocina con tomate, pan y paciencia.",
    cuerpo:
      "La mesa cordobesa equilibra el frío del salmorejo con guisos de cuchara y frituras de barra. El Montilla-Moriles aparece en salsas como la carrillada al Pedro Ximénez, y la repostería conventual deja yemas y dulces de sartén. Estas recetas de Córdoba te acercan a esa despensa: pan candeal, AOVE y producto de interior.",
    keywords: [
      "comida típica de Córdoba",
      "recetas cordobesas",
      "salmorejo cordobés",
      "qué comer en Córdoba",
    ],
  },
  Cádiz: {
    lead: "Pescaito, adobos y ortiguillas: Cádiz mira al Atlántico y fríe con oficio.",
    cuerpo:
      "La cocina gaditana huele a fritura limpia, a adobo de cazón y a vino de Jerez. Tortillitas de camarones, papas aliñás, urta a la roteña o alfajores de Medina Sidonia cuentan la provincia de la costa a la sierra. En esta guía tienes la comida típica de Cádiz lista para repetir en casa, con trucos de aceite y temperatura.",
    keywords: [
      "comida típica de Cádiz",
      "pescaito frito",
      "recetas gaditanas",
      "qué comer en Cádiz",
    ],
  },
  Málaga: {
    lead: "Ajoblanco, espeto y boquerones: Málaga une huerta, mar y chiringuito.",
    cuerpo:
      "En la Costa del Sol el espeto de sardinas convive con el ajoblanco de almendras, las ensaladas malagueñas y los dulces como borrachuelos o mostachones de la provincia. La fritura es ligera y el limón no falta. Explora recetas típicas de Málaga pensadas para calor, terraza y mesa compartida.",
    keywords: [
      "comida típica de Málaga",
      "ajoblanco malagueño",
      "espeto de sardinas",
      "qué comer en Málaga",
    ],
  },
  Granada: {
    lead: "Remojón, Sacromonte y tropiezos de sierra: Granada cocina entre vega y montaña.",
    cuerpo:
      "La cocina granadina mezcla salazón, naranja y platos de interior. El remojón, la tortilla del Sacromonte o los piononos de Santa Fe son tarjeta de visita. También hay habas con jamón y guisos de cuchara cuando baja la temperatura. Aquí van recetas de Granada con el equilibrio entre tapas y plato único.",
    keywords: [
      "comida típica de Granada",
      "remojón granadino",
      "recetas granadinas",
      "qué comer en Granada",
    ],
  },
  Huelva: {
    lead: "Marisco, arroz marinero y jamón de sierra: Huelva cocina entre marea y dehesa.",
    cuerpo:
      "De la costa onubense salen chocos con habas, arroz marinero y pescados de lonja; de la sierra, el ibérico. La cocina de Huelva es directa, con poco adorno y mucho producto. Estas recetas típicas de Huelva te ayudan a llevar esa despensa atlántica a la cazuela de casa.",
    keywords: [
      "comida típica de Huelva",
      "recetas onubenses",
      "arroz marinero",
      "qué comer en Huelva",
    ],
  },
  Jaén: {
    lead: "AOVE, berza y pipirrana: Jaén cocina con aceite y verdura de secano.",
    cuerpo:
      "Jaén es capital del olivar: el aceite de oliva virgen extra marca aliños, sofritos y guisos. La berza jiennense, la pipirrana o los potajes de invierno definen una cocina de interior contundente y clara. Descubre recetas típicas de Jaén donde el AOVE no es adorno, sino protagonista.",
    keywords: [
      "comida típica de Jaén",
      "berza jiennense",
      "recetas de Jaén",
      "AOVE Jaén",
    ],
  },
  Almería: {
    lead: "Gurullos, ajo colorao y huerta: Almería cocina con sol y secano.",
    cuerpo:
      "Entre invernadero y desierto, la cocina almeriense aprovecha verdura, legumbre y platos de cuchara como los gurullos o el ajo colorao. También hay pescado de lonja y tapas de barra. Estas recetas de Almería acercan esa despensa mediterránea y austera, con sabor intenso y poca complicación.",
    keywords: [
      "comida típica de Almería",
      "gurullos almerienses",
      "recetas almerienses",
      "qué comer en Almería",
    ],
  },
};
