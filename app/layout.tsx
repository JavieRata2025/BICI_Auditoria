import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bici-IA: Auditoría de Seguridad Vial",
  description: "Plataforma de IA para el proyecto de movilidad sostenible en Torrelavega.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased overflow-hidden h-screen w-screen bg-slate-50 dark:bg-slate-950">
        {children}
      </body>
    </html>
  );
}
