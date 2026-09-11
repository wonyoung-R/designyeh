import type { Metadata } from "next"
import "./globals.css"

const description = "어떤 일을 하는 곳인지, 왜 믿고 맡길 수 있는지. 사업 소개부터 서비스 안내, 고객 문의까지 담아드립니다."

export const metadata: Metadata = {
  metadataBase: new URL("https://dsgnyeh.art"),
  title: { default: "소규모 사업자를 위한 홈페이지 제작 · designYEH", template: "%s · designYEH" },
  description,
  icons: { icon: "/favicon.svg" },
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "ko_KR", url: "https://dsgnyeh.art/", siteName: "designYEH", title: "소규모 사업자를 위한 홈페이지 제작 · designYEH", description, images: [{ url: "/images/og.jpg", width: 1200, height: 800, alt: "designYEH 웹에이전시" }] },
  twitter: { card: "summary_large_image", title: "소규모 사업자를 위한 홈페이지 제작 · designYEH", description, images: ["/images/og.jpg"] },
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
