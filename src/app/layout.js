import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
 variable:"--font-geist-sans",
 subsets: ["latin"],
});

const geistMono = Geist_Mono({
 variable:"--font-geist-mono",
 subsets: ["latin"],
});

export const metadata = {
 title:"Creators Kit",
 description:"The complete toolkit for modern creators.",
};

export default function RootLayout({ children}) {
 return (
 <html
 lang="en"
 className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-x-hidden w-full max-w-[100vw]`}
 suppressHydrationWarning
 >
      <body className="min-h-full flex flex-col bg-[#FDFBF7] dark:bg-[#0f172a] text-[#900606] dark:text-neutral-200 transition-colors duration-300 overflow-x-hidden w-full max-w-[100vw]" suppressHydrationWarning={true}>
        <ThemeProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              {children}
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
