import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/lib/types";
import { ratingIcons } from "@/lib/ratings";

/**
 * Componente `BrandCard`
 *
 * Tarjeta de visualización para una marca dentro del directorio.
 * Muestra valoración e información resumida con detalle desplegable.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Brand} props.brand - Objeto con todos los datos de la marca (tipado en `Brand`).
 */
export function BrandCard({ brand }: { brand: Brand }) {
    // Definición centralizada de colores editoriales para los iconos de valoración.
    const ratingStyles: Record<string, string> = {
        Genial: "text-[#3A7D44] drop-shadow-[0_0px_8px_rgba(255,255,255,0.9)]",
        Bueno: "text-[#4A7C8C] drop-shadow-[0_0px_8px_rgba(255,255,255,0.9)]",
        Regular: "text-[#C77D38] drop-shadow-[0_0px_8px_rgba(255,255,255,0.9)]",
        Evitar: "text-[#CC5833] drop-shadow-[0_0px_8px_rgba(255,255,255,0.9)]",
    };

    // Resuelve el icono desde el diccionario `ratingIcons` según la valoración de la marca.
    const RatingIcon = ratingIcons[brand.overallRating];

    // Imagen local estable para marcas sin imagen propia.
    const fallbackImages = ["/img/moodboard-1.jpg", "/img/moodboard-2.jpg", "/img/moodboard-3.jpg"];
    const hash = Array.from(brand.id).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const fallbackImage = fallbackImages[hash % fallbackImages.length];
    const imageSrc = brand.imageUrl && brand.imageUrl.trim() ? brand.imageUrl : fallbackImage;

    const detailText = brand.description?.trim() || "Sin detalles adicionales disponibles.";

    return (
        <article className="group relative flex flex-col h-full bg-white rounded-[2rem] border border-[#D1CFC7]/60 overflow-hidden hover:border-[#D1CFC7] transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1">
            {/* Imagen superior de la marca */}
            <div className="relative aspect-4/3 w-full bg-[#F2F0E9] overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={brand.name}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105 mix-blend-multiply opacity-90 group-hover:opacity-100"
                />

                {/* Insignia con icono de valoración */}
                <div className="absolute top-4 right-4 z-10">
                    <span
                        className={`transition-all duration-300 flex items-center justify-center ${ratingStyles[brand.overallRating] || "text-black"}`}
                        role="img"
                        aria-label={brand.overallRating}
                    >
                        {RatingIcon && <RatingIcon className="w-8 h-8 stroke-[2.5]" aria-hidden="true" />}
                        <span className="sr-only">{brand.overallRating}</span>
                    </span>
                </div>
            </div>

            {/* Contenido editorial */}
            <div className="p-6 md:p-8 flex flex-col flex-grow bg-white">
                <div className="flex justify-between items-start mb-3">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9E3F24]">{brand.category}</p>
                </div>

                <h3 className="font-serif italic text-3xl font-light text-[#1A1A1A] mb-4 group-hover:text-[#9E3F24] transition-colors">
                    {brand.name}
                </h3>

                <div className="flex flex-wrap gap-2 mb-8">
                    {brand.isVegan && (
                        <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-1 rounded border border-[#1A1A1A]/10 text-[#1A1A1A]/70">
                            Vegano
                        </span>
                    )}
                    {brand.isFairTrade && (
                        <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-1 rounded border border-[#1A1A1A]/10 text-[#1A1A1A]/70">
                            Comercio Justo
                        </span>
                    )}
                </div>

                {/* Panel de métricas ASG */}
                <div className="mt-auto pt-6 border-t border-[#D1CFC7]/50">
                    <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col">
                            <span className="font-mono text-[9px] text-[#1A1A1A]/70 uppercase tracking-widest mb-1.5">Ambiental</span>
                            <div className="flex items-center gap-2">
                                <span className="font-sans font-bold text-sm text-[#1A1A1A]">{brand.asgScores.ambiental}</span>
                                <span className="text-[#1A1A1A]/70 text-xs">/5</span>
                            </div>
                        </div>
                        <div className="flex flex-col border-l border-[#D1CFC7]/50 pl-2">
                            <span className="font-mono text-[9px] text-[#1A1A1A]/70 uppercase tracking-widest mb-1.5">Social</span>
                            <div className="flex items-center gap-2">
                                <span className="font-sans font-bold text-sm text-[#1A1A1A]">{brand.asgScores.social}</span>
                                <span className="text-[#1A1A1A]/70 text-xs">/5</span>
                            </div>
                        </div>
                        <div className="flex flex-col border-l border-[#D1CFC7]/50 pl-2">
                            <span className="font-mono text-[9px] text-[#1A1A1A]/70 uppercase tracking-widest mb-1.5">Gobernanza</span>
                            <div className="flex items-center gap-2">
                                <span className="font-sans font-bold text-sm text-[#1A1A1A]">{brand.asgScores.gobernanza}</span>
                                <span className="text-[#1A1A1A]/70 text-xs">/5</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desplegable "Ver más detalles" como en el directorio anterior */}
                <details className="mt-6 text-sm leading-relaxed text-[#1A1A1A]/80">
                    <summary className="cursor-pointer text-xs font-semibold underline decoration-[#1A1A1A]/40 underline-offset-4 hover:text-[#9E3F24] transition-colors">
                        Ver más detalles
                    </summary>
                    <p className="mt-3">{detailText}</p>
                </details>

                <Link
                    href={`/marca?id=${encodeURIComponent(brand.id)}`}
                    className="mt-6 inline-flex items-center justify-center rounded-full border border-[#1A1A1A]/20 px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-white"
                >
                    Ver ficha de marca
                </Link>
            </div>
        </article>
    );
}
