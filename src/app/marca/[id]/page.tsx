import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { BrandDetailClient } from "./BrandDetailClient";
import {
    BRAND_SELECT_LEGACY,
    BRAND_SELECT_WITH_INDICATORS,
    getFallbackBrandList,
    normalizeBrand,
    type BrandDetail,
    type DbBrandRow,
} from "@/lib/brand-data";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabaseClient = SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

const fetchPublishedBrands = async (): Promise<BrandDetail[]> => {
    if (!supabaseClient) return getFallbackBrandList();

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
        console.error("Error cargando marcas para ficha", queryError);
        return getFallbackBrandList();
    }

    const normalizedRows = rows
        .filter((row) => row.id)
        .map(normalizeBrand);

    return normalizedRows.length ? normalizedRows : getFallbackBrandList();
};

export async function generateStaticParams() {
    const brands = await fetchPublishedBrands();
    return brands.map((brand) => ({
        id: brand.id,
    }));
}

export default async function BrandDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const brands = await fetchPublishedBrands();
    const brand = brands.find((b) => b.id === id);

    if (!brand) {
        notFound();
    }

    return <BrandDetailClient initialBrand={brand} brandId={id} />;
}
