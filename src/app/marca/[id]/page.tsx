import { mockBrands } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Flag, Info, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { ratingIcons } from "@/lib/ratings";

export async function generateStaticParams() {
    return mockBrands.map((brand) => ({
        id: brand.id,
    }));
}

/**
 * `BrandDetailPage`
 * 
 * Página dinámica generada para el dossier individual de cada marca (ej: `/marca/br-001`).
 * Muestra el análisis en profundidad, la puntuación ASG desglosada y el veredicto editorial.
 * 
 * @param {Object} props - Propiedades inyectadas por Next.js App Router.
 * @param {Promise<{ id: string }>} props.params - Promesa que resuelve a los parámetros de la URL (ID de la marca).
 */
export default async function BrandDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const brand = mockBrands.find((b) => b.id === id);

    if (!brand) {
        notFound();
    }

    // Paleta tonal refinada que acompasa la estética del dossier.
    const ratingStyles: Record<string, { badge: string, bg: string, text: string }> = {
        Genial: { badge: "bg-[#2E4036] text-[#F2F0E9] border-[#2E4036]", bg: "bg-[#2E4036]", text: "text-[#F2F0E9]" },
        Bueno: { badge: "bg-[#4A6356] text-[#F2F0E9] border-[#4A6356]", bg: "bg-[#1A1A1A]", text: "text-[#F2F0E9]" },
        Regular: { badge: "bg-[#ECEAE3] text-[#1A1A1A] border-[#D1CFC7]", bg: "bg-[#1A1A1A]", text: "text-[#F2F0E9]" },
        Evitar: { badge: "bg-[#1A1A1A] text-[#F2F0E9] border-[#1A1A1A]", bg: "bg-[#1A1A1A]", text: "text-[#F2F0E9]" },
    };

    const style = ratingStyles[brand.overallRating] || ratingStyles["Regular"];
    const RatingIcon = ratingIcons[brand.overallRating];

    return (
        <div className="bg-[#F2F0E9] min-h-screen selection:bg-[#CC5833] selection:text-white pb-24">

            {/* 1. Encabezado de la ficha */}
            <div className={`${style.bg} pt-32 pb-24 md:pt-40 md:pb-32 rounded-b-[3rem] shadow-xl`}>
                <div className="mx-auto max-w-5xl px-6 md:px-8">

                    {/* Migas de navegación */}
                    <nav className="font-mono text-[10px] md:text-xs text-white/50 mb-12 uppercase tracking-widest flex items-center gap-3">
                        <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
                        <span className="text-white/30">/</span>
                        <Link href="/directorio" className="hover:text-white transition-colors">Directorio</Link>
                        <span className="text-white/30">/</span>
                        <span className="text-white">{brand.name}</span>
                    </nav>

                    <div className="flex flex-col md:flex-row gap-12 items-start justify-between">
                        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-10 max-w-2xl">
                            {/* Logotipo */}
                            <div className="relative w-28 h-28 md:w-40 md:h-40 bg-[#F2F0E9] rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden shrink-0 mt-2">
                                {brand.imageUrl ? (
                                    <Image src={brand.imageUrl} alt={brand.name} fill className="object-cover mix-blend-multiply opacity-90" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#ECEAE3] font-mono text-[10px] uppercase tracking-widest text-[#1A1A1A]/30">Asset No Disp.</div>
                                )}
                            </div>

                            {/* Info Principal */}
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="w-6 h-px bg-[#CC5833]" />
                                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#CC5833]">{brand.category}</span>
                                </div>
                                <h1 className="font-serif italic text-6xl md:text-7xl lg:text-8xl font-light tracking-tight mb-4 text-white leading-[1.1]">{brand.name}</h1>
                                <p className="font-sans text-xl md:text-2xl font-light text-white/70 leading-relaxed max-w-xl">{brand.slogan}</p>
                            </div>
                        </div>

                        {/* Insignia grande de valoración global */}
                        <div className="bg-[#F2F0E9] p-8 md:p-10 rounded-[2rem] border border-[#D1CFC7] shadow-lg text-center min-w-[240px] flex flex-col items-center justify-center shrink-0">
                            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/40 mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#1A1A1A]/40" /> Valoración General del Sistema
                            </p>

                            <span className={`px-8 py-4 rounded-full border shadow-sm mb-6 w-full flex items-center justify-center ${style.badge}`} role="img" aria-label={brand.overallRating}>
                                {RatingIcon && <RatingIcon className="w-10 h-10" aria-hidden="true" />}
                                <span className="sr-only">{brand.overallRating}</span>
                            </span>

                            <div className="mt-auto font-mono text-[9px] uppercase tracking-widest text-[#1A1A1A]/40 flex gap-2 items-center">
                                Escala 1-5. <Link href="/metodologia" className="underline hover:text-[#1A1A1A] transition-colors">Metodología</Link>
                            </div>
                        </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-6 md:px-8 py-20">

                {/* Introducción y acciones */}
                <div className="flex flex-col lg:flex-row gap-16 mb-24">
                    <div className="lg:w-2/3">
                        <p className="font-serif text-2xl md:text-3xl text-[#1A1A1A] leading-snug mb-8">
                            Resumen del Dossier.
                        </p>
                        <p className="font-sans text-lg text-[#1A1A1A]/70 leading-relaxed mb-10">
                            {brand.description}
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {brand.isVegan && <span className="font-mono text-[10px] uppercase tracking-widest px-4 py-2 rounded-full border border-[#1A1A1A]/20 text-[#1A1A1A]">Integridad Vegana</span>}
                            {brand.isFairTrade && <span className="font-mono text-[10px] uppercase tracking-widest px-4 py-2 rounded-full border border-[#1A1A1A]/20 text-[#1A1A1A]">Cert. Comercio Justo</span>}
                        </div>
                    </div>

                    <div className="lg:w-1/3 flex flex-col gap-4">
                        <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-[#1A1A1A] text-white rounded-full font-mono text-xs uppercase tracking-widest hover:bg-[#CC5833] transition-colors">
                            <ExternalLink className="h-4 w-4" /> Sitio Oficial de la Marca
                        </a>
                        <Link href="/contacto?motivo=sugerencia" className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-transparent border border-[#1A1A1A]/20 text-[#1A1A1A] rounded-full font-mono text-xs uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-colors">
                            <Flag className="h-4 w-4" /> Sugerir Corrección de Datos
                        </Link>
                    </div>
                </div>

                <div className="w-full h-px bg-[#D1CFC7] mb-20" />

                {/* 2. Resumen 3 Dimensiones (ASG) */}
                <div className="mb-24">
                    <div className="flex items-center gap-3 mb-12">
                        <span className="w-8 h-px bg-[#CC5833]" />
                        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[#CC5833]">Telemetría de Dimensiones</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-0 bg-[#D1CFC7] border border-[#D1CFC7] rounded-[2rem] overflow-hidden">
                        {/* Planeta */}
                        <div className="bg-white p-10 flex flex-col">
                            <div className="flex justify-between items-start mb-12">
                                <h3 className="font-serif text-3xl text-[#1A1A1A]">Planeta <span className="block font-mono text-[10px] uppercase tracking-widest text-[#1A1A1A]/40 mt-2 font-normal">Ambiental</span></h3>
                                <span className={`font-serif italic text-2xl w-14 h-14 flex items-center justify-center rounded-full border shadow-sm shrink-0 ${brand.asgScores.ambiental >= 4 ? ratingStyles.Genial.badge : brand.asgScores.ambiental >= 3 ? ratingStyles.Bueno.badge : ratingStyles.Regular.badge}`}>
                                    {brand.asgScores.ambiental}
                                </span>
                            </div>
                            <p className="font-sans text-[#1A1A1A]/70 leading-relaxed mt-auto">
                                Utilización de recursos, emisiones de carbono alcance 1-3, gestión del agua y productos químicos, y políticas verificables de protección ambiental.
                            </p>
                        </div>

                        {/* Personas */}
                        <div className="bg-white p-10 flex flex-col">
                            <div className="flex justify-between items-start mb-12">
                                <h3 className="font-serif text-3xl text-[#1A1A1A]">Personas <span className="block font-mono text-[10px] uppercase tracking-widest text-[#1A1A1A]/40 mt-2 font-normal">Matriz Laboral</span></h3>
                                <span className={`font-serif italic text-2xl w-14 h-14 flex items-center justify-center rounded-full border shadow-sm shrink-0 ${brand.asgScores.social >= 4 ? ratingStyles.Genial.badge : brand.asgScores.social >= 3 ? ratingStyles.Bueno.badge : ratingStyles.Regular.badge}`}>
                                    {brand.asgScores.social}
                                </span>
                            </div>
                            <p className="font-sans text-[#1A1A1A]/70 leading-relaxed mt-auto">
                                Métricas de salarios dignos, auditorías de fabricación en la cadena de suministro, libertad de asociación y protocolos documentados de empoderamiento de los trabajadores.
                            </p>
                        </div>

                        {/* Gobernanza */}
                        <div className="bg-white p-10 flex flex-col">
                            <div className="flex justify-between items-start mb-12">
                                <h3 className="font-serif text-3xl text-[#1A1A1A]">Gobernanza <span className="block font-mono text-[10px] uppercase tracking-widest text-[#1A1A1A]/40 mt-2 font-normal">Transparencia</span></h3>
                                <span className={`font-serif italic text-2xl w-14 h-14 flex items-center justify-center rounded-full border shadow-sm shrink-0 ${brand.asgScores.gobernanza >= 4 ? ratingStyles.Genial.badge : brand.asgScores.gobernanza >= 3 ? ratingStyles.Bueno.badge : ratingStyles.Regular.badge}`}>
                                    {brand.asgScores.gobernanza}
                                </span>
                            </div>
                            <p className="font-sans text-[#1A1A1A]/70 leading-relaxed mt-auto">
                                Índice de transparencia corporativa, trazabilidad de materias primas, cumplimiento ético y la publicación de informes de sostenibilidad sin filtros.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3 & 4. Evidencias y Prácticas */}
                <div className="mb-24">
                    <div className="flex items-center gap-3 mb-10">
                        <span className="w-8 h-px bg-[#1A1A1A]/40" />
                        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[#1A1A1A]/60">Archivo de Evidencia</h2>
                    </div>

                    <div className="bg-white border border-[#D1CFC7] rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="p-10 md:p-12 border-b border-[#D1CFC7] bg-[#ECEAE3]">
                            <h3 className="font-serif italic text-3xl text-[#1A1A1A] mb-4 flex items-center gap-4">
                                <ShieldCheck className="text-[#2E4036] h-8 w-8 shrink-0" /> Protocolos Verificados
                            </h3>
                            <p className="font-sans text-[#1A1A1A]/70 mb-10 max-w-2xl leading-relaxed">Hemos corroborado las afirmaciones de esta marca cruzando datos públicos con los siguientes estándares estrictos.</p>

                            <ul className="grid sm:grid-cols-2 gap-6">
                                <li className="flex items-start gap-4 bg-white p-6 rounded-[1.5rem] border border-[#D1CFC7]/50 shadow-sm">
                                    <CheckCircle2 className="h-6 w-6 text-[#2E4036] shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-serif text-xl text-[#1A1A1A] mb-1">Transparencia de Proveedores</p>
                                        <p className="font-sans text-sm text-[#1A1A1A]/60 leading-relaxed">La marca publica al menos el 80% de sus proveedores directos de nivel 1 a nivel mundial.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4 bg-white p-6 rounded-[1.5rem] border border-[#D1CFC7]/50 shadow-sm">
                                    <CheckCircle2 className="h-6 w-6 text-[#2E4036] shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-serif text-xl text-[#1A1A1A] mb-1">Materiales Preferidos</p>
                                        <p className="font-sans text-sm text-[#1A1A1A]/60 leading-relaxed">Alta proporción de materiales orgánicos certificados o reciclados mecánicamente.</p>
                                    </div>
                                </li>
                                {brand.isFairTrade && (
                                    <li className="flex items-start gap-4 bg-white p-6 rounded-[1.5rem] border border-[#D1CFC7]/50 shadow-sm">
                                        <CheckCircle2 className="h-6 w-6 text-[#2E4036] shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-serif text-xl text-[#1A1A1A] mb-1">Auditoría Social</p>
                                            <p className="font-sans text-sm text-[#1A1A1A]/60 leading-relaxed">Certificación FairTrade garantizando un trato y salarios justos.</p>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>

                        <div className="p-10 md:p-12">
                            <h3 className="font-serif italic text-3xl text-[#1A1A1A] mb-4 flex items-center gap-4">
                                <AlertTriangle className="h-8 w-8 text-[#CC5833]" /> Brechas de Datos y Exclusiones
                            </h3>
                            <p className="font-sans text-[#1A1A1A]/70 mb-8 max-w-2xl leading-relaxed">Información crítica ausente en las divulgaciones de dominio público de la corporación.</p>

                            <ul className="space-y-4 font-sans text-sm md:text-base text-[#1A1A1A]/80 ml-2">
                                <li className="flex items-start gap-4"><span className="text-[#CC5833] mt-1 font-mono">↳</span> No hay evidencia clara de pagos de <strong>salarios dignos reales</strong> en toda la cadena de suministro.</li>
                                <li className="flex items-start gap-4"><span className="text-[#CC5833] mt-1 font-mono">↳</span> Granularidad insuficiente al informar sobre emisiones indirectas (Alcance 3).</li>
                            </ul>
                        </div>
                    </div>
                    </div>
                </div>

                {/* 6. Aviso legal anti-greenwashing */}
                <div className="bg-[#1A1A1A] p-8 md:p-12 rounded-[2rem] flex flex-col md:flex-row gap-6 md:gap-8 items-start relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[#2E4036]/10 mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <Info className="h-8 w-8 text-[#CC5833] shrink-0 relative z-10" />
                    <div className="relative z-10">
                        <h4 className="font-serif italic text-2xl text-white mb-4">Aviso Legal de la Metodología</h4>
                        <p className="font-sans text-white/70 leading-relaxed max-w-3xl mb-8">
                            Nuestras calificaciones se basan rigurosamente en evidencias públicas y verificables proporcionadas por la marca y evaluadas frente a estándares externos. Las afirmaciones sin datos reportados obtienen una puntuación cero. Si considera que esta información está desactualizada, <Link href="/contacto" className="underline hover:text-white transition-colors">notifique a nuestros investigadores con un enlace al reporte público</Link>.
                        </p>
                        <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.2em]">
                            Última Revisión de Inteligencia: Octubre 2023
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
