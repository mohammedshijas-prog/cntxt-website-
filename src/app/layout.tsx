import type { Metadata, Viewport } from "next";
import { JsonLd, organization, website } from "@/lib/seo";
import { Host_Grotesk, Manrope } from "next/font/google";
import Script from "next/script";
import "lenis/dist/lenis.css";
import "./globals.css";
import { MotionProvider } from "../components/motion/MotionProvider";
import { PhoneDock } from "../components/site/PhoneDock";
import { PageBeacon } from "../components/site/PageBeacon";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

/*
 * Tracking, kept exactly as on cntxt.tech. Google Tag Manager carries GA4,
 * Google Ads, LinkedIn Insight, the Meta pixel and the HubSpot "form
 * submitted" events; HubSpot's own script records page visits and sources.
 */
const gtmId = "GTM-PVNBSB8S";
const gtmHead = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${host.variable} ${manrope.variable}`}>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {children}
        <MotionProvider />
        <PhoneDock />
        <PageBeacon />
        <JsonLd data={[organization, website]} />
        {/*
          Third-party scripts load through next/script, after React has taken
          over the page. Loaded as raw tags, HubSpot edits the DOM before
          hydration and React throws a hydration error.
        */}
        <Script id="gtm-head" strategy="lazyOnload">
          {gtmHead}
        </Script>
        {/* Cookie banner, as on the current site */}
        <Script
          id="cookie-consent"
          src="https://cookie-consent-cdn-prod.pages.dev/cookie-consent/3.0.33/cookie-consent.js"
          integrity="sha384-hID7SQtXLqNKM1f6agvO2qhK2radQn5wf+Su4pAEM5ElgJ/FmSWXrmcaYP4/D3E0"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        {/* HubSpot embed code: chat and forms tracking, loaded when the page is idle. */}
        <Script id="hs-script-loader" src="https://js.hs-scripts.com/48027770.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
