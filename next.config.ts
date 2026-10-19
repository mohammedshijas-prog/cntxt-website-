import type { NextConfig } from "next";

/*
 * Content Security Policy. It ships as Report-Only so a missed tracking host shows
 * up as a console warning instead of breaking GTM, HubSpot or the cookie banner;
 * switch the key to "Content-Security-Policy" once the console is clean.
 * 'unsafe-inline' is needed by Next's inline scripts and the GTM snippet.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googletagmanager.com https://*.google-analytics.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google.com https://snap.licdn.com https://connect.facebook.net https://js.hs-scripts.com https://js.hsforms.net https://*.hubspot.com https://*.hsforms.com https://*.hs-analytics.net https://*.hs-banner.com https://*.hscollectedforms.net https://*.hsadspixel.net https://*.usemessages.com https://cookie-consent-cdn-prod.pages.dev https://vercel.live",
  "connect-src 'self' https://teohvkusixcmwozsfqyv.supabase.co wss://teohvkusixcmwozsfqyv.supabase.co https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.g.doubleclick.net https://www.google.com https://px.ads.linkedin.com https://*.linkedin.com https://www.facebook.com https://*.hubspot.com https://*.hubapi.com https://*.hsforms.com https://*.hs-banner.com https://*.hscollectedforms.net https://*.hs-analytics.net https://cookie-consent-cdn-prod.pages.dev https://vercel.live wss://ws-us3.pusher.com",
  "img-src 'self' data: blob: https:",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "media-src 'self'",
  "frame-src https://www.googletagmanager.com https://td.doubleclick.net https://www.facebook.com https://*.hsforms.com https://*.hsforms.net https://*.hubspot.com https://vercel.live",
  "form-action 'self' https://*.hsforms.com https://*.hubspot.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy-Report-Only", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
        ],
      },
      {
        source: "/admin",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
  // KLKT and Munsit live on their own sites.
  async redirects() {
    return [
      { source: "/evaluate-ai", destination: "/products", permanent: false },
      // Old cntxt.tech page URLs, sent to their closest page on the new site.
      { source: "/ai-product-lab", destination: "/products", permanent: true },
      { source: "/custom-ai-solutions", destination: "/solutions", permanent: true },
      { source: "/aiforfinance", destination: "/industries/financial-services", permanent: true },
      { source: "/lp-ai-for-government", destination: "/industries/public-sector", permanent: true },
      { source: "/sovereign-ai-uae", destination: "/solutions", permanent: true },
      { source: "/our-story", destination: "/about", permanent: true },
      { source: "/career", destination: "/careers", permanent: true },
      { source: "/use-cases", destination: "/solutions", permanent: true },
      { source: "/use-case-1", destination: "/industries/financial-services", permanent: true },
      { source: "/use-case-2", destination: "/industries/real-estate", permanent: true },
      { source: "/use-case-3", destination: "/industries/public-sector", permanent: true },
      { source: "/use-case-4", destination: "/agentix", permanent: true },
      { source: "/use-case-5", destination: "/solutions", permanent: true },
      { source: "/use-case-6", destination: "/physical-ai/robotics-humanoids", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      // CNTXT AI Connect was retired; old links land on Careers.
      { source: "/cntxtai-connect", destination: "/careers", permanent: false },
      // Old articles: temporary until they are moved into the new blog.
      { source: "/insight-hub", destination: "/blog", permanent: false },
      { source: "/insight-hub/:path*", destination: "/blog", permanent: false },
      { source: "/insights/:path*", destination: "/blog", permanent: false },
      { source: "/post/:path*", destination: "/blog", permanent: false },
      { source: "/newsroom", destination: "/blog", permanent: false },
      { source: "/klkt", destination: "https://klkt.app", permanent: false },
      { source: "/klkt/:path*", destination: "https://klkt.app", permanent: false },
      { source: "/munsit", destination: "https://munsit.com", permanent: false },
      { source: "/munsit/:path*", destination: "https://munsit.com", permanent: false },
    ];
  },
};

export default nextConfig;
