"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { FabWax } from "@/components/fab-wax"
import { asset } from "@/lib/assets"
import {
  type Work,
  toWork,
  frameLayout,
  FALLBACK_WORKS,
} from "@/lib/works"

/* ── A single framed work, hung on the salon wall ───────────────────────── */
function Frame({ work, index }: { work: Work; index: number }) {
  const { artW, artH, frameClass, offsetClass } = frameLayout(index)
  const ref = useRef<HTMLAnchorElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <a
      ref={ref}
      className={`frame-link ${offsetClass} ${inView ? "in-view" : ""}`}
      href={work.url}
      target="_blank"
      rel="noopener noreferrer"
      style={
        {
          "--art-w": `${artW}px`,
          "--art-h": `${artH}px`,
          transitionDelay: `${(index % 6) * 60}ms`,
        } as React.CSSProperties
      }
    >
      <article className={`frame ${frameClass}`}>
        <div className="mat snug">
          <div className="art">
            {/* next/image with unoptimized doesn't prefix basePath; asset() does. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="art-img"
              src={asset(work.image)}
              alt={`${work.title} 웹사이트 미리보기`}
              loading="lazy"
            />
          </div>
        </div>
      </article>
      <div className="label">
        <div className="lbl-row">
          <span className="lbl-no">No. {String(index + 1).padStart(3, "0")}</span>
          <span className="lbl-year">{work.year}</span>
        </div>
        <h3 className="lbl-title">{work.title}</h3>
        <p className="lbl-meta">{work.meta}</p>
        <p className="lbl-url">{work.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}  ↗</p>
      </div>
    </a>
  )
}

export default function GalleryHome() {
  const [works, setWorks] = useState<Work[]>(FALLBACK_WORKS)

  // Live data: replace fallback when the Supabase table has rows.
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        // Order by id only (always present); sort by sort_order client-side if
        // the column exists. Keeps us resilient to schema variations.
        const { data, error } = await supabase
          .from("portfolios")
          .select("*")
          .order("id", { ascending: true })
        if (!alive) return
        if (!error && data && data.length > 0) {
          const rows = [...(data as Record<string, unknown>[])].sort(
            (a, b) =>
              (Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)) ||
              (Number(a.id ?? 0) - Number(b.id ?? 0))
          )
          setWorks(rows.map((row, i) => toWork(row, i)))
        }
      } catch {
        /* keep fallback */
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  return (
    <>
      {/* ─── DOCENT BAR ─────────────────────────────────────────────── */}
      <header className="docent">
        <div className="docent-l">
          <span className="dot" />
          <span className="docent-room">ROOM 01 — ENTRY</span>
        </div>
        <a className="wordmark" href="#room-01">
          designyeh<span className="wm-period">.</span>
        </a>
        <nav className="docent-r">
          <a href="#room-02">Works</a>
          <a href="#room-05">Studio</a>
          <Link href="/contact">Contact</Link>
          <span className="docent-meta">STUDIO — SEOUL</span>
        </nav>
      </header>

      {/* ═══ ROOM 01 — ENTRY WALL ════════════════════════════════════ */}
      <section id="room-01" className="room room-entry">
        <div className="room-tag">
          <span className="tag-no">01</span>
          <span className="tag-name">ENTRY HALL</span>
          <span className="tag-meta">— a permanent collection of finished work</span>
        </div>

        <div className="entry-wall">
          <h1 className="exhibition-statement">
            <span className="es-line">This must be</span>
            <span className="es-line es-italic">the&nbsp;studio.</span>
          </h1>

          <div className="entry-plate">
            <p className="plate-kicker">designyeh — selected works</p>
            <p className="plate-body">
              디자인예는 브랜드의 첫 인상을 짓는 작은 스튜디오입니다. 홈페이지, 로고, 인쇄물 — 각각의 작업을
              액자에 걸어 두었습니다. 편하게 둘러보시고, 마음에 드는 작품이 있다면 그 액자를 눌러보세요.
            </p>
            <p className="plate-foot">↓&nbsp;&nbsp;scroll to enter&nbsp;&nbsp;·&nbsp;&nbsp;벽을 따라 천천히</p>
          </div>
        </div>

        <div className="baseboard" />
      </section>

      {/* ═══ ROOM 02 — WEBSITES (salon-hung, data-driven) ════════════ */}
      <section id="room-02" className="room room-websites">
        <div className="room-tag">
          <span className="tag-no">02</span>
          <span className="tag-name">웹사이트</span>
          <span className="tag-meta">— homepages, hung on the wall</span>
        </div>

        <div className="salon-wall salon-grid">
          {works.map((work, i) => (
            <Frame key={work.id} work={work} index={i} />
          ))}
        </div>

        <div className="baseboard" />
      </section>

      {/* ═══ ROOM 03 — VINYL STATEMENT (interlude) ═══════════════════ */}
      <section className="room room-vinyl">
        <div className="room-tag">
          <span className="tag-no">03</span>
          <span className="tag-name">INTERLUDE</span>
          <span className="tag-meta">— wall vinyl, matte black lettering</span>
        </div>

        <div className="vinyl-wall">
          <p className="vinyl-line">DESIGN&nbsp;WELL,</p>
          <p className="vinyl-line">SHIP&nbsp;WELL,</p>
          <p className="vinyl-line vinyl-and">and</p>
          <p className="vinyl-line">LIVE&nbsp;A&nbsp;LITTLE.</p>
          <p className="vinyl-cite">— designyeh, studio motto, taped to the back wall</p>
        </div>

        <div className="baseboard" />
      </section>

      {/* ═══ ROOM 04 — STUDIO PLAQUE ═════════════════════════════════ */}
      <section id="room-05" className="room room-studio">
        <div className="room-tag">
          <span className="tag-no">04</span>
          <span className="tag-name">STUDIO</span>
          <span className="tag-meta">— curator&apos;s note, mounted on the wall</span>
        </div>

        <div className="studio-wall">
          <div className="studio-plaque">
            <p className="plq-kicker">DESIGNYEH</p>
            <h2 className="plq-title">
              A small studio.<br />
              <em>Big enough to care, small enough to answer.</em>
            </h2>
            <div className="plq-grid">
              <div>
                <p className="plq-h">Based in</p>
                <p>Seoul, Korea</p>
              </div>
              <div>
                <p className="plq-h">Practice</p>
                <p>Websites · Identity · Automation</p>
              </div>
              <div>
                <p className="plq-h">Clients</p>
                <p>
                  검진센터 · 인테리어
                  <br />
                  스포츠 · 학원 SaaS
                </p>
              </div>
              <div>
                <p className="plq-h">Inquiries</p>
                <p>
                  by appointment
                  <br />
                  grizrider@gmail.com
                </p>
              </div>
            </div>
            <p className="plq-foot">— 누르세요&nbsp;&nbsp;·&nbsp;&nbsp;press the wax seal below for inquiries.</p>
          </div>
        </div>

        <div className="baseboard" />
      </section>

      {/* ═══ END LABEL ═══════════════════════════════════════════════ */}
      <footer className="end-label">
        <span>END&nbsp;OF&nbsp;EXHIBIT</span>
        <span>designyeh © {new Date().getFullYear()}</span>
        <a href="mailto:grizrider@gmail.com">grizrider@gmail.com</a>
      </footer>

      {/* ═══ FLOATING CONTACT — WAX SEAL ═════════════════════════════ */}
      <FabWax />
    </>
  )
}
