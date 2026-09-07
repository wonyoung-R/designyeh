import Link from "next/link"
import type { Metadata } from "next"

const EMAIL = "creativebyyeh@gmail.com"
const SUBJECT = "designYEH 프로젝트 상담"
const BODY = `안녕하세요, designYEH에 프로젝트 상담을 요청합니다.

— 관심 서비스 (웹사이트 / 아이덴티티 / 운영 자동화):
— 현재 상황:
— 목표와 대상 고객:
— 필요한 화면·기능 또는 줄이고 싶은 반복 업무:
— 준비된 콘텐츠·참고 자료:
— 희망 일정과 예산 범위:
— 연동 서비스·취급 데이터 (해당 시):
— 의사결정자·연락처:`
const KAKAO_OPEN_CHAT = "https://open.kakao.com/me/designyeh"

export const metadata: Metadata = {
  title: "프로젝트 상담",
  description: "웹사이트, 아이덴티티, 운영 자동화 프로젝트를 designYEH와 상담하세요. 현재 상황과 목표, 필요한 기능과 운영 범위를 함께 확인합니다.",
  openGraph: { type: "website", locale: "ko_KR", url: "https://dsgnyeh.art/contact/", title: "프로젝트 상담 · designYEH", description: "웹사이트, 아이덴티티, 운영 자동화의 목표와 제작 범위를 상담합니다.", images: ["/images/og.jpg"] },
  twitter: { card: "summary_large_image", title: "프로젝트 상담 · designYEH", description: "웹사이트, 아이덴티티, 운영 자동화의 목표와 제작 범위를 상담합니다.", images: ["/images/og.jpg"] },
  alternates: { canonical: "/contact/" },
}

export default function ContactPage() {
  const mailtoHref = `mailto:${EMAIL}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`
  return (
    <>
      <header className="docent contact-nav">
        <Link className="wordmark" href="/">designyeh<span className="wm-period">.</span></Link>
        <nav className="nav-primary" aria-label="문의 페이지 메뉴">
          <Link href="/#services">Services</Link><Link href="/#works">Works</Link><Link href="/#process">Process</Link><Link href="/#faq">FAQ</Link>
        </nav>
        <Link className="contact-home" href="/">전시로 돌아가기</Link>
      </header>
      <main>
        <section className="room room-studio contact-room" aria-labelledby="contact-title">
          <div className="room-tag"><span className="tag-no">—</span><span className="tag-name">CONTACT</span><span className="tag-meta">— project inquiries</span></div>
          <div className="contact-layout">
            <div className="contact-intro">
              <p className="section-kicker">START WITH A NOTE</p>
              <h1 id="contact-title" className="contact-title">프로젝트의 <em>다음 장면.</em></h1>
              <p>웹사이트, 아이덴티티, 운영 자동화 중 필요한 일을 알려주세요. 아직 범위가 정해지지 않았다면 현재의 문제부터 함께 살펴봅니다.</p>
              <div className="contact-service-list" aria-label="상담 가능한 서비스">
                <div><span>01</span><strong><Link className="service-link" href="/homepage-production/">웹사이트</Link></strong><p>소개·브랜드·서비스·문의 웹</p></div>
                <div><span>02</span><strong><Link className="service-link" href="/brand-identity/">아이덴티티</Link></strong><p>로고·시각 체계·웹 적용</p></div>
                <div><span>03</span><strong><Link className="service-link" href="/operations-automation/">운영 자동화</Link></strong><p>반복 업무 진단·AI/SaaS/RPA 흐름</p></div>
              </div>
            </div>
            <div className="contact-plaque">
              <h2>상담에 필요한 정보</h2>
              <p className="contact-lead">아는 만큼만 적어도 괜찮습니다. 아래 정보가 있으면 프로젝트의 적합성과 범위를 더 정확히 확인할 수 있습니다.</p>
              <ul className="prep-list">
                <li><strong>현재 상황</strong><span>기존 사이트·브랜드·업무 방식과 해결하려는 문제</span></li>
                <li><strong>목표</strong><span>대상 고객과 만들고 싶은 변화</span></li>
                <li><strong>필요한 기능</strong><span>필요 화면, 문의 방식, 연동 또는 반복 업무</span></li>
                <li><strong>프로젝트 조건</strong><span>일정·예산 범위, 준비된 콘텐츠, 의사결정자</span></li>
                <li><strong>운영 조건</strong><span>데이터·개인정보, 승인 담당, 오류 시 대체 절차</span></li>
              </ul>
              <div className="contact-email-block"><p className="contact-email-label">EMAIL</p><a className="contact-email" href={mailtoHref}>{EMAIL}</a></div>
              <a className="contact-submit" href={mailtoHref}>준비 항목과 함께 이메일 보내기 →</a>
              <div className="contact-or"><span>또는</span></div>
              <a className="contact-kakao" href={KAKAO_OPEN_CHAT} target="_blank" rel="noopener noreferrer">
                <span className="kakao-icon" aria-hidden="true">💬</span><span className="kakao-text"><span className="kakao-title">카카오톡 오픈채팅으로 대화하기</span><span className="kakao-sub">designYEH · 카카오톡에서 열립니다</span></span><span className="kakao-arrow" aria-hidden="true">↗</span>
              </a>
              <p className="contact-hint">상담 후 포함·제외 범위, 고객 제공 자료, 외부 서비스 비용, 개인정보와 권한, 승인·인계·유지관리 기준을 확인합니다.</p>
            </div>
          </div>
          <div className="baseboard" />
        </section>
      </main>
      <footer className="end-label"><span>FRONT DESK</span><Link href="/">designYEH — HOME</Link><a href={`mailto:${EMAIL}`}>{EMAIL}</a></footer>
    </>
  )
}
