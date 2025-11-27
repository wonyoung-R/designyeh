"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AnimateInView from "@/components/animate-in-view"

export default function ContactPage() {
  return (
    <div className="container px-4 pt-8 pb-16 md:px-6">
      <AnimateInView animation="fadeIn" duration={0.7}>
        <div className="space-y-4 text-center mb-12 mt-8">
          <h1 className="font-poppins text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-gray-500 to-black dark:from-gray-400 dark:to-white text-transparent bg-clip-text">
            Contact
          </h1>
          <p className="text-muted-foreground md:text-xl/relaxed max-w-2xl mx-auto">
            프로젝트 및 견적 문의를 남겨주세요.
          </p>
        </div>
      </AnimateInView>

      <AnimateInView animation="slideUp" delay={0.2}>
        <div className="max-w-2xl mx-auto">
          <Card className="border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-950">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">이름</Label>
                <Input 
                  id="name" 
                  placeholder="홍길동" 
                  className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact" className="text-base">연락처 (이메일 또는 전화번호)</Label>
                <Input 
                  id="contact" 
                  placeholder="010-1234-5678" 
                  className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-base">문의 유형</Label>
                <Select>
                  <SelectTrigger id="type" className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <SelectValue placeholder="문의 유형을 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">웹사이트 제작</SelectItem>
                    <SelectItem value="branding">로고/브랜딩</SelectItem>
                    <SelectItem value="marketing">마케팅/SEO</SelectItem>
                    <SelectItem value="other">기타 문의</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-base">메시지</Label>
                <Textarea 
                  id="message" 
                  placeholder="문의 내용을 자유롭게 작성해주세요." 
                  className="min-h-[150px] resize-none bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-4"
                />
              </div>

              <Button className="w-full h-12 text-base font-medium mt-4" size="lg">
                문의하기
              </Button>
            </CardContent>
          </Card>
        </div>
      </AnimateInView>
    </div>
  )
}
