import type { Metadata, Viewport } from "next";
import { TtsWarmup } from "@/components/TtsWarmup";
import { UserProvider } from "@/lib/UserContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "PandaMandarin",
  description: "Learn Mandarin Chinese",
  icons: { icon: "/icon.png", apple: "/icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#F2F2F7",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ background: '#F2F2F7' }}>
      <body className="text-[#1C1C1E]" style={{ background: '#F2F2F7' }}>
        <UserProvider>
          <TtsWarmup />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
