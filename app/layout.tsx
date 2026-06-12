import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import localFont from "next/font/local"; 
import CookieConsent from "@/app/dashboard/components/CookieConsent";

const brigends = localFont({
  src: "../public/fonts/Brigends.otf",
  variable: "--font-brigends",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Financial Tracking | Controle seu Futuro",
  description: "Acompanhe seus gastos, defina metas e assuma o controle.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f4f7f6] dark:bg-[#0f172a] text-[#2c3e50] dark:text-gray-100 transition-colors duration-300`}>
        <Providers>
          {children}
        </Providers>
        <CookieConsent />
      </body>
    </html>
  );
}

