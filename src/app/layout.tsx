import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { InstallPrompt } from "@/components/install-prompt";
import { BottomNav } from "@/components/BottomNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Jornada com Deus",
  description: "App devocional cristão para criar hábito diário com Deus. Momentos de paz, reflexão e crescimento espiritual.",
  keywords: ["oração", "bíblia", "devocional", "cristão", "espiritualidade", "fé"],
  authors: [{ name: "Jornada com Deus" }],
  creator: "Jornada com Deus",
  publisher: "Jornada com Deus",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192x192.png",
  },
  openGraph: {
    title: "Jornada com Deus",
    description: "App devocional cristão para criar hábito diário com Deus",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jornada com Deus",
    description: "App devocional cristão para criar hábito diário com Deus",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FB923C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
        <InstallPrompt />
        <BottomNav />
      </body>
    </html>
  );
}
