import Link from "next/link"
import { ORIGIN, services, type ServiceContent } from "@/lib/services"
import { FALLBACK_WORKS } from "@/lib/works"
import { asset } from "@/lib/assets"

export function ServicePage({ service }: { service: ServiceContent }) {
  const url = `${ORIGIN}/${service.slug}/`
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
    <header className="docent contact-nav"><Link className="wordmark" href="/">designyeh<span className="wm-period">.</span></Link><Link className="contact-home" href="/contact/">홈페이지 제작 문의</Link></header>
    <main className="service-detail">
      <section className="room room-entry" aria-labelledby="service-title">
        <div className="room-tag"><span className="tag-no">S—0{services.indexOf(service) + 1}</span><span className="tag-name">SERVICE GALLERY</span></div>
        <div className="service-sheet">
          <nav className="service-breadcrumb" aria-label="현재 위치"><Link href="/">홈</Link><span aria-hidden="true"> / </span><span aria-current="page">{service.name}</span></nav>
          <h1 id="service-title">{service.title}</h1><p className="service-definition">{service.definition}</p>
          <div className="cta-row"><Link className="cta cta-primary" href="/contact/">홈페이지 제작 문의하기 →</Link><a className="cta cta-secondary" href="#service-works">관련 작품 보기 ↓</a></div>
        </div><div className="baseboard" />
      </section>
      <section className="room room-problem" aria-labelledby="audience-title"><div className="service-sheet"><h2 id="audience-title">누구를 위한 서비스인가요?</h2><ul>{service.audience.map(text => <li key={text}>{text}</li>)}</ul><h2>어떤 문제를 다루나요?</h2>{service.problems.map(text => <p key={text}>{text}</p>)}</div><div className="baseboard" /></section>
      <section className="room room-services" aria-labelledby="scope-title"><div className="service-sheet"><h2 id="scope-title">포함하는 작업</h2><ul>{service.included.map(text => <li key={text}>{text}</li>)}</ul><h2>제외 항목과 먼저 확인할 범위</h2><ul>{service.boundaries.map(text => <li key={text}>{text}</li>)}</ul></div><div className="baseboard" /></section>
      <section id="service-works" className="room room-websites" aria-labelledby="related-works-title"><div className="service-sheet"><p className="section-kicker">SELECTED COLLECTION</p><h2 id="related-works-title">관련 작품</h2><p>{service.worksContext}</p><div className="service-works">{service.works.map(id => {
        const work = FALLBACK_WORKS.find(work => work.id === id)!
        return <article key={id}><div className="frame frame-walnut"><div className="mat snug">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(work.image)} alt={`${work.title} 웹사이트 미리보기`} width={1440} height={900} loading="lazy" />
        </div></div><div className="label"><h3 className="lbl-title">{work.title}</h3><p className="lbl-meta">{work.meta}</p><a className="service-link" href={work.url} target="_blank" rel="noopener noreferrer">작품 사이트 방문 <span className="sr-only">{work.title} (새 창)</span> ↗</a></div></article>
      })}</div><Link className="service-link" href="/#works">전체 작품 보기 →</Link></div><div className="baseboard" /></section>
      <section className="room room-process" aria-labelledby="steps-title"><div className="service-sheet"><h2 id="steps-title">진행 과정</h2><ol className="process-list">{service.steps.map(([title, text], index) => <li className="process-item" key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol></div><div className="baseboard" /></section>
      <section id="faq" className="room room-faq" aria-labelledby="service-faq-title"><div className="service-sheet"><h2 id="service-faq-title">자주 묻는 질문</h2><div className="faq-list">{service.faq.map(([question, answer]) => <details className="faq-item" key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div><div className="baseboard" /></section>
      <section className="room room-final" aria-labelledby="next-title"><div className="service-sheet"><h2 id="next-title">홈페이지에 담고 싶은 내용을 알려주세요.</h2><p>사업 소개, 준비된 자료와 필요한 페이지·기능을 알려주시면 제작 범위와 인계 기준을 함께 확인합니다.</p><div className="cta-row"><Link className="cta cta-primary" href="/contact/">홈페이지 제작 문의하기 →</Link></div><nav className="service-related" aria-label="홈페이지 제작 안내">{services.filter(item => item.slug === "homepage-production" && item.slug !== service.slug).map(item => <Link className="service-link" href={`/${item.slug}/`} key={item.slug}>{item.name} 살펴보기 →</Link>)}<Link className="service-link" href="/pricing/">홈페이지 제작 가격 및 수정 정책 →</Link></nav></div><div className="baseboard" /></section>
    </main><footer className="end-label"><span>SERVICE GALLERY</span><Link href="/">designYEH — HOME</Link><Link href="/contact/">Contact</Link></footer>
  </>
}
