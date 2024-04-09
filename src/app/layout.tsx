import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "haelpAuth",
  description: "core authentication server",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Suspense
          fallback={
            <div className="flex justify-center items-center select-none h-screen bg-black text-white font-mono font-bold p-10 relative">
              <span>Loading...</span>
            </div>
          }
        >
          {children}
        </Suspense>
      </body>
    </html>
  );
}
