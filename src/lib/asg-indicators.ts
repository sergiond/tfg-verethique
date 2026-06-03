import type { ASGScores, RatingCategory } from "./types";

export type ASGDimension = "ambiental" | "social" | "gobernanza";

export type ASGIndicator = {
    id: string;
    dimension: ASGDimension;
    title: string;
    description: string;
    evidenceHint: string;
};

export type ASGIndicatorEvidence = Record<ASGDimension, string[]>;

export const ASG_DIMENSIONS: ASGDimension[] = ["ambiental", "social", "gobernanza"];

export const ASG_INDICATOR_GROUPS: Record<ASGDimension, ASGIndicator[]> = {
    ambiental: [
        {
            id: "materials_traceable_preferred",
            dimension: "ambiental",
            title: "Materiales preferentes trazables",
            description: "La marca documenta el origen de materiales orgánicos, reciclados, regenerativos o de menor impacto.",
            evidenceHint: "Certificados, fichas de material, proveedor o porcentaje de composición verificable.",
        },
        {
            id: "climate_emissions_plan",
            dimension: "ambiental",
            title: "Medición climática y plan de reducción",
            description: "Existe medición de emisiones y objetivos de reducción para operaciones y cadena de suministro relevante.",
            evidenceHint: "Inventario GEI, alcances 1-2 y alcance 3 relevante, objetivo y avance publicado.",
        },
        {
            id: "water_wastewater_management",
            dimension: "ambiental",
            title: "Gestión de agua y vertidos",
            description: "Hay control documentado de consumo, tratamiento y vertido en procesos húmedos o proveedores críticos.",
            evidenceHint: "Datos de agua, ensayos de efluentes, ZDHC u otra evidencia técnica equivalente.",
        },
        {
            id: "chemical_restricted_substances",
            dimension: "ambiental",
            title: "Sustancias químicas restringidas",
            description: "La marca aplica listas RSL/MRSL o controles equivalentes sobre químicos peligrosos.",
            evidenceHint: "Política química, listas restringidas, auditorías o declaraciones de conformidad.",
        },
        {
            id: "circularity_waste_reduction",
            dimension: "ambiental",
            title: "Circularidad y reducción de residuos",
            description: "Se evidencian acciones de durabilidad, reparación, reutilización, reciclaje o reducción de residuos.",
            evidenceHint: "Programa de reparación/recogida, datos de residuos, packaging o diseño circular.",
        },
    ],
    social: [
        {
            id: "ilo_code_of_conduct",
            dimension: "social",
            title: "Código laboral alineado con OIT",
            description: "El código cubre trabajo forzoso, trabajo infantil, discriminación, libertad sindical y seguridad laboral.",
            evidenceHint: "Código proveedor, cláusulas contractuales o política laboral publicada.",
        },
        {
            id: "supplier_assessment_remediation",
            dimension: "social",
            title: "Evaluación y remediación de proveedores",
            description: "Existen revisiones laborales y planes correctivos cuando se detectan incumplimientos.",
            evidenceHint: "Auditorías, CAPA, seguimiento de incidencias o resúmenes de remediación.",
        },
        {
            id: "living_wage_progress",
            dimension: "social",
            title: "Salario digno o progreso salarial",
            description: "La marca mide brechas salariales y tiene acciones verificables hacia salarios dignos.",
            evidenceHint: "Benchmark salarial, compromisos por proveedor, negociación o datos de avance.",
        },
        {
            id: "health_safety_controls",
            dimension: "social",
            title: "Salud y seguridad laboral",
            description: "Hay controles verificables de seguridad, prevención de accidentes y respuesta ante riesgos críticos.",
            evidenceHint: "Sistema SST, inspecciones, formación, accidentes o planes de mejora.",
        },
        {
            id: "worker_voice_purchasing_practices",
            dimension: "social",
            title: "Voz trabajadora y compras responsables",
            description: "Se documentan canales de queja, diálogo social y prácticas de compra que no empujan abusos.",
            evidenceHint: "Mecanismo de reclamación, acuerdos, plazos de pago, lead times o feedback trabajador.",
        },
    ],
    gobernanza: [
        {
            id: "supplier_traceability_public",
            dimension: "gobernanza",
            title: "Trazabilidad pública de proveedores",
            description: "La marca publica proveedores directos y, cuando aplica, etapas de procesado o materia prima.",
            evidenceHint: "Lista de proveedores con nombre, ubicación, producto/proceso y fecha de actualización.",
        },
        {
            id: "accountability_oversight",
            dimension: "gobernanza",
            title: "Responsabilidad interna definida",
            description: "Hay una persona, equipo o órgano responsable de sostenibilidad y cumplimiento ASG.",
            evidenceHint: "Organigrama, comité, responsable designado o gobierno corporativo publicado.",
        },
        {
            id: "public_targets_kpis",
            dimension: "gobernanza",
            title: "Objetivos y KPIs públicos",
            description: "Existen metas ambientales/sociales con indicadores, plazos y seguimiento periódico.",
            evidenceHint: "Informe, dashboard, memoria o página con objetivos y progreso.",
        },
        {
            id: "third_party_verification",
            dimension: "gobernanza",
            title: "Verificación externa o certificación",
            description: "Las evidencias clave están verificadas por terceros o respaldadas por certificaciones reconocibles.",
            evidenceHint: "Certificados vigentes, auditoría independiente, assurance o verificación documental.",
        },
        {
            id: "claims_substantiation_process",
            dimension: "gobernanza",
            title: "Control anti-greenwashing",
            description: "Las afirmaciones ambientales/sociales son específicas, trazables y corregibles si quedan desactualizadas.",
            evidenceHint: "Metodología, fuentes, fecha de revisión, responsable y proceso de corrección.",
        },
    ],
};

const indicatorIdsByDimension: Record<ASGDimension, Set<string>> = ASG_DIMENSIONS.reduce(
    (acc, dimension) => ({
        ...acc,
        [dimension]: new Set(ASG_INDICATOR_GROUPS[dimension].map((indicator) => indicator.id)),
    }),
    {} as Record<ASGDimension, Set<string>>
);

export const emptyASGIndicatorEvidence = (): ASGIndicatorEvidence => ({
    ambiental: [],
    social: [],
    gobernanza: [],
});

export const normalizeIndicatorIds = (dimension: ASGDimension, values: string[] | null | undefined): string[] => {
    const validIds = indicatorIdsByDimension[dimension];
    return Array.from(new Set(values ?? [])).filter((value) => validIds.has(value));
};

export const normalizeASGIndicatorEvidence = (
    evidence?: Partial<ASGIndicatorEvidence>
): ASGIndicatorEvidence => ({
    ambiental: normalizeIndicatorIds("ambiental", evidence?.ambiental),
    social: normalizeIndicatorIds("social", evidence?.social),
    gobernanza: normalizeIndicatorIds("gobernanza", evidence?.gobernanza),
});

export const hasStructuredEvidence = (evidence: ASGIndicatorEvidence): boolean =>
    ASG_DIMENSIONS.some((dimension) => evidence[dimension].length > 0);

export const calculateASGScores = (evidence: ASGIndicatorEvidence): ASGScores => ({
    ambiental: normalizeIndicatorIds("ambiental", evidence.ambiental).length,
    social: normalizeIndicatorIds("social", evidence.social).length,
    gobernanza: normalizeIndicatorIds("gobernanza", evidence.gobernanza).length,
});

export const calculateOverallRating = (scores: ASGScores): RatingCategory => {
    const values = [scores.ambiental, scores.social, scores.gobernanza];
    const average = values.reduce((sum, value) => sum + value, 0) / values.length;
    const minimum = Math.min(...values);

    if (average >= 4.2 && minimum >= 3) return "Genial";
    if (average >= 3 && minimum >= 2) return "Bueno";
    if (average >= 1.5) return "Regular";
    return "Evitar";
};

export const getSelectedIndicators = (dimension: ASGDimension, evidence: ASGIndicatorEvidence): ASGIndicator[] => {
    const selectedIds = new Set(normalizeIndicatorIds(dimension, evidence[dimension]));
    return ASG_INDICATOR_GROUPS[dimension].filter((indicator) => selectedIds.has(indicator.id));
};

export const getMissingIndicators = (dimension: ASGDimension, evidence: ASGIndicatorEvidence): ASGIndicator[] => {
    const selectedIds = new Set(normalizeIndicatorIds(dimension, evidence[dimension]));
    return ASG_INDICATOR_GROUPS[dimension].filter((indicator) => !selectedIds.has(indicator.id));
};
