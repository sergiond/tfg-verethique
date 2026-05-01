import { Laugh, Smile, Meh, Frown, type LucideIcon } from "lucide-react";

/** 
 * Diccionario central de iconos para la valoración de las marcas.
 * transpola cada clave de valoración general a un icono de Lucide (line-art minimalista).
 * Los iconos son monocromáticos y heredan el color de texto del contenedor padre.
 * Esto permite centralizar la lógica visual y facilitar cambios de diseño de forma global.
 */
export const ratingIcons: Record<string, LucideIcon> = {
    Genial: Laugh,   // Sonrisa amplia — valoración máxima
    Bueno: Smile,    // Sonrisa suave — valoración positiva
    Regular: Meh,    // Boca recta — valoración media o neutra
    Evitar: Frown,   // Boca hacia abajo — valoración negativa o alerta
};
