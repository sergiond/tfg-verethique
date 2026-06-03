import { fallbackBrands } from "./data";
import type { Brand, RatingCategory } from "./types";
import {
    calculateASGScores,
    calculateOverallRating,
    hasStructuredEvidence,
    normalizeASGIndicatorEvidence,
    type ASGIndicatorEvidence,
} from "./asg-indicators";

export type DbBrandRow = {
    id: string;
    slug: string | null;
    nombre: string | null;
    eslogan: string | null;
    descripcion: string | null;
    calificacion_general: string | null;
    ambiental: number | null;
    social: number | null;
    gobernanza: number | null;
    ambiental_indicadores?: string[] | string | null;
    social_indicadores?: string[] | string | null;
    gobernanza_indicadores?: string[] | string | null;
    categorias: string[] | string | null;
    tipo_tienda: string[] | string | null;
    pais: string | null;
    ciudad: string | null;
    web: string | null;
    instagram: string | null;
    published?: boolean | null;
};

export type BrandDetail = Brand & {
    slug: string;
    categorias: string[];
    tipoTienda: string[];
    pais: string;
    ciudad: string;
    web: string;
    instagram: string;
    asgIndicators: ASGIndicatorEvidence;
};

export const BRAND_SELECT_WITH_INDICATORS = "id, slug, nombre, eslogan, descripcion, calificacion_general, ambiental, social, gobernanza, ambiental_indicadores, social_indicadores, gobernanza_indicadores, categorias, tipo_tienda, pais, ciudad, web, instagram, published";
export const BRAND_SELECT_LEGACY = "id, slug, nombre, eslogan, descripcion, calificacion_general, ambiental, social, gobernanza, categorias, tipo_tienda, pais, ciudad, web, instagram, published";

const VALID_RATINGS: RatingCategory[] = ["Genial", "Bueno", "Regular", "Evitar"];
const fallbackImages = ["/img/moodboard-1.jpg", "/img/moodboard-2.jpg", "/img/moodboard-3.jpg"];

export const parseList = (value: string[] | string | null | undefined): string[] => {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === "string") {
        return value.split(",").map((v) => v.trim()).filter(Boolean);
    }
    return [];
};

export const normalizeRating = (value: string | null): RatingCategory => {
    return VALID_RATINGS.includes(value as RatingCategory) ? (value as RatingCategory) : "Regular";
};

export const getFallbackImage = (id: string): string => {
    const hash = Array.from(id).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return fallbackImages[hash % fallbackImages.length];
};

export const toIndicatorEvidence = (row: DbBrandRow): ASGIndicatorEvidence =>
    normalizeASGIndicatorEvidence({
        ambiental: parseList(row.ambiental_indicadores),
        social: parseList(row.social_indicadores),
        gobernanza: parseList(row.gobernanza_indicadores),
    });

export const normalizeBrand = (row: DbBrandRow): BrandDetail => {
    const categorias = parseList(row.categorias);
    const asgIndicators = toIndicatorEvidence(row);
    const scores = hasStructuredEvidence(asgIndicators)
        ? calculateASGScores(asgIndicators)
        : {
            ambiental: Number(row.ambiental ?? 0),
            social: Number(row.social ?? 0),
            gobernanza: Number(row.gobernanza ?? 0),
        };
    const overallRating = hasStructuredEvidence(asgIndicators)
        ? calculateOverallRating(scores)
        : normalizeRating(row.calificacion_general);

    return {
        id: row.id,
        slug: row.slug ?? "",
        name: row.nombre ?? row.slug ?? "Sin nombre",
        slogan: row.eslogan ?? "",
        description: row.descripcion ?? "",
        overallRating,
        category: categorias[0] ?? "Sin categoria",
        asgScores: scores,
        imageUrl: getFallbackImage(row.id),
        isVegan: false,
        isFairTrade: false,
        materials: [],
        categorias,
        tipoTienda: parseList(row.tipo_tienda),
        pais: row.pais ?? "",
        ciudad: row.ciudad ?? "",
        web: row.web ?? "",
        instagram: row.instagram ?? "",
        asgIndicators,
    };
};

export const mapFallbackBrand = (brand: Brand): BrandDetail => ({
    ...brand,
    slug: "",
    categorias: brand.category ? [brand.category] : [],
    tipoTienda: [],
    pais: "",
    ciudad: "",
    web: "",
    instagram: "",
    asgIndicators: normalizeASGIndicatorEvidence(),
    imageUrl: brand.imageUrl?.trim() ? brand.imageUrl : getFallbackImage(brand.id),
});

export const getFallbackBrandList = (): BrandDetail[] => fallbackBrands.map(mapFallbackBrand);
