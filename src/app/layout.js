import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import AuthProvider from "@/components/AuthProvider";
import { AuthModalProvider } from "@/context/AuthModalContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
 variable: "--font-plus-jakarta",
 subsets: ["latin"],
});

const geistMono = Geist_Mono({
 variable: "--font-geist-mono",
 subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://creatorskit.com'),
  title: "Creators Kit",
  description: "The complete toolkit for modern creators. Equip yourself with premium gear, courses, and resources.",
  keywords: ["creators kit", "creator gear", "youtube setup", "streaming gear", "masterclass", "content creation"],
  authors: [{ name: "Zinmatt" }],
  creator: "Zinmatt",
  openGraph: {
    title: "Creators Kit",
    description: "The complete toolkit for modern creators. Equip yourself with premium gear, courses, and resources.",
    url: "https://creatorskit.com",
    siteName: "Creators Kit",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Creators Kit - The complete toolkit for modern creators",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Creators Kit",
    description: "The complete toolkit for modern creators. Equip yourself with premium gear, courses, and resources.",
    creator: "@zinmatt",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased overflow-x-hidden w-full max-w-[100vw] font-sans`}
      suppressHydrationWarning
    >
      <body className="font-sans min-h-full flex flex-col bg-[#FBFBF7] text-[#111827] transition-colors duration-300 overflow-x-hidden w-full max-w-[100vw]" suppressHydrationWarning={true}>
        <AuthProvider>
          <ThemeProvider>
            <AuthModalProvider>
              <CartProvider>
                <Navbar />
                {children}
                <Footer />
              </CartProvider>
            </AuthModalProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
