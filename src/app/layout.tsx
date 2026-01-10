import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CC Mindset Companion | Transform Your Thinking",
  description: "Your AI-powered mindset transformation companion. Talk to CC, connect with others on the same journey, and become who you're meant to be.",
  keywords: ["mindset", "personal growth", "AI companion", "transformation", "coaching", "community"],
  authors: [{ name: "CC" }],
  openGraph: {
    title: "CC Mindset Companion",
    description: "Your AI-powered mindset transformation companion.",
    type: "website",
    locale: "en_US",
    siteName: "CC Mindset",
  },
  twitter: {
    card: "summary_large_image",
    title: "CC Mindset Companion",
    description: "Your AI-powered mindset transformation companion.",
  },
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  themeColor: "#0a0a0a",
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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
