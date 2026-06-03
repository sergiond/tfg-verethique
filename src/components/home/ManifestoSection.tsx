"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registra de forma segura el plugin de ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

/**
 * Sección `ManifestoSection`
 * 
 * Componente central que muestra el "manifiesto" de la plataforma, usando animaciones
 * atadas al scroll. Establece el tono crítico
 * y basado en las evidencias del sitio.
 */
export function ManifestoSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".manifesto-line", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 70%",
                },
                y: 60,
                duration: 1.5,
                stagger: 0.3,
                ease: "power3.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative w-full bg-[#1A1A1A] py-32 md:py-48 overflow-hidden flex flex-col items-center justify-center">
            {/* Textura con efecto */}
            <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none">
                <Image
                    src="/img/moodboard-2.jpg"
                    alt="Texture"
                    fill
                    sizes="100vw"
                    className="object-cover object-center grayscale"
                />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-8 text-center flex flex-col items-center">
                <div className="manifesto-line mb-10 flex items-center justify-center gap-4">
                    <span className="w-12 h-px bg-[#D9653E]" />
                    <p className="font-mono text-xs md:text-sm tracking-[0.3em] uppercase text-[#D9653E]">
                        Nuestra base
                    </p>
                    <span className="w-12 h-px bg-[#D9653E]" />
                </div>

                <div className="overflow-hidden mb-8 md:mb-10">
                    <h2 className="manifesto-line font-sans text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#F2F0E9] leading-none">
                        El mercado adora las promesas.
                    </h2>
                </div>
                <div className="overflow-visible pb-1 md:pb-2">
                    <h2 className="manifesto-line font-serif italic text-5xl md:text-7xl lg:text-8xl font-light text-[#F2F0E9] leading-[1.05]">
                        Nosotros exigimos las pruebas.
                    </h2>
                </div>
            </div>
        </section>
    );
}
