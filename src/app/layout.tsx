import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "HemoHealth | Real-Time Blood Availability & Emergency Donor Coordination",
  description:
    "Real-time blood resource discovery, verified inventory management, and emergency donor matching for hospitals, blood banks, donors, and patients.",
  keywords: [
    "blood availability",
    "emergency blood donor",
    "blood bank inventory",
    "smart matching",
    "blood transfusion coordination",
    "hospital blood supply",
  ],
  authors: [{ name: "HemoHealth Healthcare Initiative" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#FAFAFA] text-[#18181B]">
        <ToastProvider>
          <DemoBanner />
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
