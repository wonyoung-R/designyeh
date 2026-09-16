import Link from "next/link"
import { FabWax } from "@/components/fab-wax"
import { ProjectCarousel } from "@/components/project-carousel"
import { SiteNav } from "@/components/site-nav"
import { asset } from "@/lib/assets"
import { type Work, FALLBACK_WORKS } from "@/lib/works"

function WorkCard({ work, index }: { work: Work; index: number }) {
  const stem = /^\/works\/(designluka|dcare|mavs|sdngazer|laf2023|gritlab|hoopnote)\.png$/.test(work.image)
    ? work.image.slice(0, -4)
    : null
  return (
    <article id={`work-${work.id}`} className="work-card" aria-labelledby={`work-title-${work.id}`}>
      <a className="work-image-link" href={work.url} target="_blank" rel="noopener noreferrer" aria-label={`${work.title} 사이트 방문 (새 창)`}>
        <picture style={{ display: "block", width: "100%" }}>
          {stem && <source type="image/webp" srcSet={`${asset(`${stem}-640.webp`)} 640w, ${asset(`${stem}.webp`)} 1440w`} sizes="(max-width: 700px) 100vw, 50vw" />}
          <img className="work-image" src={asset(work.image)} alt={`${work.title} 웹사이트 미리보기`} width={1440} height={900} loading="lazy" />
        </picture>
      </a>
      <div className="label">
        <div className="lbl-row"><span>{String(index + 1).padStart(2, "0")} / 홈페이지 제작 사례</span><span>{work.year}</span></div>
        <h3 id={`work-title-${work.id}`} className="lbl-title">{work.title}</h3>
        <p className="lbl-meta">{work.meta}</p>
        {work.solution ? (
          <dl className="work-narrative">
            {work.note && <><dt>필요했던 것</dt><dd>{work.note}</dd></>}
            <dt>이렇게 만들었습니다</dt>
            <dd>{work.solution}</dd>
          </dl>
        ) : work.note && <p className="lbl-note">{work.note}</p>}
        {work.scope && work.scope.length > 0 && (
          <div className="work-scope">
            <p className="work-scope-label">제작 범위</p>
            <ul>{work.scope.map((item, scopeIndex) => <li key={`${scopeIndex}-${item}`}>{item}</li>)}</ul>
          </div>
        )}
        <p className="lbl-url"><a href={work.url} target="_blank" rel="noopener noreferrer">{work.url.replace(/^https:\/\//, "").replace(/\/$/, "")}<span aria-hidden="true">↗</span><span className="sr-only">{work.title} (새 창)</span></a></p>
      </div>
    </article>
  )
}

function SectionTag({ no, name, meta }: { no: string; name: string; meta: string }) {
  return <div className="room-tag"><span className="tag-no">{no}</span><span className="tag-name">{name}</span><span className="tag-meta">{meta}</span></div>
}

export default function StudioHome() {
  const works = FALLBACK_WORKS
  return (
    <>
      <a className="skip-link" href="#top">본문으로 이동</a>
      <SiteNav />
      <main id="top" tabIndex={-1}>
        <section className="room room-entry agency-hero" aria-labelledby="hero-title">
          <div className="hero-grid">
            <div>
              <p className="hero-eyebrow">designYEH · 디자인과 기술로 만드는 사업의 다음</p>
              <h1 id="hero-title" className="agency-title"><span className="agency-title-intro">당신이 쌓아온 일에,</span> <strong className="agency-title-key">필요한 다음을 만듭니다.</strong></h1>
            </div>
            <div className="hero-copy">
              <p className="hero-proposition"><span>사업을 보여주는 모습부터, 매일 일하는 방식까지.</span> <span>디자인과 기술로 지금 필요한 것을 함께 만듭니다.</span></p>
              <div className="cta-row">
                <Link className="cta cta-primary" href="/contact">우리 사업 이야기 나누기 <span aria-hidden="true">↗</span></Link>
                <a className="cta cta-secondary" href="#works">만든 것들 살펴보기 <span aria-hidden="true">↓</span></a>
              </div>
            </div>
          </div>
        </section>

        <section className="project-strip" aria-labelledby="project-strip-title">
          <ProjectCarousel works={works} />
        </section>

        <section id="works" className="room room-websites" aria-labelledby="works-title">
          <SectionTag no="02" name="SELECTED WORK" meta="websites · details · decisions" />
          <div className="section-intro works-intro"><h2 id="works-title">홈페이지 제작 사례</h2><p>사업을 소개하는 홈페이지부터, 운영에 필요한 관리 기능까지.</p><p className="portfolio-scope">DB 연동, 관리자 페이지, 대회 운영 기능은 별도 구축 범위이며 기본 랜딩 패키지에는 포함되지 않습니다.</p></div>
          <div className="salon-wall salon-grid">{works.map((work, index) => <WorkCard key={work.id} work={work} index={index} />)}</div>
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
          <section id="approach" className="section-intro split-intro services-approach" aria-labelledby="approach-title">
            <h2 id="approach-title">사업의 분위기를 살리고, 필요한 정보는 찾기 쉽게.</h2>
            <p>누가 방문하고 무엇을 알아야 하는지 먼저 살핍니다. 소개와 서비스, 작업 사례와 문의를 자연스럽게 연결합니다.</p>
          </section>
        </section>

        <section id="process" className="room room-process" aria-labelledby="process-title">
          <SectionTag no="04" name="PROCESS" meta="from first note to handoff" />
          <div className="section-intro split-intro"><h2 id="process-title">상담부터 홈페이지 인계까지.</h2><p>필요한 페이지와 기능을 확인하고, 단계마다 내용을 함께 검토합니다.</p></div>
          <ol className="process-list">
            <li className="process-item"><span>01</span><div><h3>상담·적합성 확인</h3><p>사업과 대상 고객, 필요한 홈페이지, 일정과 예산 범위를 확인합니다.</p></div></li>
            <li className="process-item"><span>02</span><div><h3>범위 정의</h3><p>포함·제외 항목, 고객 제공 자료, 연동·외부 비용, 승인과 변경 기준을 문서로 맞춥니다.</p></div></li>
            <li className="process-item"><span>03</span><div><h3>기획</h3><p>사업 소개와 서비스 정보, 작업 사례와 문의 순서를 정리합니다.</p></div></li>
            <li className="process-item"><span>04</span><div><h3>디자인·제작</h3><p>합의된 방향을 시각 시스템과 반응형 화면, 필요한 기능으로 구현합니다.</p></div></li>
            <li className="process-item"><span>05</span><div><h3>검수·승인</h3><p>기기별 화면, 링크, 접근성, 예외 흐름을 확인하고 합의된 기준으로 승인합니다.</p></div></li>
            <li className="process-item"><span>06</span><div><h3>인계·운영</h3><p>접근 권한, 관리 방법, 데이터와 개인정보 책임, 유지관리 범위를 정리해 인계합니다.</p></div></li>
          </ol>
        </section>

        <section id="faq" className="room room-faq" aria-labelledby="faq-title">
          <SectionTag no="05" name="FAQ" meta="before you send a note" />
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
        </section>

        <section id="contact" className="room room-final" aria-labelledby="final-title">
          <SectionTag no="06" name="CONTACT" meta="start a conversation" />
          <div className="final-plaque">
            <p className="section-kicker">YOUR NEXT PROJECT</p>
            <h2 id="final-title">우리 사업을 소개할 <em>홈페이지가 필요하신가요?</em></h2>
            <p>어떤 일을 하는 곳인지, 홈페이지에 무엇을 담고 싶은지 알려주세요.</p>
            <Link className="cta cta-primary" href="/contact">홈페이지 제작 문의하기 <span aria-hidden="true">→</span></Link>
          </div>
        </section>
      </main>
      <FabWax />
      <footer className="end-label"><span>DESIGNYEH STUDIO</span><Link href="/pricing/">가격 및 이용 안내</Link><span>designYEH © {new Date().getFullYear()}</span><a href="mailto:creativebyyeh@gmail.com">creativebyyeh@gmail.com</a></footer>
    </>
  )
}
