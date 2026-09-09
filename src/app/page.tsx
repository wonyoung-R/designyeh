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
          <SectionTag no="01" name="ENTRY HALL" meta="web, identity, and practical operations" />
          <div className="hero-grid">
            <div>
              <p className="hero-eyebrow">SEOUL · SMALL WEB AGENCY</p>
              <h1 id="hero-title" className="agency-title">눈에 남는 브랜드, <em>손이 덜 가는 운영.</em></h1>
              <p className="hero-creed">Every homepage is a work of art.</p>
            </div>
            <div className="hero-copy">
              <p className="hero-proposition">웹사이트 제작부터 브랜드 아이덴티티, 문의 이후 운영 자동화까지 한 흐름으로 설계합니다.</p>
              <p>공식 웹사이트가 필요하거나, 브랜드 인상이 정리되지 않았거나, 문의 뒤의 반복 업무를 줄이고 싶은 작은 팀과 사업자를 위해 만듭니다.</p>
              <p>고객은 무엇을 제공하는지 빠르게 이해하고, 믿을 근거를 확인한 뒤, 망설임 없이 문의할 수 있습니다.</p>
              <div className="cta-row">
                <Link className="cta cta-primary" href="/contact">프로젝트 상담하기 <span aria-hidden="true">→</span></Link>
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
              <p>방문자가 첫 화면에서 업종과 가치를 이해하지 못하고, 신뢰할 근거와 다음 행동을 찾지 못하면 광고의 다음 클릭은 사라집니다.</p>
              <p>designYEH는 정보의 순서를 정리하고, 브랜드다운 시각 언어를 만들고, 문의가 실제 운영으로 이어지는 경로까지 함께 설계합니다.</p>
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
            <p className="section-kicker">THREE PRACTICES</p>
            <h2 id="services-title">필요한 만큼 연결하고, 범위는 선명하게.</h2>
          </div>
          <div className="service-grid">
            <article className="service-card">
              <span className="card-no">S—01</span><h3>웹사이트</h3>
              <p className="card-lead">서비스를 이해시키고 문의로 이끄는 브랜드 웹 경험</p>
              <ul><li>정보 구조와 핵심 메시지</li><li>반응형 UI와 접근성</li><li>문의 동선과 기본 검색 설정</li><li>운영 인계와 관리 기준</li></ul>
              <Link className="service-link" href="/homepage-production/">홈페이지 제작 자세히 보기 →</Link>
            </article>
            <article className="service-card">
              <span className="card-no">S—02</span><h3>아이덴티티</h3>
              <p className="card-lead">화면과 접점마다 한 브랜드로 기억되는 시각 체계</p>
              <ul><li>로고와 기본 그래픽 언어</li><li>색상·서체·사용 원칙</li><li>웹 적용을 위한 디자인 시스템</li><li>필요 접점의 핵심 제작물</li></ul>
              <Link className="service-link" href="/brand-identity/">브랜드 아이덴티티 자세히 보기 →</Link>
            </article>
            <article className="service-card">
              <span className="card-no">S—03</span><h3>운영 자동화</h3>
              <p className="card-lead">문의 이후 반복되는 입력·분류·전달을 줄이는 실무 흐름</p>
              <ul><li>현재 업무 흐름과 예외 진단</li><li>AI·SaaS·RPA의 목적별 적용</li><li>사람의 승인(human approval) 지점</li><li>오류 시 수동 대체 절차(fallback)</li></ul>
              <Link className="service-link" href="/operations-automation/">운영 자동화 자세히 보기 →</Link>
            </article>
          </div>
          <p className="scope-note"><Link className="service-link" href="/pricing/">랜딩페이지 300,000원 · 가격 및 수정 정책 보기 →</Link> <span>VAT·도메인 구매비 별도.</span></p>
          <p className="scope-note"><strong>상담에서 먼저 확인합니다.</strong> 목표, 필요한 화면과 기능, 제공 가능한 콘텐츠, 연동 대상, 개인정보 취급, 도메인·호스팅, 유지관리와 운영 인계 범위를 확인한 뒤 프로젝트 범위를 제안합니다.</p>
          <div className="baseboard" />
        </section>

        <section id="approach" className="room room-approach" aria-labelledby="approach-title">
          <SectionTag no="04" name="APPROACH" meta="how decisions are made" />
          <div className="section-intro split-intro">
            <h2 id="approach-title">작품의 결을 지키고, 사업의 흐름을 놓치지 않습니다.</h2>
            <p>도구보다 먼저 목적을 묻습니다. 각 결정이 방문자의 이해, 브랜드 신뢰, 문의 행동, 그리고 팀의 실제 운영에 어떤 영향을 주는지 살핍니다.</p>
          </div>
          <div className="approach-grid">
            <article className="approach-card"><span>01</span><h3>기획</h3><p>사업과 고객의 언어를 읽고 필요한 정보와 기능의 우선순위를 세웁니다.</p></article>
            <article className="approach-card"><span>02</span><h3>전환</h3><p>이해에서 신뢰, 행동으로 이어지는 메시지와 CTA의 순서를 설계합니다.</p></article>
            <article className="approach-card"><span>03</span><h3>비주얼</h3><p>템플릿의 표정이 아니라 브랜드가 기억될 고유한 장면을 만듭니다.</p></article>
            <article className="approach-card"><span>04</span><h3>운영</h3><p>반복 업무는 줄이고 판단이 필요한 지점에는 사람과 안전한 대안을 남깁니다.</p></article>
          </div>
          <div className="baseboard" />
        </section>

        <section id="works" className="room room-websites" aria-labelledby="works-title">
          <SectionTag no="05" name="WORKS" meta="selected websites, hung on the wall" />
          <div className="section-intro works-intro"><p className="section-kicker">PERMANENT COLLECTION</p><h2 id="works-title">만든 것에서 <em>판단의 결</em>을 보세요.</h2><p>각기 다른 업종과 목적을 브랜드다운 웹 장면으로 옮긴 기존 작업입니다.</p></div>
          <div className="salon-wall salon-grid">
            {works.map((work, index) => <Frame key={work.id} work={work} index={index} />)}
          </div>
          <div className="baseboard" />
        </section>

        <section id="process" className="room room-process" aria-labelledby="process-title">
          <SectionTag no="06" name="PROCESS" meta="from first note to handoff" />
          <div className="section-intro split-intro"><h2 id="process-title">질문에서 시작해 운영 가능한 상태로.</h2><p>정해진 패키지에 끼워 맞추지 않습니다. 상담에서 확인한 목표와 제약을 기준으로 단계별 산출물과 승인 지점을 합의합니다.</p></div>
          <ol className="process-list">
            <li className="process-item"><span>01</span><div><h3>상담·적합성 확인</h3><p>목표, 대상 고객, 필요한 서비스, 일정과 예산 범위, 의사결정 구조를 확인합니다.</p></div></li>
            <li className="process-item"><span>02</span><div><h3>범위 정의</h3><p>포함·제외 항목, 고객 제공 자료, 연동·외부 비용, 승인과 변경 기준을 문서로 맞춥니다.</p></div></li>
            <li className="process-item"><span>03</span><div><h3>기획</h3><p>콘텐츠와 사용자 흐름, 핵심 메시지, 기능 및 운영 시나리오를 설계합니다.</p></div></li>
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
              <details className="faq-item"><summary>세 서비스를 꼭 함께 진행해야 하나요?</summary><p>아닙니다. 웹사이트, 아이덴티티, 운영 자동화 중 필요한 범위만 선택할 수 있습니다. 서로 연결할 이유가 분명할 때 함께 제안합니다.</p></details>
              <details className="faq-item"><summary>어떤 팀과 잘 맞나요?</summary><p>공식 웹사이트나 명확한 문의 경로가 필요한 소규모 사업자·초기 팀, 반복 문의와 후속 업무를 정리하려는 운영자와 잘 맞습니다.</p></details>
              <details className="faq-item"><summary>상담할 때 무엇을 준비하면 좋나요?</summary><p>현재 상황, 목표와 대상 고객, 필요한 기능, 참고 자료, 일정·예산 범위, 의사결정자를 알려주세요. 정해지지 않은 부분은 그대로 적어도 됩니다.</p></details>
              <details className="faq-item"><summary>콘텐츠와 도메인도 포함되나요?</summary><p>콘텐츠 작성, 촬영, 도메인·호스팅, 외부 서비스 비용과 관리는 프로젝트마다 다릅니다. 상담 후 포함·제외 범위와 담당을 명확히 확인합니다.</p></details>
              <details className="faq-item"><summary>운영 자동화는 어떻게 안전하게 만드나요?</summary><p>AI·SaaS·RPA는 반복 업무를 줄이는 수단으로만 사용합니다. 개인정보와 권한, 예외 상황을 먼저 확인하고 사람의 승인과 수동 대체 절차를 함께 둡니다.</p></details>
              <details className="faq-item"><summary>완료 후 수정과 관리는 어떻게 하나요?</summary><p>운영 인계, 유지관리, 추가 변경은 필요한 수준이 모두 다릅니다. 상담과 범위 정의 단계에서 관리 주체, 지원 범위, 변경 절차를 합의합니다.</p></details>
            </div>
          </div>
          <div className="baseboard" />
        </section>

        <section id="contact" className="room room-final" aria-labelledby="final-title">
          <SectionTag no="08" name="FRONT DESK" meta="the next piece starts with a note" />
          <div className="final-plaque">
            <p className="section-kicker">YOUR NEXT PROJECT</p>
            <h2 id="final-title">첫인상과 그다음 운영을 <em>함께 설계해볼까요?</em></h2>
            <p>아직 정리되지 않은 생각이어도 괜찮습니다. 현재 상황과 만들고 싶은 변화를 알려주세요.</p>
            <Link className="cta cta-primary" href="/contact">프로젝트 상담하기 <span aria-hidden="true">→</span></Link>
          </div>
          <div className="baseboard" />
        </section>
      </main>
      <footer className="end-label"><span>END OF EXHIBIT</span><Link href="/pricing/">가격 및 이용 안내</Link><span>designYEH © {new Date().getFullYear()}</span><a href="mailto:creativebyyeh@gmail.com">creativebyyeh@gmail.com</a></footer>
      <FabWax />
    </>
  )
}
