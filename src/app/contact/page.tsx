"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AnimateInView from "@/components/animate-in-view"
import { Loader2 } from "lucide-react"

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    type: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }))
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.contact || !formData.type || !formData.message) {
      alert("모든 항목을 입력해주세요.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("문의가 성공적으로 접수되었습니다!")
        setFormData({ name: "", contact: "", type: "", message: "" })
      } else {
        alert("문의 접수에 실패했습니다. 다시 시도해주세요.")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 pt-8 pb-16 md:px-6">
      <AnimateInView animation="fadeIn" duration={0.7}>
        <div className="space-y-4 text-center mb-12 mt-8">
          <h1 className="font-poppins text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-slate-800 dark:text-slate-100">
            contact
          </h1>
          <p className="text-muted-foreground md:text-xl/relaxed max-w-2xl mx-auto">
            당신의 비즈니스에 아름다운 혁신이 필요하다면, 언제든 말을 걸어주세요.
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
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact" className="text-base">연락처 (이메일 또는 전화번호)</Label>
                <Input 
                  id="contact" 
                  placeholder="010-1234-5678" 
                  className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  value={formData.contact}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-base">문의 유형</Label>
                <Select onValueChange={handleSelectChange} value={formData.type}>
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
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <Button 
                className="w-full h-12 text-base font-medium mt-4" 
                size="lg"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    전송 중...
                  </>
                ) : (
                  "문의하기"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </AnimateInView>
    </div>
  )
}
