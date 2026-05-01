"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";

/**
 * Sección `HeroSection`
 * 
 * Encabezado principal (Hero) de la página de inicio.
 * Emplea animaciones GSAP de entrada ("staggered fade-up") y una jerarquía visual
 * cinematográfica/editorial para captar la atención del usuario inmediatamente.
 */
export function HeroSection() {
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".hero-element", {
                y: 50,
                opacity: 0,
                duration: 1.4,
                stagger: 0.15,
                ease: "power4.out",
                delay: 0.3
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={heroRef} className="relative w-full h-dvh min-h-[700px] flex justify-start items-end pb-24 md:pb-32 overflow-hidden bg-[#1D211F]">
            {/* Textura de fondo */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-linear-to-t from-[#1A1A1A] via-[#1A1A1A]/40 to-transparent z-10" />
                <div className="absolute inset-0 bg-[#2E4036]/20 mix-blend-multiply z-10" />
                <Image
                    src="/img/fashion-hero-01.jpg"
                    alt="Cinematic Fashion"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center opacity-50 mix-blend-luminosity scale-[1.02]"
                />
            </div>

            <div className="relative z-20 mx-auto w-full max-w-7xl px-6 md:px-8">
                <div className="max-w-3xl">
                    <div className="hero-element mb-8 flex items-center gap-4">
                        <span className="w-10 h-px bg-[#CC5833]" />
                        <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] font-medium uppercase text-[#F2F0E9]/80">Indice de establecimientos que hacen las cosas bien</span>
                    </div>

                    <h1 className="hero-element font-sans text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-[#F2F0E9] mb-6 leading-[1.05] text-balance">
                        La moda necesita más que <span className="font-serif italic font-light tracking-normal block mt-1">promesas.</span>
                    </h1>

                    <p className="hero-element font-sans text-lg md:text-xl text-[#F2F0E9]/70 mb-12 max-w-xl leading-relaxed">
                        Verethiqué es una plataforma que utiliza criterios ASG y los aplica a los establecimientos del sector la moda para evaluar su nivel de compromiso con la sostenibilidad social y ambiental.
                    </p>

                    <div className="hero-element flex flex-col sm:flex-row gap-5 items-start">
                        <Link
                            href="/directorio"
                            className="group relative flex items-center justify-center px-10 py-5 bg-[#F2F0E9] text-[#1A1A1A] rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.02]"
                        >
                            <span className="absolute inset-0 bg-[#CC5833] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
                            <span className="relative z-10 font-sans text-xs font-bold uppercase tracking-[0.15em] group-hover:text-[#F2F0E9] transition-colors duration-500 flex items-center gap-3">
                                Explora el directorio <ArrowRight className="w-4 h-4" />
                            </span>
                        </Link>

                        <Link
                            href="/metodologia"
                            className="group relative flex items-center justify-center px-10 py-5 text-[#F2F0E9] border border-[#F2F0E9]/75 rounded-full transition-all duration-500 hover:border-[#F2F0E9] hover:bg-[#F2F0E9]/10"
                        >
                            <span className="relative z-10 font-sans text-xs font-bold uppercase tracking-[0.15em] flex items-center gap-3">
                                Ver metodología
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
