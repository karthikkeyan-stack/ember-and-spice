import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "EMBER & SPICE | Premium South Indian Restaurant in Coimbatore",
    template: "%s | EMBER & SPICE",
  },
  description:
    "Thoughtfully prepared South Indian dishes, warm hospitality and an inviting dining experience in Coimbatore, Tamil Nadu.",
  openGraph: {
    siteName: "EMBER & SPICE",
    title: "EMBER & SPICE | Premium South Indian Restaurant in Coimbatore",
    description:
      "South Indian flavours, served with a modern soul. A premium dining room in Coimbatore.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="bg-cream text-ink antialiased font-body">
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
