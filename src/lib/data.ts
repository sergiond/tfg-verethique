import { Brand } from "./types";

/**
 * Base de datos simulada del Directorio de Marcas.
 * 
 * Este array proporciona datos semilla para poblar la interfaz de usuario en entornos
 * de desarrollo y demostración. Sigue estrictamente la interfaz `Brand` definida en `types.ts`.
 * 
 * @type {Brand[]}
 */
export const mockBrands: Brand[] = [
    {
        id: "br-001",
        name: "Aura Verde",
        category: "Ropa Deportiva",
        slogan: "Movimiento orgánico",
        description: "Ropa deportiva de alto rendimiento confeccionada íntegramente con plásticos oceánicos recuperados y tintes naturales. Transparencia total en su cadena de suministro.",
        overallRating: "Genial",
        asgScores: { ambiental: 5, social: 4, gobernanza: 5 },
        imageUrl: "/mock-images/aura-verde.jpg",
        isVegan: true,
        isFairTrade: true,
        materials: ["PET Reciclado", "Algodón Orgánico"],
    },
    {
        id: "br-002",
        name: "Lino & Tierra",
        category: "Casual",
        slogan: "Lo clásico perdura",
        description: "Basicos atemporales de lino cultivado en Europa. Excelentes condiciones laborales y un enfoque radical hacia el residuo cero en sus talleres.",
        overallRating: "Genial",
        asgScores: { ambiental: 4.5, social: 5, gobernanza: 5 },
        imageUrl: "/mock-images/lino-tierra.jpg",
        isVegan: true,
        isFairTrade: true,
        materials: ["Lino Europeo"],
    },
    {
        id: "br-003",
        name: "Urban Fast",
        category: "Streetwear",
        slogan: "A la velocidad de la ciudad",
        description: "Moda rápida y de tendencia constante. Frecuentes rotaciones de catálogo y escasa transparencia respecto al origen y fin de vida de sus materiales.",
        overallRating: "Evitar",
        asgScores: { ambiental: 1, social: 2, gobernanza: 1 },
        imageUrl: "/mock-images/urban-fast.jpg",
        isVegan: false,
        isFairTrade: false,
        materials: ["Poliéster", "Acrílico"],
    },
    {
        id: "br-004",
        name: "Knit Origin",
        category: "Punto",
        slogan: "Tejiendo comunidad",
        description: "Prendas de punto elaboradas por cooperativas de artesanas certificadas. Buen desempeño en derechos laborales, aunque con una política ambiental moderada.",
        overallRating: "Bueno",
        asgScores: { ambiental: 3.5, social: 4.5, gobernanza: 4 },
        imageUrl: "/mock-images/knit-origin.jpg",
        isVegan: false,
        isFairTrade: true,
        materials: ["Lana Merina", "Alpaca"],
    },
    {
        id: "br-005",
        name: "Essential Co.",
        category: "Básicos",
        slogan: "Lo de siempre",
        description: "Marca de básicos accesibles. Prometen el uso de algodón orgánico, pero no proporcionan certificaciones verificables sobre sus prácticas sociales o de gobernanza.",
        overallRating: "Regular",
        asgScores: { ambiental: 3, social: 2.5, gobernanza: 2 },
        imageUrl: "/mock-images/essential-co.jpg",
        isVegan: true,
        isFairTrade: false,
        materials: ["Algodón Orgánico Mezclado"],
    },
];
