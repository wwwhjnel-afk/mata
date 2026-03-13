// src/app/layout.tsx
import { Providers } from "@/components/providers";
import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from 'next/headers';
import type { Metadata, Viewport } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Dynamic metadata based on environment
export async function generateMetadata(): Promise<Metadata> {
  // Check if we're in Codespaces
  const headersList = await headers();
  const host = headersList.get('host') || '';
  
  // Enhanced Codespaces detection
  const isCodespaces = 
    process.env.NEXT_PUBLIC_DISABLE_MANIFEST === 'true' || // Added this line
    host.includes('app.github.dev') || 
    host.includes('codespaces') ||
    process.env.CODESPACES === 'true' ||
    process.env.NODE_ENV === 'development';
  
  console.log('Environment detection:', { 
    host, 
    isCodespaces, 
    codespaces: process.env.CODESPACES,
    disableManifest: process.env.NEXT_PUBLIC_DISABLE_MANIFEST // Added this
  });
  
  const baseMetadata = {
    title: "Matanuska Driver App",
    description: "Fleet management driver application for Matanuska",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default" as const,
      title: "Matanuska Driver",
    },
    formatDetection: {
      telephone: false,
    },
    icons: {
      icon: [
        { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [
        { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
  };

  // Only include manifest if NOT in Codespaces
  return isCodespaces 
    ? baseMetadata
    : { ...baseMetadata, manifest: "/manifest.json" };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2563eb" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}