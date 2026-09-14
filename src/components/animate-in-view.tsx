import type { ReactNode } from "react"

type AnimationType = "fadeIn" | "slideUp" | "stagger" | "scaleUp"

interface AnimateInViewProps {
  children: ReactNode
  animation?: AnimationType
  duration?: number
  delay?: number
  className?: string
  threshold?: number
}

// Compatibility wrapper: content is present immediately, including without JS.
// Restrained interactive transitions are handled by CSS and reduced-motion rules.
export default function AnimateInView({ children, className }: AnimateInViewProps) {
  return <div className={className}>{children}</div>
}

export function AnimateItem({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}
