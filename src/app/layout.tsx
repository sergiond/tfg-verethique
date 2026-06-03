import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Verethique | Directorio de moda sostenible",
  description: "Directorio editorial de revisión ASG, transparencia, trazabilidad, circularidad y retail textil.",
};

/**
 * `RootLayout`
 *
 * Componente principal de diseño que envuelve a toda la aplicación Next.js.
 * Configura las fuentes globales (Tailwind CSS variables), inyecta los componentes
 * fijos como `Navbar` y `Footer`, y define el contenedor `main` para las páginas.
 *
 * @param {Object} props - Propiedades de React.
 * @param {React.ReactNode} props.children - Los componentes hijos renderizados por el router.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} ${outfit.variable} ${cormorantGaramond.variable} ${jetBrainsMono.variable} font-sans antialiased min-h-screen flex flex-col relative bg-background text-foreground`}
      >
        <div className="noise-overlay fixed inset-0 pointer-events-none z-50 opacity-[0.05]" />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

