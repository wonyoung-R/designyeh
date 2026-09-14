"use client"

import Link from "next/link"
import { useEffect } from "react"
import { asset } from "@/lib/assets"

export default function PortfolioRedirect() {
  useEffect(() => {
    window.location.replace(asset("/#works"))
  }, [])
  return <main className="room redirect-page"><p className="section-kicker">SELECTED WORK</p><h1>designYEH 제작 사례</h1><p>업종과 목적에 맞춰 만든 기존 웹 작업을 살펴보세요.</p><Link className="cta cta-primary" href="/#works">제작 사례 보기 →</Link><Link className="service-link" href="/">홈으로 돌아가기</Link></main>
}
