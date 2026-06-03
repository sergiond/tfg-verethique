"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { createClient } from "@supabase/supabase-js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    ASG_DIMENSIONS,
    ASG_INDICATOR_GROUPS,
    calculateASGScores,
    calculateOverallRating,
    emptyASGIndicatorEvidence,
    normalizeASGIndicatorEvidence,
    type ASGDimension,
    type ASGIndicatorEvidence,
} from "@/lib/asg-indicators";

type ReviewStatus = "pendiente" | "aprobada" | "rechazada";
type BrandRating = "Genial" | "Bueno" | "Regular" | "Evitar";

type ReviewRequest = {
    id: string;
    created_at: string;
    applicant_name: string | null;
    applicant_email: string | null;
    brand_name: string | null;
    reason: string | null;
    message: string | null;
    evidence_url: string | null;
    evidence_files: string[] | string | null;
    status: ReviewStatus | null;
    admin_notes: string | null;
    reviewed_at: string | null;
};

type BrandRow = {
    id: string;
    slug: string | null;
    nombre: string | null;
    eslogan: string | null;
    descripcion: string | null;
    calificacion_general: BrandRating | null;
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
    published: boolean | null;
};

type BrandFormState = {
    id: string;
    slug: string;
    nombre: string;
    eslogan: string;
    descripcion: string;
    asgIndicators: ASGIndicatorEvidence;
    categorias: string;
    tipo_tienda_online: boolean;
    tipo_tienda_fisica: boolean;
    pais: string;
    ciudad: string;
    web: string;
    instagram: string;
    published: boolean;
};

type BrandInsertPayload = {
    slug: string;
    nombre: string;
    eslogan: string | null;
    descripcion: string | null;
    calificacion_general: BrandRating;
    ambiental: number;
    social: number;
    gobernanza: number;
    ambiental_indicadores: string[];
    social_indicadores: string[];
    gobernanza_indicadores: string[];
    categorias: string[];
    tipo_tienda: string[];
    pais: string | null;
    ciudad: string | null;
    web: string | null;
    instagram: string | null;
    published: boolean;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const hasSupabaseConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
const supabase = hasSupabaseConfig ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const ADMIN_USER = "admin";
const ADMIN_PASS = "modaetica2025";
const SESSION_KEY = "me_admin_logged";
const REQUESTS_TABLE = "review_requests";
const BRAND_SELECT_COLUMNS = "id, slug, nombre, eslogan, descripcion, calificacion_general, ambiental, social, gobernanza, ambiental_indicadores, social_indicadores, gobernanza_indicadores, categorias, tipo_tienda, pais, ciudad, web, instagram, published";
const BRAND_SELECT_LEGACY_COLUMNS = "id, slug, nombre, eslogan, descripcion, calificacion_general, ambiental, social, gobernanza, categorias, tipo_tienda, pais, ciudad, web, instagram, published";
const ADMIN_INPUT_CLASS = "h-11 rounded-[1.1rem] border-0 bg-[#F2F0E9]/65 px-4 shadow-none focus-visible:ring-2 focus-visible:ring-[#2E4036]/25";
const ADMIN_TEXTAREA_CLASS = "min-h-[110px] rounded-[1.1rem] border-0 bg-[#F2F0E9]/65 px-4 py-3 shadow-none focus-visible:ring-2 focus-visible:ring-[#2E4036]/25";

const parseList = (value: string[] | string | null | undefined): string[] => {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === "string") return value.split(",").map((v) => v.trim()).filter(Boolean);
    return [];
};

const parseCsv = (value: string): string[] => value.split(",").map((v) => v.trim()).filter(Boolean);

const toIndicatorEvidence = (brand: Pick<BrandRow, "ambiental_indicadores" | "social_indicadores" | "gobernanza_indicadores">): ASGIndicatorEvidence =>
    normalizeASGIndicatorEvidence({
        ambiental: parseList(brand.ambiental_indicadores),
        social: parseList(brand.social_indicadores),
        gobernanza: parseList(brand.gobernanza_indicadores),
    });

const toSlug = (value: string): string =>
    value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);

const emptyBrandForm = (): BrandFormState => ({
    id: "",
    slug: "",
    nombre: "",
    eslogan: "",
    descripcion: "",
    asgIndicators: emptyASGIndicatorEvidence(),
    categorias: "",
    tipo_tienda_online: false,
    tipo_tienda_fisica: false,
    pais: "",
    ciudad: "",
    web: "",
    instagram: "",
    published: true,
});

const toBrandDraftFromRequest = (request: ReviewRequest): BrandFormState => {
    const nombre = request.brand_name?.trim() ?? "";
    const fallbackSlug = `marca-${request.id.slice(0, 8)}`;
    const descripcion = [request.message?.trim(), request.evidence_url ? `Fuente documental: ${request.evidence_url}` : ""]
        .filter(Boolean)
        .join("\n\n");

    return {
        ...emptyBrandForm(),
        nombre,
        slug: toSlug(nombre || fallbackSlug),
        descripcion,
        published: false,
    };
};

const toBrandPayloadFromRequest = (request: ReviewRequest): BrandInsertPayload => {
    const draft = toBrandDraftFromRequest(request);
    return {
        slug: draft.slug,
        nombre: draft.nombre || `Marca ${request.id.slice(0, 8)}`,
        eslogan: null,
        descripcion: draft.descripcion || null,
        calificacion_general: "Evitar",
        ambiental: 0,
        social: 0,
        gobernanza: 0,
        ambiental_indicadores: [],
        social_indicadores: [],
        gobernanza_indicadores: [],
        categorias: [],
        tipo_tienda: [],
        pais: null,
        ciudad: null,
        web: null,
        instagram: null,
        published: false,
    };
};

const toBrandForm = (brand: BrandRow): BrandFormState => {
    const tipos = parseList(brand.tipo_tienda);
    return {
        id: brand.id,
        slug: brand.slug ?? "",
        nombre: brand.nombre ?? "",
        eslogan: brand.eslogan ?? "",
        descripcion: brand.descripcion ?? "",
        asgIndicators: toIndicatorEvidence(brand),
        categorias: parseList(brand.categorias).join(","),
        tipo_tienda_online: tipos.includes("online"),
        tipo_tienda_fisica: tipos.includes("fisica"),
        pais: brand.pais ?? "",
        ciudad: brand.ciudad ?? "",
        web: brand.web ?? "",
        instagram: brand.instagram ?? "",
        published: brand.published ?? true,
    };
};

const statusMap: Record<ReviewStatus, { label: string; badge: string }> = {
    pendiente: { label: "Pendiente", badge: "bg-amber-100 text-amber-800" },
    aprobada: { label: "Aprobada", badge: "bg-emerald-100 text-emerald-800" },
    rechazada: { label: "Rechazada", badge: "bg-rose-100 text-rose-800" },
};

const dimensionLabels: Record<ASGDimension, string> = {
    ambiental: "Ambiental",
    social: "Social",
    gobernanza: "Gobernanza",
};

const getBrandInsertErrorMessage = (error: { code?: string; message?: string }) => {
    const message = error.message ?? "Error desconocido de Supabase.";
    const isOldScoreConstraint =
        error.code === "23514" &&
        (message.includes("brands_ambiental_check") ||
            message.includes("brands_social_check") ||
            message.includes("brands_gobernanza_check"));

    if (isOldScoreConstraint) {
        return "Solicitud aprobada, pero la base de datos aun no permite puntuaciones ASG a 0. Ejecuta la migracion de restricciones 0-5 del README y vuelve a aprobar la solicitud.";
    }

    return `Solicitud aprobada, pero fallo la creacion automatica del establecimiento. Supabase devolvio: ${message}`;
};

export default function AdminDashboard() {
    const [isAuthed, setIsAuthed] = useState(
        () => typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1"
    );
    const [loginUser, setLoginUser] = useState("");
    const [loginPass, setLoginPass] = useState("");
    const [loginError, setLoginError] = useState("");

    const [requests, setRequests] = useState<ReviewRequest[]>([]);
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [adminNotesDraft, setAdminNotesDraft] = useState("");

    const [brands, setBrands] = useState<BrandRow[]>([]);
    const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
    const [brandForm, setBrandForm] = useState<BrandFormState>(emptyBrandForm);

    const [loadingRequests, setLoadingRequests] = useState(false);
    const [savingReview, setSavingReview] = useState(false);
    const [savingBrand, setSavingBrand] = useState(false);
    const [statusInfo, setStatusInfo] = useState("");
    const [statusError, setStatusError] = useState("");
    const [isAsgSchemaReady, setIsAsgSchemaReady] = useState<boolean | null>(null);

    const selectedRequest = useMemo(
        () => requests.find((r) => r.id === selectedRequestId) ?? null,
        [requests, selectedRequestId]
    );

    const metrics = useMemo(() => {
        const pending = requests.filter((r) => (r.status ?? "pendiente") === "pendiente").length;
        const approved = requests.filter((r) => r.status === "aprobada").length;
        const rejected = requests.filter((r) => r.status === "rechazada").length;
        return { total: requests.length, pending, approved, rejected };
    }, [requests]);

    const calculatedScores = useMemo(
        () => calculateASGScores(brandForm.asgIndicators),
        [brandForm.asgIndicators]
    );
    const calculatedRating = useMemo(
        () => calculateOverallRating(calculatedScores),
        [calculatedScores]
    );

    const setAlert = (info = "", error = "") => {
        setStatusInfo(info);
        setStatusError(error);
    };

    const loadRequests = useCallback(async () => {
        if (!supabase) return setAlert("", "Falta configuración de Supabase en variables NEXT_PUBLIC.");

        setLoadingRequests(true);
        setAlert("Cargando solicitudes de revisión...");

        const { data, error } = await supabase
            .from(REQUESTS_TABLE)
            .select("id, created_at, applicant_name, applicant_email, brand_name, reason, message, evidence_url, evidence_files, status, admin_notes, reviewed_at")
            .order("created_at", { ascending: false });

        setLoadingRequests(false);

        if (error) {
            console.error("Error cargando solicitudes", error);
            setRequests([]);
            setSelectedRequestId(null);
            setAdminNotesDraft("");
            return setAlert("", "No se pudieron cargar las solicitudes. Revisa tabla/policies.");
        }

        const normalized = ((data ?? []) as ReviewRequest[]).map((row) => ({
            ...row,
            status: (row.status as ReviewStatus | null) ?? "pendiente",
        }));
        const nextId = selectedRequestId ?? normalized[0]?.id ?? null;
        const next = normalized.find((r) => r.id === nextId) ?? null;
        setRequests(normalized);
        setSelectedRequestId(nextId);
        setAdminNotesDraft(next?.admin_notes ?? "");
        setAlert(normalized.length ? "" : "No hay solicitudes todavía.", "");
    }, [selectedRequestId]);

    const loadBrands = useCallback(async () => {
        if (!supabase) return setAlert("", "Falta configuración de Supabase en variables NEXT_PUBLIC.");

        const { data, error } = await supabase
            .from("brands")
            .select(BRAND_SELECT_COLUMNS)
            .order("nombre", { ascending: true });
        let rows = (data ?? []) as BrandRow[];
        let queryError = error;

        if (error) {
            setIsAsgSchemaReady(false);
            const legacyResult = await supabase
                .from("brands")
                .select(BRAND_SELECT_LEGACY_COLUMNS)
                .order("nombre", { ascending: true });
            rows = (legacyResult.data ?? []) as BrandRow[];
            queryError = legacyResult.error;
        } else {
            setIsAsgSchemaReady(true);
        }

        if (queryError) {
            console.error("Error cargando establecimientos", queryError);
            return setAlert("", "No se pudieron cargar los establecimientos.");
        }

        setBrands(rows);
        if (!selectedBrandId && rows[0]) {
            setSelectedBrandId(rows[0].id);
            setBrandForm(toBrandForm(rows[0]));
        }
    }, [selectedBrandId]);

    useEffect(() => {
        if (!isAuthed) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void Promise.all([loadRequests(), loadBrands()]);
    }, [isAuthed, loadRequests, loadBrands]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loginUser.trim() !== ADMIN_USER || loginPass !== ADMIN_PASS) {
            return setLoginError("Usuario o contraseña incorrectos.");
        }
        sessionStorage.setItem(SESSION_KEY, "1");
        setIsAuthed(true);
        setLoginError("");
        await Promise.all([loadRequests(), loadBrands()]);
    };

    const handleLogout = () => {
        sessionStorage.removeItem(SESSION_KEY);
        setIsAuthed(false);
        setLoginUser("");
        setLoginPass("");
        setLoginError("");
        setRequests([]);
        setSelectedRequestId(null);
        setAdminNotesDraft("");
        setBrands([]);
        setSelectedBrandId(null);
        setBrandForm(emptyBrandForm());
        setAlert();
    };

    const toggleASGIndicator = (dimension: ASGDimension, indicatorId: string) => {
        setBrandForm((current) => {
            const selected = new Set(current.asgIndicators[dimension]);
            if (selected.has(indicatorId)) {
                selected.delete(indicatorId);
            } else {
                selected.add(indicatorId);
            }

            return {
                ...current,
                asgIndicators: {
                    ...current.asgIndicators,
                    [dimension]: Array.from(selected),
                },
            };
        });
    };

    const saveReview = async (nextStatus?: ReviewStatus) => {
        if (!supabase || !selectedRequest) return;
        setSavingReview(true);
        setAlert("Guardando revisión...");

        const payload: Partial<ReviewRequest> & { reviewed_at: string } = {
            admin_notes: adminNotesDraft.trim() || null,
            reviewed_at: new Date().toISOString(),
            ...(nextStatus ? { status: nextStatus } : {}),
        };

        const { data, error } = await supabase
            .from(REQUESTS_TABLE)
            .update(payload)
            .eq("id", selectedRequest.id)
            .select("id, created_at, applicant_name, applicant_email, brand_name, reason, message, evidence_url, evidence_files, status, admin_notes, reviewed_at")
            .single();

        if (error) {
            setSavingReview(false);
            console.error("Error guardando revisión", error);
            return setAlert("", "No se pudo guardar la revisión.");
        }

        const updated = { ...(data as ReviewRequest), status: ((data as ReviewRequest).status as ReviewStatus | null) ?? "pendiente" };
        setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));

        if (nextStatus !== "aprobada") {
            setSavingReview(false);
            setAlert("Revisión actualizada correctamente.", "");
            return;
        }

        const draft = toBrandDraftFromRequest(updated);
        const { data: existingBrand, error: existingError } = await supabase
            .from("brands")
            .select(BRAND_SELECT_COLUMNS)
            .eq("slug", draft.slug)
            .maybeSingle();
        let brandForEdit: BrandRow | null = (existingBrand as BrandRow | null) ?? null;
        let existingQueryError = existingError;

        if (existingError) {
            const legacyResult = await supabase
                .from("brands")
                .select(BRAND_SELECT_LEGACY_COLUMNS)
                .eq("slug", draft.slug)
                .maybeSingle();
            brandForEdit = (legacyResult.data as BrandRow | null) ?? null;
            existingQueryError = legacyResult.error;
        }

        if (existingQueryError) {
            setSavingReview(false);
            console.error("Error comprobando establecimiento existente", existingQueryError);
            return setAlert("Solicitud aprobada, pero no se pudo preparar el establecimiento para edición.", "");
        }

        if (!brandForEdit) {
            const brandPayload = toBrandPayloadFromRequest(updated);
            const { data: insertedBrand, error: insertError } = await supabase
                .from("brands")
                .insert(brandPayload)
                .select(BRAND_SELECT_COLUMNS)
                .single();

            if (insertError) {
                setSavingReview(false);
                console.error("Error creando establecimiento desde solicitud aprobada", insertError);
                return setAlert("", getBrandInsertErrorMessage(insertError));
            }
            brandForEdit = insertedBrand as BrandRow;
        }

        setSelectedBrandId(brandForEdit.id);
        setBrandForm(toBrandForm(brandForEdit));
        await loadBrands();
        setSavingReview(false);
        setAlert("Solicitud aprobada y establecimiento listo para completar campos manualmente.", "");

        if (typeof document !== "undefined") {
            document.getElementById("brand-form-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const saveBrand = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!supabase) return;
        if (isAsgSchemaReady === false) {
            return setAlert("", "Migración ASG pendiente en Supabase: faltan columnas de indicadores. Ejecuta el SQL del apartado 8.1 del README antes de guardar checks.");
        }

        setSavingBrand(true);
        const payload = {
            slug: brandForm.slug.trim(),
            nombre: brandForm.nombre.trim(),
            eslogan: brandForm.eslogan.trim() || null,
            descripcion: brandForm.descripcion.trim() || null,
            calificacion_general: calculatedRating,
            ambiental: calculatedScores.ambiental,
            social: calculatedScores.social,
            gobernanza: calculatedScores.gobernanza,
            ambiental_indicadores: brandForm.asgIndicators.ambiental,
            social_indicadores: brandForm.asgIndicators.social,
            gobernanza_indicadores: brandForm.asgIndicators.gobernanza,
            categorias: parseCsv(brandForm.categorias),
            tipo_tienda: [...(brandForm.tipo_tienda_online ? ["online"] : []), ...(brandForm.tipo_tienda_fisica ? ["fisica"] : [])],
            pais: brandForm.pais.trim().toUpperCase() || null,
            ciudad: brandForm.ciudad.trim() || null,
            web: brandForm.web.trim() || null,
            instagram: brandForm.instagram.trim() || null,
            published: brandForm.published,
        };

        const result = brandForm.id
            ? await supabase.from("brands").update(payload).eq("id", brandForm.id).select(BRAND_SELECT_COLUMNS).single()
            : await supabase.from("brands").insert(payload).select(BRAND_SELECT_COLUMNS).single();

        setSavingBrand(false);
        if (result.error) {
            console.error("Error guardando establecimiento", result.error);
            return setAlert("", "No se pudo guardar el establecimiento. Revisa que la migración ASG del README esté aplicada en Supabase.");
        }

        const savedBrand = result.data as BrandRow;
        setBrands((prev) => {
            const exists = prev.some((brand) => brand.id === savedBrand.id);
            const next = exists
                ? prev.map((brand) => (brand.id === savedBrand.id ? savedBrand : brand))
                : [...prev, savedBrand];
            return next.sort((a, b) => (a.nombre ?? "").localeCompare(b.nombre ?? "", "es", { sensitivity: "base" }));
        });
        setSelectedBrandId(savedBrand.id);
        setBrandForm(toBrandForm(savedBrand));
        setAlert(brandForm.id ? "Establecimiento actualizado." : "Establecimiento creado.", "");
    };

    const deleteBrand = async () => {
        if (!supabase || !brandForm.id) return;
        if (!window.confirm("¿Seguro que quieres eliminar este establecimiento?")) return;
        const { error } = await supabase.from("brands").delete().eq("id", brandForm.id);
        if (error) {
            console.error("Error eliminando establecimiento", error);
            return setAlert("", "No se pudo eliminar el establecimiento.");
        }
        setAlert("Establecimiento eliminado.", "");
        setBrandForm(emptyBrandForm());
        setSelectedBrandId(null);
        await loadBrands();
    };

    const topSpacing = "mx-auto max-w-7xl px-4 pt-36 pb-12 sm:px-6 lg:px-8";

    if (!isAuthed) {
        return (
            <div className={topSpacing}>
                <header className="mb-8">
                    <h1 className="font-serif text-4xl md:text-5xl font-light tracking-tight text-[#1A1A1A]">Panel administrativo</h1>
                    <p className="mt-2 text-[#1A1A1A]/70">Validación de solicitudes y gestión del directorio.</p>
                </header>
                <section className="mx-auto mt-10 w-full max-w-md rounded-[1.5rem] bg-white/80 p-6 shadow-[0_18px_45px_rgba(26,26,26,0.05)]">
                    <h2 className="text-sm font-semibold text-[#1A1A1A]">Acceso restringido</h2>
                    <form onSubmit={handleLogin} className="mt-4 space-y-4">
                        <Field label="Usuario" htmlFor="login-user"><Input id="login-user" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} required /></Field>
                        <Field label="Contraseña" htmlFor="login-pass"><Input id="login-pass" type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} required /></Field>
                        <Button type="submit" className="w-full">Entrar</Button>
                        {loginError ? <p className="text-xs text-rose-700">{loginError}</p> : null}
                    </form>
                </section>
            </div>
        );
    }

    return (
        <div className={topSpacing}>
            <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="font-serif text-4xl md:text-5xl font-light tracking-tight text-[#1A1A1A]">Admin · Validación y gestión</h1>
                    <p className="mt-2 text-[#1A1A1A]/70">Revisión de documentación y CRUD de establecimientos.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="px-3 py-1">admin_root</Badge>
                    <Button variant="outline" size="sm" onClick={handleLogout}>Cerrar sesión</Button>
                </div>
            </div>

            {(statusInfo || statusError) && (
                <div className={`mb-6 rounded-[1.25rem] px-4 py-3 text-sm ${statusError ? "bg-rose-50 text-rose-800" : "bg-emerald-50 text-emerald-800"}`}>
                    {statusError || statusInfo}
                </div>
            )}

            {isAsgSchemaReady === false && (
                <div className="mb-6 rounded-[1.25rem] bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    Migración ASG pendiente en Supabase. Las marcas se pueden leer, pero los checks no se pueden guardar hasta añadir las columnas `ambiental_indicadores`, `social_indicadores` y `gobernanza_indicadores`.
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-4 mb-8">
                <MetricCard title="Solicitudes" value={metrics.total} />
                <MetricCard title="Pendientes" value={metrics.pending} accent="text-amber-700" />
                <MetricCard title="Aprobadas" value={metrics.approved} accent="text-emerald-700" />
                <MetricCard title="Rechazadas" value={metrics.rejected} accent="text-rose-700" />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_1.9fr] mb-10">
                <section className="rounded-[1.5rem] bg-white/70 p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <h2 className="text-sm font-semibold text-[#1A1A1A]">Solicitudes recibidas</h2>
                        <Button variant="ghost" size="sm" onClick={loadRequests} disabled={loadingRequests}>{loadingRequests ? "Cargando..." : "Recargar"}</Button>
                    </div>
                    <div className="max-h-[560px] space-y-2 overflow-auto pr-1">
                        {requests.length === 0 ? <p className="text-sm text-[#1A1A1A]/60">No hay solicitudes todavía.</p> : requests.map((req) => {
                            const currentStatus = req.status ?? "pendiente";
                            const badge = statusMap[currentStatus];
                            return (
                                <button key={req.id} type="button" onClick={() => { setSelectedRequestId(req.id); setAdminNotesDraft(req.admin_notes ?? ""); }} className={`w-full rounded-[1.25rem] px-3 py-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E4036]/30 ${selectedRequestId === req.id ? "bg-[#F2F0E9] shadow-[inset_4px_0_0_#2E4036]" : "hover:bg-[#F2F0E9]/55"}`}>
                                    <div className="mb-2 flex items-center justify-between gap-2">
                                        <p className="font-semibold text-sm text-[#1A1A1A]">{req.brand_name || "Marca sin especificar"}</p>
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${badge.badge}`}>{badge.label}</span>
                                    </div>
                                    <p className="text-xs text-[#1A1A1A]/60">{req.applicant_name || "Solicitante"} · {req.applicant_email || "sin email"}</p>
                                </button>
                            );
                        })}
                    </div>
                </section>

                <section className="rounded-[1.5rem] bg-white/70 p-6">
                    {!selectedRequest ? <p className="text-sm text-[#1A1A1A]/60">Selecciona una solicitud para revisarla.</p> : (
                        <>
                            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h2 className="font-serif text-3xl font-light text-[#1A1A1A]">{selectedRequest.brand_name || "Solicitud de revisión"}</h2>
                                    <p className="mt-1 text-sm text-[#1A1A1A]/60">{selectedRequest.applicant_name || "Solicitante"} · {selectedRequest.applicant_email || "sin email"}</p>
                                </div>
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusMap[(selectedRequest.status ?? "pendiente") as ReviewStatus].badge}`}>{statusMap[(selectedRequest.status ?? "pendiente") as ReviewStatus].label}</span>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2 mb-6">
                                <InfoField label="Motivo" value={selectedRequest.reason || "Sin motivo"} />
                                <InfoField label="Fecha" value={new Date(selectedRequest.created_at).toLocaleString("es-ES")} />
                            </div>
                            <div className="mb-6 space-y-2">
                                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#1A1A1A]/50">Evidencias adjuntas</h3>
                                {selectedRequest.evidence_url ? <a href={selectedRequest.evidence_url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#2E4036] underline underline-offset-4">Abrir enlace documental principal</a> : <p className="text-sm text-[#1A1A1A]/60">Sin enlace principal adjunto.</p>}
                                {parseList(selectedRequest.evidence_files).map((file) => (
                                    <div key={file}><a href={file} target="_blank" rel="noopener noreferrer" className="text-sm text-[#2E4036] underline underline-offset-4">{file}</a></div>
                                ))}
                            </div>
                            <div className="mb-6">
                                <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#1A1A1A]/50">Mensaje del solicitante</h3>
                                <p className="rounded-[1.25rem] bg-[#F2F0E9]/55 px-4 py-3 text-sm leading-relaxed text-[#1A1A1A]/80">{selectedRequest.message || "Sin mensaje adicional."}</p>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="admin-notes" className="text-xs font-semibold uppercase tracking-widest text-[#1A1A1A]/50">Notas de revisión interna</label>
                                <Textarea id="admin-notes" value={adminNotesDraft} onChange={(e) => setAdminNotesDraft(e.target.value)} className="min-h-[130px]" />
                            </div>
                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                <Button variant="outline" onClick={() => void saveReview("pendiente")} disabled={savingReview}>Marcar pendiente</Button>
                                <Button className="bg-emerald-700 hover:bg-emerald-800" onClick={() => void saveReview("aprobada")} disabled={savingReview}>Aprobar solicitud</Button>
                                <Button className="bg-rose-700 hover:bg-rose-800" onClick={() => void saveReview("rechazada")} disabled={savingReview}>Rechazar solicitud</Button>
                                <Button variant="ghost" onClick={() => void saveReview()} disabled={savingReview}>Guardar notas</Button>
                            </div>
                        </>
                    )}
                </section>
            </div>

            <section className="grid gap-6 lg:grid-cols-[1.2fr_1.8fr]">
                <section className="rounded-[1.5rem] bg-white/70 p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <h2 className="text-sm font-semibold text-[#1A1A1A]">Establecimientos</h2>
                        <Button variant="ghost" size="sm" onClick={loadBrands}>Recargar</Button>
                    </div>
                    <div className="max-h-[500px] space-y-2 overflow-auto pr-1">
                        {brands.length === 0 ? <p className="text-sm text-[#1A1A1A]/60">No hay establecimientos todavía.</p> : brands.map((b) => (
                            <button key={b.id} type="button" onClick={() => { setSelectedBrandId(b.id); setBrandForm(toBrandForm(b)); }} className={`w-full rounded-[1.25rem] px-3 py-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E4036]/30 ${selectedBrandId === b.id ? "bg-[#F2F0E9] shadow-[inset_4px_0_0_#2E4036]" : "hover:bg-[#F2F0E9]/55"}`}>
                                <p className="font-semibold text-sm text-[#1A1A1A]">{b.nombre || "Sin nombre"}</p>
                                <p className="text-xs text-[#1A1A1A]/60">{b.slug || "sin-slug"}</p>
                            </button>
                        ))}
                    </div>
                </section>

                <form id="brand-form-panel" onSubmit={saveBrand} className="space-y-4 rounded-[1.5rem] bg-white/70 p-6">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="text-sm font-semibold text-[#1A1A1A]">{brandForm.id ? "Editar establecimiento" : "Crear establecimiento"}</h2>
                        <Button type="button" variant="ghost" size="sm" onClick={() => { setSelectedBrandId(null); setBrandForm(emptyBrandForm()); }}>Limpiar</Button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                        <Field label="Slug" htmlFor="slug"><Input id="slug" className={ADMIN_INPUT_CLASS} value={brandForm.slug} onChange={(e) => setBrandForm((p) => ({ ...p, slug: e.target.value }))} required /></Field>
                        <Field label="Nombre" htmlFor="nombre"><Input id="nombre" className={ADMIN_INPUT_CLASS} value={brandForm.nombre} onChange={(e) => setBrandForm((p) => ({ ...p, nombre: e.target.value }))} required /></Field>
                    </div>
                    <Field label="Eslogan" htmlFor="eslogan"><Input id="eslogan" className={ADMIN_INPUT_CLASS} value={brandForm.eslogan} onChange={(e) => setBrandForm((p) => ({ ...p, eslogan: e.target.value }))} /></Field>
                    <Field label="Descripción" htmlFor="descripcion"><Textarea id="descripcion" className={ADMIN_TEXTAREA_CLASS} value={brandForm.descripcion} onChange={(e) => setBrandForm((p) => ({ ...p, descripcion: e.target.value }))} /></Field>
                    <div className="rounded-[1.5rem] bg-[#F2F0E9]/45 p-4">
                        <div className="mb-4 grid gap-3 md:grid-cols-4">
                            <ScoreBox label="Ambiental" value={calculatedScores.ambiental} />
                            <ScoreBox label="Social" value={calculatedScores.social} />
                            <ScoreBox label="Gobernanza" value={calculatedScores.gobernanza} />
                            <ScoreBox label="Valoración" value={calculatedRating} />
                        </div>
                        <div className="grid gap-4 lg:grid-cols-3">
                            {ASG_DIMENSIONS.map((dimension) => (
                                <IndicatorChecklist
                                    key={dimension}
                                    dimension={dimension}
                                    selected={brandForm.asgIndicators[dimension]}
                                    onToggle={toggleASGIndicator}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                        <Field label="Categorías (coma)" htmlFor="categorias"><Input id="categorias" className={ADMIN_INPUT_CLASS} value={brandForm.categorias} onChange={(e) => setBrandForm((p) => ({ ...p, categorias: e.target.value }))} /></Field>
                        <div className="space-y-2"><p className="text-sm font-medium">Tipo tienda</p>
                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={brandForm.tipo_tienda_online} onChange={(e) => setBrandForm((p) => ({ ...p, tipo_tienda_online: e.target.checked }))} /> Online</label>
                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={brandForm.tipo_tienda_fisica} onChange={(e) => setBrandForm((p) => ({ ...p, tipo_tienda_fisica: e.target.checked }))} /> Física</label>
                        </div>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                        <Field label="País (ISO2)" htmlFor="pais"><Input id="pais" className={ADMIN_INPUT_CLASS} maxLength={2} value={brandForm.pais} onChange={(e) => setBrandForm((p) => ({ ...p, pais: e.target.value }))} /></Field>
                        <Field label="Ciudad" htmlFor="ciudad"><Input id="ciudad" className={ADMIN_INPUT_CLASS} value={brandForm.ciudad} onChange={(e) => setBrandForm((p) => ({ ...p, ciudad: e.target.value }))} /></Field>
                        <PublicationSwitch
                            checked={brandForm.published}
                            onCheckedChange={(published) => setBrandForm((p) => ({ ...p, published }))}
                        />
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                        <Field label="Web" htmlFor="web"><Input id="web" className={ADMIN_INPUT_CLASS} type="url" value={brandForm.web} onChange={(e) => setBrandForm((p) => ({ ...p, web: e.target.value }))} /></Field>
                        <Field label="Instagram" htmlFor="instagram"><Input id="instagram" className={ADMIN_INPUT_CLASS} value={brandForm.instagram} onChange={(e) => setBrandForm((p) => ({ ...p, instagram: e.target.value }))} /></Field>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <Button type="submit" disabled={savingBrand}>{savingBrand ? "Guardando..." : "Guardar"}</Button>
                        {brandForm.id ? <Button type="button" className="bg-rose-700 hover:bg-rose-800" onClick={deleteBrand}>Eliminar</Button> : null}
                    </div>
                </form>
            </section>
        </div>
    );
}

function MetricCard({ title, value, accent }: { title: string; value: number; accent?: string }) {
    return (
        <div className="rounded-[1.5rem] bg-white/70 p-5">
            <h3 className="text-sm font-medium text-[#1A1A1A]/60">{title}</h3>
            <p className={`mt-2 text-3xl font-bold ${accent ?? "text-[#1A1A1A]"}`}>{value}</p>
        </div>
    );
}

function InfoField({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-[1.25rem] bg-[#F2F0E9]/55 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1A1A1A]/50">{label}</p>
            <p className="mt-1 text-sm text-[#1A1A1A]/80">{value}</p>
        </div>
    );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
    return (
        <div className="space-y-1">
            <label htmlFor={htmlFor} className="text-sm font-medium text-[#1A1A1A]/80">{label}</label>
            {children}
        </div>
    );
}

function ScoreBox({ label, value }: { label: string; value: number | string }) {
    return (
        <div className="rounded-[1rem] bg-white/75 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#1A1A1A]/50">{label}</p>
            <p className="mt-1 text-lg font-bold text-[#1A1A1A]">{value}</p>
        </div>
    );
}

function PublicationSwitch({
    checked,
    onCheckedChange,
}: {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}) {
    const statusId = "published-status";

    return (
        <div className="rounded-[1.25rem] bg-[#F2F0E9]/55 px-4 py-3">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-[#1A1A1A]/80">Publicación</p>
                    <p id={statusId} className="mt-1 text-xs leading-relaxed text-[#1A1A1A]/60">
                        {checked ? "Visible en el directorio y en la ficha pública." : "Guardada en admin, oculta al público."}
                    </p>
                </div>
                <button
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    aria-describedby={statusId}
                    onClick={() => onCheckedChange(!checked)}
                    className={`relative h-7 w-12 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#2E4036]/40 ${
                        checked ? "bg-[#2E4036]" : "bg-[#D1CFC7]"
                    }`}
                >
                    <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
                            checked ? "left-6" : "left-1"
                        }`}
                    />
                    <span className="sr-only">{checked ? "Despublicar marca" : "Publicar marca"}</span>
                </button>
            </div>
            <p className={`mt-3 text-xs font-semibold uppercase tracking-widest ${checked ? "text-emerald-700" : "text-amber-700"}`}>
                {checked ? "Publicada" : "No publicada"}
            </p>
        </div>
    );
}

function IndicatorChecklist({
    dimension,
    selected,
    onToggle,
}: {
    dimension: ASGDimension;
    selected: string[];
    onToggle: (dimension: ASGDimension, indicatorId: string) => void;
}) {
    return (
        <fieldset className="rounded-[1.25rem] bg-white/75 p-4">
            <legend className="px-1 text-xs font-semibold uppercase tracking-widest text-[#1A1A1A]/60">
                {dimensionLabels[dimension]}
            </legend>
            <div className="mt-3 space-y-3">
                {ASG_INDICATOR_GROUPS[dimension].map((indicator) => (
                    <label key={indicator.id} className="flex cursor-pointer items-start gap-3 rounded-md p-2 hover:bg-[#F2F0E9]/60">
                        <input
                            type="checkbox"
                            checked={selected.includes(indicator.id)}
                            onChange={() => onToggle(dimension, indicator.id)}
                            className="mt-1 h-4 w-4 rounded border-[#1A1A1A]/30 text-[#2E4036] focus:ring-[#2E4036]"
                        />
                        <span>
                            <span className="block text-sm font-semibold text-[#1A1A1A]">{indicator.title}</span>
                            <span className="mt-1 block text-xs leading-relaxed text-[#1A1A1A]/60">{indicator.description}</span>
                        </span>
                    </label>
                ))}
            </div>
        </fieldset>
    );
}

