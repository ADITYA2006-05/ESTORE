import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import AIAssistant from "@/components/AIAssistant";

export const metadata: Metadata = {
  title: "ESTORE - Modern Minimalist Essentials",
  description: "Curating the finest minimalist essentials for the modern design-conscious consumer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-background text-on-surface">
        <CartProvider>
          {children}
          <CartDrawer />
          <AIAssistant />
        </CartProvider>
      </body>
    </html>
  );
}
