import type { Metadata } from "next";

// /about is a client-side redirect stub to /#room-05 — keep it out of the index.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function AboutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
