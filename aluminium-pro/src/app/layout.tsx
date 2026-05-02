import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter", 
});

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Aluminium House India",
    default: "Aluminium House | Premium B2B Aluminium Profiles in India",
  },
  description: "India's leading B2B wholesale supplier of premium colour-coated, silver anodized, and wooden grain aluminium profiles for structural and architectural needs.",
  keywords: ["Aluminium Profiles", "B2B Aluminium", "Wholesale Aluminium India", "Anodized Profiles", "Wooden Grain Aluminium", "Structural Profiles"],
  authors: [{ name: "Aluminium House" }],
  creator: "Aluminium House",
  publisher: "Aluminium House",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://aluminiumpro.in",
    siteName: "Aluminium House",
    title: "Aluminium House | Premium B2B Aluminium Profiles in India",
    description: "Wholesale supplier of premium aluminium profiles across India. Browse our catalogue for structural, door, window, and architectural glazing profiles.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aluminium House | Premium B2B Aluminium Profiles in India",
    description: "Wholesale supplier of premium aluminium profiles across India.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${montserrat.variable} font-sans flex flex-col min-h-screen`}>
        <Providers>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
