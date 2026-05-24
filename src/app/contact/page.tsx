import Link from "next/link"
import type { Metadata } from "next"

const EMAIL = "creativebyyeh@gmail.com"
const SUBJECT = "designYEH 문의"
const BODY = "안녕하세요, designYEH에 문의드립니다.\n\n— 만들고 싶은 것:\n— 일정/예산:\n— 연락처:"

export const metadata: Metadata = {
  title: "Contact",
  description: "designYEH에 문의하기 — 이메일로 편하게 말을 걸어주세요.",
}

export default function ContactPage() {
  const mailtoHref = `mailto:${EMAIL}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`

  return (
    <>
      <header className="docent">
        <div className="docent-l">
          <span className="dot" />
          <span className="docent-room">FRONT DESK — INQUIRIES</span>
        </div>
        <Link className="wordmark" href="/">
          designyeh<span className="wm-period">.</span>
        </Link>
        <nav className="docent-r">
          <Link href="/#room-02">Works</Link>
          <Link href="/#room-05">Studio</Link>
          <span className="docent-meta">STUDIO — SEOUL</span>
        </nav>
      </header>

      <section className="room room-studio" style={{ minHeight: "calc(100vh - 56px)" }}>
        <div className="room-tag">
          <span className="tag-no">—</span>
          <span className="tag-name">CONTACT</span>
          <span className="tag-meta">— write us a note, we read every one</span>
        </div>

        <div className="contact-wall">
          <div className="contact-plaque">
            <h1 className="contact-title">Say hello.</h1>
            <p className="contact-lead">
              브랜드의 첫 인상이 필요하시다면 편하게 말을 걸어주세요. 홈페이지·로고·인쇄물 무엇이든 좋습니다.
              아래 이메일로 보내주시면 보통 하루 안에 회신드립니다.
            </p>

            <div className="contact-email-block">
              <p className="contact-email-label">EMAIL</p>
              <a className="contact-email" href={mailtoHref}>{EMAIL}</a>
            </div>

            <a className="contact-submit" href={mailtoHref}>
              이메일 보내기 →
            </a>

            <p className="contact-hint">
              만들고 싶은 것 · 일정 · 예산을 간단히 적어주시면 더 빠르게 답해드립니다.
            </p>

            <Link href="/" className="contact-back">← 전시로 돌아가기</Link>
          </div>
        </div>

        <div className="baseboard" />
      </section>
    </>
  )
}
