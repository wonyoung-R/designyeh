import Link from "next/link"

/**
 * Wax Seal floating contact button.
 * Embossed dark-red wax coin with a "DY" monogram, links to /contact.
 * Ported from the Claude Design handoff (fab.jsx → wax_seal variant).
 */
export function FabWax() {
  return (
    <Link href="/contact" className="fab fab-wax" aria-label="문의하기 — designyeh studio">
      <span className="fab-wax-drip" />
      <span className="fab-wax-coin">
        <span className="fwx-ring" />
        <span className="fwx-monogram">DY</span>
        <span className="fwx-arc">— design · 예 —</span>
      </span>
      <span className="fab-tip">studio inquiries →</span>
    </Link>
  )
}
