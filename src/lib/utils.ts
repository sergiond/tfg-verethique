import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utilidad para combinar clases de Tailwind CSS de forma segura.
 * Utiliza `clsx` para resolución condicional de clases y `twMerge` 
 * para resolver los conflictos (ej. px-4 y px-6 juntas).
 * 
 * @param inputs - Lista de clases de Tailwind CSS (strings, objetos, arrays).
 * @returns String con las clases combinadas y resueltas sin conflictos.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
