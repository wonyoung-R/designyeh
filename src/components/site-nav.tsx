"use client"

import Link from "next/link"

const NAV_ITEMS = [
  ["Works", "/#works"],
  ["Services", "/#services"],
  ["Approach", "/#approach"],
  ["Process", "/#process"],
  ["FAQ", "/#faq"],
  ["Contact", "/contact/"],
  ["Pricing", "/pricing/"],
] as const

export function SiteNav({ currentPage }: { currentPage?: "/contact/" | "/pricing/" }) {
  const links = NAV_ITEMS.map(([label, href]) => (
    <Link key={href} href={href} className={label === "Contact" ? "nav-contact" : undefined} aria-current={href === currentPage ? "page" : undefined}>
      {label}
    </Link>
  ))

  return (
    <header className="docent agency-nav">
      <Link className="wordmark" href="/" aria-label="designYEH 홈">designyeh<span className="wm-period">.</span></Link>
      <nav className="nav-primary" aria-label="주요 메뉴">{links}</nav>
      <details className="nav-mobile">
        <summary>메뉴 <span aria-hidden="true">＋</span></summary>
        <nav aria-label="모바일 주요 메뉴" onClick={event => {
          if (event.target instanceof Element && event.target.closest("a")) {
            const menu = event.currentTarget.closest("details")
            if (menu) menu.open = false
          }
        }}>{links}</nav>
      </details>
    </header>
  )
}
