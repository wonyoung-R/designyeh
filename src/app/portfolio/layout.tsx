import type { Metadata } from "next";

// /portfolio is a client-side redirect stub to /#room-02 — keep it out of the index.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function PortfolioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
