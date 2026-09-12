import type { Metadata } from "next";
import { Figtree, Cormorant_Garamond } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

/* Cormorant Garamond: serif de contraste alto, cálida y femenina sin caer en
   lo decorativo. Se usa solo en tamaños grandes, donde luce. */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const SITE = "https://drahildadiaz.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Dra. Hilda Mary Díaz García | Ginecóloga - Obstetra - Fertilidad | Maturín",
  description:
    "Especialista en Ginecología, Obstetricia y Fertilidad en Maturín, Venezuela. Clínica Tierra Santa, Piso 3, Consultorio 3. Agenda tu cita al 0412-0896444.",
  applicationName: "Dra. Hilda Mary Díaz García",
  keywords: [
    "ginecóloga Maturín",
    "obstetra Maturín",
    "fertilidad Venezuela",
    "Hilda Diaz",
    "Clínica Tierra Santa",
    "ginecología",
    "embarazo Maturín",
  ],
  authors: [{ name: "Dra. Hilda Mary Díaz García" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Dra. Hilda Mary Díaz García | Ginecóloga · Obstetra · Fertilidad",
    description:
      "Más de 20 años en salud femenina en Maturín, Monagas. Control prenatal, fertilidad y ginecología en Clínica Tierra Santa.",
    url: SITE,
    siteName: "Dra. Hilda Mary Díaz García",
    locale: "es_VE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dra. Hilda Mary Díaz García | Ginecóloga · Obstetra · Fertilidad",
    description:
      "Más de 20 años en salud femenina en Maturín, Monagas. Clínica Tierra Santa.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${figtree.variable} ${cormorant.variable}`}>
      <body className="antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#ffffff",
              border: "1px solid #f2e3e7",
              borderRadius: "16px",
              color: "#332229",
            },
          }}
        />
      </body>
    </html>
  );
}
