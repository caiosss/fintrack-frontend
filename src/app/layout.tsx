import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = {
  variable: "--font-sans",
  subsets: ["latin"],
};

const geistMono = {
  variable: "--font-display",
  subsets: ["latin"],
};

export const metadata: Metadata = {
  title: "Fintrack",
  description: "Controle suas finanças de forma simples e eficiente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
