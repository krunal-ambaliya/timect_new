import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

const jost = Jost({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: "SEIKO - Official Online Store",
  description: "Celebrating 145 Years of Japanese Craftsmanship",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${jost.variable}`}
    >
      <body className="bg-white text-[#111111] antialiased">
        {children}
        <CustomCursor />
      </body>
    </html>
  );
}
