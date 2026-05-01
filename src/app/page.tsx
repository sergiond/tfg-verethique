import { HeroSection } from "@/components/home/HeroSection";
import { DashboardSection } from "@/components/home/DashboardSection";
import { ManifestoSection } from "@/components/home/ManifestoSection";
import { StickyArchiveSection } from "@/components/home/StickyArchiveSection";

/**
 * `Home`
 * 
 * Página de inicio de la aplicación (`/`).
 * Ensambla secuencialmente las secciones narrativas principales:
 * Sección principal (presentación), panel de evaluación (teoría ASG y protocolo), manifiesto y archivo de evidencias.
 */
export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh">
      <HeroSection />
      <DashboardSection />
      <ManifestoSection />
      <StickyArchiveSection />
    </div>
  );
}
