import { Suspense } from "react";
import { BrandDetailClient } from "./BrandDetailClient";

export default function BrandPage() {
    return (
        <Suspense fallback={<BrandPageFallback />}>
            <BrandDetailClient />
        </Suspense>
    );
}

function BrandPageFallback() {
    return (
        <div className="bg-[#F2F0E9] min-h-screen">
            <div className="bg-[#1A1A1A] pt-32 pb-24 md:pt-40 md:pb-32 rounded-b-[3rem] shadow-xl">
                <div className="mx-auto max-w-3xl px-6 md:px-8">
                    <p className="font-mono text-[10px] md:text-xs text-white/75 mb-12 uppercase tracking-widest">
                        Ficha de marca
                    </p>
                    <h1 className="font-serif italic text-5xl md:text-7xl font-light tracking-tight mb-6 text-white leading-[1.1]">
                        Cargando ficha
                    </h1>
                    <p className="font-sans text-lg md:text-xl font-light text-white/70 leading-relaxed max-w-2xl">
                        Preparando la consulta de datos publicados.
                    </p>
                </div>
            </div>
        </div>
    );
}
