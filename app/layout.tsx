import type { Metadata } from "next";
import { Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/components/custom/LoaderProvider";
import StoreProvider from "@/redux/StoreProvider";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/services/auth/providers";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Planova",
  description: "You think, we plan it",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-mono", jetbrainsMono.variable)}>
      <body className={`${poppins.variable} antialiased`}>
        <StoreProvider>
          <Providers>
            <Toaster position="top-right" />
            <AuthProvider>{children}</AuthProvider>
          </Providers>
        </StoreProvider>
      </body>
    </html>
  );
}
