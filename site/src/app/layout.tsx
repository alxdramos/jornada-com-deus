import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Minha Jornada Diária - Devocional Diário com Paz e Crescimento",
  description:
    "Encontre paz no seu dia a dia com devocionais, meditações guiadas, Bíblia offline e hábitos espirituais. Instale gratuitamente o PWA Minha Jornada Diária.",
  keywords: [
    "devocional diário",
    "bíblia offline",
    "meditação cristã",
    "oração",
    "hábito espiritual",
    "app cristão",
    "crescimento espiritual",
    "paz interior",
    "jornada com deus",
  ],
  authors: [{ name: "Minha Jornada Diária" }],
  creator: "Minha Jornada Diária",
  publisher: "Minha Jornada Diária",
  metadataBase: new URL("https://minhajornadadiaria.com.br"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://minhajornadadiaria.com.br",
    title: "Minha Jornada Diária - Devocional Diário com Paz e Crescimento",
    description:
      "Encontre paz no seu dia a dia com devocionais, meditações guiadas, Bíblia offline e hábitos espirituais. Gratuito e offline.",
    siteName: "Minha Jornada Diária",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Minha Jornada Diária - App Devocional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Minha Jornada Diária - Devocional Diário",
    description:
      "Transforme seus dias com a Palavra, oração e meditação. Gratuito e offline.",
    creator: "@senier451",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FB923C",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
