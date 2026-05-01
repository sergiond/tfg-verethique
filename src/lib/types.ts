/**
 * Categorías de valoración general de las marcas.
 * Estas categorías concluyen el sistema de calificaciones (Genial, Bueno, Regular, Evitar)
 * que luego se trasladan en los colores y emojis de la interfaz.
 */
export type RatingCategory = "Genial" | "Bueno" | "Regular" | "Evitar";
/**
 * Estructura de puntuaciones Ambientales, Sociales y de Gobernanza (ASG / ESG en inglés).
 * Cada puntuación se evalúa de 0 a 5.
 */
export interface ASGScores {
    /** Puntuación de impacto ambiental (emisiones, materiales, etc.) (0-5) */
    ambiental: number;
    /** Puntuación de impacto social (condiciones laborales, salarios, etc.) (0-5) */
    social: number;
    /** Puntuación de gobernanza y transparencia (auditorías, trazabilidad, etc.) (0-5) */
    gobernanza: number;
}

/**
 * LA Interfaz principal que define el modelo de datos de una Marca dentro del directorio.
 * Este objeto contiene toda la telemetría ASG y la información editorial.
 */
export interface Brand {
    /** Identificador único de la marca (ej: br-001) */
    id: string;
    /** Nombre comercial de la marca */
    name: string;
    /** Categoría comercial (ej: Ropa Deportiva, Streetwear, etc.) */
    category: string;
    /** Eslogan o frase breve de posicionamiento */
    slogan: string;
    /** Descripción detallada o revisión editorial de la marca */
    description: string;
    /** Valoración semántica general calculada en el sistema */
    overallRating: RatingCategory;
    /** Desglose de puntuaciones de la auditoría ASG */
    asgScores: ASGScores;
    /** Ruta de la imagen de fondo/portada de la marca (asset local o URL) */
    imageUrl: string;
    /** Determina si la marca certifica productos libres de explotación animal */
    isVegan: boolean;
    /** Determina si la marca posee certificación de comercio justo (FairTrade) */
    isFairTrade: boolean;
    /** Lista de los principales materiales declarados (ej: Algodón Orgánico, PET Reciclado) */
    materials: string[];
}
