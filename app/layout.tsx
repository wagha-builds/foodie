import type { Metadata } from "next";
import { Open_Sans } from "next/font/google"; // Using Google Fonts built-in
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "../components/layout/header";
import { Footer } from "../components/layout/footer";
import { BottomNav } from "../components/layout/bottom-nav";

const fontSans = Open_Sans({ subsets: ["latin"] });

// SEO CONFIGURATION
export const metadata: Metadata = {
  title: "FoodSwift - Delivery App",
  description: "Fastest food delivery in town",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${fontSans.className} min-h-screen flex flex-col`}>
        <Providers>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}