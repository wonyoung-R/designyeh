"use client"

// The gallery home IS the portfolio now. Keep this route as a redirect so any
// existing links / bookmarks land on the works wall. useRouter respects basePath.
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PortfolioRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/#room-02")
  }, [router])
  return null
}
