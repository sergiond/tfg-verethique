"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Search, Laugh, Smile, Frown } from "lucide-react";

const ANALYSIS_MESSAGES = [
    "transparencia corporativa",
    "materiales y circularidad",
    "salarios dignos",
    "auditorias de proveedores",
    "emisiones y energia",
];

/**
 * Bloque visual de la portada.
 * Resume las tres dimensiones ASG y muestra una busqueda animada para explicar el directorio.
 */
export function DashboardSection() {
    return (
        <section className="py-24 md:py-32 bg-[#F2F0E9] border-b border-[#D1CFC7]/50 overflow-hidden relative z-10">
            <div className="mx-auto max-w-7xl px-6 md:px-8">
                <div className="mb-20 max-w-2xl">
                    <h2 className="font-serif italic text-4xl md:text-5xl lg:text-5xl text-[#1A1A1A] mb-8 leading-tight">
                        Evaluacion
                    </h2>
                    <p className="font-sans text-lg text-[#1A1A1A]/70 leading-relaxed font-medium">
                        Evaluamos la sostenibilidad mas alla del relato de marca. Analizamos el desempeno ambiental, social y la transparencia corporativa mediante criterios de acceso publico y metodologias basadas en evidencia.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <ASGRatingStack />
                    <AnalysisTypewriter />
                    <FilterScheduler />
                </div>
            </div>
        </section>
    );
}

/**
 * Tarjetas rotatorias para explicar las dimensiones Ambiental, Social y Gobernanza.
 */
function ASGRatingStack() {
    const [cards, setCards] = useState([
        { id: "ambiental", label: "Ambiental", desc: "Materiales, Circularidad", color: "#2E4036", text: "#F2F0E9" },
        { id: "social", label: "Social", desc: "Cadena de suministro", color: "#4A6356", text: "#F2F0E9" },
        { id: "gobernanza", label: "Gobernanza", desc: "Transparencia, Evidencia", color: "#1A1A1A", text: "#F2F0E9" },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCards((prev) => {
                const newCards = [...prev];
                const last = newCards.pop();
                if (last) newCards.unshift(last);
                return newCards;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white rounded-[2rem] p-8 border border-[#D1CFC7] shadow-sm flex flex-col h-[400px]">
            <div className="flex items-center gap-3 mb-auto">
                <span className="w-2 h-2 rounded-full bg-[#CC5833]" />
                <span className="font-mono text-[10px] md:text-xs tracking-[0.15em] uppercase text-[#1A1A1A]/70">Dimensiones de analisis</span>
            </div>

            <div className="relative h-[220px] w-full mt-8 pointer-events-none">
                {cards.map((card, idx) => {
                    const isTop = idx === 2;
                    const isMid = idx === 1;

                    return (
                        <div
                            key={card.id}
                            className="absolute w-full rounded-[1.5rem] p-6 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-lg"
                            style={{
                                backgroundColor: card.color,
                                color: card.text,
                                top: isTop ? 40 : isMid ? 20 : 0,
                                scale: isTop ? 1 : isMid ? 0.95 : 0.9,
                                opacity: 1,
                                zIndex: idx,
                                transformOrigin: "top center",
                            }}
                        >
                            <h3 className="font-sans font-bold text-xl mb-1">{card.label}</h3>
                            <p className="font-mono text-xs uppercase tracking-wider text-[#F2F0E9]">{card.desc}</p>

                            <div className="mt-12 flex justify-between items-end">
                                <div className="space-y-1">
                                    <div className="w-16 h-1 bg-white/20 rounded-full" />
                                    <div className="w-10 h-1 bg-white/20 rounded-full" />
                                </div>
                                <span className="font-mono text-[10px] tracking-widest">ASG-0{idx + 1}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/**
 * Texto animado sencillo para mostrar ejemplos de criterios revisados.
 */
function AnalysisTypewriter() {
    const [text, setText] = useState("");
    const [msgIdx, setMsgIdx] = useState(0);

    useEffect(() => {
        let currentText = "";
        let i = 0;
        let isTyping = true;
        let timeout: NodeJS.Timeout;

        const type = () => {
            const targetMsg = ANALYSIS_MESSAGES[msgIdx];
            if (isTyping) {
                if (i < targetMsg.length) {
                    currentText += targetMsg.charAt(i);
                    setText(currentText);
                    i++;
                    timeout = setTimeout(type, 50);
                } else {
                    isTyping = false;
                    timeout = setTimeout(type, 2000);
                }
            } else if (i > 0) {
                currentText = currentText.slice(0, -1);
                setText(currentText);
                i--;
                timeout = setTimeout(type, 20);
            } else {
                isTyping = true;
                setMsgIdx((prev) => (prev + 1) % ANALYSIS_MESSAGES.length);
            }
        };

        timeout = setTimeout(type, 500);
        return () => clearTimeout(timeout);
    }, [msgIdx]);

    return (
        <div className="bg-white rounded-[2rem] p-8 border border-[#D1CFC7] shadow-sm flex flex-col h-[400px]">
            <div className="flex items-center gap-3 mb-8">
                <span className="w-2 h-2 rounded-full bg-[#CC5833]" />
                <span className="font-mono text-[10px] md:text-xs tracking-[0.15em] uppercase text-[#1A1A1A]/70">Metricas de analisis</span>
            </div>

            <div className="font-serif text-3xl md:text-4xl text-[#1A1A1A] leading-tight mt-auto mb-auto relative pr-2">
                <span className="italic text-[#1A1A1A]/60">Evaluando </span>
                <span className="font-bold text-[#CC5833]">{text}</span>
                <span className="inline-block w-0.5 h-8 bg-[#1A1A1A]/30 ml-1 animate-pulse align-middle" />
            </div>

            <div className="mt-auto border-t border-[#D1CFC7]/50 pt-5 flex justify-between items-center">
                <span className="font-mono text-[10px] tracking-widest uppercase text-[#1A1A1A]/70">Actualizacion continua</span>
            </div>
        </div>
    );
}

/**
 * Animacion decorativa que representa el filtrado de resultados del directorio.
 */
function FilterScheduler() {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

            tl.to(".search-cursor", { x: 40, y: 70, duration: 1, ease: "power3.inOut" })
                .to(".search-box", { borderColor: "#2E4036", duration: 0.2 })
                .to(".search-term", { opacity: 1, display: "inline-block", duration: 0.1 })
                .to(".search-cursor", { x: 180, y: 150, duration: 1, ease: "power3.inOut", delay: 0.5 })
                .to(".rating-filter-middle", { backgroundColor: "rgba(74, 124, 140, 0.1)", borderColor: "#4A7C8C", duration: 0.2 })
                .to(".result-row-first", { opacity: 0.4, scale: 0.98, duration: 0.3, yoyo: true, repeat: 1 })
                .to(".result-row-second", { opacity: 0.4, scale: 0.98, duration: 0.3, yoyo: true, repeat: 1 }, "-=0.2")
                .to(".search-cursor", { x: 250, y: 250, duration: 1.2, ease: "power2.inOut", delay: 1 })
                .to(".search-box", { borderColor: "rgba(209,207,199,0.5)", duration: 0.2 })
                .to(".search-term", { opacity: 0, display: "none", duration: 0.1 })
                .to(".rating-filter-middle", { backgroundColor: "transparent", borderColor: "#D1CFC7", duration: 0.2 })
                .to(".search-cursor", { x: 0, y: 0, duration: 1, ease: "power3.inOut" });
        }, rootRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={rootRef} className="bg-white rounded-[2rem] p-8 border border-[#D1CFC7] shadow-sm flex flex-col h-[400px] relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#2E4036]" />
                <span className="font-mono text-[10px] md:text-xs tracking-[0.15em] uppercase text-[#1A1A1A]/70">Busqueda en directorio</span>
            </div>

            <div className="relative flex-1 mt-4">
                <div className="search-box flex items-center gap-3 px-4 py-3 border-2 border-[#D1CFC7]/50 rounded-full mb-6 transition-colors bg-[#F2F0E9]/30">
                    <Search className="w-4 h-4 text-[#1A1A1A]/50" />
                    <span className="font-mono text-[10px] md:text-xs text-[#1A1A1A]/40 flex-1 uppercase tracking-wider">
                        <span className="search-term opacity-0 font-medium text-[#1A1A1A]">marca circular</span>
                    </span>
                </div>

                <div className="flex gap-3 mb-8">
                    <div className="flex items-center justify-center p-2.5 rounded-full border border-[#D1CFC7] text-[#3A7D44] bg-white shadow-sm"><Laugh className="w-5 h-5" /></div>
                    <div className="rating-filter-middle flex items-center justify-center p-2.5 rounded-full border border-[#D1CFC7] text-[#4A7C8C] bg-white shadow-sm transition-all"><Smile className="w-5 h-5" /></div>
                    <div className="flex items-center justify-center p-2.5 rounded-full border border-[#D1CFC7] text-[#CC5833] bg-white shadow-sm"><Frown className="w-5 h-5" /></div>
                </div>

                <div className="space-y-3">
                    <div className="result-row-first w-full h-14 bg-[#F2F0E9] rounded-[1rem] border border-[#D1CFC7]/40 flex items-center px-4 gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#D1CFC7]/50" />
                        <div className="space-y-1.5 flex-1">
                            <div className="h-2 w-1/3 bg-[#D1CFC7] rounded-full" />
                            <div className="h-1.5 w-1/4 bg-[#D1CFC7]/50 rounded-full" />
                        </div>
                    </div>
                    <div className="result-row-second w-full h-14 bg-[#F2F0E9] rounded-[1rem] border border-[#D1CFC7]/40 flex items-center px-4 gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#D1CFC7]/50" />
                        <div className="space-y-1.5 flex-1">
                            <div className="h-2 w-1/2 bg-[#D1CFC7] rounded-full" />
                            <div className="h-1.5 w-1/3 bg-[#D1CFC7]/50 rounded-full" />
                        </div>
                    </div>
                </div>

                <div className="search-cursor absolute top-0 left-0 w-6 h-6 z-10 pointer-events-none drop-shadow-xl" style={{ transform: "translate(0px, 0px)" }}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4L11 20L14.5 14.5L20 11L4 4Z" fill="#1A1A1A" stroke="#F2F0E9" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
