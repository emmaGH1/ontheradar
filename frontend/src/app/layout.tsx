import type { Metadata } from "next";
import { Space_Grotesk, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "OnTheRadar — The report card for your CAP agent",
  description:
    "Post-launch metrics for CAP agents: order count, revenue, unique buyers, and completion rate from real CAP order history.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${spaceGrotesk.variable} ${jetbrains.variable} min-h-screen bg-[#0F0F11] font-[family-name:var(--font-space-grotesk)] text-[#EEEEEF] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
