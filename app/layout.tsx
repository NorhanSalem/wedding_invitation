import type { Metadata, Viewport } from "next";
import {
  Amiri,
  Ballet,
  Bodoni_Moda,
  Cormorant_Garamond,
  Cormorant_Unicase,
  Geist,
  Geist_Mono,
  Mea_Culpa,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const cormorantUnicase = Cormorant_Unicase({
  variable: "--font-cormorant-unicase",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const amiri = Amiri({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const meaCulpa = Mea_Culpa({
  variable: "--font-mea-culpa",
  subsets: ["latin"],
  weight: "400",
});

const ballet = Ballet({
  variable: "--font-ballet",
  subsets: ["latin"],
  weight: "400",
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  weight: "variable",
});
export const metadata: Metadata = {
  title: "Mohammed & Noor — Wedding",
  description: "You are invited to our wedding ceremony.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} ${cormorantUnicase.variable} ${amiri.variable} ${meaCulpa.variable} ${ballet.variable} ${bodoniModa.variable} h-full antialiased`}
    >
      <body className="min-h-dvh">
        <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
