"use client"

// About is folded into ROOM 04 (Studio) on the gallery home. Redirect there.
// useRouter respects basePath (works on subpath + custom domain).
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AboutRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/#room-05")
  }, [router])
  return null
}
