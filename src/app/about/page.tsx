import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import AnimateInView, { AnimateItem } from "@/components/animate-in-view"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 pt-8 pb-16 md:px-6">
      <AnimateInView animation="fadeIn" duration={0.7}>
        <div className="space-y-4 text-center mb-16 mt-8">
          <h1 className="font-poppins text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-slate-800 dark:text-slate-100">
            about
          </h1>
          <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-2xl mx-auto">
            DesignYEH는 미학과 기술의 경계에서 <br />가장 인간적인 디지털 경험을 창조합니다.
          </p>
        </div>
      </AnimateInView>

      <div className="grid gap-12">
        {/* 회사 소개 섹션 */}
        <AnimateInView animation="slideUp" delay={0.1}>
          <section className="relative overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-900 p-8 md:p-12 border border-slate-100 dark:border-slate-800">
            <div className="relative max-w-3xl mx-auto text-center space-y-6">
              <h2 className="font-poppins font-bold text-3xl md:text-4xl text-slate-900 dark:text-slate-100">우리의 이야기</h2>

              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                "가장 아름다운 기술은 사람을 향한다."<br />
                우리는 2024년, 차가운 코드 속에 사람의 온기를 담기 위해 시작되었습니다.
              </p>

              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                DesignYEH는 Make, n8n과 같은 최첨단 자동화 도구를 통해 당신을 단순 반복 업무로부터 해방시킵니다.<br />
                하지만 우리는 효율성만을 쫓지 않습니다. 우리가 빚어내는 모든 결과물에는<br />
                사람의 향기와 감성이 깊이 배어 있습니다.
              </p>

              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                기술이 발전할수록 더욱 중요해지는 것은 '인간다움'입니다.<br />
                DesignYEH는 AI라는 강력한 도구를, 미학이라는 언어로 번역하여<br />
                당신의 비즈니스를 하나의 예술 작품으로 만들어 드립니다.
              </p>
            </div>
          </section>
        </AnimateInView>

        {/* 팀 소개 섹션 */}
        <AnimateInView animation="slideUp" delay={0.2}>
          <section>
            <h2 className="font-poppins text-3xl font-bold text-center mb-8">
              DesignYEH를 소개합니다
            </h2>

            <AnimateInView animation="stagger" delay={0.1}>
              <div className="grid gap-8 md:grid-cols-1 max-w-2xl mx-auto">
                <AnimateItem>
                  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl bg-white dark:bg-slate-900">
                    <div className="relative h-80 w-full">
                      <Image
                        src="/images/profile.jpg"
                        alt="DesignYEH 프로필"
                        fill
                        className="object-cover grayscale brightness-125 contrast-[0.85] opacity-90"
                      />
                    </div>
                    <CardContent className="p-8 space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold">DesignYEH</h3>
                        <p className="text-primary font-medium mt-1">Creative Director YEH</p>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        "아름다움을 추구하는 개발자"<br />
                        10년 이상의 경험을 가진 Creative Director YEH는 단순한 개발자가 아닙니다.<br />
                        AI를 도구 삼아 최대치의 미학적 결과물을 끌어내는 디지털 아티스트입니다.<br />
                        기술적 완벽함은 기본, 그 위에 감성적인 터치를 더해 사용자의 마음을 움직이는 경험을 설계합니다.
                      </p>
                    </CardContent>
                  </Card>
                </AnimateItem>
              </div>
            </AnimateInView>
          </section>
        </AnimateInView>

        {/* 서비스 소개 섹션 */}
        <AnimateInView animation="slideUp" delay={0.3}>
          <section>
            <h2 className="font-poppins text-3xl font-bold text-center mb-8">
              우리의 서비스
            </h2>

            <AnimateInView animation="stagger" delay={0.1}>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnimateItem>
                  <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-xl h-full">
                    <div className="h-1 bg-gradient-to-r from-primary to-purple-600"></div>
                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-xl font-bold">웹사이트 디자인 & 개발</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        단순한 정보 전달을 넘어, 브랜드의 철학을 담아내는 웹사이트를 제작합니다.
                        최신 AI 기술과 감각적인 디자인을 결합하여, 사용자에게 깊은 울림을 주는 디지털 경험을 제공합니다.
                      </p>
                    </CardContent>
                  </Card>
                </AnimateItem>

                <AnimateItem>
                  <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-xl h-full">
                    <div className="h-1 bg-gradient-to-r from-primary to-purple-600"></div>
                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-xl font-bold">
                        브랜드 아이덴티티 & 로고
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        브랜드의 본질을 시각적 언어로 번역합니다.
                        당신만의 고유한 이야기가 담긴 로고와 아이덴티티 디자인으로,
                        고객의 마음속에 오래도록 기억될 수 있는 이미지를 구축합니다.
                      </p>
                    </CardContent>
                  </Card>
                </AnimateItem>

                <AnimateItem>
                  <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-xl h-full">
                    <div className="h-1 bg-gradient-to-r from-primary to-purple-600"></div>
                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-xl font-bold">자동화 & 컨설팅</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        Make, n8n 등을 활용한 업무 자동화로 반복적인 일에서 당신을 해방시켜 드립니다.
                        효율적인 시스템 구축을 통해 더 가치 있고 창의적인 일에 집중할 수 있도록 돕습니다.
                      </p>
                    </CardContent>
                  </Card>
                </AnimateItem>
              </div>
            </AnimateInView>
          </section>
        </AnimateInView>
      </div>
    </div>
  )
}
