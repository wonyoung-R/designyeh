"use client"

// About is folded into ROOM 04 (Studio) on the gallery home. Redirect there.
import { useEffect } from "react"

export default function AboutRedirect() {
  useEffect(() => {
    window.location.replace("/#room-05")
  }, [])
  return null
}
