import Link from "next/link"
import { ORIGIN, services, type ServiceContent } from "@/lib/services"
import { FALLBACK_WORKS } from "@/lib/works"
import { asset } from "@/lib/assets"
import { SiteNav } from "@/components/site-nav"

export function ServicePage({ service }: { service: ServiceContent }) {
  const url = `${ORIGIN}/${service.slug}/`
  const inquiry = service.slug === "homepage-production"
    ? { cta: "홈페이지 제작 문의하기", title: "홈페이지에 담고 싶은 내용을 알려주세요.", preparation: "사업 소개, 준비된 자료와 필요한 페이지·기능을 알려주시면 제작 범위와 인계 기준을 함께 확인합니다." }
    : service.slug === "brand-identity"
      ? { cta: "브랜드 디자인 상담하기", title: "브랜드에 필요한 접점을 알려주세요.", preparation: "브랜드 소개, 기존 로고와 사용 권한, 필요한 제작물을 알려주세요. 로고·색상·서체와 웹 적용 중 필요한 범위를 함께 확인합니다." }
      : { cta: "운영 자동화 상담하기", title: "반복해서 처리하는 업무를 알려주세요.", preparation: "사용 중인 도구, 반복되는 입력·전달 과정과 예외를 익명화한 예시로 알려주세요. AI 없이 해결하는 방법과 연동 가능 여부부터 확인합니다." }
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Service", "@id": `${url}#service`, name: service.name, description: service.definition, url, provider: { "@id": `${ORIGIN}/#agency` }, mainEntityOfPage: { "@id": `${url}#webpage` } },
      { "@type": "WebPage", "@id": `${url}#webpage`, url, name: service.title, description: service.description, inLanguage: "ko-KR", isPartOf: { "@id": `${ORIGIN}/#website` }, mainEntity: { "@id": `${url}#service` }, breadcrumb: { "@id": `${url}#breadcrumb` }, hasPart: { "@id": `${url}#faq` } },
      { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [{ "@type": "ListItem", position: 1, name: "홈", item: `${ORIGIN}/` }, { "@type": "ListItem", position: 2, name: service.name, item: url }] },
      { "@type": "FAQPage", "@id": `${url}#faq`, isPartOf: { "@id": `${url}#webpage` }, mainEntity: service.faq.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) },
    ],
  }
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <a className="skip-link" href="#service-main">본문으로 이동</a>
    <SiteNav />
    <main id="service-main" tabIndex={-1} className="service-detail">
      <section className="room room-entry" aria-labelledby="service-title">
        <div className="room-tag"><span className="tag-no">S—0{services.indexOf(service) + 1}</span><span className="tag-name">STUDIO SERVICES</span></div>
        <div className="service-sheet">
          <nav className="service-breadcrumb" aria-label="현재 위치"><Link href="/">홈</Link><span aria-hidden="true"> / </span><span aria-current="page">{service.name}</span></nav>
          <h1 id="service-title">{service.title}</h1><p className="service-definition">{service.definition}</p>
          <div className="cta-row"><Link className="cta cta-primary" href="/contact/">{inquiry.cta} →</Link><a className="cta cta-secondary" href="#service-works">관련 작업 보기 ↓</a></div>
        </div>
      </section>
      <section className="room room-problem" aria-labelledby="audience-title"><div className="service-sheet"><h2 id="audience-title">누구를 위한 서비스인가요?</h2><ul>{service.audience.map(text => <li key={text}>{text}</li>)}</ul><h2>어떤 문제를 다루나요?</h2>{service.problems.map(text => <p key={text}>{text}</p>)}</div></section>
      <section className="room room-services" aria-labelledby="scope-title"><div className="service-sheet"><h2 id="scope-title">포함하는 작업</h2><ul>{service.included.map(text => <li key={text}>{text}</li>)}</ul><h2>제외 항목과 먼저 확인할 범위</h2><ul>{service.boundaries.map(text => <li key={text}>{text}</li>)}</ul></div></section>
      <section id="service-works" className="room room-websites" aria-labelledby="related-works-title"><div className="service-sheet"><p className="section-kicker">SELECTED WORK</p><h2 id="related-works-title">관련 작업</h2><p>{service.worksContext}</p><div className="service-works">{service.works.map(id => {
        const work = FALLBACK_WORKS.find(work => work.id === id)
        if (!work) return null
        const stem = /^\/works\/(designluka|dcare|mavs|sdngazer|laf2023|gritlab|hoopnote)\.png$/.test(work.image)
          ? work.image.slice(0, -4)
          : null
        return <article key={id} className="work-card"><a className="work-image-link" href={work.url} target="_blank" rel="noopener noreferrer" aria-label={`${work.title} 사이트 방문 (새 창)`}>
          <picture style={{ display: "block", width: "100%" }}>
            {stem && <source type="image/webp" srcSet={`${asset(`${stem}-640.webp`)} 640w, ${asset(`${stem}.webp`)} 1440w`} sizes="(max-width: 700px) 100vw, 50vw" />}
            <img src={asset(work.image)} alt={`${work.title} 웹사이트 미리보기`} width={1440} height={900} loading="lazy" />
          </picture>
        </a><div className="label"><h3 className="lbl-title">{work.title}</h3><p className="lbl-meta">{work.meta}</p><a className="service-link" href={work.url} target="_blank" rel="noopener noreferrer">작업 사이트 방문 <span className="sr-only">{work.title} (새 창)</span> ↗</a></div></article>
      })}</div><Link className="service-link" href="/#works">전체 작업 보기 →</Link></div></section>
      <section className="room room-process" aria-labelledby="steps-title"><div className="service-sheet"><h2 id="steps-title">진행 과정</h2><ol className="process-list">{service.steps.map(([title, text], index) => <li className="process-item" key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol></div></section>
      <section id="faq" className="room room-faq" aria-labelledby="service-faq-title"><div className="service-sheet"><h2 id="service-faq-title">자주 묻는 질문</h2><div className="faq-list">{service.faq.map(([question, answer]) => <details className="faq-item" key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></section>
      <section className="room room-final" aria-labelledby="next-title"><div className="service-sheet"><h2 id="next-title">{inquiry.title}</h2><p>{inquiry.preparation}</p><div className="cta-row"><Link className="cta cta-primary" href="/contact/">{inquiry.cta} →</Link></div><nav className="service-related" aria-label="관련 서비스 안내">{services.filter(item => item.slug !== service.slug).map(item => <Link className="service-link" href={`/${item.slug}/`} key={item.slug}>{item.name} 살펴보기 →</Link>)}<Link className="service-link" href="/pricing/">홈페이지 제작 가격 및 수정 정책 →</Link></nav></div></section>
    </main><footer className="end-label"><span>STUDIO SERVICES</span><Link href="/">designYEH — HOME</Link><Link href="/contact/">Contact</Link></footer>
  </>
}
