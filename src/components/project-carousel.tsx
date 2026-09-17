"use client"

import { asset } from "@/lib/assets"
import type { Work } from "@/lib/works"

const PROJECT_IDS = ["designluka", "dcare", "gritlab", "mavs", "hoopnote"]

function ProjectLogo({ work }: { work: Work }) {
  if (work.id === "hoopnote") {
    return <span className="project-logo-hoopnote"><img src={asset("/logos/hoopnote.png")} alt="" width={42} height={42} /><span>hoopnote</span></span>
  }
  const filename = work.id === "designluka" ? "designluka-wordmark.png" : work.id === "mavs" ? "mavs.svg" : `${work.id}.png`
  return <img className={`project-logo-image project-logo-${work.id}`} src={asset(`/logos/${filename}`)} alt="" width={220} height={72} />
}

export function ProjectCarousel({ works }: { works: Work[] }) {
  const projects = PROJECT_IDS.flatMap(id => works.filter(work => work.id === id))

  return (
    <div className="project-strip-inner">
      <div className="project-strip-heading">
        <h2 id="project-strip-title">프로젝트명</h2>
      </div>
      <div id="project-carousel" className="project-strip-scroll" role="region" aria-labelledby="project-strip-title" tabIndex={0} onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.scrollLeft = 0
      }}>
        <div className="project-carousel-track">
          {[0, 1].map(copy => (
            <ul className="project-logo-list" key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {projects.map(work => (
                <li key={work.id}>
                  <a className="project-logo-link" href={work.url} target="_blank" rel="noopener noreferrer" tabIndex={copy === 1 ? -1 : undefined} aria-label={`${work.title} 사이트 방문 (새 창)`}>
                    <ProjectLogo work={work} />
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  )
}
