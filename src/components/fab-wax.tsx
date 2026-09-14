import Link from "next/link"

// Keep the existing export for callers; the contact pill occupies its own row.
export function FabWax() {
  return <aside className="contact-rail" aria-label="스튜디오 문의"><Link href="/contact" className="fab contact-pill">제작 문의 <span aria-hidden="true">↗</span></Link></aside>
}
