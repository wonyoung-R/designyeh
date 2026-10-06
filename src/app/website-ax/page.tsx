import type { Metadata } from "next"
import Link from "next/link"
import { asset } from "@/lib/assets"
import { FALLBACK_WORKS } from "@/lib/works"
import styles from "./landing.module.css"

const kakao = "https://open.kakao.com/me/designyeh"
const email = "mailto:creativebyyeh@gmail.com?subject=홈페이지%20제작%20및%20AX%20상담"
const title = "홈페이지 제작 · AX 컨설팅"
const description = "브랜드를 보여주는 홈페이지, 반복 업무를 줄이는 AI. designyeh의 실제 제작 사례를 확인하고 홈페이지 제작과 AX 컨설팅·구축을 상담하세요."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/website-ax/" },
  openGraph: {
    title: `${title} · designyeh`,
    description,
    url: "https://dsgnyeh.art/website-ax/",
    type: "website",
    locale: "ko_KR",
    images: [{ url: asset("/works/hoopnote.png"), alt: "HoopNote 홈페이지 제작 사례" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} · designyeh`,
    description,
    images: [asset("/works/hoopnote.png")],
  },
}

const steps = [
  { title: "지금의 문제를 듣습니다.", text: "사업과 고객, 현재 홈페이지와 반복 업무를 함께 살펴봅니다. 준비된 기획서가 없어도 괜찮습니다." },
  { title: "필요한 범위를 정합니다.", text: "페이지 구성이나 자동화할 업무를 정리하고, 작업 범위·견적·일정을 협의합니다." },
  { title: "만들고, 함께 확인합니다.", text: "디자인과 구현을 진행합니다. 실제 화면과 업무 흐름을 보며 사용성을 확인합니다." },
  { title: "운영할 수 있게 전달합니다.", text: "사용 방법과 운영에 필요한 내용을 안내합니다. 유지관리 범위는 프로젝트에 맞춰 정합니다." },
]

const faqs = [
  { question: "홈페이지와 AX를 꼭 함께 신청해야 하나요?", answer: "홈페이지 제작만, AX 컨설팅만 따로 상담할 수 있습니다. 함께 필요한 경우에는 홈페이지에서 들어오는 문의와 이후 업무까지 연결해 범위를 정합니다." },
  { question: "AX가 무엇인가요? 우리 사업에도 필요한가요?", answer: "AX는 AI를 실제 업무에 적용하는 일입니다. 문의 정리, 콘텐츠 초안, 운영 보고처럼 반복되는 일을 먼저 살펴봅니다. 모든 업무를 자동화하기보다 적용할 가치가 있는 업무부터 함께 찾습니다." },
  { question: "비용과 제작 기간은 어떻게 정하나요?", answer: "기본 단일 랜딩페이지는 최대 9개 섹션 30만원(VAT·유료 서비스 비용 별도)입니다. 자료·범위 확정 후 합의한 착수 시점부터 12시간 내 완성본을 전달합니다. 추가 페이지·관리자·DB·AX 구축은 별도 견적으로 범위와 일정을 정하며, AI·외부 도구 이용료는 고객 부담입니다. 상세 조건은 가격 및 이용 안내에서 확인할 수 있습니다." },
  { question: "아직 자료나 기획서가 없어도 상담할 수 있나요?", answer: "네. 사업 소개와 현재 고민, 참고하고 싶은 사이트가 있다면 알려주세요. 어떤 정보를 보여줄지, 어떤 업무를 줄이고 싶은지부터 함께 정리합니다." },
  { question: "AI가 만든 결과는 누가 확인하나요?", answer: "업무의 성격에 맞춰 사람이 확인할 단계를 설계합니다. 고객에게 전달되는 내용이나 중요한 판단은 검토할 수 있도록 하고, 필요한 데이터와 접근 권한도 구축 범위에 맞춰 협의합니다." },
]

function ContactLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? styles.mobileActions : styles.actions}>
      <a className={styles.primaryButton} href={kakao} target="_blank" rel="noopener noreferrer">
        카카오톡 상담 <span aria-hidden="true">↗</span>
      </a>
      <a className={styles.secondaryButton} href={email}>
        이메일 문의 <span aria-hidden="true">↗</span>
      </a>
    </div>
  )
}

export default function WebsiteAxPage() {
  const featured = FALLBACK_WORKS.find(work => work.id === "hoopnote") ?? FALLBACK_WORKS[0]

  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#main-content">본문으로 바로가기</a>
      <header className={styles.header}>
        <Link className={styles.wordmark} href="/" aria-label="designyeh 홈">designyeh<span>.</span></Link>
        <span className={styles.headerNote}>WEBSITES & AI TRANSFORMATION</span>
        <nav className={styles.nav} aria-label="랜딩 페이지 메뉴">
          <a href="#works">제작 사례</a>
          <a href="#inquiry">상담하기 <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <main id="main-content">
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}><span className={styles.dot} /> 홈페이지 제작 · AX 컨설팅 & 구축</p>
            <h1 id="hero-title">브랜드를 보여주는<br />홈페이지,<br /><span>반복 업무를 줄이는 AI.</span></h1>
            <p className={styles.heroLead}>사업의 가치는 고객에게 더 선명하게.<br />매일 반복되는 일은 더 가볍게.<br />디자인과 기술로 다음 단계를 함께 만듭니다.</p>
            <ContactLinks />
            <p className={styles.contactHint}>만들고 싶은 사이트나 줄이고 싶은 업무를 알려주세요.</p>
            <Link className={styles.priceLink} href="/pricing/">기본 랜딩페이지 30만원 · 가격 및 이용 안내 ↗</Link>
          </div>
          <div className={styles.heroVisual}>
            <p className={styles.visualHeading}>A website with purpose.</p>
            <a className={styles.featuredFrame} href={featured.url} target="_blank" rel="noopener noreferrer" aria-label={`${featured.title} 제작 사례 보기 (새 탭)`}>
              <div className={styles.browserBar}><span /><span /><span /><p>{featured.url.replace(/^https?:\/\//, "")}</p><span aria-hidden="true">↗</span></div>
              {/* Local screenshot keeps the original gallery's asset/basePath handling. */}
              <picture><source type="image/webp" srcSet={`${asset("/works/hoopnote-640.webp")} 640w, ${asset("/works/hoopnote.webp")} 1440w`} sizes="(max-width: 760px) 90vw, 45vw" /><img src={asset(featured.image)} alt={`${featured.title} 웹사이트 첫 화면`} width={1440} height={900} fetchPriority="high" /></picture>
            </a>
            <div className={styles.featuredLabel}><span>SELECTED WORK — {featured.title}</span><span>실제 제작 사례 ↗</span></div>
            <div className={styles.visualNote}><span aria-hidden="true">✳</span><p>보여주는 일부터,<br />일하는 방식까지.</p></div>
          </div>
        </section>

        <section className={styles.section} id="services" aria-labelledby="services-title">
          <div className={styles.sectionHeading}><p className={styles.eyebrow}>01 / WHAT WE DO</p><h2 id="services-title">지금 필요한 변화부터.</h2><p>처음 만드는 홈페이지도, 이미 운영 중인 사업의 개선도.<br />필요한 일에 맞춰 시작합니다.</p></div>
          <div className={styles.services}>
            <article className={styles.service}><p className={styles.serviceIndex}>01 <span>BRAND WEBSITE</span></p><h3>소개에서 문의까지,<br />브랜드다운 홈페이지.</h3><p>우리 사업의 강점을 고객이 이해할 수 있도록 정리합니다. 첫 화면의 인상부터 서비스 소개와 상담 동선까지 설계합니다.</p><ul><li>브랜드·서비스 소개와 콘텐츠 구성</li><li>PC·모바일 반응형 디자인 및 구현</li><li>문의 동선과 검색을 위한 기본 구조</li></ul><a href="#works" className={styles.textLink}>실제 홈페이지 보기 <span aria-hidden="true">↓</span></a></article>
            <article className={`${styles.service} ${styles.axService}`}><p className={styles.serviceIndex}>02 <span>AI TRANSFORMATION</span></p><h3>반복되는 업무에,<br />쓸 수 있는 AI.</h3><p>어떤 도구를 쓸지보다 어떤 일이 반복되는지부터 봅니다. 기존 업무를 살펴보고 필요한 AI 활용 흐름을 설계·구축합니다.</p><ul><li>업무 흐름 점검과 적용 범위 정리</li><li>기존 도구와 연결할 자동화 설계</li><li>사람의 검토 단계와 운영 방법 안내</li></ul><div className={styles.examples}><span>적용 예시</span><p>문의 분류 · 콘텐츠 초안 · 운영 보고</p></div></article>
          </div>
        </section>

        <section className={styles.section} id="works" aria-labelledby="works-title">
          <div className={styles.sectionHeading}><p className={styles.eyebrow}>02 / SELECTED WORKS</p><h2 id="works-title">설명보다, 실제 작업.</h2><p>각기 다른 사업의 이야기를 담았습니다.<br />이미지를 누르면 실제 웹사이트로 이동합니다.</p></div>
          <div className={styles.worksGrid}>{FALLBACK_WORKS.map((work, index) => (
            <a className={styles.work} key={work.id} href={work.url} target="_blank" rel="noopener noreferrer" aria-label={`${work.title} 웹사이트 보기 (새 탭)`}>
              <div className={styles.workImage}>
                  <picture><source type="image/webp" srcSet={`${asset(work.image.replace(/\.png$/, "-640.webp"))} 640w, ${asset(work.image.replace(/\.png$/, ".webp"))} 1440w`} sizes="(max-width: 420px) 90vw, (max-width: 1000px) 45vw, 30vw" /><img src={asset(work.image)} alt={`${work.title} 웹사이트 미리보기`} width={1440} height={900} loading="lazy" /></picture>
              </div>
              <div className={styles.workTitle}><span>{String(index + 1).padStart(2, "0")}</span><h3>{work.title}</h3><span aria-hidden="true">↗</span></div><p>{work.meta}</p>
            </a>
          ))}</div>
          <Link href="/" className={styles.textLink}>스튜디오 둘러보기 <span aria-hidden="true">↗</span></Link>
        </section>

        <section className={`${styles.section} ${styles.processSection}`} aria-labelledby="process-title">
          <div className={styles.sectionHeading}><p className={styles.eyebrow}>03 / HOW WE WORK</p><h2 id="process-title">대화로 시작해,<br />운영까지 생각합니다.</h2></div>
          <ol className={styles.steps}>{steps.map((step, index) => <li key={step.title}><span className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol>
        </section>

        <section className={`${styles.section} ${styles.faqSection}`} aria-labelledby="faq-title">
          <div className={styles.sectionHeading}><p className={styles.eyebrow}>04 / BEFORE WE TALK</p><h2 id="faq-title">궁금한 것부터.</h2></div>
          <div className={styles.faqs}>{faqs.map(faq => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}<Link className={styles.textLink} href="/pricing/">가격 및 이용 안내 보기 ↗</Link></div>
        </section>

        <section className={styles.inquiry} id="inquiry" aria-labelledby="inquiry-title">
          <p className={styles.eyebrow}>LET’S MAKE YOUR NEXT CHAPTER.</p>
          <h2 id="inquiry-title">어떤 사업을 하고 계신가요?</h2>
          <p>보여주고 싶은 브랜드, 줄이고 싶은 반복 업무.<br />지금의 고민을 들려주세요.</p>
          <ContactLinks />
          <p className={styles.inquiryHint}>사업 소개 · 필요한 작업 · 희망 일정이 있으면 함께 알려주세요.</p>
          <Link className={styles.textLink} href="/contact">문의 안내 보기 <span aria-hidden="true">↗</span></Link>
        </section>
      </main>

      <footer className={styles.footer}><Link href="/">designyeh — studio</Link><a href="mailto:creativebyyeh@gmail.com">creativebyyeh@gmail.com</a><span>SEOUL, KOREA</span></footer>
      <aside className={styles.mobileContact} aria-label="빠른 상담"><ContactLinks compact /></aside>
    </div>
  )
}
