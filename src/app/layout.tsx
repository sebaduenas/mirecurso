import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "mirecurso.cl - Reclame la exención de contribuciones",
  description:
    "Genere gratis su recurso de protección contra el cobro de contribuciones. Para adultos mayores propietarios de vivienda.",
  keywords:
    "contribuciones, adulto mayor, recurso protección, SII, exención, Chile",
  openGraph: {
    title: "mirecurso.cl - Exención de contribuciones para adultos mayores",
    description: "Genere su recurso de protección gratis, sin abogados.",
    url: "https://mirecurso.cl",
    siteName: "mirecurso.cl",
    locale: "es_CL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
