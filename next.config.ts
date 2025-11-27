import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "dcarecenter.kr" },
      { protocol: "https", hostname: "sukone.kr" },
      { protocol: "https", hostname: "cdn.litt.ly" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "img.freepik.com" },
      { protocol: "https", hostname: "ssdwgzhtzbxgxezkomqz.supabase.co" }, // Supabase Image Domain
    ],
  },
};

export default nextConfig;
