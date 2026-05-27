import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dra. Hilda Mary Díaz García | Ginecóloga - Obstetra - Fertilidad | Maturín",
  description:
    "Especialista en Ginecología, Obstetricia y Fertilidad en Maturín, Venezuela. Clínica Tierra Santa, Piso 3, Consultorio 3. Agenda tu cita al 0412-0896444.",
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
  openGraph: {
    title: "Dra. Hilda Mary Díaz García | Ginecóloga - Obstetra - Fertilidad",
    description:
      "Especialista en Ginecología, Obstetricia y Fertilidad en Maturín, Venezuela.",
    locale: "es_VE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="antialiased">
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#fff',
              },
            }}
          />
        </body>
    </html>
  );
}
