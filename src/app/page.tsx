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
        {work.note && (
          <p className="lbl-note">
            <span className="lbl-note-mark" aria-hidden="true">“</span>
            {work.note}
          </p>
        )}
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
          // Stale-schema guard: if the DB still has the old row set (e.g.
          // includes mybdr which we removed from the canonical list), don't
          // overwrite the fallback — fallback is the source of truth until
          // the SQL editor is re-run. Detect by URL presence.
          const urls = (data as Record<string, unknown>[]).map(r =>
            String((r.url ?? r.link ?? "") as string).toLowerCase()
          )
          const stale = urls.some(u => u.includes("mybdr"))
          if (stale) return // keep FALLBACK_WORKS

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
          <div className="entry-headline">
            <h1 className="exhibition-statement">
              <span className="es-line">This must be</span>
              <span className="es-line es-italic">the&nbsp;studio.</span>
            </h1>

            <p className="es-creed">
              <span className="es-creed-en">Every homepage is a work of art.</span>
              <span className="es-creed-kr">나는 홈페이지 하나하나를 작품으로 생각한다.</span>
            </p>
          </div>

          <div className="entry-plate">
            <p className="plate-kicker">designyeh — selected works</p>
            <p className="plate-body">
              designYEH는 브랜드의 첫 인상을 짓는 작은 스튜디오입니다. 홈페이지·로고·인쇄물 — 각각의 작업을
              하나의 작품으로 빚어 액자에 걸어 두었습니다. 천천히 둘러보시고, 마음에 드는 작품이 있다면
              그 액자를 눌러보세요.
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

      {/* ═══ ROOM 03 — STUDIO CREED (interlude / artist statement) ═══ */}
      <section className="room room-vinyl">
        <div className="room-tag">
          <span className="tag-no">03</span>
          <span className="tag-name">CREED</span>
          <span className="tag-meta">— studio statement, wall vinyl, south face</span>
        </div>

        <div className="vinyl-wall">
          <p className="vinyl-line">EVERY</p>
          <p className="vinyl-line">HOMEPAGE</p>
          <p className="vinyl-line vinyl-and"><em>is</em>&nbsp;a&nbsp;work</p>
          <p className="vinyl-line">OF&nbsp;ART.</p>

          <div className="vinyl-kr-block">
            <p className="vinyl-kr">나는 홈페이지 하나하나를</p>
            <p className="vinyl-kr">작품으로 생각한다.</p>
          </div>

          <p className="vinyl-cite">— designYEH, studio statement, on the south wall</p>
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
            <p className="plq-kicker">DESIGNYEH — ARTIST&apos;S NOTE</p>
            <h2 className="plq-title">
              A small studio.<br />
              <em>Big enough to care, small enough to answer.</em>
            </h2>

            <div className="plq-statement">
              <p>한 페이지의 첫 화면을 위해 며칠을 씁니다.</p>
              <p>
                클라이언트가 가져오는 건 브랜드의 이름뿐이지만, 그 이름 뒤에는 누군가 쌓아온 시간과
                다음을 향한 의지가 있습니다. 저는 그것을 읽고, 웹이라는 빈 캔버스 위에 다시 세웁니다.
              </p>
              <p>
                홈페이지는 외주가 아니라 작품이고, 작품은 결과보다 의도가 먼저입니다. 만든 사람을 만나본
                적 없는 사람도, 페이지 하나로 그 브랜드의 결을 느낄 수 있어야 합니다.
              </p>
              <p className="plq-statement-coda">그 결을 빚는 것이 designYEH의 일입니다.</p>
            </div>

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
                  creativebyyeh@gmail.com
                </p>
              </div>
            </div>

            <p className="plq-cta">
              <span className="plq-cta-kr">당신의 브랜드도 작품이 될 수 있습니다.</span>
              <span className="plq-cta-en">Your brand could be the next piece.</span>
            </p>
            <p className="plq-foot">— 누르세요&nbsp;&nbsp;·&nbsp;&nbsp;press the wax seal below for inquiries.</p>
          </div>
        </div>

        <div className="baseboard" />
      </section>

      {/* ═══ END LABEL ═══════════════════════════════════════════════ */}
      <footer className="end-label">
        <span>END&nbsp;OF&nbsp;EXHIBIT</span>
        <span>designyeh © {new Date().getFullYear()}</span>
        <a href="mailto:creativebyyeh@gmail.com">creativebyyeh@gmail.com</a>
      </footer>

      {/* ═══ FLOATING CONTACT — WAX SEAL ═════════════════════════════ */}
      <FabWax />
    </>
  )
}
