"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Contact", href: "/contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-slate-200 dark:border-slate-800 shadow-sm"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center">
        {/* 로고 영역 - 왼쪽 정렬을 유지하되 flex-grow를 주지 않음 */}
        <div className="flex-shrink-0 mr-4">
          <Link href="/" className="font-bold text-2xl font-poppins tracking-tighter" onClick={() => setIsOpen(false)}>
            Design<span className="text-primary">YEH</span>
          </Link>
        </div>

        {/* Desktop Nav - 중앙 정렬을 위해 flex-1로 공간 차지하고 justify-center */}
        <nav className="hidden md:flex items-center justify-center flex-1 gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative group",
                pathname === item.href
                  ? "text-primary font-bold"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
              {pathname === item.href && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* 모바일 토글 버튼과 빈 공간 - 우측 끝으로 배치 */}
        <div className="flex-shrink-0 ml-auto md:ml-4 md:w-[140px] flex justify-end">
           {/* 모바일에서는 토글 버튼 보임 */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b shadow-lg animate-in slide-in-from-top-5">
          <div className="flex flex-col p-4 space-y-4 text-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-lg font-medium px-4 py-2 rounded-md hover:bg-muted",
                  pathname === item.href
                    ? "text-primary bg-muted/50"
                    : "text-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
