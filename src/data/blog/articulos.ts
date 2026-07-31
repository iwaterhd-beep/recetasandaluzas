export interface ArticuloBlog {
  slug: string;
  titulo: string;
  descripcion: string;
  publicadaEn: string;
  etiquetas: string[];
  /** Párrafos del artículo (HTML-safe text) */
  contenido: string[];
  /** IDs de recetas relacionadas */
  recetasRelacionadas: string[];
}

export const articulos: ArticuloBlog[] = [
  {
    slug: "mejores-tapas-sevilla",
    titulo: "Las mejores tapas de Sevilla para cocinar en casa",
    descripcion:
      "Guía de tapas sevillanas icónicas — espinacas con garbanzos, solomillo al whisky, huevos a la flamenca — con enlaces a recetas paso a paso.",
    publicadaEn: "2026-04-10",
    etiquetas: ["tapas", "Sevilla", "cocina andaluza"],
    contenido: [
      "Sevilla vive de tapa en tapa. No hace falta reservar en la Alfalfa para disfrutar de esa cocina de barra: con buena materia prima y un poco de paciencia, el solomillo al whisky o las espinacas con garbanzos salen en casa casi igual que en el bar de siempre.",
      "Empieza por las espinacas con garbanzos, plato de Cuaresma y de diario, con comino y pimentón. Sigue con los huevos a la flamenca, perfectos para una cena rápida, y remata con el solomillo al whisky si quieres impresionar sin complicarte la vida.",
      "La clave sevillana es el aceite de oliva generoso, el pan para mojar y no tener prisa con los sofritos. En nuestra colección tienes cada receta con tiempos reales y modo cocina para no perder el hilo entre sartén y vaso.",
    ],
    recetasRelacionadas: [
      "espinacas-con-garbanzos",
      "solomillo-al-whisky",
      "huevos-a-la-flamenca",
      "pescaito-frito",
    ],
  },
  {
    slug: "que-comer-semana-santa-andalucia",
    titulo: "Qué comer en Semana Santa en Andalucía",
    descripcion:
      "Torrijas, potaje de vigilia, bacalao y dulces conventuales: la mesa andaluza de Semana Santa explicada con recetas para repetir en casa.",
    publicadaEn: "2026-04-11",
    etiquetas: ["Semana Santa", "torrijas", "tradición"],
    contenido: [
      "La Semana Santa andaluza no es solo procesión: es olor a incienso, a cera y a torrija. En muchas casas el menú cambia hacia el pescado, las legumbres de vigilia y los dulces de sartén o de convento.",
      "Las torrijas mandan del Domingo de Ramos al de Resurrección. El arroz con bacalao y el remojón granadino cubren la parte salada con producto de temporada. Y si apetece algo para regalar o para el café, los pestiños y el tocino de cielo siguen la tradición conventual.",
      "Da igual si cocinas en un piso del centro de Málaga o en un cortijo: estas recetas están pensadas para hacerse con antelación, compartirse en bandeja y aguantar el ritmo de salidas a la calle.",
    ],
    recetasRelacionadas: [
      "torrijas",
      "arroz-con-bacalao",
      "remojon-granadino",
      "pestinos",
      "tocino-de-cielo",
    ],
  },
  {
    slug: "gazpacho-vs-salmorejo",
    titulo: "Gazpacho vs salmorejo: diferencias y cuándo hacer cada uno",
    descripcion:
      "Textura, ingredientes y origen: cómo distinguir gazpacho andaluz y salmorejo cordobés, y qué receta elegir según el momento.",
    publicadaEn: "2026-04-12",
    etiquetas: ["gazpacho", "salmorejo", "sopas frías"],
    contenido: [
      "Los dos son fríos, rojos y andaluces, pero no son el mismo plato. El gazpacho es más líquido, lleva pepino y pimiento, y se bebe en vaso o se toma a cucharadas ligeras. El salmorejo es crema espesa de tomate y pan, casi para untar, coronada con huevo y jamón.",
      "Si hace mucho calor y quieres hidratarte, gazpacho. Si buscas un primer plato con más cuerpo —o una tapa en cuenco— salmorejo. La porra antequerana se parece más al segundo, con pimiento y aún más densidad.",
      "En verano conviene prepararlos por la mañana, refrigerar bien y emulsionar el aceite con paciencia: esa seda en boca es lo que separa un buen resultado de un tomate batido cualquiera.",
    ],
    recetasRelacionadas: [
      "gazpacho-andaluz",
      "salmorejo-cordobes",
      "porra-antequerana",
      "ajoblanco-malagueno",
    ],
  },
];

export function getArticulo(slug: string): ArticuloBlog | undefined {
  return articulos.find((a) => a.slug === slug);
}

export function getAllArticuloSlugs(): string[] {
  return articulos.map((a) => a.slug);
}
