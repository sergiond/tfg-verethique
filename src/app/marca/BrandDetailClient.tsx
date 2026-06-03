"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ExternalLink, Flag, Info, CheckCircle2, AlertTriangle, ShieldCheck, MapPin, Store, type LucideIcon } from "lucide-react";
import { ratingIcons } from "@/lib/ratings";
import {
    ASG_DIMENSIONS,
    getMissingIndicators,
    getSelectedIndicators,
    type ASGDimension,
} from "@/lib/asg-indicators";
import {
    BRAND_SELECT_LEGACY,
    BRAND_SELECT_WITH_INDICATORS,
    normalizeBrand,
    type BrandDetail,
    type DbBrandRow,
} from "@/lib/brand-data";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabaseClient = SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

const dimensionLabels: Record<ASGDimension, string> = {
    ambiental: "Ambiental",
    social: "Social",
    gobernanza: "Gobernanza",
};

type BrandLoadStatus = "idle" | "loading" | "loaded" | "missing-id" | "not-found" | "error";

const BRAND_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function BrandDetailClient() {
    const searchParams = useSearchParams();
    const brandId = searchParams.get("id")?.trim() ?? "";
    const [brand, setBrand] = useState<BrandDetail | null>(null);
    const [status, setStatus] = useState<BrandLoadStatus>("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const refreshBrand = useCallback(async () => {
        if (!brandId) {
            setBrand(null);
            setStatus("missing-id");
            return;
        }

        if (!BRAND_ID_PATTERN.test(brandId)) {
            setBrand(null);
            setStatus("not-found");
            return;
        }

        if (!supabaseClient) {
            setBrand(null);
            setErrorMessage("La configuracion publica de Supabase no esta disponible.");
            setStatus("error");
            return;
        }

        setStatus("loading");
        setErrorMessage("");

        const { data, error } = await supabaseClient
            .from("brands")
            .select(BRAND_SELECT_WITH_INDICATORS)
            .eq("id", brandId)
            .eq("published", true)
            .maybeSingle();

        let row = data as DbBrandRow | null;
        let queryError = error;

        if (error) {
            const legacyResult = await supabaseClient
                .from("brands")
                .select(BRAND_SELECT_LEGACY)
                .eq("id", brandId)
                .eq("published", true)
                .maybeSingle();

            row = legacyResult.data as DbBrandRow | null;
            queryError = legacyResult.error;
        }

        if (queryError) {
            console.error("Error refrescando marca desde Supabase", queryError);
            setBrand(null);
            setErrorMessage("No se ha podido cargar la ficha desde Supabase.");
            setStatus("error");
            return;
        }

        if (row) {
            setBrand(normalizeBrand(row));
            setStatus("loaded");
            return;
        }

        setBrand(null);
        setStatus("not-found");
    }, [brandId]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void refreshBrand();

        const handleFocus = () => {
            void refreshBrand();
        };

        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, [refreshBrand]);

    if (status === "missing-id") {
        return (
            <BrandStateMessage
                title="Ficha de marca"
                description="Abre esta pagina desde el directorio para cargar una marca concreta."
            />
        );
    }

    if (status === "not-found") {
        return (
            <BrandStateMessage
                title="Marca no disponible"
                description="La marca no existe, el identificador no es valido o la ficha no esta publicada."
            />
        );
    }

    if (status === "error") {
        return (
            <BrandStateMessage
                title="No se ha podido cargar la ficha"
                description={errorMessage || "Revisa la configuracion y vuelve a intentarlo."}
            />
        );
    }

    if (!brand) {
        return (
            <BrandStateMessage
                title="Cargando ficha"
                description="Consultando los datos publicados de la marca."
            />
        );
    }

    const ratingStyles: Record<string, { badge: string; bg: string; text: string }> = {
        Genial: { badge: "bg-[#2E4036] text-[#F2F0E9] border-[#2E4036]", bg: "bg-[#2E4036]", text: "text-[#F2F0E9]" },
        Bueno: { badge: "bg-[#4A6356] text-[#F2F0E9] border-[#4A6356]", bg: "bg-[#1A1A1A]", text: "text-[#F2F0E9]" },
        Regular: { badge: "bg-[#ECEAE3] text-[#1A1A1A] border-[#D1CFC7]", bg: "bg-[#1A1A1A]", text: "text-[#F2F0E9]" },
        Evitar: { badge: "bg-[#1A1A1A] text-[#F2F0E9] border-[#1A1A1A]", bg: "bg-[#1A1A1A]", text: "text-[#F2F0E9]" },
    };

    const style = ratingStyles[brand.overallRating] || ratingStyles.Regular;
    const RatingIcon = ratingIcons[brand.overallRating];
    const selectedIndicators = ASG_DIMENSIONS.flatMap((dimension) =>
        getSelectedIndicators(dimension, brand.asgIndicators).map((indicator) => ({ ...indicator, dimension }))
    );
    const missingIndicators = ASG_DIMENSIONS.flatMap((dimension) =>
        getMissingIndicators(dimension, brand.asgIndicators).map((indicator) => ({ ...indicator, dimension }))
    );
    const locationLabel = formatLocation(brand.ciudad, brand.pais);
    const storeTypeLabel = formatStoreTypes(brand.tipoTienda);
    const hasBrandDetails = Boolean(locationLabel || storeTypeLabel);

    return (
        <div className="bg-[#F2F0E9] min-h-screen selection:bg-[#9E3F24] selection:text-white pb-24">
            <div className={`${style.bg} pt-32 pb-24 md:pt-40 md:pb-32 rounded-b-[3rem] shadow-xl`}>
                <div className="mx-auto max-w-5xl px-6 md:px-8">
                    <nav className="font-mono text-[10px] md:text-xs text-white/75 mb-12 uppercase tracking-widest flex items-center gap-3">
                        <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
                        <span className="text-white/75">/</span>
                        <Link href="/directorio" className="hover:text-white transition-colors">Directorio</Link>
                        <span className="text-white/75">/</span>
                        <span className="text-white">{brand.name}</span>
                    </nav>

                    <div className="flex flex-col md:flex-row gap-12 items-start justify-between">
                        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-10 max-w-2xl">
                            <div className="relative w-28 h-28 md:w-40 md:h-40 bg-[#F2F0E9] rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden shrink-0 mt-2">
                                {brand.imageUrl ? (
                                    <Image src={brand.imageUrl} alt={brand.name} fill className="object-cover mix-blend-multiply opacity-90" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#ECEAE3] font-mono text-[10px] uppercase tracking-widest text-[#1A1A1A]/70">Sin imagen</div>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="w-6 h-px bg-[#D9653E]" />
                                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#F2F0E9]/80">{brand.category}</span>
                                </div>
                                <h1 className="font-serif italic text-6xl md:text-7xl lg:text-8xl font-light tracking-tight mb-4 text-white leading-[1.1]">{brand.name}</h1>
                                <p className="font-sans text-xl md:text-2xl font-light text-white/70 leading-relaxed max-w-xl">{brand.slogan}</p>
                            </div>
                        </div>

                        <div className="bg-[#F2F0E9] p-8 md:p-10 rounded-[2rem] border border-[#D1CFC7] shadow-lg text-center min-w-[240px] flex flex-col items-center justify-center shrink-0">
                            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/70 mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#1A1A1A]/70" /> Valoración General del Sistema
                            </p>

                            <span className={`px-8 py-4 rounded-full border shadow-sm mb-6 w-full flex items-center justify-center ${style.badge}`} role="img" aria-label={brand.overallRating}>
                                {RatingIcon && <RatingIcon className="w-10 h-10" aria-hidden="true" />}
                                <span className="sr-only">{brand.overallRating}</span>
                            </span>

                            <div className="mt-auto font-mono text-[9px] uppercase tracking-widest text-[#1A1A1A]/70 flex gap-2 items-center">
                                Escala 1-5. <Link href="/metodologia" className="underline hover:text-[#1A1A1A] transition-colors">Metodología</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-6 md:px-8 py-20">
                <div className="flex flex-col lg:flex-row gap-16 mb-24">
                    <div className="lg:w-2/3">
                        <p className="font-serif text-2xl md:text-3xl text-[#1A1A1A] leading-snug mb-8">Resumen de la marca.</p>
                        <p className="font-sans text-lg text-[#1A1A1A]/70 leading-relaxed mb-10">{brand.description}</p>
                    </div>

                    <div className="lg:w-1/3 flex flex-col gap-4">
                        {brand.web ? (
                            <a href={brand.web} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-[#1A1A1A] text-white rounded-full font-mono text-xs uppercase tracking-widest hover:bg-[#9E3F24] transition-colors">
                                <ExternalLink className="h-4 w-4" /> Sitio Oficial de la Marca
                            </a>
                        ) : null}
                        <Link href="/contacto?motivo=sugerencia" className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-transparent border border-[#1A1A1A]/20 text-[#1A1A1A] rounded-full font-mono text-xs uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-colors">
                            <Flag className="h-4 w-4" /> Sugerir Corrección de Datos
                        </Link>

                        {hasBrandDetails ? (
                            <div className="mt-4 rounded-[1.75rem] bg-white/70 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/70 mb-5">
                                    Datos de la marca
                                </p>
                                <div className="space-y-4">
                                    {locationLabel ? (
                                        <BrandInfoRow icon={MapPin} label="Ubicación" value={locationLabel} />
                                    ) : null}
                                    {storeTypeLabel ? (
                                        <BrandInfoRow icon={Store} label="Tipo de tienda" value={storeTypeLabel} />
                                    ) : null}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="w-full h-px bg-[#D1CFC7] mb-20" />

                <div className="mb-24">
                    <div className="flex items-center gap-3 mb-12">
                        <span className="w-8 h-px bg-[#9E3F24]" />
                        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[#9E3F24]">Puntuacion por dimensiones</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-0 bg-[#D1CFC7] border border-[#D1CFC7] rounded-[2rem] overflow-hidden">
                        <DimensionScoreCard
                            title="Planeta"
                            subtitle="Ambiental"
                            score={brand.asgScores.ambiental}
                            badgeClass={brand.asgScores.ambiental >= 4 ? ratingStyles.Genial.badge : brand.asgScores.ambiental >= 3 ? ratingStyles.Bueno.badge : ratingStyles.Regular.badge}
                            description="Utilización de recursos, emisiones de carbono alcance 1-3, gestión del agua y productos químicos, y políticas verificables de protección ambiental."
                        />
                        <DimensionScoreCard
                            title="Personas"
                            subtitle="Matriz Laboral"
                            score={brand.asgScores.social}
                            badgeClass={brand.asgScores.social >= 4 ? ratingStyles.Genial.badge : brand.asgScores.social >= 3 ? ratingStyles.Bueno.badge : ratingStyles.Regular.badge}
                            description="Métricas de salarios dignos, auditorías de fabricación en la cadena de suministro, libertad de asociación y protocolos documentados de empoderamiento de los trabajadores."
                        />
                        <DimensionScoreCard
                            title="Gobernanza"
                            subtitle="Transparencia"
                            score={brand.asgScores.gobernanza}
                            badgeClass={brand.asgScores.gobernanza >= 4 ? ratingStyles.Genial.badge : brand.asgScores.gobernanza >= 3 ? ratingStyles.Bueno.badge : ratingStyles.Regular.badge}
                            description="Índice de transparencia corporativa, trazabilidad de materias primas, cumplimiento ético y publicación de informes de sostenibilidad sin filtros."
                        />
                    </div>
                </div>

                <div className="mb-24">
                    <div className="flex items-center gap-3 mb-10">
                        <span className="w-8 h-px bg-[#1A1A1A]/70" />
                        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[#1A1A1A]/70">Archivo de Evidencia</h2>
                    </div>

                    <div className="bg-white border border-[#D1CFC7] rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="p-10 md:p-12 border-b border-[#D1CFC7] bg-[#ECEAE3]">
                            <h3 className="font-serif italic text-3xl text-[#1A1A1A] mb-4 flex items-center gap-4">
                                <ShieldCheck className="text-[#2E4036] h-8 w-8 shrink-0" /> Indicadores Verificados
                            </h3>
                            <p className="font-sans text-[#1A1A1A]/70 mb-10 max-w-2xl leading-relaxed">Estos son los puntos que tienen evidencia suficiente para contar en la puntuación de la marca.</p>

                            {selectedIndicators.length > 0 ? (
                                <ul className="grid sm:grid-cols-2 gap-6">
                                    {selectedIndicators.map((indicator) => (
                                        <li key={indicator.id} className="flex items-start gap-4 bg-white p-6 rounded-[1.5rem] border border-[#D1CFC7]/50 shadow-sm">
                                            <CheckCircle2 className="h-6 w-6 text-[#2E4036] shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-mono text-[9px] uppercase tracking-widest text-[#9E3F24] mb-2">{dimensionLabels[indicator.dimension]}</p>
                                                <p className="font-serif text-xl text-[#1A1A1A] mb-1">{indicator.title}</p>
                                                <p className="font-sans text-sm text-[#1A1A1A]/70 leading-relaxed">{indicator.description}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="rounded-[1.5rem] border border-[#D1CFC7]/50 bg-white p-6 font-sans text-sm text-[#1A1A1A]/70">
                                    Todavía no hay indicadores comprobados para esta marca.
                                </p>
                            )}
                        </div>

                        <div className="p-10 md:p-12">
                            <h3 className="font-serif italic text-3xl text-[#1A1A1A] mb-4 flex items-center gap-4">
                                <AlertTriangle className="h-8 w-8 text-[#9E3F24]" /> Indicadores pendientes de comprobar
                            </h3>
                            <p className="font-sans text-[#1A1A1A]/70 mb-8 max-w-2xl leading-relaxed">Estos puntos no tienen evidencia suficiente en la revisión. Por eso no suman en la puntuación de la dimensión correspondiente.</p>

                            {missingIndicators.length > 0 ? (
                                <ul className="grid gap-4 sm:grid-cols-2">
                                    {missingIndicators.map((indicator) => (
                                        <li key={indicator.id} className="flex items-start gap-4 rounded-[1.25rem] border border-[#D1CFC7]/50 bg-[#F2F0E9]/50 p-5">
                                            <span className="text-[#9E3F24] mt-1 font-mono">↳</span>
                                            <div>
                                                <p className="font-mono text-[9px] uppercase tracking-widest text-[#1A1A1A]/70 mb-1">{dimensionLabels[indicator.dimension]}</p>
                                                <p className="font-serif text-lg text-[#1A1A1A]">{indicator.title}</p>
                                                <p className="font-sans text-sm text-[#1A1A1A]/70 leading-relaxed mt-1">{indicator.evidenceHint}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="font-sans text-sm text-[#1A1A1A]/70">Todos los indicadores de esta metodología tienen evidencia marcada.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-[#1A1A1A] p-8 md:p-12 rounded-[2rem] flex flex-col md:flex-row gap-6 md:gap-8 items-start relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[#2E4036]/10 mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <Info className="h-8 w-8 text-[#D9653E] shrink-0 relative z-10" />
                    <div className="relative z-10">
                        <h4 className="font-serif italic text-2xl text-white mb-4">Aviso Legal de la Metodología</h4>
                        <p className="font-sans text-white/70 leading-relaxed max-w-3xl mb-8">
                            Nuestras calificaciones se basan rigurosamente en evidencias públicas y verificables proporcionadas por la marca y evaluadas frente a estándares externos. Las afirmaciones sin datos reportados obtienen una puntuación cero. Si considera que esta información está desactualizada, <Link href="/contacto" className="underline hover:text-white transition-colors">póngase en contacto con nosotros</Link>.
                        </p>
                        <p className="font-mono text-[10px] text-white/70 uppercase tracking-[0.2em]">Metodologia ASG aplicada segun las evidencias disponible</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function formatLocation(city: string, country: string): string {
    return [city.trim(), country.trim()].filter(Boolean).join(", ");
}

function formatStoreTypes(storeTypes: string[]): string {
    return storeTypes
        .map((storeType) => {
            const normalized = storeType.trim().toLowerCase();
            if (normalized === "online") return "Online";
            if (normalized === "fisica" || normalized === "física") return "Física";
            return normalized
                .replace(/[-_]/g, " ")
                .replace(/\b\w/g, (letter) => letter.toUpperCase());
        })
        .filter(Boolean)
        .join(" y ");
}

function BrandInfoRow({
    icon: Icon,
    label,
    value,
}: {
    icon: LucideIcon;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ECEAE3] text-[#1A1A1A]">
                <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-[#1A1A1A]/60 mb-1">{label}</p>
                <p className="font-sans text-sm font-medium text-[#1A1A1A] leading-relaxed">{value}</p>
            </div>
        </div>
    );
}

function BrandStateMessage({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="bg-[#F2F0E9] min-h-screen selection:bg-[#9E3F24] selection:text-white">
            <div className="bg-[#1A1A1A] pt-32 pb-24 md:pt-40 md:pb-32 rounded-b-[3rem] shadow-xl">
                <div className="mx-auto max-w-3xl px-6 md:px-8">
                    <nav className="font-mono text-[10px] md:text-xs text-white/75 mb-12 uppercase tracking-widest flex items-center gap-3">
                        <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
                        <span className="text-white/75">/</span>
                        <Link href="/directorio" className="hover:text-white transition-colors">Directorio</Link>
                        <span className="text-white/75">/</span>
                        <span className="text-white">Marca</span>
                    </nav>

                    <h1 className="font-serif italic text-5xl md:text-7xl font-light tracking-tight mb-6 text-white leading-[1.1]">
                        {title}
                    </h1>
                    <p className="font-sans text-lg md:text-xl font-light text-white/70 leading-relaxed max-w-2xl mb-10">
                        {description}
                    </p>
                    <Link
                        href="/directorio"
                        className="inline-flex items-center justify-center rounded-full bg-[#F2F0E9] px-6 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1A1A1A] transition-colors hover:bg-[#9E3F24] hover:text-white"
                    >
                        Volver al directorio
                    </Link>
                </div>
            </div>
        </div>
    );
}

function DimensionScoreCard({
    title,
    subtitle,
    score,
    badgeClass,
    description,
}: {
    title: string;
    subtitle: string;
    score: number;
    badgeClass: string;
    description: string;
}) {
    return (
        <div className="bg-white p-10 flex flex-col">
            <div className="flex justify-between items-start mb-12">
                <h3 className="font-serif text-3xl text-[#1A1A1A]">
                    {title} <span className="block font-mono text-[10px] uppercase tracking-widest text-[#1A1A1A]/70 mt-2 font-normal">{subtitle}</span>
                </h3>
                <span className={`font-serif italic text-2xl w-14 h-14 flex items-center justify-center rounded-full border shadow-sm shrink-0 ${badgeClass}`}>
                    {score}
                </span>
            </div>
            <p className="font-sans text-[#1A1A1A]/70 leading-relaxed mt-auto">{description}</p>
        </div>
    );
}
