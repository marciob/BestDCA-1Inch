// app/layout.tsx (Updated)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; // Import the new provider

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Best DCA | 1inch",
  description: "Gas-free, cross-chain Bitcoin accumulation powered by 1inch.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers> {/* Wrap your app */}
      </body>
    </html>
  );
}
