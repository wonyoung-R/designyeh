"use client"

import { motion, useInView, Variants } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

type AnimationType = "fadeIn" | "slideUp" | "stagger" | "scaleUp"

interface AnimateInViewProps {
  children: React.ReactNode
  animation?: AnimationType
  duration?: number
  delay?: number
  className?: string
  threshold?: number
}

export default function AnimateInView({
  children,
  animation = "fadeIn",
  duration = 0.5,
  delay = 0,
  className,
  threshold = 0.1,
}: AnimateInViewProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px", amount: threshold })

  const variants: Record<string, Variants> = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { duration, delay, ease: "easeOut" }
      },
    },
    slideUp: {
      hidden: { opacity: 0, y: 30 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration, delay, ease: "easeOut" }
      },
    },
    scaleUp: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration, delay, ease: "easeOut" }
      }
    },
    stagger: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: delay,
        },
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[animation]}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

export function AnimateItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
  }

  return (
    <motion.div variants={itemVariants} className={cn(className)}>
      {children}
    </motion.div>
  )
}

