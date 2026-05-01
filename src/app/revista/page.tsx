import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

/**
 * `RevistaPage`
 * 
 * Índice de artículos editoriales (Revista).
 * Publicaciones periódicas sobre investigaciones en profundidad, greenwashing y estado de la industria.
 */
export default function RevistaPage() {
    return (
        <div className="bg-background min-h-screen">
            {/* Encabezado Editorial */}
            <header className="bg-muted/30 border-b border-border py-16 md:py-24">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
                        Revista
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Análisis profundos, guías de materiales y noticias sobre el impacto de la industria de la moda, respaldados por nuestros datos.
                    </p>

                    <div className="mt-10 flex flex-wrap justify-center gap-2">
                        {["Todos", "Materiales", "Guías de Compra", "Entrevistas", "Noticias", "Fast Fashion"].map((cat, i) => (
                            <Link
                                key={cat}
                                href={`/revista?cat=${cat.toLowerCase().replace(' ', '-')}`}
                                className={`px-5 py-2 rounded-full border text-sm font-medium transition-colors ${i === 0 ? "bg-foreground text-background" : "bg-background hover:bg-muted"}`}
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                </div>
            </header>

            {/* Artículo destacado */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-b border-border/50">
                <Link href="/" className="group grid lg:grid-cols-2 gap-10 items-center">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted">
                        <Image src="/img/moodboard-3.jpg" alt="Featured article" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                            <span className="font-bold text-primary uppercase tracking-wider">Investigación</span>
                            <span>•</span>
                            <span>Hace 3 días</span>
                        </div>
                        <h2 className="font-serif text-4xl lg:text-5xl font-bold leading-tight mb-6 group-hover:text-primary transition-colors">
                            El coste oculto del &quot;Envío y Devolución Gratis&quot; en la moda rápida
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Detrás de la comodidad de comprar cinco tallas y devolver cuatro, existe una crisis logística y de residuos que rara vez se computa en los informes de sostenibilidad de las grandes marcas.
                        </p>
                        <span className="inline-flex font-semibold text-foreground items-center border-b border-foreground pb-1 group-hover:text-primary group-hover:border-primary transition-all">
                            Leer artículo entero
                        </span>
                    </div>
                </Link>
            </section>

            {/* Rejilla de artículos recientes */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex justify-between items-end mb-10">
                    <h3 className="font-serif text-3xl font-bold">Últimas publicaciones</h3>
                </div>

                <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 1, 3, 2, 1].map((i, index) => (
                        <Link key={index} href="/" className="group flex flex-col">
                            <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-muted mb-5">
                                <Image src={`/img/moodboard-${i}.jpg`} alt={`Artículo ${index}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                                <span className="font-semibold text-primary uppercase tracking-wider">
                                    {i === 1 ? 'Guías' : i === 2 ? 'Materiales' : 'Entrevistas'}
                                </span>
                                <span>•</span>
                                <span>12 Oct 2023</span>
                            </div>
                            <h4 className="font-serif text-2xl font-bold leading-tight group-hover:text-primary transition-colors mb-3">
                                {i === 1 && "¿Qué significan realmente las etiquetas ecológicas?"}
                                {i === 2 && "TENCEL Lyocell vs Viscosa convencional. ¿Vale la pena?"}
                                {i === 3 && "Hablando con activistas textiles en Bangladesh"}
                            </h4>
                            <p className="text-muted-foreground text-sm line-clamp-2">
                                Un análisis detallado de las prácticas de la industria, desmintiendo mitos y aportando claridad al consumidor.
                            </p>
                        </Link>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Button variant="outline" size="lg" className="rounded-full px-10">
                        Cargar más artículos
                    </Button>
                </div>
            </section>

            {/* Llamada a la acción del boletín */}
            <section className="bg-primary text-primary-foreground py-20 mt-10">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="font-serif text-4xl font-bold mb-6">Lee antes de comprar.</h2>
                    <p className="text-lg text-primary-foreground/80 mb-8">
                        Recibe nuestros análisis directamente en tu bandeja de entrada. Sin spam, solo buen periodismo ético y datos útiles.
                    </p>
                    <div className="flex max-w-md mx-auto gap-2">
                        <input type="email" placeholder="Tu correo electrónico" className="flex-1 px-4 py-3 rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-background" />
                        <Button className="bg-background text-primary hover:bg-background/90 font-bold px-6">
                            Unirme
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
