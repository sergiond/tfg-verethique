"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

/**
 * Componente `Navbar`
 * 
 * Se trata de la barra de navegación principal del sitio.
 * Implementa un diseño fijo que cambia de transparente a sólido con un desenfoque
 * cuando el usuario hace scroll. También incluye un menú superpuesto
 */
export function Navbar() {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isOverlayOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOverlayOpen]);

    const isHome = pathname === "/";
    const isDarkAtTop = isHome; // Estado inicia del sitio

    return (
        <>
            <header className="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-5xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                <div className={`
                    flex items-center justify-between px-5 md:px-7 transition-all duration-500 rounded-full
                    ${isScrolled
                        ? "h-16 bg-white/60 backdrop-blur-xl border border-primary/35 shadow-[0_8px_30px_rgb(0,0,0,0.06)] text-primary"
                        : `h-16 border border-transparent ${isDarkAtTop ? "text-background" : "text-primary"}`
                    }
                `}>

                    <Link href="/" className="font-serif italic text-[1.95rem] md:text-[2.15rem] font-semibold tracking-tight relative group px-1 leading-[1.08]" onClick={() => setIsOverlayOpen(false)}>
                        <span className="relative z-10">Verethiqué</span>
                    </Link>

                    <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-7 font-sans font-medium text-sm tracking-widest uppercase">
                        {["Inicio", "Metodología"].map((item, i) => {
                            const paths = ["/", "/metodologia"];
                            return (
                                <Link
                                    key={i}
                                    href={paths[i]}
                                    className="relative group overflow-hidden py-1"
                                >
                                    <span className="relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-[120%] block">{item}</span>
                                    <span className="absolute inset-0 z-10 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] translate-y-[120%] group-hover:translate-y-0 flex items-center justify-center font-bold text-accent">{item}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-3 md:gap-4">
                        <Link
                            href="/directorio"
                            className={`hidden md:inline-flex relative items-center justify-center px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-500 overflow-hidden group
                                ${isScrolled || !isDarkAtTop ? "bg-primary text-primary-foreground hover:bg-primary/95" : "bg-background text-foreground hover:bg-background/90"}`
                            }
                        >
                            <span className="relative z-10 group-hover:text-accent transition-colors duration-300">Directorio</span>
                        </Link>

                        <Link
                            href="/contacto"
                            className={`hidden md:inline-flex relative items-center justify-center px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-500 overflow-hidden group
                                ${isScrolled || !isDarkAtTop ? "border border-primary/60 text-primary hover:bg-primary/15" : "border border-background/80 text-background hover:bg-background/20"}`
                            }
                        >
                            <span className="relative z-10 transition-colors duration-300">Contacto</span>
                        </Link>

                        <button
                            className="inline-flex md:hidden items-center justify-center rounded-full p-2 transition-transform hover:scale-105"
                            onClick={() => setIsOverlayOpen(true)}
                            aria-label="Menú principal"
                            aria-expanded={isOverlayOpen}
                            aria-controls="nav-overlay"
                        >
                            <Menu className="w-7 h-7" strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </header>

            <div
                id="nav-overlay"
                aria-hidden={!isOverlayOpen}
                className={`fixed inset-0 z-50 bg-[#F2F0E9]/95 backdrop-blur-2xl transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex flex-col ${isOverlayOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
            >
                <div className="flex h-28 items-center justify-between px-8 sm:px-16 w-full max-w-7xl mx-auto">
                    <span className="font-serif italic text-3xl font-semibold text-primary">Verethiqué</span>
                    <button
                        className="p-3 text-primary transition-transform hover:rotate-90 hover:scale-110"
                        onClick={() => setIsOverlayOpen(false)}
                        aria-label="Cerrar menú"
                    >
                        <X className="w-10 h-10" strokeWidth={1} />
                    </button>
                </div>

                <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 w-full max-w-7xl mx-auto">
                    <nav aria-label="Navegación móvil" className="flex flex-col gap-6 sm:gap-10">
                        {[
                            { name: "Inicio", path: "/" },
                            { name: "Metodología", path: "/metodologia" },
                            { name: "Directorio", path: "/directorio" },
                            { name: "Contacto", path: "/contacto" }
                        ].map((item, i) => (
                            <Link
                                key={i}
                                href={item.path}
                                className="font-serif italic text-5xl sm:text-7xl lg:text-8xl text-primary hover:text-accent transition-colors duration-500 w-fit group flex items-center"
                                onClick={() => setIsOverlayOpen(false)}
                            >
                                <span className="group-hover:translate-x-6 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]">{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-20 max-w-md">
                        <p className="font-mono text-sm tracking-widest uppercase text-primary/85 mb-5 border-b border-primary/40 pb-5">
                            Sostenibilidad social y ambiental
                        </p>
                        <p className="font-sans text-lg text-primary/80 leading-relaxed font-medium">
                            Una plataforma independiente que evalúa la transparencia, trazabilidad y gobernanza en la industria textil. Exigimos evidencias, no afirmaciones.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

