"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { BrandCard } from "@/components/directorio/BrandCard";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { ratingIcons } from "@/lib/ratings";
import type { RatingCategory } from "@/lib/types";
import {
    BRAND_SELECT_LEGACY,
    BRAND_SELECT_WITH_INDICATORS,
    normalizeBrand,
    type BrandDetail,
    type DbBrandRow,
} from "@/lib/brand-data";

type SortOption = "relevancia" | "nombre_asc" | "nombre_desc" | "rating_desc" | "rating_asc";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const hasSupabaseConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
const supabaseClient = hasSupabaseConfig
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

/**
 * `DirectoryPage`
 *
 * Página principal del Directorio de Marcas.
 * Carga marcas publicadas desde Supabase y aplica filtros combinados.
 */
export default function DirectorioPage() {
    const [brands, setBrands] = useState<BrandDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusError, setStatusError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
    const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<SortOption>("relevancia");
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const loadBrands = useCallback(async () => {
        setIsLoading(true);
        setStatusError("");
        setStatusMessage("Cargando marcas...");

        if (!supabaseClient) {
            setBrands([]);
            setStatusMessage("");
            setStatusError("Falta configuración de Supabase en variables NEXT_PUBLIC.");
            setIsLoading(false);
            return;
        }

        const { data, error } = await supabaseClient
            .from("brands")
            .select(BRAND_SELECT_WITH_INDICATORS)
            .eq("published", true)
            .order("nombre", { ascending: true });
        let rows = (data ?? []) as DbBrandRow[];
        let queryError = error;

        if (error) {
            const legacyResult = await supabaseClient
                .from("brands")
                .select(BRAND_SELECT_LEGACY)
                .eq("published", true)
                .order("nombre", { ascending: true });
            rows = (legacyResult.data ?? []) as DbBrandRow[];
            queryError = legacyResult.error;
        }

        if (queryError) {
            console.error("Error cargando marcas desde Supabase", queryError);
            setBrands([]);
            setStatusMessage("");
            setStatusError("No se pudieron cargar las marcas. Vuelve a intentarlo.");
            setIsLoading(false);
            return;
        }

        const normalized = rows.map(normalizeBrand);
        setBrands(normalized);
        setStatusError("");
        setStatusMessage(normalized.length ? "" : "No hay marcas publicadas todavía.");
        setIsLoading(false);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void loadBrands();

        const handleFocus = () => {
            void loadBrands();
        };

        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, [loadBrands]);

    const categories = ["Todas", ...Array.from(new Set(brands.map((b) => b.category)))];
    const ratings = ["Genial", "Bueno", "Regular", "Evitar"];

    const toggleRating = (rating: string) => {
        setSelectedRatings((prev) =>
            prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
        );
    };

    const filteredBrands = useMemo(() => {
        const filtered = brands.filter((brand) => {
            const searchHaystack = [
                brand.name,
                brand.slogan,
                brand.description,
                brand.category,
                brand.categorias.join(" "),
                brand.pais,
                brand.ciudad,
            ]
                .join(" ")
                .toLowerCase();

            const matchesSearch = searchHaystack.includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === "Todas" || brand.category === selectedCategory;
            const matchesRating =
                selectedRatings.length === 0 || selectedRatings.includes(brand.overallRating);

            return matchesSearch && matchesCategory && matchesRating;
        });

        const sorted = [...filtered];
        const ratingOrder: Record<RatingCategory, number> = {
            Genial: 4,
            Bueno: 3,
            Regular: 2,
            Evitar: 1,
        };

        switch (sortBy) {
            case "nombre_asc":
                sorted.sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));
                break;
            case "nombre_desc":
                sorted.sort((a, b) => b.name.localeCompare(a.name, "es", { sensitivity: "base" }));
                break;
            case "rating_desc":
                sorted.sort((a, b) => ratingOrder[b.overallRating] - ratingOrder[a.overallRating]);
                break;
            case "rating_asc":
                sorted.sort((a, b) => ratingOrder[a.overallRating] - ratingOrder[b.overallRating]);
                break;
            case "relevancia":
            default:
                // Mantiene el orden base (ya viene por nombre desde Supabase).
                break;
        }

        return sorted;
    }, [brands, searchTerm, selectedCategory, selectedRatings, sortBy]);

    return (
        <div className="bg-[#F2F0E9] min-h-screen pb-24 selection:bg-[#2E4036] selection:text-white">

            {/* Encabezado del directorio */}
            <div className="pt-32 pb-16 md:pt-40 md:pb-24 border-b border-[#D1CFC7]/50">
                <div className="mx-auto max-w-7xl px-6 md:px-8">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-8 h-px bg-[#CC5833]" />
                            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#9E3F24]">Directorio</span>
                        </div>
                        <h1 className="font-serif italic text-5xl md:text-6xl lg:text-7xl font-light text-[#1A1A1A] mb-6 leading-tight">
                            Marcas de cercanía.
                        </h1>
                        <p className="font-sans text-lg md:text-xl text-[#1A1A1A]/70 mb-12 max-w-2xl leading-relaxed">
                            Reunimos pequeños establecimientos que hacen las cosas con cuidado. Revisamos la información que nos comparten y publicamos solo lo que podemos contrastar. Cómo trabajan, de dónde viene lo que venden y cómo gestionan su impacto medioambiental.
                        </p>

                        {/* Buscador Premium */}
                        <div className="relative group max-w-2xl">
                            <label htmlFor="directory-search" className="sr-only">
                                Buscar marcas por nombre, categoría o palabra clave
                            </label>
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-[#1A1A1A]/60 group-focus-within:text-[#2E4036] transition-colors" />
                            </div>
                            <input
                                id="directory-search"
                                type="text"
                                placeholder="Buscar por marca, categoría o palabra clave..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-14 pr-6 h-16 md:h-20 text-lg bg-white rounded-full border border-[#D1CFC7] focus:outline-none focus:border-[#2E4036] focus:ring-1 focus:ring-[#2E4036] shadow-sm transition-all font-sans placeholder:text-[#1A1A1A]/30 placeholder:font-light"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Diseño principal barra lateral + rejilla */}
            <div className="mx-auto max-w-7xl px-6 md:px-8 py-16">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

                    {/* Botón Filtros Móvil */}
                    <div className="w-full lg:hidden flex justify-between items-center mb-4">
                        <span className="font-mono text-xs uppercase tracking-widest text-[#1A1A1A]/70">
                            {isLoading ? "Cargando..." : `${filteredBrands.length} resultados`}
                        </span>
                        <button
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="flex items-center gap-2 px-4 py-2 border border-[#1A1A1A]/20 rounded-full font-sans text-sm font-semibold text-[#1A1A1A] hover:bg-[#1A1A1A]/5 transition-colors"
                        >
                            <SlidersHorizontal className="h-4 w-4" /> Filtros
                        </button>
                    </div>

                    {/* Barra lateral de filtros (escritorio: fija, móvil: desplegable) */}
                    <aside className={`w-full lg:w-1/4 lg:sticky lg:top-32 space-y-12 ${showMobileFilters ? "block" : "hidden lg:block"}`}>

                        {/* Categorías */}
                        <fieldset>
                            <legend className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/70 mb-6 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-[#2E4036]" /> Índice de categorías
                            </legend>
                            <div className="flex flex-col gap-3">
                                {categories.map((cat) => (
                                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={selectedCategory === cat}
                                            onChange={() => setSelectedCategory(cat)}
                                            className="w-4 h-4 text-[#2E4036] bg-transparent border-[#1A1A1A]/20 focus:ring-[#2E4036] focus:ring-offset-[#F2F0E9] checked:border-[#2E4036] transition-all"
                                        />
                                        <span className={`font-sans text-sm transition-colors ${selectedCategory === cat ? "text-[#1A1A1A] font-bold" : "text-[#1A1A1A]/70 group-hover:text-[#1A1A1A]"}`}>
                                            {cat}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        {/* Valoración global */}
                        <fieldset>
                            <legend className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/70 mb-6 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-[#CC5833]" /> Valoración general
                            </legend>
                            <div className="flex flex-col gap-3">
                                {ratings.map((rating) => {
                                    const Icon = ratingIcons[rating];
                                    return (
                                        <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={selectedRatings.includes(rating)}
                                                onChange={() => toggleRating(rating)}
                                                className="w-4 h-4 rounded text-[#2E4036] bg-transparent border-[#1A1A1A]/20 focus:ring-[#2E4036] focus:ring-offset-[#F2F0E9] checked:border-[#2E4036] transition-all"
                                            />
                                            <span className="flex items-center text-[#1A1A1A]/70 group-hover:text-[#1A1A1A] transition-colors">
                                                {Icon && <Icon className="w-5 h-5" aria-hidden="true" />}
                                                <span className="sr-only">{rating}</span>
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </fieldset>

                    </aside>

                    {/* Rejilla de resultados */}
                        <div className="w-full lg:w-3/4">
                        <h2 className="sr-only">Resultados del directorio</h2>
                        {(statusMessage || statusError) && (
                            <div
                                className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
                                    statusError
                                        ? "border-rose-200 bg-rose-50 text-rose-800"
                                        : "border-emerald-200 bg-emerald-50 text-emerald-800"
                                }`}
                            >
                                {statusError || statusMessage}
                            </div>
                        )}

                        <div className="hidden lg:flex justify-between items-center mb-10 border-b border-[#D1CFC7] pb-6">
                            <div className="flex items-center gap-3">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E4036] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2E4036]"></span>
                                </span>
                                <span className="font-mono text-xs uppercase tracking-widest text-[#1A1A1A]/70">Mostrando <strong className="text-[#1A1A1A]">{filteredBrands.length}</strong> entradas</span>
                            </div>

                            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest">
                                <span className="text-[#1A1A1A]/70">Ordenar por:</span>
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                                        className="appearance-none rounded-full border border-[#1A1A1A]/20 bg-white px-4 py-2 pr-10 font-bold text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#2E4036]/30"
                                        aria-label="Ordenar resultados"
                                    >
                                        <option value="relevancia">Relevancia</option>
                                        <option value="nombre_asc">Nombre (A-Z)</option>
                                        <option value="nombre_desc">Nombre (Z-A)</option>
                                        <option value="rating_desc">Valoración (mejor a peor)</option>
                                        <option value="rating_asc">Valoración (peor a mejor)</option>
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1A1A1A]/60" />
                                </div>
                            </div>
                        </div>

                        {!isLoading && filteredBrands.length > 0 ? (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                                {filteredBrands.map((brand) => (
                                    <BrandCard key={brand.id} brand={brand} />
                                ))}
                            </div>
                        ) : !isLoading ? (
                            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2rem] border border-[#D1CFC7] shadow-sm text-center px-6">
                                <h3 className="font-serif italic text-3xl font-light text-[#1A1A1A] mb-4">No se encontraron resultados</h3>
                                <p className="font-sans text-[#1A1A1A]/70 max-w-md mx-auto mb-8 leading-relaxed">
                                    No hay marcas que coincidan con tus criterios. Ajusta los filtros o explora la metodologia.
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSelectedCategory("Todas");
                                        setSelectedRatings([]);
                                    }}
                                    className="px-6 py-3 rounded-full border border-[#1A1A1A]/20 font-sans text-xs font-bold uppercase tracking-widest text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F2F0E9] transition-all duration-300"
                                >
                                    Restablecer
                                </button>
                            </div>
                        ) : null}

                        {!isLoading && filteredBrands.length > 0 && (
                            <div className="mt-20 pt-10 border-t border-[#D1CFC7] text-center">
                                <button type="button" disabled className="px-8 py-4 rounded-full border border-[#1A1A1A]/20 font-sans text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/70 cursor-not-allowed">
                                    Fin del directorio
                                </button>
                            </div>
                        )}
                        </div>

                </div>
            </div>
        </div>
    );
}
