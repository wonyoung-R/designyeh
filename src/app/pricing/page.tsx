import type { Metadata } from "next"
import Link from "next/link"
import "./pricing.css"

const title = "가격 및 이용 안내"
const description = "단일 랜딩페이지 최대 9개 섹션, 300,000원(VAT·도메인 구매비 별도). 완료 후 30일간 간단한 수정 2회와 24시간 회신 조건, AI·업무 자동화 견적 방식을 안내합니다."
const url = "https://dsgnyeh.art/pricing/"
export const metadata: Metadata = {
  title, description, alternates: { canonical: url },
  openGraph: { title: `${title} · designYEH`, description, url, type: "website", locale: "ko_KR", images: [{ url: "/images/og.jpg", width: 1200, height: 800, alt: "designYEH 웹에이전시" }] },
  twitter: { card: "summary_large_image", title: `${title} · designYEH`, description, images: ["/images/og.jpg"] },
}

const stages = [
  ["01", "업무 분석", "현재·목표 업무 흐름, 자동화 후보와 비AI 대안, 요구사항·우선순위와 개략 견적을 정리합니다.", "분석 범위별 고정가 또는 시간 상한제 협의"],
  ["02", "PoC · 기술 검증", "대표 자료와 평가셋으로 시제품을 검증하고 품질·지연·사용비와 한계를 확인합니다.", "검증 범위와 실험 예산 상한 합의"],
  ["03", "구축 · 연동", "기능·화면·연동·권한·예외 처리를 구현하고 합의한 기준으로 검수·인계합니다.", "검증 가능한 작업 묶음별 견적"],
  ["04", "운영 · 유지관리", "필요한 점검과 장애 대응, 유지관리 범위를 정합니다.", "월 포함 시간과 별도 사용료 협의"],
]
const terms = [
  ["제작 범위", "기본 디자인과 원고·이미지 제공 기준, 섹션별 분량, 반응형·검색 메타데이터·문의 링크 등 포함 기능과 최초 배포 범위를 상담 후 견적서에서 확정합니다."],
  ["일정 · 결제 · 취소", "제작·최초 납품 일정, 자료 제공 지연 시 처리, 결제 시점·분할 여부, 착수 전후 취소·환불과 진행 단계별 정산 기준은 계약 전 협의·확정합니다."],
  ["수정 · 회신", "제작 오류 대응 기간·범위, 추가 수정 단가, 공식 수정 접수 채널, 반복 회신 지연 시 보상 누적 여부와 추가 보상 수정의 사용 기한은 계약 전 확인합니다."],
  ["운영 · 인계", "도메인 갱신 비용·관리 주체, 호스팅·소스 소유권과 인계, 유지관리 책임·비용을 계약 전 확인합니다. 유료 호스팅·소재·라이선스 등 외부 비용은 필요한 항목을 별도 안내합니다."],
  ["AI 프로젝트", "시간단가·최소 분석 범위, 사전 상담의 무료 여부, 컨설팅비의 구축비 차감 여부, 사용량 정산·상한, 데이터·권한·외부 전송 조건은 상담과 계약에서 확정합니다."],
]

export default function PricingPage() {
  return <>
    <header className="docent contact-nav pricing-nav">
      <Link className="wordmark" href="/">designyeh<span className="wm-period">.</span></Link>
      <nav aria-label="주요 메뉴"><Link href="/pricing/" aria-current="page">가격 안내</Link><Link href="/contact/">프로젝트 상담 →</Link></nav>
    </header>
    <main className="service-detail pricing-page">
      <section className="room room-entry" aria-labelledby="pricing-title">
        <div className="room-tag"><span className="tag-no">P—01</span><span className="tag-name">PRICING & POLICY</span></div>
        <div className="service-sheet">
          <nav className="service-breadcrumb" aria-label="현재 위치"><Link href="/">홈</Link> / <span aria-current="page">가격 및 이용 안내</span></nav>
          <p className="section-kicker">A CLEAR START</p>
          <h1 id="pricing-title">필요한 범위는 명확하게, 비용은 이해하기 쉽게.</h1>
          <p className="service-definition">작은 시작을 위한 랜딩페이지부터 AI·업무 자동화까지. 제작 범위와 완료 기준을 먼저 맞추고 시작합니다.</p>
          <nav className="pricing-index" aria-label="가격 안내 목차"><a href="#landing">랜딩페이지</a><a href="#revisions">완료와 수정</a><a href="#reply">24시간 회신</a><a href="#ai">AI·자동화 견적</a><a href="#terms">계약 전 확인</a></nav>
          <article id="landing" className="pricing-plaque" aria-labelledby="landing-title">
            <div><p className="section-kicker">LANDING PAGE / FIXED PRICE</p><h2 id="landing-title">하나의 페이지로 시작하세요.</h2><p>단일 랜딩페이지 · 최대 9개 섹션</p><p className="pricing-amount">300,000<span>원</span></p><p className="pricing-tax">VAT 별도 · 도메인 구매 비용 별도</p><Link className="cta cta-primary" href="/contact/">제작 범위 상담하기 →</Link></div>
            <div className="pricing-inclusions"><span className="card-no">INCLUDED CARE</span><h3>완료 후에도, 작은 수정을 함께.</h3><p>제작 완료 확정일로부터 <strong>30일간 간단한 수정 2회</strong>를 무상 제공합니다.</p><p>섹션은 소개·서비스·사례·문의처럼 한 페이지 안의 콘텐츠 구역입니다. 독립된 웹페이지 9개를 뜻하지 않습니다.</p><a className="service-link" href="#terms">기본 구성·포함 작업은 상담 후 확정 ↓</a></div>
          </article>
          <p className="scope-note"><strong>범위가 넓어질 때는 별도 견적을 확인합니다.</strong> 추가 페이지·새 섹션·기능, 전면 디자인 변경, 기획·카피, 로고·촬영, 다국어, 회원가입·결제·예약·DB·관리자, 자체 문의 폼·외부 연동은 별도 견적 검토 대상입니다. 최종 포함·제외 항목은 견적서에서 확정합니다.</p>
        </div><div className="baseboard" />
      </section>
      <section id="revisions" className="room room-process" aria-labelledby="revision-title"><div className="service-sheet">
        <p className="section-kicker">01 / COMPLETION & CARE</p><h2 id="revision-title">완료 기준부터, 수정 한 번의 기준까지.</h2>
        <ol className="process-list">
          <li className="process-item"><span>01</span><div><h3>착수 전에 완료 기준을 합의합니다.</h3><p>섹션 구성·원고·이미지·디자인 방향, PC·모바일 표시와 버튼 동작, 기능·배포·인계 중 필요한 검수 항목을 함께 정합니다. 검수 후 고객과 완료일을 확정하며 1차 납품만으로 자동 완료 처리하지 않습니다.</p></div></li>
          <li className="process-item"><span>02</span><div><h3>완료 후 30일간, 간단한 수정 2회.</h3><p>기존 구성 안의 문구·이미지 교체 등 간단한 수정이 대상입니다. 요청사항을 한 번에 취합해 전달한 건을 1회로 산정합니다. 완료 후 30일 이내 접수한 요청은 실제 처리 완료가 기간 이후여도 인정합니다.</p></div></li>
          <li className="process-item"><span>03</span><div><h3>제작 오류는 수정 횟수에서 차감하지 않습니다.</h3><p>완료 기준 미충족 부분의 보완은 제작 범위에 포함하며 서비스 수정 횟수에서 차감하지 않습니다. 제작 오류도 차감하지 않으며 별도의 오류 대응 기간·범위는 계약 전 확정합니다.</p></div></li>
          <li className="process-item"><span>04</span><div><h3>새 요구는 범위와 비용을 먼저 맞춥니다.</h3><p>제작 중 새 요구·방향 변경과 완료 후 새 섹션·기능·전면 디자인 변경은 별도로 협의합니다. 기간·횟수 초과 시 추가 작업 여부와 비용을 사전 합의하며 추가 수정 단가는 상담 후 확정합니다.</p></div></li>
        </ol>
      </div><div className="baseboard" /></section>
      <section id="reply" className="room room-services" aria-labelledby="reply-title"><div className="service-sheet pricing-reply">
        <div><p className="section-kicker">02 / SERVICE CONDITION</p><h2 id="reply-title">24시간 회신 약속</h2><p className="pricing-clock" aria-hidden="true">24<span>h</span></p></div>
        <div><p><strong>서비스 조건으로 안내합니다.</strong> 1차 납품 후 수정 요청 접수 시점부터 24시간 이내에 요청 내용을 확인하고 처리 예정 일정을 회신합니다. 주말·공휴일도 포함합니다.</p><p>단순 자동 접수 메시지는 회신으로 보지 않습니다. <strong>24시간 이내 수정 완료 보장은 아닙니다.</strong> 실제 완료 일정은 작업 범위에 따라 안내합니다.</p><p>회신이 24시간을 초과하면 <strong>기본 수정 2회 외 추가 수정 1회</strong>를 무상 제공합니다. 제작비 전체 면제·환불을 의미하지 않습니다.</p><p className="scope-note">공식 접수 채널, 반복 지연 시 보상 누적 여부, 추가 보상 수정의 사용 기한은 계약 전 협의·확정합니다.</p></div>
      </div><div className="baseboard" /></section>
      <section id="ai" className="room room-approach" aria-labelledby="ai-title"><div className="service-sheet">
        <p className="section-kicker">03 / AI · RAG · AUTOMATION</p><h2 id="ai-title">업무와 자료를 먼저, 견적은 그다음.</h2><p>사내 문서 검색·답변(RAG), 문서 처리, 업무 도구 연동은 자료 상태와 기능·권한·예외 처리 요구에 따라 비용이 달라집니다. 컨설팅과 구축을 구분하며, 아래 단계와 견적 방식은 상담 후 확정합니다. 단계별 단가·최소 비용은 협의가 필요합니다.</p>
        <div className="pricing-stages">{stages.map(([no, name, text, basis]) => <article key={no}><span className="card-no">{no}</span><h3>{name}</h3><p>{text}</p><p className="pricing-basis">{basis}</p></article>)}</div>
        <h2>시간과 사용량을 구분해 산정합니다.</h2><p>전문가의 분석·설계·구현 관여·검수 시간, AI 실행비, 인프라 등 직접 비용을 나누는 견적 방식을 제안합니다. 산출물·완료 기준·예상 비용·예산 상한을 함께 정하고, 초과 실행 전 승인을 받는 구조를 협의합니다.</p>
        <ul><li>사람의 실제 투입시간과 에이전트 실행·대기시간을 구분하며, 에이전트 수를 사람 인원수로 환산하지 않습니다.</li><li>AI 비용은 입력·출력·캐시·도구 등 공급사의 실제 과금 기준을 따릅니다. 구독형 도구에 임의 토큰 단가를 적용하지 않습니다.</li><li>제작사 실수나 불필요한 재시도 비용을 무제한 전가하지 않습니다. PoC의 정상 실험 예산은 사전에 합의합니다.</li><li>모델 API, 서버·DB·검색 인프라, 유료 SaaS·라이선스와 유지관리 비용은 구축비와 구분합니다.</li></ul>
        <p className="scope-note">랜딩페이지 정찰제는 이 견적 방식과 별개입니다. 합의한 기본 범위 안에서 토큰 사용량을 이유로 추가 청구하지 않습니다.</p>
      </div><div className="baseboard" /></section>
      <section id="terms" className="room room-faq" aria-labelledby="terms-title"><div className="service-sheet">
        <p className="section-kicker">04 / BEFORE WE BEGIN</p><h2 id="terms-title">계약 전에 함께 확인합니다.</h2><p>아래 항목은 아직 확정되지 않았습니다. 상담을 거쳐 견적서·계약서에서 합의하며, 확정 전 보장되는 조건이 아닙니다.</p>
        <dl className="pricing-terms">{terms.map(([name, text]) => <div key={name}><dt>{name}</dt><dd>{text}</dd></div>)}</dl><p>VAT·세금계산서 처리는 사업자 과세유형에 따라 확인합니다. 이 페이지는 가격과 서비스 이용 안내이며, 개별 계약서나 개인정보처리방침을 대체하지 않습니다.</p>
      </div><div className="baseboard" /></section>
      <section className="room room-final" aria-labelledby="pricing-contact-title"><div className="final-plaque"><p className="section-kicker">LET’S DEFINE YOUR SCOPE</p><h2 id="pricing-contact-title">필요한 범위부터 이야기해 주세요.</h2><p>현재 상황, 필요한 페이지나 업무, 준비된 자료와 희망 일정을 알려주세요. 정찰제 적용 여부와 별도 검토가 필요한 범위를 안내합니다.</p><Link className="cta cta-primary" href="/contact/">프로젝트 상담하기 →</Link></div><div className="baseboard" /></section>
    </main>
    <footer className="end-label"><Link href="/">designYEH — HOME</Link><Link href="/pricing/" aria-current="page">가격 및 이용 안내</Link><Link href="/contact/">Contact</Link></footer>
  </>
}
