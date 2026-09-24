import type { Metadata } from "next";
import { Suspense } from "react";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import PageShell from "@/components/PageShell";
import { getSettings } from "@/lib/store";

const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"], variable: "--font-display" });
const corps = Inter({ subsets: ["latin"], variable: "--font-corps" });

export const metadata: Metadata = {
  title: "Ben Melissa Promotion — Immobilier à Oran",
  description: "Promoteur immobilier à Bir El Djir, Oran. Appartements, programmes neufs, visites 3D et accompagnement en français.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings().catch(() => null);
  return (
    <html lang="fr" className={`${display.variable} ${corps.variable}`}>
      <body className="min-h-screen flex flex-col bg-noir text-creme">
        <Suspense>
          <Header tel={settings?.tel ?? "0549 73 04 34"} telHref={settings?.telHref ?? "tel:+213549730434"} logoUrl={settings?.logoUrl} />
        </Suspense>
        <Suspense>
          <PageShell>{children}</PageShell>
        </Suspense>
        <Footer settings={settings} />
        <ChatWidget />
      </body>
    </html>
  );
}
