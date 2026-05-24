"use client"

import { useState } from "react"
import Link from "next/link"

// Static export has no server runtime, so the form posts directly to the
// Make.com webhook from the client. This is a public ingest webhook (no secret).
const WEBHOOK_URL =
  process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL ||
  "https://hook.us1.make.com/4ybr1nqnijslbt2y4fi3wth8ly2ni88n"

type Status = "idle" | "sending" | "ok" | "err"

export default function ContactPage() {
  const [status, setStatus] = useState<Status>("idle")
  const [form, setForm] = useState({ name: "", contact: "", type: "", message: "" })

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target
    setForm((p) => ({ ...p, [id]: value }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.contact || !form.type || !form.message) {
      setStatus("err")
      return
    }
    setStatus("sending")
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus("ok")
        setForm({ name: "", contact: "", type: "", message: "" })
      } else {
        setStatus("err")
      }
    } catch {
      setStatus("err")
    }
  }

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
          <span className="tag-meta">— leave a note at the front desk</span>
        </div>

        <div className="contact-wall">
          <div className="contact-plaque">
            <h1 className="contact-title">Say hello.</h1>
            <p className="contact-lead">
              브랜드의 첫 인상이 필요하시다면 편하게 말을 걸어주세요. 홈페이지·로고·인쇄물 무엇이든 좋습니다.
              남겨주시면 하루 안에 회신드립니다.
            </p>

            <form onSubmit={onSubmit}>
              <div className="field">
                <label className="field-label" htmlFor="name">이름 / 브랜드</label>
                <input
                  id="name"
                  className="field-input"
                  placeholder="홍길동 / 브랜드명"
                  value={form.name}
                  onChange={onChange}
                />
              </div>

              <div className="field">
                <label className="field-label" htmlFor="contact">연락처 (이메일 또는 전화)</label>
                <input
                  id="contact"
                  className="field-input"
                  placeholder="hello@example.com / 010-1234-5678"
                  value={form.contact}
                  onChange={onChange}
                />
              </div>

              <div className="field">
                <label className="field-label" htmlFor="type">문의 유형</label>
                <select id="type" className="field-select" value={form.type} onChange={onChange}>
                  <option value="" disabled>
                    문의 유형을 선택해주세요
                  </option>
                  <option value="website">홈페이지 제작</option>
                  <option value="branding">로고 · 브랜딩</option>
                  <option value="automation">업무 자동화</option>
                  <option value="other">기타 문의</option>
                </select>
              </div>

              <div className="field">
                <label className="field-label" htmlFor="message">메시지</label>
                <textarea
                  id="message"
                  className="field-textarea"
                  placeholder="만들고 싶은 것, 일정, 예산 — 편하게 적어주세요."
                  value={form.message}
                  onChange={onChange}
                />
              </div>

              <button type="submit" className="contact-submit" disabled={status === "sending"}>
                {status === "sending" ? "보내는 중…" : "문의 보내기 →"}
              </button>

              {status === "ok" && (
                <p className="contact-note ok">접수되었습니다. 하루 안에 회신드릴게요. 감사합니다.</p>
              )}
              {status === "err" && (
                <p className="contact-note err">
                  모든 항목을 채워주세요. 계속 안 되면 grizrider@gmail.com 로 보내주셔도 됩니다.
                </p>
              )}
            </form>

            <Link href="/" className="contact-back">← 전시로 돌아가기</Link>
          </div>
        </div>

        <div className="baseboard" />
      </section>
    </>
  )
}
