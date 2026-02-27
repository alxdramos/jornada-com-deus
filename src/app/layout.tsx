import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { Toaster } from "sonner";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { AuthSyncWrapper } from "@/components/AuthSyncWrapper";

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
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  // ── iOS PWA: app nativo no iPhone ──────────────────────────────────────
  appleWebApp: {
    capable: true,
    title: "Jornada com Deus",
    statusBarStyle: "default",
    startupImage: [
      // iPhone SE 2ª geração / iPhone 8 — 750×1334
      {
        url: "/screenshots/screenshot-hoje.webp",
        media:
          "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      // iPhone XR / iPhone 11 — 828×1792
      {
        url: "/screenshots/screenshot-explorar.webp",
        media:
          "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      // iPhone 12 / 13 / 14 — 1170×2532
      {
        url: "/screenshots/screenshot-oracoes.webp",
        media:
          "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      // iPhone 14 Pro / 15 — 1179×2556
      {
        url: "/screenshots/screenshot-diario.webp",
        media:
          "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      // iPhone 14 Pro Max / 15 Plus — 1290×2796
      {
        url: "/screenshots/screenshot-hoje.webp",
        media:
          "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
    ],
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
        <Suspense fallback={
          <div className="w-screen h-screen flex flex-col items-center justify-center bg-background gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
            <p className="text-sm text-muted-foreground">Carregando sua jornada...</p>
          </div>
        }>
          <SessionProvider>
            <AuthSyncWrapper>
              <ServiceWorkerRegistration />
              <OfflineIndicator />
              {children}
              <Toaster position="top-center" richColors closeButton />
            </AuthSyncWrapper>
          </SessionProvider>
        </Suspense>
      </body>
    </html>
  );
}
