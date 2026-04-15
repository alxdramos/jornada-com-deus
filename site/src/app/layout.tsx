import type { Metadata, Viewport } from "next";
import { Lora, Raleway } from "next/font/google";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Minha Jornada Diária — Devocional, Meditação e Bíblia",
  description:
    "Um app espiritual completo para cultivar sua fé todo dia. Devocional diário, meditações guiadas em áudio, Bíblia offline e gamificação espiritual. Gratuito.",
  keywords: [
    "devocional diário",
    "bíblia offline",
    "meditação cristã",
    "oração",
    "hábito espiritual",
    "app cristão",
    "crescimento espiritual",
    "jornada com deus",
    "árvore da vida",
  ],
  authors: [{ name: "Minha Jornada Diária" }],
  creator: "Minha Jornada Diária",
  publisher: "Minha Jornada Diária",
  metadataBase: new URL("https://minhajornadadiaria.com.br"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://minhajornadadiaria.com.br",
    title: "Minha Jornada Diária — Sua Fé, Cultivada Todo Dia",
    description:
      "Devocional diário, meditações guiadas, Bíblia offline e hábitos espirituais. Gratuito.",
    siteName: "Minha Jornada Diária",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Minha Jornada Diária",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Minha Jornada Diária",
    description: "Cultivar sua fé todo dia — devocional, meditação, Bíblia e oração.",
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
  themeColor: "#2D6A4F",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${lora.variable} ${raleway.variable}`}>
      <body
        className="antialiased"
        style={{ fontFamily: 'var(--font-raleway)' }}
      >
        {children}
      </body>
    </html>
  );
}
