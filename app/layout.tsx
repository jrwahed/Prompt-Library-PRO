import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Company Prompt OS — Dragify.ai",
  description: "أداة داخلية لبناء البرومبتات الجاهزة لشركة Dragify.ai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark h-full">
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50">
        {children}
      </body>
    </html>
  );
}
