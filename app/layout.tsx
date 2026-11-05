import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import { LostFoundProvider } from "@/context/LostFoundContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "TUT Campus Lost & Found Management System | Tshwane University of Technology",
  description: "Modern, responsive lost and found management platform for Tshwane University of Technology students and Campus Protection Services (CPS).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-slate-900">
        <LostFoundProvider>
          <Suspense fallback={<div className="h-16 bg-white border-b border-slate-200" />}>
            <Header />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </LostFoundProvider>
      </body>
    </html>
  );
}

