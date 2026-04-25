import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Étude IA et cognition",
  description: "Application expérimentale pour mémoire MIAGE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}