import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import AnimateInView from "@/components/animate-in-view"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 text-center bg-gradient-to-b from-background to-slate-50 dark:to-slate-950">
      <AnimateInView animation="scaleUp" duration={0.8}>
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="inline-block rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-sm text-slate-600 dark:text-slate-300 mb-4">
            Digital Creative Agency
          </div>
          
          <h1 className="font-poppins text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
            design<span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">YEH</span>
          </h1>
          
          <p className="mx-auto max-w-[700px] text-slate-500 md:text-xl dark:text-slate-400 leading-relaxed">
            단순함과 창의성의 조화로 당신의 비즈니스를 디자인합니다.<br className="hidden md:block" />
            웹사이트 제작부터 브랜딩, 마케팅까지 All-in-One 솔루션을 경험하세요.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Button asChild size="lg" className="h-12 px-8 text-base font-medium rounded-full shadow-lg shadow-primary/20">
              <Link href="/portfolio">
                포트폴리오 보기 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base font-medium rounded-full">
              <Link href="/about">
                designYEH 더 알아보기
              </Link>
            </Button>
          </div>
        </div>
      </AnimateInView>
      
      <AnimateInView animation="fadeIn" delay={0.5} className="absolute bottom-8 left-0 w-full text-center animate-bounce text-slate-400">
        <span className="text-xs">Scroll to explore</span>
      </AnimateInView>
    </div>
  );
}
