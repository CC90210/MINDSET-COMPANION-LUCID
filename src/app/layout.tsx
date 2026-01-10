import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Lucid | See Yourself Clearly",
  description: "Get lucid. Take the mindset assessment. Talk to CC. Join a community of people doing the real work. Transform your thinking.",
  keywords: ["mindset", "personal growth", "AI companion", "mental health", "self-awareness", "community"],
  authors: [{ name: "Lucid" }],
  openGraph: {
    title: "Lucid — Get Lucid",
    description: "Take the mindset assessment. Know your score. Transform your thinking.",
    type: "website",
    locale: "en_US",
    siteName: "Lucid",
  },
  twitter: {
    card: "summary_large_image",
    title: "What's your Lucid Score?",
    description: "Take the free mindset assessment. 2 minutes. No signup required.",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
