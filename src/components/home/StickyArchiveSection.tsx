"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

/**
 * Sección `StickyArchiveSection`
 * 
 * Sección final de la página principal que muestra los tres pilares o dimensiones de la revisión ASG.
 * Utiliza ScrollTrigger para hacer que cada tarjeta se fije en la pantalla y se desvanezca
 * cuando entra la siguiente, creando un efecto de profundidad tipo "pararell".
 */
export function StickyArchiveSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray<HTMLElement>(".archive-card");

            cards.forEach((card, index) => {
                if (index === cards.length - 1) return; // La última tarjeta no se escala ni se desenfoca

                // Fija la tarjeta actual en la pantalla
                ScrollTrigger.create({
                    trigger: card,
                    start: "top top",
                    end: "bottom top",
                    pin: true,
                    pinSpacing: false,
                    id: `pin-${index}`
                });

                // Escala, desenfoca y reduce la opacidad cuando la siguiente tarjeta aparece
                gsap.to(card, {
                    scale: 0.9,
                    opacity: 0.3,
                    filter: "blur(20px)",
                    scrollTrigger: {
                        trigger: cards[index + 1],
                        start: "top bottom",
                        end: "top top",
                        scrub: true,
                    }
                });
            });

        }, containerRef);
        return () => ctx.revert();
    }, []);

    const archiveData = [
        {
            title: "Materiales y circularidad",
            desc: "Analizamos la dependencia de fibras vírgenes sintéticas, la viabilidad real del reciclaje propuesto y los modelos de negocio que extienden la vida útil del producto más allá de la primera venta.",
            img: "/img/moodboard-3.jpg",
            metric: "Dimensión 01"
        },
        {
            title: "Impacto social y cadena de suministro",
            desc: "Evidencia de salarios dignos reales, auditorías independientes en fábricas deslocalizadas y políticas efectivas contra el trabajo forzoso. La responsabilidad no termina en la frontera.",
            img: "/img/moodboard-1.jpg",
            metric: "Dimensión 02"
        },
        {
            title: "Gobernanza y transparencia",
            desc: "La falta de datos públicos es un dato en sí mismo. Evaluamos la publicación de proveedores (Nivel 1 a 3), la estructura fiscal corporativa y los compromisos de emisiones auditados.",
            img: "/img/moodboard-2.jpg",
            metric: "Dimensión 03"
        }
    ];

    return (
        <section ref={containerRef} className="relative w-full bg-[#1A1A1A]">
            {archiveData.map((data, idx) => (
                <div key={idx} className="archive-card h-screen w-full flex items-center justify-center sticky top-0 bg-[#1A1A1A] pt-16 px-4 sm:px-8">
                    <div className="w-full max-w-7xl h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] rounded-[2rem] md:rounded-[3rem] overflow-hidden relative flex flex-col md:flex-row shadow-2xl bg-[#F2F0E9] border border-white/5">

                        {/* Panel de Imagen / Cubierta */}
                        <div className="w-full md:w-1/2 h-2/5 md:h-full relative overflow-hidden bg-[#2E4036]">
                            <Image
                                src={data.img}
                                alt={data.title}
                                fill
                                sizes="(min-width: 768px) 50vw, 100vw"
                                className="object-cover opacity-80 mix-blend-luminosity hover:scale-105 hover:mix-blend-normal transition-all duration-1000"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-[#1A1A1A]/80 md:from-[#1A1A1A]/50 to-transparent" />
                        </div>

                        {/* Panel de Contenido / Texto */}
                        <div className="w-full md:w-1/2 h-3/5 md:h-full p-8 md:p-16 lg:p-24 flex flex-col justify-center bg-[#F2F0E9]">
                            <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#B14A2A] border border-[#B14A2A] px-4 py-2 rounded-full w-fit mb-6 md:mb-10 font-bold">
                                {data.metric}
                            </span>
                            <h2 className="font-serif italic text-3xl md:text-5xl lg:text-5xl text-[#1A1A1A] mb-6 md:mb-8 leading-tight">
                                {data.title}
                            </h2>
                            <p className="font-sans text-base md:text-lg text-[#1A1A1A]/70 leading-relaxed font-medium">
                                {data.desc}
                            </p>
                        </div>
                    </div>
                </div>
            ))}

            {/* Espaciador inferior para permitir que el último elemento se libere de forma segura antes del pie */}
            <div className="h-[20vh] w-full bg-[#1A1A1A]"></div>
        </section>
    );
}
