"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { FabWax } from "@/components/fab-wax"
import { asset } from "@/lib/assets"
import { type Work, toWork, frameLayout, FALLBACK_WORKS } from "@/lib/works"

const NAV_ITEMS = [
  ["Services", "#services"],
  ["Approach", "#approach"],
  ["Works", "#works"],
  ["Process", "#process"],
  ["FAQ", "#faq"],
  ["가격 안내", "/pricing/"],
] as const

function SiteNav() {
  return (
    <header className="docent agency-nav">
      <a className="wordmark" href="#top" aria-label="designYEH 홈 맨 위로">
        designyeh<span className="wm-period">.</span>
      </a>
      <nav className="nav-primary" aria-label="주요 메뉴">
        {NAV_ITEMS.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        <Link className="nav-contact" href="/contact">Contact</Link>
      </nav>
      <details className="nav-mobile">
        <summary aria-label="모바일 메뉴 열기">Menu <span aria-hidden="true">＋</span></summary>
        <nav aria-label="모바일 주요 메뉴">
          {NAV_ITEMS.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
          <Link href="/contact">Contact</Link>
        </nav>
      </details>
    </header>
  )
}

function Frame({ work, index }: { work: Work; index: number }) {
  const { artW, artH, frameClass, offsetClass } = frameLayout(index)
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        io.disconnect()
      }
    }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`frame-link ${offsetClass} ${inView ? "in-view" : ""}`}
      style={{
        "--art-w": `${artW}px`,
        "--art-h": `${artH}px`,
        transitionDelay: `${(index % 6) * 60}ms`,
      } as React.CSSProperties}
    >
      <article className={`frame ${frameClass}`}>
        <div className="mat snug"><div className="art">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="art-img" src={asset(work.image)} alt={`${work.title} 웹사이트 미리보기`} loading="lazy" />
        </div></div>
      </article>
      <div className="label">
        <div className="lbl-row">
          <span className="lbl-no">No. {String(index + 1).padStart(3, "0")}</span>
          <span className="lbl-year">{work.year}</span>
        </div>
        <h3 className="lbl-title">{work.title}</h3>
        <p className="lbl-meta">{work.meta}</p>
        {work.note && <p className="lbl-note"><span className="lbl-note-mark" aria-hidden="true">“</span>{work.note}</p>}
        <p className="lbl-url">{work.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</p>
      </div>
    </div>
  )
}

function SectionTag({ no, name, meta }: { no: string; name: string; meta: string }) {
  return <div className="room-tag"><span className="tag-no">{no}</span><span className="tag-name">{name}</span><span className="tag-meta">— {meta}</span></div>
}

export default function GalleryHome() {
  const [works, setWorks] = useState<Work[]>(FALLBACK_WORKS)

  useEffect(() => {
    if (!supabase) return
    let alive = true
    ;(async () => {
      try {
        const { data, error } = await supabase.from("portfolios").select("*").order("id", { ascending: true })
        if (!alive || error || !data?.length) return
        const urls = (data as Record<string, unknown>[]).map((row) => String(row.url ?? row.link ?? "").toLowerCase())
        if (urls.some((url) => url.includes("mybdr"))) return
        const rows = [...(data as Record<string, unknown>[])].sort((a, b) =>
          (Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)) || (Number(a.id ?? 0) - Number(b.id ?? 0)))
        setWorks(rows.map((row, index) => toWork(row, index)))
      } catch {
        // Network and schema failures intentionally leave the curated fallback collection visible.
      }
    })()
    return () => { alive = false }
  }, [])

  return (
    <>
      <SiteNav />
      <main id="top">
        <section className="room room-entry agency-hero" aria-labelledby="hero-title">
          <SectionTag no="01" name="ENTRY HALL" meta="websites for small businesses" />
          <div className="hero-grid">
            <div>
              <p className="hero-eyebrow">SEOUL · SMALL WEB AGENCY</p>
              <h1 id="hero-title" className="agency-title">소규모 사업자를 위한 <em>홈페이지 제작</em></h1>
              <p className="hero-creed">Every homepage is a work of art.</p>
            </div>
            <div className="hero-copy">
              <p className="hero-proposition">어떤 일을 하는 곳인지, 왜 믿고 맡길 수 있는지. 사업 소개부터 서비스 안내, 고객 문의까지 담아드립니다.</p>
              <div className="cta-row">
                <Link className="cta cta-primary" href="/contact">홈페이지 제작 문의하기 <span aria-hidden="true">→</span></Link>
                <a className="cta cta-secondary" href="#works">제작 사례 보기 <span aria-hidden="true">↓</span></a>
              </div>
            </div>
          </div>
          <div className="baseboard" />
        </section>

        <section className="room room-problem" aria-labelledby="problem-title">
          <SectionTag no="02" name="THE BRIEF" meta="understand · trust · act" />
          <div className="section-intro split-intro">
            <h2 id="problem-title">예쁜 화면만으로는 문의가 이어지지 않습니다.</h2>
            <div>
              <p>방문자가 어떤 일을 하는 곳인지 이해하고, 믿을 근거와 문의 방법을 쉽게 찾을 수 있어야 합니다.</p>
              <p>designYEH는 사업 소개와 서비스 정보를 정리하고, 작업 사례와 문의 경로를 홈페이지에 담습니다.</p>
            </div>
          </div>
          <ol className="journey" aria-label="전환 설계 흐름">
            <li><span>01</span><strong>이해</strong><p>누구를 위한 어떤 서비스인지 첫 화면에서 분명하게</p></li>
            <li><span>02</span><strong>신뢰</strong><p>실제 작업과 구체적인 범위로 선택의 근거를 충분하게</p></li>
            <li><span>03</span><strong>행동</strong><p>알맞은 문의 경로와 준비 정보로 다음 단계를 가볍게</p></li>
          </ol>
          <div className="baseboard" />
        </section>

        <section id="services" className="room room-services" aria-labelledby="services-title">
          <SectionTag no="03" name="SERVICES" meta="what we make" />
          <div className="section-intro">
            <p className="section-kicker">WEBSITE PRODUCTION</p>
            <h2 id="services-title">기획부터 인계까지, 홈페이지에 필요한 일.</h2>
          </div>
          <div className="service-grid">
            <article className="service-card">
              <span className="card-no">S—01</span><h3>기획·정보 정리</h3>
              <p className="card-lead">사업과 고객을 이해하고 홈페이지에 담을 내용을 정리합니다.</p>
              <ul><li>사업 소개와 핵심 메시지</li><li>서비스 정보와 메뉴 구성</li><li>제공 자료와 콘텐츠 확인</li><li>필요한 화면과 문의 경로</li></ul>
              <Link className="service-link" href="/homepage-production/">홈페이지 제작 자세히 보기 →</Link>
            </article>
            <article className="service-card">
              <span className="card-no">S—02</span><h3>디자인·제작</h3>
              <p className="card-lead">사업의 분위기에 맞는 화면을 만들고 모바일까지 구현합니다.</p>
              <ul><li>사업에 어울리는 화면 디자인</li><li>PC·모바일 반응형 구현</li><li>합의한 기능과 문의 링크</li><li>기본 검색 설정</li></ul>
              <Link className="service-link" href="#works">제작 사례 보기 →</Link>
            </article>
            <article className="service-card">
              <span className="card-no">S—03</span><h3>검수·인계</h3>
              <p className="card-lead">화면과 링크를 확인하고 관리에 필요한 내용을 전달합니다.</p>
              <ul><li>기기별 화면과 가독성 확인</li><li>링크·문의 경로와 접근성 검수</li><li>관리 방법과 계정 권한 인계</li><li>수정·유지관리 범위 확인</li></ul>
              <Link className="service-link" href="/pricing/#revisions">수정·인계 기준 보기 →</Link>
            </article>
          </div>
          <p className="scope-note"><Link className="service-link" href="/pricing/">랜딩페이지 300,000원 · 가격 및 수정 정책 보기 →</Link> <span>VAT·도메인 구매비 별도.</span></p>
          <p className="scope-note"><Link className="service-link" href="/pricing/#maintenance">운영·유지관리 월 30,000원부터 · 기존 홈페이지도 상담 가능 · 사이트당/VAT 별도 →</Link></p>
          <p className="scope-note"><strong>상담에서 먼저 확인합니다.</strong> 목표, 필요한 화면과 기능, 제공 가능한 콘텐츠, 연동 대상, 개인정보 취급, 도메인·호스팅, 유지관리와 운영 인계 범위를 확인한 뒤 프로젝트 범위를 제안합니다.</p>
          <div className="baseboard" />
        </section>

        <section id="approach" className="room room-approach" aria-labelledby="approach-title">
          <SectionTag no="04" name="APPROACH" meta="how decisions are made" />
          <div className="section-intro split-intro">
            <h2 id="approach-title">사업의 분위기를 살리고, 필요한 정보는 찾기 쉽게.</h2>
            <p>누가 방문하고 무엇을 알아야 하는지 먼저 살핍니다. 소개와 서비스, 작업 사례와 문의를 자연스럽게 연결합니다.</p>
          </div>
          <div className="approach-grid">
            <article className="approach-card"><span>01</span><h3>기획</h3><p>사업과 고객의 언어를 읽고 필요한 정보와 기능의 우선순위를 세웁니다.</p></article>
            <article className="approach-card"><span>02</span><h3>전환</h3><p>이해에서 신뢰, 행동으로 이어지는 메시지와 CTA의 순서를 설계합니다.</p></article>
            <article className="approach-card"><span>03</span><h3>비주얼</h3><p>템플릿의 표정이 아니라 브랜드가 기억될 고유한 장면을 만듭니다.</p></article>
            <article className="approach-card"><span>04</span><h3>운영</h3><p>완료 후에도 관리할 수 있도록 사용 방법과 유지관리 범위를 정리합니다.</p></article>
          </div>
          <div className="baseboard" />
        </section>

        <section id="works" className="room room-websites" aria-labelledby="works-title">
          <SectionTag no="05" name="WORKS" meta="selected websites, hung on the wall" />
          <div className="section-intro works-intro"><p className="section-kicker">PERMANENT COLLECTION</p><h2 id="works-title">무엇을 만들었는지보다, 어떻게 판단했는지 보세요.</h2><p>각기 다른 업종과 목적을 브랜드다운 웹 장면으로 옮긴 기존 작업입니다.</p></div>
          <div className="salon-wall salon-grid">
            {works.map((work, index) => <Frame key={work.id} work={work} index={index} />)}
          </div>
          <div className="baseboard" />
        </section>

        <section id="process" className="room room-process" aria-labelledby="process-title">
          <SectionTag no="06" name="PROCESS" meta="from first note to handoff" />
          <div className="section-intro split-intro"><h2 id="process-title">상담부터 홈페이지 인계까지.</h2><p>필요한 페이지와 기능을 확인하고, 단계마다 내용을 함께 검토합니다.</p></div>
          <ol className="process-list">
            <li className="process-item"><span>01</span><div><h3>상담·적합성 확인</h3><p>사업과 대상 고객, 필요한 홈페이지, 일정과 예산 범위를 확인합니다.</p></div></li>
            <li className="process-item"><span>02</span><div><h3>범위 정의</h3><p>포함·제외 항목, 고객 제공 자료, 연동·외부 비용, 승인과 변경 기준을 문서로 맞춥니다.</p></div></li>
            <li className="process-item"><span>03</span><div><h3>기획</h3><p>사업 소개와 서비스 정보, 작업 사례와 문의 순서를 정리합니다.</p></div></li>
            <li className="process-item"><span>04</span><div><h3>디자인·제작</h3><p>합의된 방향을 시각 시스템과 반응형 화면, 필요한 기능으로 구현합니다.</p></div></li>
            <li className="process-item"><span>05</span><div><h3>검수·승인</h3><p>기기별 화면, 링크, 접근성, 예외 흐름을 확인하고 합의된 기준으로 승인합니다.</p></div></li>
            <li className="process-item"><span>06</span><div><h3>인계·운영</h3><p>접근 권한, 관리 방법, 데이터와 개인정보 책임, 유지관리 범위를 정리해 인계합니다.</p></div></li>
          </ol>
          <div className="baseboard" />
        </section>

        <section id="faq" className="room room-faq" aria-labelledby="faq-title">
          <SectionTag no="07" name="FAQ" meta="before you send a note" />
          <div className="faq-layout">
            <div className="section-intro"><p className="section-kicker">COMMON QUESTIONS</p><h2 id="faq-title">상담 전에 자주 묻는 것.</h2></div>
            <div className="faq-list">
              <details className="faq-item"><summary>어떤 사업자에게 필요한가요?</summary><p>사업과 서비스를 소개하고 고객 문의를 받을 공식 홈페이지가 필요한 소규모 사업자에게 맞습니다.</p></details>
              <details className="faq-item"><summary>기존 홈페이지도 새로 만들 수 있나요?</summary><p>현재 사이트와 자료를 살펴보고, 유지할 내용과 바꿀 화면·기능의 범위를 함께 정합니다.</p></details>
              <details className="faq-item"><summary>상담할 때 무엇을 준비하면 좋나요?</summary><p>사업 소개, 필요한 기능, 참고 사이트, 일정과 예산 범위를 알려주세요. 정해지지 않은 부분은 그대로 적어도 됩니다.</p></details>
              <details className="faq-item"><summary>콘텐츠와 도메인도 포함되나요?</summary><p>콘텐츠 작성, 촬영, 도메인·호스팅, 외부 서비스 비용과 관리는 프로젝트마다 다릅니다. 상담 후 포함·제외 범위와 담당을 명확히 확인합니다.</p></details>
              <details className="faq-item"><summary>완료 후 수정과 관리는 어떻게 하나요?</summary><p>제작 범위에 따른 수정 조건과 관리 방법을 확인해 인계합니다. <Link className="service-link" href="/pricing/">가격 및 수정 정책</Link>에서 조건을 확인하실 수 있습니다.</p></details>
              <details className="faq-item"><summary>AI·업무 자동화도 상담할 수 있나요?</summary><p>필요한 경우 홈페이지 제작과 별도로 상담할 수 있습니다. 개인정보와 권한, 사람의 승인과 수동 대체 절차를 확인한 뒤 범위를 정합니다. <Link className="service-link" href="/operations-automation/">추가 상담 안내 →</Link></p></details>
            </div>
          </div>
          <div className="baseboard" />
        </section>

        <section id="contact" className="room room-final" aria-labelledby="final-title">
          <SectionTag no="08" name="FRONT DESK" meta="the next piece starts with a note" />
          <div className="final-plaque">
            <p className="section-kicker">YOUR NEXT PROJECT</p>
            <h2 id="final-title">우리 사업을 소개할 <em>홈페이지가 필요하신가요?</em></h2>
            <p>어떤 일을 하는 곳인지, 홈페이지에 무엇을 담고 싶은지 알려주세요.</p>
            <Link className="cta cta-primary" href="/contact">홈페이지 제작 문의하기 <span aria-hidden="true">→</span></Link>
          </div>
          <div className="baseboard" />
        </section>
      </main>
      <footer className="end-label"><span>END OF EXHIBIT</span><Link href="/pricing/">가격 및 이용 안내</Link><span>designYEH © {new Date().getFullYear()}</span><a href="mailto:creativebyyeh@gmail.com">creativebyyeh@gmail.com</a></footer>
      <FabWax />
    </>
  )
}
