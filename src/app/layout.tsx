import type { Metadata } from "next";
import { Host_Grotesk, Manrope } from "next/font/google";
import "./globals.css";

// Site-wide type: Host Grotesk for titles and UI, Manrope for descriptions.
const host = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-host",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "CNTXT AI",
  description:
    "The world’s most important decisions need real-world AI.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${host.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
