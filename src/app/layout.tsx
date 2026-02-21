import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons:{
    icon: "/favicon.png",
  },
  title: "Fractals Academy | Mathematics Learning Hub",
  description:
    "Comprehensive e-learning platform for Class 7-12, JEE & WBJEE preparation. Expert guidance by Sayantan Sarcar in Baruipur, Kolkata.",
  keywords: [
    "mathematics",
    "JEE preparation",
    "WBJEE preparation",
    "online learning",
    "Baruipur",
    "Kolkata",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
