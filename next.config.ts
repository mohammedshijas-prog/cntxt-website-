import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // KLKT and Munsit live on their own sites.
  async redirects() {
    return [
      { source: "/klkt", destination: "https://klkt.app", permanent: false },
      { source: "/klkt/:path*", destination: "https://klkt.app", permanent: false },
      { source: "/munsit", destination: "https://munsit.com", permanent: false },
      { source: "/munsit/:path*", destination: "https://munsit.com", permanent: false },
    ];
  },
};

export default nextConfig;
