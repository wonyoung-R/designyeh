"use client"

import Link from "next/link"
import { useEffect } from "react"
import { asset } from "@/lib/assets"

export default function AboutRedirect() {
  useEffect(() => {
    window.location.replace(asset("/#approach"))
  }, [])
  return <main className="room redirect-page"><p className="section-kicker">DESIGNYEH STUDIO</p><h1>스튜디오의 작업 방식</h1><p>사업을 이해하고 홈페이지를 만드는 과정을 소개합니다.</p><Link className="cta cta-primary" href="/#approach">작업 방식 살펴보기 →</Link><Link className="service-link" href="/">홈으로 돌아가기</Link></main>
}
