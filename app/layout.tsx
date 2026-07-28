import type { Metadata, Viewport } from "next";
import { Poppins, Tajawal } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Prompt OS — Brand Shift Marketing Agency",
    template: "%s · Brand Shift Prompt OS",
  },
  description:
    "مكتبة البرومبتات الداخلية لفريق Brand Shift — اختار برومبت جاهز، املأ الفراغات، وانسخ النتيجة.",
  icons: { icon: "/brand/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8fd" },
    { media: "(prefers-color-scheme: dark)", color: "#140a22" },
  ],
};

// Applies the saved theme before first paint so there is no flash of the wrong mode.
const THEME_SCRIPT = `try{var t=localStorage.getItem("cpo:theme");var d=t?t==="dark":!window.matchMedia("(prefers-color-scheme: light)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`dark h-full ${tajawal.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col bg-surface text-content antialiased">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
