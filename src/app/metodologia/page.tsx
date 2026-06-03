import Link from "next/link";
import { Leaf, Users, ShieldCheck, Database, ArrowRight, Laugh, Smile, Meh, Frown } from "lucide-react";

/**
 * `MethodologyPage`
 *
 * Página estática que expone de forma pública y detallada los criterios de auditoría de la plataforma.
 * Detalla el protocolo ASG, el significado de cada valoración semántica y la misión de transparencia.
 */
export default function MetodologiaPage() {
    return (
        <div className="bg-[#F2F0E9] min-h-screen pb-20 selection:bg-[#2E4036] selection:text-white">
            <header className="bg-[#1A1A1A] text-[#F2F0E9] pt-32 pb-24 md:pt-40 md:pb-32 rounded-b-[3rem]">
                <div className="mx-auto max-w-5xl px-6 md:px-8">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="w-12 h-px bg-[#D9653E]" />
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#D9653E]">Arquitectura del sistema</span>
                    </div>
                    <h1 className="font-serif italic text-6xl md:text-7xl lg:text-8xl font-light mb-8 leading-[1.1]">
                        El protocolo <br /> de evaluación.
                    </h1>
                    <p className="font-sans text-xl md:text-2xl text-[#F2F0E9]/70 max-w-3xl leading-relaxed font-light">
                        Nuestra metodología es independiente, transparente y se basa únicamente en datos públicos auditables.
                        Creemos que lo que no se puede probar, no se debe de afirmar.
                    </p>
                </div>
            </header>

            <div className="mx-auto max-w-5xl px-6 md:px-8 py-20 md:py-32">
                <section className="mb-32 grid md:grid-cols-12 gap-12">
                    <div className="md:col-span-4 flex items-start pt-2">
                        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[#1A1A1A]/70">01 - La tesis</h2>
                    </div>
                    <div className="md:col-span-8">
                        <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-[#1A1A1A] leading-snug mb-10">
                            Evaluamos pequeños establecimientos de cercanía con criterios prácticos, verificables y proporcionados por cada negocio.
                        </p>
                        <p className="font-sans text-lg text-[#1A1A1A]/70 leading-relaxed mb-6 font-medium">
                            Nuestro análisis se construye con la información y documentación que nos facilita cada establecimiento en el proceso de revisión.
                            Cuando faltan datos clave o no hay evidencia suficiente, la valoración se mantiene conservadora hasta su verificación.
                        </p>
                        <div className="flex items-center gap-4 bg-[#1A1A1A] text-[#F2F0E9] p-6 md:p-8 rounded-2xl mt-12">
                            <span className="font-mono text-xl text-[#D9653E]">*</span>
                            <p className="font-mono text-xs md:text-sm uppercase tracking-widest leading-relaxed">
                                Nuestro mantra: si no hay evidencia pública, no podemos asumir buenas prácticas.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="w-full h-px bg-[#D1CFC7] mb-32" />

                <section className="mb-32">
                    <div className="grid md:grid-cols-12 gap-12 mb-16">
                        <div className="md:col-span-4 flex items-start">
                            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[#1A1A1A]/70">02 - Las dimensiones</h2>
                        </div>
                        <div className="md:col-span-8">
                            <h3 className="font-serif italic text-4xl md:text-5xl text-[#1A1A1A] mb-6">Tres pilares fundamentales de trazabilidad.</h3>
                        </div>
                    </div>

                    <div className="grid gap-8">
                        <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-[#D1CFC7]/50 hover:border-[#D1CFC7] transition-colors relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Leaf className="w-32 h-32 text-[#2E4036]" />
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-16">
                                <div className="md:w-1/3">
                                    <span className="inline-block px-3 py-1 font-mono text-[10px] uppercase tracking-widest border border-[#2E4036]/20 rounded-full text-[#2E4036] mb-6 font-bold">Dimensión 01</span>
                                    <h4 className="font-serif text-3xl text-[#1A1A1A] mb-4">Planeta <span className="italic text-[#1A1A1A]/70">(Ambiental)</span></h4>
                                </div>
                                <div className="md:w-2/3">
                                    <p className="font-sans text-lg text-[#1A1A1A]/70 leading-relaxed max-w-xl mb-8">
                                        Evaluamos la utilización de recursos y el impacto ecológico a lo largo de la actividad del establecimiento.
                                        Esto abarca gestión del agua, uso de materiales, residuos y medidas concretas de reducción de impacto.
                                    </p>
                                    <ul className="space-y-4 font-mono text-xs text-[#1A1A1A]/70">
                                        <li className="flex items-start gap-4"><span className="text-[#9E3F24] mt-0.5">↳</span> Integración de prácticas de bajo impacto.</li>
                                        <li className="flex items-start gap-4"><span className="text-[#9E3F24] mt-0.5">↳</span> Circularidad y gestión de residuos.</li>
                                        <li className="flex items-start gap-4"><span className="text-[#9E3F24] mt-0.5">↳</span> Trazabilidad de materiales y proveedores.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-[#D1CFC7]/50 hover:border-[#D1CFC7] transition-colors relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Users className="w-32 h-32 text-[#1A1A1A]" />
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-16">
                                <div className="md:w-1/3">
                                    <span className="inline-block px-3 py-1 font-mono text-[10px] uppercase tracking-widest border border-[#1A1A1A]/20 rounded-full text-[#1A1A1A] mb-6 font-bold">Dimensión 02</span>
                                    <h4 className="font-serif text-3xl text-[#1A1A1A] mb-4">Personas <span className="italic text-[#1A1A1A]/70">(Laboral)</span></h4>
                                </div>
                                <div className="md:w-2/3">
                                    <p className="font-sans text-lg text-[#1A1A1A]/70 leading-relaxed max-w-xl mb-8">
                                        Revisamos condiciones laborales, trato y políticas internas en función de la evidencia disponible.
                                        Se valora especialmente la formalización, la seguridad y la coherencia entre lo declarado y lo documentado.
                                    </p>
                                    <ul className="space-y-4 font-mono text-xs text-[#1A1A1A]/70">
                                        <li className="flex items-start gap-4"><span className="text-[#9E3F24] mt-0.5">↳</span> Condiciones de trabajo y seguridad.</li>
                                        <li className="flex items-start gap-4"><span className="text-[#9E3F24] mt-0.5">↳</span> Prácticas de contratación y cumplimiento básico.</li>
                                        <li className="flex items-start gap-4"><span className="text-[#9E3F24] mt-0.5">↳</span> Evidencia de protocolos sociales aplicados.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-[#D1CFC7]/50 hover:border-[#D1CFC7] transition-colors relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <ShieldCheck className="w-32 h-32 text-[#9E3F24]" />
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-16">
                                <div className="md:w-1/3">
                                    <span className="inline-block px-3 py-1 font-mono text-[10px] uppercase tracking-widest border border-[#9E3F24]/40 rounded-full text-[#9E3F24] mb-6 font-bold">Dimensión 03</span>
                                    <h4 className="font-serif text-3xl text-[#1A1A1A] mb-4">Gobernanza <span className="italic text-[#1A1A1A]/70">(Transparencia)</span></h4>
                                </div>
                                <div className="md:w-2/3">
                                    <p className="font-sans text-lg text-[#1A1A1A]/70 leading-relaxed max-w-xl mb-8">
                                        Penalizamos el greenwashing. Una gobernanza sólida exige transparencia, documentación verificable y respuesta clara a solicitudes de información.
                                    </p>
                                    <ul className="space-y-4 font-mono text-xs text-[#1A1A1A]/70">
                                        <li className="flex items-start gap-4"><span className="text-[#9E3F24] mt-0.5">↳</span> Claridad documental y trazabilidad.</li>
                                        <li className="flex items-start gap-4"><span className="text-[#9E3F24] mt-0.5">↳</span> Coherencia entre comunicación y práctica real.</li>
                                        <li className="flex items-start gap-4"><span className="text-[#9E3F24] mt-0.5">↳</span> Actualización y mantenimiento de evidencias.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="w-full h-px bg-[#D1CFC7] mb-32" />

                <section className="mb-32">
                    <div className="grid md:grid-cols-12 gap-12 mb-16">
                        <div className="md:col-span-4 flex items-start">
                            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[#1A1A1A]/70">03 - Resultados de datos</h2>
                        </div>
                        <div className="md:col-span-8">
                            <h3 className="font-serif italic text-4xl md:text-5xl text-[#1A1A1A] mb-6">La taxonomía de cinco puntos.</h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#D1CFC7] border border-[#D1CFC7] overflow-hidden rounded-[2rem]">
                        <div className="bg-white p-10 flex flex-col">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="font-serif text-5xl text-[#2E4036]">5.</span>
                                <div>
                                    <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest font-bold text-[#1A1A1A]"><Laugh className="w-5 h-5" aria-hidden="true" /><span className="sr-only">Genial</span></span>
                                    <p className="font-mono text-[10px] text-[#1A1A1A]/70 uppercase tracking-widest mt-1">Líder de sistemas</p>
                                </div>
                            </div>
                            <p className="font-sans text-[#1A1A1A]/70 leading-relaxed mt-auto">Evidencias completas, coherentes y mantenidas en el tiempo. Nivel alto de confianza.</p>
                        </div>
                        <div className="bg-white p-10 flex flex-col">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="font-serif text-5xl text-[#4A6356]">4.</span>
                                <div>
                                    <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest font-bold text-[#1A1A1A]"><Smile className="w-5 h-5" aria-hidden="true" /><span className="sr-only">Bueno</span></span>
                                    <p className="font-mono text-[10px] text-[#1A1A1A]/70 uppercase tracking-widest mt-1">Progreso sustancial</p>
                                </div>
                            </div>
                            <p className="font-sans text-[#1A1A1A]/70 leading-relaxed mt-auto">Buena base documental, con pequeños huecos no críticos pendientes de completar.</p>
                        </div>
                        <div className="bg-white p-10 flex flex-col">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="font-serif text-5xl text-[#1A1A1A]">3.</span>
                                <div>
                                    <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest font-bold text-[#1A1A1A]"><Meh className="w-5 h-5" aria-hidden="true" /><span className="sr-only">Regular</span></span>
                                    <p className="font-mono text-[10px] text-[#1A1A1A]/70 uppercase tracking-widest mt-1">Inicio básico</p>
                                </div>
                            </div>
                            <p className="font-sans text-[#1A1A1A]/70 leading-relaxed mt-auto">Información parcial o en fase inicial. Requiere más evidencia para aumentar confianza.</p>
                        </div>
                        <div className="bg-white p-10 flex flex-col">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="font-serif text-5xl text-[#1A1A1A]">1-2.</span>
                                <div>
                                    <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest font-bold text-[#1A1A1A]"><Frown className="w-5 h-5" aria-hidden="true" /><span className="sr-only">Evitar</span></span>
                                    <p className="font-mono text-[10px] text-[#1A1A1A]/70 uppercase tracking-widest mt-1">Práctica insuficiente</p>
                                </div>
                            </div>
                            <p className="font-sans text-[#1A1A1A]/70 leading-relaxed mt-auto">Sin evidencia suficiente o inconsistencias relevantes entre declaración y documentación.</p>
                        </div>
                    </div>
                </section>

                <div className="bg-[#1A1A1A] p-12 md:p-16 rounded-[2rem] text-center border border-white/10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[#2E4036]/20 mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative z-10 flex flex-col items-center">
                        <Database className="w-8 h-8 text-[#D9653E] mb-6" />
                        <h3 className="font-serif italic text-3xl md:text-4xl text-[#F2F0E9] mb-4">¿Quieres formar parte de nuestro directorio?</h3>
                        <p className="font-sans text-[#F2F0E9]/80 max-w-xl mx-auto mb-10 leading-relaxed font-light">
                            Si tienes un establecimiento de cercanía y quieres aparecer en el directorio, envíanos tu solicitud con la documentación necesaria y revisaremos tu caso.
                        </p>

                        <Link
                            href="/contacto"
                            className="inline-flex relative items-center justify-center px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-500 overflow-hidden group border border-[#F2F0E9]/80 text-[#F2F0E9] hover:bg-[#F2F0E9] hover:text-[#1A1A1A]"
                        >
                            <span className="relative z-10 transition-colors duration-300">Inscríbete</span>
                            <ArrowRight className="relative z-10 ml-3 w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
