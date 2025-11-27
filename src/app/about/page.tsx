import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import AnimateInView, { AnimateItem } from "@/components/animate-in-view"

export default function AboutPage() {
  return (
    <div className="container px-4 pt-8 pb-16 md:px-6">
      <AnimateInView animation="fadeIn" duration={0.7}>
        <div className="space-y-4 text-center mb-16 mt-8">
          <h1 className="font-poppins text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
            소개
          </h1>
          <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-2xl mx-auto">
            designYEH는 창의적인 디자인과 혁신적인 기술로 <br />고객의 디지털 경험을 향상시키는 웹 에이전시입니다.
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
                designYEH는 2024년에 설립된 이후, 다양한 산업 분야의 클라이언트들과 협력하여 <br />
                혁신적인 디지털 솔루션을 제공해왔습니다.<br />
                단순한 웹사이트 제작을 넘어, 고객의 비즈니스 목표를 이해하고 이를 달성하기 위해 노력해왔습니다.<br />
                AI 시대에 고객님들과 전략적 파트너가 되고자 합니다.
              </p>

              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                우리의 철학은 단순함과 창의성의 조화입니다. <br />복잡한 문제를 단순하고 우아한 솔루션으로 해결하며, <br />
                항상 최신 트렌드와 기술을 연구하여 고객에게 최상의 결과물을 제공합니다.
              </p>
            </div>
          </section>
        </AnimateInView>

        {/* 팀 소개 섹션 */}
        <AnimateInView animation="slideUp" delay={0.2}>
          <section>
            <h2 className="font-poppins text-3xl font-bold text-center mb-8">
              designYEH를 소개합니다
            </h2>

            <AnimateInView animation="stagger" delay={0.1}>
              <div className="grid gap-8 md:grid-cols-1 max-w-2xl mx-auto">
                <AnimateItem>
                  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl bg-white dark:bg-slate-900">
                    <div className="relative h-80 w-full">
                      <Image
                        src="/images/profile.jpg"
                        alt="designYEH 프로필"
                        fill
                        className="object-cover grayscale brightness-125 contrast-[0.85] opacity-90"
                      />
                    </div>
                    <CardContent className="p-8 space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold">designYEH</h3>
                        <p className="text-primary font-medium mt-1">Creative Director YEH</p>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        10년 이상의 업무자동화, 웹개발 경험을 가진 designYEH는 창의적인 감각으로 비즈니스를 이끌고 있습니다.<br />
                        designYEH는 주도적이고 혁신적 접근 방식으로 수많은 프로젝트의 성공을 이끌어냈습니다. <br />
                        사용자 경험에 중점을 둔 디자인으로, 심미적으로 아름답고, 다양한 디자인에 도전적인 시도를 하고 있습니다.
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
                        반응형 웹사이트부터 복잡한 웹 애플리케이션까지, 고객의 요구에 맞는 맞춤형 웹 솔루션을
                        제공합니다. 최신 기술과 디자인 트렌드를 활용하여 사용자 경험을 극대화합니다.
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
                        브랜드의 가치와 비전을 시각적으로 표현하는 로고와 브랜드 아이덴티티를 디자인합니다. 고객의
                        브랜드가 경쟁에서 돋보이도록 독특하고 기억에 남는 디자인을 제공합니다.
                      </p>
                    </CardContent>
                  </Card>
                </AnimateItem>

                <AnimateItem>
                  <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-xl h-full">
                    <div className="h-1 bg-gradient-to-r from-primary to-purple-600"></div>
                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-xl font-bold">디지털 마케팅 & SEO</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        웹사이트 트래픽을 증가시키고 전환율을 높이기 위한 종합적인 디지털 마케팅 전략을 수립합니다. 검색
                        엔진 최적화(SEO)를 통해 고객의 온라인 가시성을 향상시킵니다.
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
