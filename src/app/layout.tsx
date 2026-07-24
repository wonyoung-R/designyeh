import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dsgnyeh.art"),
  title: {
    default: "designyeh — studio",
    template: "%s · designyeh",
  },
  description:
    "designyeh는 브랜드의 첫 인상을 짓는 작은 디자인 스튜디오입니다. 홈페이지, 로고, 인쇄물 — 마감된 작업들을 액자에 걸어 전시합니다.",
  icons: { icon: "/favicon.svg" },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://dsgnyeh.art",
    siteName: "designyeh",
    title: "designyeh — studio",
    description:
      "브랜드의 첫 인상을 짓는 작은 디자인 스튜디오. 마감된 작업들을 액자에 걸어 전시합니다.",
    images: [
      {
        url: "/images/og.jpg",
        width: 1200,
        height: 800,
        alt: "dsgnyeh.art — Designing Brands. Building Impact.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "designyeh — studio",
    description: "브랜드의 첫 인상을 짓는 작은 디자인 스튜디오.",
    images: ["/images/og.jpg"],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://dsgnyeh.art/#org",
      name: "designyeh",
      url: "https://dsgnyeh.art",
      description:
        "브랜드의 첫 인상을 짓는 작은 디자인 스튜디오. 홈페이지 제작, 브랜딩, 디자인 솔루션.",
      image: "https://dsgnyeh.art/images/og.jpg",
      areaServed: "KR",
    },
    {
      "@type": "WebSite",
      "@id": "https://dsgnyeh.art/#website",
      name: "designyeh — studio",
      url: "https://dsgnyeh.art",
      inLanguage: "ko-KR",
      publisher: { "@id": "https://dsgnyeh.art/#org" },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* Pretendard (KR body) — matches the design handoff */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="gallery antialiased">{children}</body>
    </html>
  );
}
