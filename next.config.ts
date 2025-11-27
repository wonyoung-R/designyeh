import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // Static HTML Export 설정
  images: {
    unoptimized: true, // GitHub Pages에서는 이미지 최적화 서버를 사용할 수 없으므로 비활성화
    remotePatterns: [
      { protocol: "https", hostname: "dcarecenter.kr" },
      { protocol: "https", hostname: "sukone.kr" },
      { protocol: "https", hostname: "cdn.litt.ly" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "img.freepik.com" },
      { protocol: "https", hostname: "ssdwgzhtzbxgxezkomqz.supabase.co" },
    ],
  },
};

export default nextConfig;
