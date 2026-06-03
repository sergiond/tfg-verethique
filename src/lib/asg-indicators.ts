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
            title: "Materiales con origen claro",
            description: "Se puede comprobar de dónde vienen los materiales principales y si son orgánicos, reciclados o de menor impacto.",
            evidenceHint: "Origen, proveedor o composición de los materiales principales.",
        },
        {
            id: "climate_emissions_plan",
            dimension: "ambiental",
            title: "Huella climática y plan de mejora",
            description: "La marca muestra cuánto contamina su actividad y qué pasos está dando para reducir ese impacto.",
            evidenceHint: "Datos sobre emisiones y medidas para reducirlas.",
        },
        {
            id: "water_wastewater_management",
            dimension: "ambiental",
            title: "Agua usada y vertidos controlados",
            description: "Hay información sobre el agua que se utiliza y sobre cómo se evita contaminar al lavar, teñir o producir.",
            evidenceHint: "Consumo de agua, tratamiento de vertidos y controles de contaminación.",
        },
        {
            id: "chemical_restricted_substances",
            dimension: "ambiental",
            title: "Control de químicos peligrosos",
            description: "La marca explica cómo evita usar sustancias dañinas para las personas o el entorno.",
            evidenceHint: "Sustancias que se evitan y forma de controlar su uso.",
        },
        {
            id: "circularity_waste_reduction",
            dimension: "ambiental",
            title: "Reparación, reutilización y menos residuos",
            description: "La marca demuestra que intenta alargar la vida de sus productos y generar menos desperdicio.",
            evidenceHint: "Reparación, recogida, reciclaje, embalajes o reducción de residuos.",
        },
    ],
    social: [
        {
            id: "ilo_code_of_conduct",
            dimension: "social",
            title: "Condiciones laborales básicas protegidas",
            description: "La marca publica reglas claras para evitar explotación, trabajo infantil, discriminación y condiciones inseguras.",
            evidenceHint: "Reglas laborales aplicadas a proveedores, talleres o personas trabajadoras.",
        },
        {
            id: "supplier_assessment_remediation",
            dimension: "social",
            title: "Revisión de talleres y corrección de problemas",
            description: "La marca revisa las condiciones de sus proveedores y explica qué hace cuando encuentra un problema.",
            evidenceHint: "Revisiones, resultados y medidas para corregir problemas en proveedores.",
        },
        {
            id: "living_wage_progress",
            dimension: "social",
            title: "Avances hacia salarios dignos",
            description: "La marca aporta datos o compromisos para que las personas que fabrican sus productos cobren de forma justa.",
            evidenceHint: "Datos sobre salarios, compromisos de mejora y avances con proveedores.",
        },
        {
            id: "health_safety_controls",
            dimension: "social",
            title: "Seguridad en el trabajo",
            description: "La marca muestra que existen medidas para prevenir accidentes y proteger la salud de quienes trabajan.",
            evidenceHint: "Formación, inspecciones, accidentes y mejoras de seguridad.",
        },
        {
            id: "worker_voice_purchasing_practices",
            dimension: "social",
            title: "Escucha a trabajadores y compras justas",
            description: "La marca facilita que las personas trabajadoras puedan quejarse o dar su opinión, y compra sin presionar de forma abusiva.",
            evidenceHint: "Canales de queja, acuerdos, plazos de pago y escucha a trabajadores.",
        },
    ],
    gobernanza: [
        {
            id: "supplier_traceability_public",
            dimension: "gobernanza",
            title: "Proveedores visibles",
            description: "La marca permite saber quién fabrica, dónde se produce y qué parte del proceso realiza cada proveedor.",
            evidenceHint: "Lista de proveedores con ubicación, actividad y fecha de actualización.",
        },
        {
            id: "accountability_oversight",
            dimension: "gobernanza",
            title: "Responsable claro dentro de la marca",
            description: "La marca indica quién se encarga de revisar estos temas y de responder si algo falla.",
            evidenceHint: "Persona, equipo o área responsable de estos compromisos.",
        },
        {
            id: "public_targets_kpis",
            dimension: "gobernanza",
            title: "Objetivos públicos y seguimiento",
            description: "La marca publica objetivos concretos y muestra si avanza, se queda igual o empeora.",
            evidenceHint: "Objetivos medibles, fechas y actualización del progreso.",
        },
        {
            id: "third_party_verification",
            dimension: "gobernanza",
            title: "Verificación externa",
            description: "Una entidad externa, certificado o revisión independiente respalda parte de la información publicada.",
            evidenceHint: "Certificación vigente o revisión independiente que apoye la información.",
        },
        {
            id: "claims_substantiation_process",
            dimension: "gobernanza",
            title: "Afirmaciones sostenibles comprobables",
            description: "La marca evita frases vagas: explica de dónde sale cada afirmación y cómo la corrige si deja de ser cierta.",
            evidenceHint: "Fuentes, fecha de revisión y forma de corregir afirmaciones desactualizadas.",
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
