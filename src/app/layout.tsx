import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://designyeh.kr"),
  title: {
    default: "designyeh — studio",
    template: "%s · designyeh",
  },
  description:
    "designyeh는 브랜드의 첫 인상을 짓는 작은 디자인 스튜디오입니다. 홈페이지, 로고, 인쇄물 — 마감된 작업들을 액자에 걸어 전시합니다.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://designyeh.kr",
    siteName: "designyeh",
    title: "designyeh — studio",
    description:
      "브랜드의 첫 인상을 짓는 작은 디자인 스튜디오. 마감된 작업들을 액자에 걸어 전시합니다.",
  },
  twitter: {
    card: "summary_large_image",
    title: "designyeh — studio",
    description: "브랜드의 첫 인상을 짓는 작은 디자인 스튜디오.",
  },
  robots: { index: true, follow: true },
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
      </head>
      <body className="gallery antialiased">{children}</body>
    </html>
  );
}
