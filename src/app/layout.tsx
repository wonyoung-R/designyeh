import type { Metadata } from "next"
import "./globals.css"

const description = "designYEH는 웹사이트, 아이덴티티, 문의 이후 운영 자동화를 설계하는 서울의 작은 웹에이전시입니다. 눈에 남는 브랜드, 손이 덜 가는 운영. 홈페이지 제작부터 브랜드 아이덴티티와 운영 흐름까지 함께 설계합니다."

export const metadata: Metadata = {
  metadataBase: new URL("https://dsgnyeh.art"),
  title: { default: "홈페이지 제작 · designYEH — 눈에 남는 브랜드, 손이 덜 가는 운영.", template: "%s · designYEH" },
  description,
  icons: { icon: "/favicon.svg" },
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "ko_KR", url: "https://dsgnyeh.art/", siteName: "designYEH", title: "홈페이지 제작 · designYEH — 눈에 남는 브랜드, 손이 덜 가는 운영.", description, images: [{ url: "/images/og.jpg", width: 1200, height: 800, alt: "designYEH 웹에이전시" }] },
  twitter: { card: "summary_large_image", title: "홈페이지 제작 · designYEH — 눈에 남는 브랜드, 손이 덜 가는 운영.", description, images: ["/images/og.jpg"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 } },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": ["Organization", "ProfessionalService"], "@id": "https://dsgnyeh.art/#agency", name: "designYEH", url: "https://dsgnyeh.art/", description, image: "https://dsgnyeh.art/images/og.jpg", email: "creativebyyeh@gmail.com", areaServed: "KR", knowsLanguage: ["ko", "en"] },
    { "@type": "WebSite", "@id": "https://dsgnyeh.art/#website", name: "designYEH", url: "https://dsgnyeh.art/", inLanguage: "ko-KR", publisher: { "@id": "https://dsgnyeh.art/#agency" } },

  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko"><head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </head><body className="gallery antialiased">{children}</body></html>
  )
}
