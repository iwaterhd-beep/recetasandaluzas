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
  {
    slug: "mejores-tapas-andalucia",
    titulo: "Las mejores tapas de Andalucía para cocinar en casa",
    descripcion:
      "De Cádiz a Jaén: tortillitas, flamenquines, gambas al ajillo, papas aliñás y más tapas andaluzas con receta paso a paso.",
    publicadaEn: "2026-04-18",
    etiquetas: ["tapas", "Andalucía", "barra"],
    contenido: [
      "Andalucía se entiende mejor de tapa en tapa. No hay una sola barra canónica: en Cádiz mandan las frituras y el adobo, en Córdoba el flamenquín, en Málaga el espeto y el ajoblanco como contrapunto fresco, en Sevilla el solomillo al whisky y las espinacas con garbanzos.",
      "Para montar una mesa de tapas en casa, elige dos frituras (pescaito, puntillitas o berenjenas con miel de caña), una de plancha (gambas al ajillo o presa ibérica) y una fría (boquerones en vinagre o papas aliñás). Así repartes tiempos de fuego y no saturas el aceite.",
      "Todas las recetas de esta guía tienen modo cocina, temporizadores donde hace falta y trucos de aceite y punto. Empieza por las que ya te suenan del bar de tu pueblo y completa con una tapa de otra provincia: el mapa se nota en el plato.",
    ],
    recetasRelacionadas: [
      "tortillitas-de-camarones",
      "flamenquines-cordobeses",
      "gambas-al-ajillo",
      "papas-alinas",
      "boquerones-en-vinagre",
      "berenjenas-fritas-miel-cana",
      "espinacas-con-garbanzos",
      "queso-payoyo-frito",
    ],
  },
  {
    slug: "comida-tipica-cadiz",
    titulo: "Comida típica de Cádiz: pescaito, adobos y dulces",
    descripcion:
      "Qué comer en Cádiz: pescaito frito, cazón en adobo, tortillitas de camarones, urta a la roteña y alfajores. Recetas para casa.",
    publicadaEn: "2026-04-19",
    etiquetas: ["Cádiz", "pescaito", "comida típica"],
    contenido: [
      "La cocina gaditana mira al Atlántico: lonja, fritura limpia y adobos con comino y pimentón. El pescaito frito es el icono, pero la provincia también da ortiguillas, papas aliñás, urta a la roteña y una repostería de feria y convento —alfajores, pan de Cádiz— que conviene no olvidar.",
      "Si visitas Cádiz o quieres recrear esa mesa lejos del puerto, empieza por una fritura en tandas (aceite caliente, pescado seco) y un plato de cuchara o horno como la urta. De tapa fría, el cazón en adobo o los boquerones en vinagre abren el apetito sin encender los fogones del todo.",
      "En nuestra colección tienes cada receta típica de Cádiz con ingredientes medidos y pasos claros. El secreto gaditano no es misterioso: producto fresco, harina ligera y no amontonar en la sartén.",
    ],
    recetasRelacionadas: [
      "pescaito-frito",
      "cazon-en-adobo",
      "tortillitas-de-camarones",
      "urta-a-la-rotena",
      "ortiguillas-fritas",
      "papas-alinas",
      "alfajores-medina-sidonia",
      "pan-de-cadiz",
    ],
  },
  {
    slug: "postres-andaluces-navidad",
    titulo: "Postres andaluces tradicionales para Navidad",
    descripcion:
      "Mantecados, polvorones, roscos de vino, pestiños y yemas: dulces andaluces de Navidad con recetas para hornear en casa.",
    publicadaEn: "2026-04-20",
    etiquetas: ["Navidad", "postres", "mantecados"],
    contenido: [
      "La Navidad andaluza huele a manteca tostada, a ajonjolí y a anís. Estepa envía mantecados y polvorones a media España; en otras casas se fríen pestiños, se hornean roscos de vino o se reservan yemas de convento para el café de sobremesa.",
      "Si cocinas con antelación, prioriza lo que aguanta envuelto (mantecados, polvorones, roscos). Deja las frituras —pestiños, borrachuelos— para cerca de las fiestas, cuando aún crujen. Un buen AOVE suave o manteca de calidad marca la diferencia más que cualquier molde de silicona.",
      "Estas recetas de postres andaluces de Navidad están pensadas para horno de casa y tandas razonables. Combina dos dulces secos y uno de sartén: tendrás bandeja de visita sin pasar tres días en la cocina.",
    ],
    recetasRelacionadas: [
      "mantecados-de-estepa",
      "polvorones-de-estepa",
      "roscos-de-vino",
      "pestinos",
      "yemas-de-san-leandro",
      "borrachuelos-malaguenos",
      "tortas-de-aceite-castilleja",
      "mostachones-de-utrerra",
    ],
  },
  {
    slug: "guisos-invierno-andalucia",
    titulo: "Guisos de invierno andaluces: cuchara para el frío",
    descripcion:
      "Puchero, berza, lentejas, ropa vieja y rabo de toro: guisos andaluces de invierno con recetas lentas y sabrosas.",
    publicadaEn: "2026-04-21",
    etiquetas: ["guisos", "invierno", "puchero"],
    contenido: [
      "Cuando baja la temperatura, Andalucía saca la olla. El puchero (y su pringá), la berza jiennense, las lentejas, los callos o el rabo de toro cordobés son cocina de paciencia: fuego suave, sofrito bien hecho y reposo.",
      "Un truco de casa: cocina de más. Estos guisos mejoran al día siguiente y alimentan varias comidas —croquetas de puchero, ropa vieja, montadito de pringá—. El caldo solo ya vale una cena con fideos o pan del día anterior.",
      "En las fichas encontrarás tiempos reales y el orden de los ingredientes para no pasar las legumbres ni quedar corto de caldo. Ideal para domingo en casa o meal prep de semana fría.",
    ],
    recetasRelacionadas: [
      "puchero-andaluz",
      "berza-jiennense",
      "lentejas-andaluzas",
      "ropa-vieja-andaluza",
      "rabo-de-toro-cordobes",
      "callos-a-la-andaluza",
      "guiso-de-patatas-con-costilla",
      "olla-de-san-anton",
    ],
  },
];

export function getArticulo(slug: string): ArticuloBlog | undefined {
  return articulos.find((a) => a.slug === slug);
}

export function getAllArticuloSlugs(): string[] {
  return articulos.map((a) => a.slug);
}
