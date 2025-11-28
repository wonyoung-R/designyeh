"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AnimateInView, { AnimateItem } from "@/components/animate-in-view"
import { ExternalLink, Loader2, Link as LinkIcon } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { motion, useInView } from "framer-motion"

interface Project {
  id: number
  title: string
  description: string
  details: string[]
  image: string
  link: string
  tech: string[]
}

function ProjectCard({ project }: { project: Project }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" }) // 화면 중앙에 왔을 때 감지

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group" ref={ref}>
      <div 
        className="relative aspect-[4/3] w-full overflow-hidden cursor-pointer" 
        onClick={() => window.open(project.link, '_blank')}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          className={`object-cover transition-all duration-500 group-hover:scale-105 
            ${isInView ? 'grayscale-0' : 'grayscale'} 
            md:grayscale md:group-hover:grayscale-0`}
        />
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold line-clamp-1">{project.title}</CardTitle>
        
        {/* URL 표시 추가 */}
        <a 
          href={project.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-1 truncate"
        >
          <LinkIcon className="h-3 w-3" />
          {project.link.replace(/^https?:\/\//, '')}
        </a>

        <div className="flex flex-wrap gap-2 mt-3">
          {project.tech?.map((t) => (
            <Badge key={t} variant="secondary" className="text-[10px] px-2 py-0 h-5">
              {t}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4 text-sm">
        <p className="text-muted-foreground line-clamp-2">{project.description}</p>
        {project.details && project.details.length > 0 && (
          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md space-y-1">
            {project.details.map((line, i) => (
              <p key={i} className="text-slate-600 dark:text-slate-400 font-medium text-xs">{line}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from('portfolios')
          .select('*')
          .order('id', { ascending: true })

        if (error) {
          console.error('Error fetching projects:', error)
        } else {
          setProjects(data || [])
        }
      } catch (error) {
        console.error('Unexpected error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <div className="container mx-auto px-4 pt-8 pb-16 md:px-6">
      <AnimateInView animation="fadeIn" duration={0.7}>
        <div className="space-y-4 text-center mb-16 mt-8">
          <h1 className="font-poppins text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text">
            포트폴리오
          </h1>
          <p className="text-muted-foreground md:text-xl/relaxed max-w-2xl mx-auto">
            DesignYEH가 진행한 다양한 프로젝트를 소개합니다.
          </p>
        </div>
      </AnimateInView>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <AnimateInView animation="stagger" delay={0.1}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <AnimateItem key={project.id}>
                <ProjectCard project={project} />
              </AnimateItem>
            ))}
          </div>
        </AnimateInView>
      )}
    </div>
  )
}
