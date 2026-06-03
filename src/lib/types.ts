/**
 * Categorias de valoracion general de las marcas.
 * Se usan para mostrar el resultado final con colores e iconos en la interfaz.
 */
export type RatingCategory = "Genial" | "Bueno" | "Regular" | "Evitar";

/**
 * Puntuaciones ambientales, sociales y de gobernanza.
 * Cada dimension se evalua de 0 a 5 segun los indicadores marcados.
 */
export interface ASGScores {
    /** Impacto ambiental: materiales, residuos, energia y agua. */
    ambiental: number;
    /** Impacto social: condiciones laborales, seguridad, diversidad y comunidad. */
    social: number;
    /** Gobernanza: transparencia, trazabilidad, etica y metodologia publicada. */
    gobernanza: number;
}

/**
 * Modelo de marca que consume la interfaz publica.
 * La capa de Supabase se normaliza a este formato antes de pintar las tarjetas.
 */
export interface Brand {
    /** Identificador unico de la marca. */
    id: string;
    /** Nombre comercial de la marca. */
    name: string;
    /** Categoria comercial principal. */
    category: string;
    /** Eslogan o frase breve de presentacion. */
    slogan: string;
    /** Descripcion visible en directorio y ficha. */
    description: string;
    /** Valoracion general calculada a partir de las puntuaciones ASG. */
    overallRating: RatingCategory;
    /** Desglose de puntuaciones por dimension. */
    asgScores: ASGScores;
    /** Ruta local o URL de imagen asociada a la marca. */
    imageUrl: string;
    /** Indica si la marca declara productos veganos. */
    isVegan: boolean;
    /** Indica si la marca declara comercio justo. */
    isFairTrade: boolean;
    /** Materiales principales declarados. */
    materials: string[];
}
