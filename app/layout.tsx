import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { UserProvider } from "@/lib/UserContext";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "学中文 - Pinyin Learner",
  description: "Learn Chinese pronunciation step by step",
  icons: {
    icon: "/icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={`${nunito.variable} antialiased font-sans`}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
