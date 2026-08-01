/** Unidades de medida para ingredientes de cocina */
export type UnidadIngrediente =
  | "g"
  | "kg"
  | "ml"
  | "l"
  | "cucharada"
  | "cucharadita"
  | "unidad"
  | "diente"
  | "pizca"
  | "al gusto";

export type Dificultad = "fácil" | "media" | "difícil";

export type Provincia =
  | "Córdoba"
  | "Sevilla"
  | "Cádiz"
  | "Granada"
  | "Málaga"
  | "Huelva"
  | "Jaén"
  | "Almería";

export type Categoria =
  | "sopas-frias"
  | "tapas"
  | "guisos"
  | "pescados"
  | "arroces"
  | "postres"
  | "ensaladas";

export interface Ingrediente {
  id: string;
  nombre: string;
  cantidadBase: number;
  unidad: UnidadIngrediente;
  notas?: string;
}

export interface Paso {
  numero: number;
  titulo: string;
  descripcion: string;
  /** Si existe, el modo cocina muestra temporizador circular */
  tiempoSegundos?: number;
  consejo?: string;
}

export interface InformacionNutricional {
  calorias: number;
  proteinas: number;
  grasas: number;
  carbohidratos: number;
}

/** Pregunta frecuente (People Also Ask / FAQPage schema) */
export interface FaqItem {
  pregunta: string;
  respuesta: string;
}

export interface Receta {
  id: string;
  nombre: string;
  provincia: Provincia;
  categoria: Categoria;
  etiquetasSEO: string[];
  dificultad: Dificultad;
  tiempoPreparacion: number;
  tiempoCoccion: number;
  raciones: number;
  valoracion: number;
  numValoraciones: number;
  descripcion: string;
  historia: string;
  ingredientes: Ingrediente[];
  pasos: Paso[];
  informacionNutricional?: InformacionNutricional;
  imagenes: string[];
  video?: string;
  /** Maridaje sugerido (SEO / contenido enriquecido) */
  maridaje?: string;
  /** Variantes del plato */
  variantes?: string;
  /** FAQ para rich results y sección on-page */
  faq?: FaqItem[];
  /** Fecha ISO para ordenar por "más recientes" */
  publicadaEn?: string;
}

export interface RecetaResumen {
  id: string;
  nombre: string;
  provincia: Provincia;
  categoria: Categoria;
  dificultad: Dificultad;
  tiempoTotal: number;
  valoracion: number;
  numValoraciones: number;
  imagen: string;
  descripcion: string;
}
