import Link from "next/link"
import type { Metadata } from "next"

const EMAIL = "creativebyyeh@gmail.com"
const SUBJECT = "designYEH 홈페이지 제작 문의"
const BODY = `안녕하세요, designYEH에 홈페이지 제작을 문의합니다.

— 현재 상황:
— 목표와 대상 고객:
— 필요한 페이지·기능:
— 준비된 콘텐츠·참고 자료:
— 희망 일정과 예산 범위:
— 연동 서비스·취급 데이터 (해당 시):
— 의사결정자·연락처:`
const KAKAO_OPEN_CHAT = "https://open.kakao.com/me/designyeh"

export const metadata: Metadata = {
  title: "홈페이지 제작 문의",
  description: "소규모 사업자를 위한 홈페이지 제작을 상담하세요. 사업 소개와 필요한 페이지·기능, 제작 범위를 함께 확인합니다.",
  openGraph: { type: "website", locale: "ko_KR", url: "https://dsgnyeh.art/contact/", title: "홈페이지 제작 문의 · designYEH", description: "사업 소개부터 서비스 안내, 고객 문의까지 담을 홈페이지 제작을 상담합니다.", images: ["/images/og.jpg"] },
  twitter: { card: "summary_large_image", title: "홈페이지 제작 문의 · designYEH", description: "사업 소개부터 서비스 안내, 고객 문의까지 담을 홈페이지 제작을 상담합니다.", images: ["/images/og.jpg"] },
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
              <h1 id="contact-title" className="contact-title">홈페이지 제작 <em>문의하기</em></h1>
              <p>어떤 일을 하는 곳인지, 홈페이지에 무엇을 담고 싶은지 알려주세요. 필요한 페이지와 기능을 함께 정리합니다.</p>
              <div className="contact-service-list" aria-label="홈페이지 제작 안내">
                <div><span>01</span><strong><Link className="service-link" href="/homepage-production/">홈페이지 제작</Link></strong><p>기획·디자인·제작·검수·인계</p></div>
                <div><span>02</span><strong><Link className="service-link" href="/pricing/">가격 및 수정 정책</Link></strong><p>제작 범위와 이용 조건 확인</p></div>
                <div><span>03</span><strong><Link className="service-link" href="/pricing/#maintenance">홈페이지 유지관리</Link></strong><p>기존 홈페이지도 상담 가능</p></div>
              </div>
            </div>
            <div className="contact-plaque">
              <h2>상담에 필요한 정보</h2>
              <p className="contact-lead">아는 만큼만 적어도 괜찮습니다. 아래 정보가 있으면 프로젝트의 적합성과 범위를 더 정확히 확인할 수 있습니다.</p>
              <ul className="prep-list">
                <li><strong>현재 상황</strong><span>사업 소개, 기존 사이트와 개선하고 싶은 점</span></li>
                <li><strong>목표</strong><span>대상 고객과 만들고 싶은 변화</span></li>
                <li><strong>필요한 기능</strong><span>필요한 페이지, 문의 방식과 연동 기능</span></li>
                <li><strong>프로젝트 조건</strong><span>일정·예산 범위, 준비된 콘텐츠, 의사결정자</span></li>
                <li><strong>운영 조건</strong><span>데이터·개인정보, 승인 담당, 오류 시 대체 절차</span></li>
              </ul>
              <div className="contact-email-block"><p className="contact-email-label">EMAIL</p><a className="contact-email" href={mailtoHref}>{EMAIL}</a></div>
              <a className="contact-submit" href={mailtoHref}>홈페이지 제작 문의하기 →</a>
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
