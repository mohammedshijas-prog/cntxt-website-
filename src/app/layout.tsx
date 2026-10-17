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

const description =
  "CNTXT AI captures and verifies data from real work, trains models on it and deploys AI on-premise for enterprises and governments.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cntxt.tech"),
  title: {
    default: "CNTXT AI | Real-world AI, from data to deployment",
    template: "%s | CNTXT AI",
  },
  description,
  openGraph: {
    type: "website",
    siteName: "CNTXT AI",
    title: "CNTXT AI | Real-world AI, from data to deployment",
    description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "CNTXT AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CNTXT AI | Real-world AI, from data to deployment",
    description,
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${host.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
