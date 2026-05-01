"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const hasSupabaseConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
const supabase = hasSupabaseConfig ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const REQUESTS_TABLE = "review_requests";

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
        <div className="bg-background min-h-screen">
            <header className="bg-muted/30 border-b border-border py-16 md:py-24">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-6">Estamos aquí.</h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Envía tu solicitud de revisión y la documentación de soporte. El equipo admin validará cada evidencia.
                    </p>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="grid md:grid-cols-2 gap-16">
                    <div>
                        <h2 className="font-serif text-3xl font-bold mb-6">Solicitar revisión</h2>

                        {(statusInfo || statusError) && (
                            <div
                                className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
                                    statusError
                                        ? "border-rose-200 bg-rose-50 text-rose-800"
                                        : "border-emerald-200 bg-emerald-50 text-emerald-800"
                                }`}
                            >
                                {statusError || statusInfo}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={onSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="nombre" className="text-sm font-medium">Nombre</label>
                                    <Input id="nombre" value={form.nombre} onChange={(e) => setField("nombre", e.target.value)} placeholder="Tu nombre" required />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                                    <Input id="email" type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} placeholder="hola@ejemplo.com" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="marca" className="text-sm font-medium">Marca / establecimiento (opcional)</label>
                                <Input id="marca" value={form.marca} onChange={(e) => setField("marca", e.target.value)} placeholder="Nombre de la marca" />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="asunto" className="text-sm font-medium">Motivo</label>
                                <select
                                    id="asunto"
                                    value={form.motivo}
                                    onChange={(e) => setField("motivo", e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                    <option>Reportar greenwashing</option>
                                    <option>Sugerir inclusión de nueva marca</option>
                                    <option>Corregir datos de calificación ASG</option>
                                    <option>Solicitar revisión documental</option>
                                    <option>Otros</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="evidencia-url" className="text-sm font-medium">Enlace principal de evidencia</label>
                                <Input
                                    id="evidencia-url"
                                    type="text"
                                    value={form.evidenciaUrl}
                                    onChange={(e) => setField("evidenciaUrl", e.target.value)}
                                    placeholder="www.ejemplo.com/documento o https://..."
                                />
                                <p className="text-xs text-muted-foreground">
                                    Formato aceptado: `www...` o `https://...` (si falta protocolo, lo añadimos automáticamente).
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="evidencias-extra" className="text-sm font-medium">Evidencias adicionales (URLs separadas por coma o línea)</label>
                                <Textarea
                                    id="evidencias-extra"
                                    value={form.evidenciasExtra}
                                    onChange={(e) => setField("evidenciasExtra", e.target.value)}
                                    placeholder="www.doc1.pdf, https://doc2.pdf"
                                    className="min-h-[90px]"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Puedes separar por comas o por líneas.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="mensaje" className="text-sm font-medium">Mensaje y contexto</label>
                                <Textarea
                                    id="mensaje"
                                    value={form.mensaje}
                                    onChange={(e) => setField("mensaje", e.target.value)}
                                    placeholder="Describe qué debe validar el equipo y por qué..."
                                    className="min-h-[150px]"
                                    required
                                />
                            </div>

                            <Button type="submit" size="lg" className="w-full" disabled={sending}>
                                {sending ? "Enviando..." : "Enviar solicitud"}
                            </Button>
                            <p className="text-xs text-muted-foreground text-center">
                                Revisaremos la documentación enviada y responderemos por email.
                            </p>
                        </form>
                    </div>

                    <div className="bg-muted p-8 rounded-2xl h-fit">
                        <h3 className="font-serif text-2xl font-bold mb-6">Qué valida el equipo admin</h3>
                        <div className="space-y-5 text-sm text-muted-foreground">
                            <p>Comprobación de la fuente original, fecha de vigencia y trazabilidad del documento.</p>
                            <p>Coherencia entre evidencia, afirmaciones públicas y calificación ASG.</p>
                            <p>Marcado final de la solicitud como pendiente, aprobada o rechazada con nota de revisión.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
