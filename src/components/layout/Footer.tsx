import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Pie de pagina comun.
 * Recoge enlaces principales y el contexto academico del proyecto.
 */
export function Footer() {
    return (
        <footer className="mt-20 w-full bg-[#1A1A1A] text-[#F2F0E9] rounded-t-[4rem] px-6 py-20 md:py-32 relative overflow-hidden">
            <div className="mx-auto max-w-7xl relative z-10 flex flex-col md:flex-row justify-between gap-16 md:gap-8">
                <div className="flex flex-col justify-between max-w-md">
                    <div>
                        <h2 className="font-serif italic text-4xl md:text-5xl font-light mb-6">Verethique</h2>
                        <p className="font-sans text-lg text-[#F2F0E9]/70 leading-relaxed font-medium">
                            Directorio academico para ordenar evidencias ASG de establecimientos de moda sostenible.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-16 md:gap-24 opacity-90">
                    <div className="flex flex-col gap-6">
                        <p className="font-mono text-xs tracking-widest uppercase text-[#F2F0E9]/75 mb-2 border-b border-[#F2F0E9]/40 pb-2">Archivo</p>
                        <nav aria-label="Navegacion del pie de pagina" className="flex flex-col gap-5">
                            <Link href="/" className="font-sans text-xl font-medium hover:text-[#D9653E] transition-colors flex items-center gap-2 group w-fit">
                                Inicio <ArrowRight className="w-5 h-5 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            </Link>
                            <Link href="/directorio" className="font-sans text-xl font-medium hover:text-[#D9653E] transition-colors flex items-center gap-2 group w-fit">
                                Directorio <ArrowRight className="w-5 h-5 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            </Link>
                            <Link href="/metodologia" className="font-sans text-xl font-medium hover:text-[#D9653E] transition-colors flex items-center gap-2 group w-fit">
                                Metodologia <ArrowRight className="w-5 h-5 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            </Link>
                            <Link href="/contacto" className="font-sans text-xl font-medium hover:text-[#D9653E] transition-colors flex items-center gap-2 group w-fit">
                                Contacto <ArrowRight className="w-5 h-5 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            </Link>
                        </nav>
                    </div>

                    <div className="flex flex-col gap-6">
                        <p className="font-mono text-xs tracking-widest uppercase text-[#F2F0E9]/75 mb-2 border-b border-[#F2F0E9]/40 pb-2">Contexto</p>
                        <p className="font-sans text-sm font-medium text-[#F2F0E9]/80 max-w-[220px] leading-relaxed">
                            Proyecto academico de Sergio Nunez para el TFG de la UOC.
                        </p>
                    </div>
                </div>
            </div>

            <div aria-hidden="true" className="absolute -bottom-10 md:-bottom-24 left-0 z-0 w-full text-center pointer-events-none opacity-[0.38] select-none flex justify-center">
                <span className="font-serif italic text-[20vw] leading-none tracking-tight">Transparencia</span>
            </div>
        </footer>
    );
}
