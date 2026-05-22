"use client"

// The gallery home IS the portfolio now. Keep this route as a redirect so any
// existing links / bookmarks land on the works wall.
import { useEffect } from "react"

export default function PortfolioRedirect() {
  useEffect(() => {
    window.location.replace("/#room-02")
  }, [])
  return null
}
