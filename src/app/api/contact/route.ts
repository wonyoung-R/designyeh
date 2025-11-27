import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json(); // 폼 데이터 전체 받기 { name, contact, type, message }

    // Make.com 웹훅 URL (환경 변수에서 가져오거나 기본값 사용)
    const webhookUrl = process.env.MAKE_WEBHOOK_URL || 'https://hook.us1.make.com/4ybr1nqnijslbt2y4fi3wth8ly2ni88n';

    // 웹훅으로 데이터 전송
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      return NextResponse.json({ message: '문의가 성공적으로 접수되었습니다.' }, { status: 200 });
    } else {
      console.error('Webhook error:', await response.text());
      return NextResponse.json({ message: '문의 접수에 실패했습니다.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
