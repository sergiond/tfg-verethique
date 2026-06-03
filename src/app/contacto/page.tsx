"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const hasSupabaseConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
const supabase = hasSupabaseConfig ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const REQUESTS_TABLE = "review_requests";
const CONTACT_INPUT_CLASS = "h-12 rounded-[1.15rem] border-0 bg-[#F2F0E9]/75 px-4 text-[#1A1A1A] shadow-none focus-visible:ring-2 focus-visible:ring-[#2E4036]/25";
const CONTACT_TEXTAREA_CLASS = "rounded-[1.15rem] border-0 bg-[#F2F0E9]/75 px-4 py-3 text-[#1A1A1A] shadow-none focus-visible:ring-2 focus-visible:ring-[#2E4036]/25";
const CONTACT_SELECT_CLASS = "h-12 w-full rounded-[1.15rem] bg-[#F2F0E9]/75 px-4 text-sm text-[#1A1A1A] outline-none focus-visible:ring-2 focus-visible:ring-[#2E4036]/25";

const reviewChecks = [
    "Fuente original, fecha de vigencia y trazabilidad del documento.",
    "Coherencia entre evidencias, afirmaciones públicas y criterios ASG.",
    "Decisión de revisión con estado y nota interna para seguimiento.",
];

const reasonByQuery: Record<string, FormState["motivo"]> = {
    sugerencia: "Sugerir inclusión de nueva marca",
    greenwashing: "Reportar greenwashing",
    correccion: "Corregir datos de calificación ASG",
    revision: "Solicitar revisión documental",
};

type FormState = {
    nombre: string;
    email: string;
    marca: string;
    motivo: string;
    mensaje: string;
    evidenciaUrl: string;
    evidenciasExtra: string;
};

type SupabaseLikeError = {
    message?: string;
    details?: string | null;
    hint?: string | null;
    code?: string;
};

const initialForm: FormState = {
    nombre: "",
    email: "",
    marca: "",
    motivo: "Reportar greenwashing",
    mensaje: "",
    evidenciaUrl: "",
    evidenciasExtra: "",
};

const toFileList = (raw: string): string[] =>
    raw
        .split(/\n|,/)
        .map((v) => v.trim())
        .filter(Boolean);

const normalizeUrl = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (/^www\./i.test(trimmed)) return `https://${trimmed}`;
    return trimmed;
};

const toNormalizedFileList = (raw: string): string[] => toFileList(raw).map(normalizeUrl);

const formatSupabaseError = (err: unknown): string => {
    const e = (err ?? {}) as SupabaseLikeError;
    if (e.code === "PGRST205") {
        return "Falta la tabla 'review_requests' en Supabase. Debes crearla antes de enviar solicitudes.";
    }
    if (typeof e.message === "string" && e.message.trim()) return e.message;
    return "Error desconocido al enviar la solicitud.";
};

export default function ContactoPage() {
    const [form, setForm] = useState<FormState>(initialForm);
    const [sending, setSending] = useState(false);
    const [statusInfo, setStatusInfo] = useState("");
    const [statusError, setStatusError] = useState("");

    useEffect(() => {
        const queryReason = new URLSearchParams(window.location.search).get("motivo");
        const selectedReason = queryReason ? reasonByQuery[queryReason] : undefined;
        if (selectedReason) {
            setForm((prev) => ({ ...prev, motivo: selectedReason }));
        }
    }, []);

    const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatusInfo("");
        setStatusError("");

        if (!supabase) {
            setStatusError("Falta configuración de Supabase en variables NEXT_PUBLIC.");
            return;
        }

        setSending(true);

        const payload = {
            applicant_name: form.nombre.trim(),
            applicant_email: form.email.trim(),
            brand_name: form.marca.trim() || null,
            reason: form.motivo,
            message: form.mensaje.trim(),
            evidence_url: normalizeUrl(form.evidenciaUrl) || null,
            evidence_files: toNormalizedFileList(form.evidenciasExtra),
            status: "pendiente",
        };

        try {
            const { error } = await supabase.from(REQUESTS_TABLE).insert(payload);
            if (error) throw error;
        } catch (err) {
            console.error("Error creando solicitud de revisión", err);
            setStatusError(`No se pudo enviar la solicitud: ${formatSupabaseError(err)}`);
            setSending(false);
            return;
        }

        setSending(false);

        setForm(initialForm);
        setStatusInfo("Solicitud enviada correctamente. El equipo de administración la revisará.");
    };

    return (
        <div className="min-h-screen bg-[#F2F0E9] text-[#1A1A1A] selection:bg-[#9E3F24] selection:text-white">
            <header className="pt-32 pb-10 md:pt-40 md:pb-16">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.25fr_0.75fr] lg:px-8">
                    <div>
                        <p className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#9E3F24]">
                            Contacto y revisión documental
                        </p>
                        <h1 className="max-w-4xl font-serif text-5xl font-light leading-[0.95] tracking-tight md:text-7xl">
                            Cuéntanos qué hay que revisar.
                        </h1>
                    </div>
                    <p className="max-w-xl self-end text-lg leading-relaxed text-[#1A1A1A]/70 md:text-xl">
                        Envía una solicitud con enlaces verificables. El equipo revisa la evidencia antes de actualizar el directorio y la ficha pública.
                    </p>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
                    <section className="rounded-[2rem] bg-white/70 p-5 md:p-8">
                        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                            <div>
                                <h2 className="font-serif text-3xl font-light">Solicitar revisión</h2>
                                <p className="mt-2 text-sm leading-relaxed text-[#1A1A1A]/70">
                                    Cuanto más clara sea la fuente, más fácil será validar la solicitud.
                                </p>
                            </div>
                        </div>

                        {(statusInfo || statusError) && (
                            <div
                                className={`mb-6 rounded-[1.25rem] px-4 py-3 text-sm ${
                                    statusError
                                        ? "bg-rose-50 text-rose-800"
                                        : "bg-emerald-50 text-emerald-800"
                                }`}
                            >
                                {statusError || statusInfo}
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={onSubmit}>
                            <div className="grid gap-4 md:grid-cols-2">
                                <ContactField label="Nombre" htmlFor="nombre">
                                    <Input id="nombre" className={CONTACT_INPUT_CLASS} value={form.nombre} onChange={(e) => setField("nombre", e.target.value)} placeholder="Tu nombre" required />
                                </ContactField>
                                <ContactField label="Email" htmlFor="email">
                                    <Input id="email" className={CONTACT_INPUT_CLASS} type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} placeholder="hola@ejemplo.com" required />
                                </ContactField>
                            </div>

                            <ContactField label="Marca / establecimiento" htmlFor="marca" hint="Opcional si la solicitud es general.">
                                <Input id="marca" className={CONTACT_INPUT_CLASS} value={form.marca} onChange={(e) => setField("marca", e.target.value)} placeholder="Nombre de la marca" />
                            </ContactField>

                            <ContactField label="Motivo" htmlFor="asunto">
                                <select
                                    id="asunto"
                                    value={form.motivo}
                                    onChange={(e) => setField("motivo", e.target.value)}
                                    className={CONTACT_SELECT_CLASS}
                                >
                                    <option>Reportar greenwashing</option>
                                    <option>Sugerir inclusión de nueva marca</option>
                                    <option>Corregir datos de calificación ASG</option>
                                    <option>Solicitar revisión documental</option>
                                    <option>Otros</option>
                                </select>
                            </ContactField>

                            <ContactField
                                label="Enlace principal de evidencia"
                                htmlFor="evidencia-url"
                                hint="Acepta www... o https://... Si falta el protocolo, se añade automáticamente."
                            >
                                <Input
                                    id="evidencia-url"
                                    className={CONTACT_INPUT_CLASS}
                                    type="text"
                                    value={form.evidenciaUrl}
                                    onChange={(e) => setField("evidenciaUrl", e.target.value)}
                                    placeholder="www.ejemplo.com/documento"
                                />
                            </ContactField>

                            <ContactField
                                label="Evidencias adicionales"
                                htmlFor="evidencias-extra"
                                hint="URLs separadas por coma o por línea."
                            >
                                <Textarea
                                    id="evidencias-extra"
                                    value={form.evidenciasExtra}
                                    onChange={(e) => setField("evidenciasExtra", e.target.value)}
                                    placeholder="www.doc1.pdf, https://doc2.pdf"
                                    className={`${CONTACT_TEXTAREA_CLASS} min-h-[96px]`}
                                />
                            </ContactField>

                            <ContactField label="Mensaje y contexto" htmlFor="mensaje">
                                <Textarea
                                    id="mensaje"
                                    value={form.mensaje}
                                    onChange={(e) => setField("mensaje", e.target.value)}
                                    placeholder="Describe qué debe validar el equipo y por qué..."
                                    className={`${CONTACT_TEXTAREA_CLASS} min-h-[150px]`}
                                    required
                                />
                            </ContactField>

                            <div className="pt-2">
                                <Button type="submit" size="lg" className="h-12 w-full rounded-full bg-[#1A1A1A] text-[#F2F0E9] hover:bg-[#9E3F24]" disabled={sending}>
                                    {sending ? "Enviando..." : "Enviar solicitud"}
                                </Button>
                                <p className="mt-4 text-center text-xs leading-relaxed text-[#1A1A1A]/70">
                                    Revisaremos la documentación enviada y responderemos por email.
                                </p>
                            </div>
                        </form>
                    </section>

                    <aside className="h-fit rounded-[2rem] bg-[#1A1A1A] p-8 text-[#F2F0E9] lg:sticky lg:top-28">
                        <h3 className="font-serif text-3xl font-light">Qué se valida</h3>
                        <div className="mt-8 space-y-7">
                            {reviewChecks.map((item, index) => (
                                <div key={item} className="grid grid-cols-[3rem_1fr] gap-4">
                                    <span className="font-serif text-4xl italic leading-none text-[#D9653E]">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <p className="text-sm leading-relaxed text-[#F2F0E9]/75">{item}</p>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

function ContactField({
    label,
    htmlFor,
    hint,
    children,
}: {
    label: string;
    htmlFor: string;
    hint?: string;
    children: ReactNode;
}) {
    return (
        <div className="space-y-2">
            <label htmlFor={htmlFor} className="text-sm font-semibold text-[#1A1A1A]/80">
                {label}
            </label>
            {children}
            {hint ? <p className="text-xs leading-relaxed text-[#1A1A1A]/70">{hint}</p> : null}
        </div>
    );
}
