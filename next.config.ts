import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // KLKT and Munsit live on their own sites.
  async redirects() {
    return [
      { source: "/evaluate-ai", destination: "/products", permanent: false },
      // Old cntxt.tech page URLs, sent to their closest page on the new site.
      { source: "/ai-product-lab", destination: "/products", permanent: true },
      { source: "/data-services", destination: "/data-hub", permanent: true },
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
