import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope, Lato, Inter } from "next/font/google";
import "./globals.css";

import { AuthInitializer } from "@/components/AuthInitializer";
// import Navbar from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: "300",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GetSQL",
  description: "Generate Production ready accurate SQL queries in seconds. ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.className}  `}>
        <AuthInitializer />
        <div className="flex justify-center">{/* <Navbar /> */}</div>
        {children}
        <div className="flex justify-center">
          <Footer />
        </div>
      </body>
    </html>
  );
}
