import { asset } from "@/lib/assets"

const scenes = ["studio-conversation", "studio-making", "studio-space"]

export function HeroBackdrop() {
  return (
    <div className="hero-backdrop" aria-hidden="true">
      {scenes.map((scene, index) => (
        <picture className="hero-scene" key={scene}>
          <source media="(max-width: 700px)" srcSet={asset(`/images/hero/${scene}-mobile.webp`)} />
          {/* Static export: responsive local assets need no image optimizer. */}
          <img src={asset(`/images/hero/${scene}.webp`)} alt="" width={index === 2 ? 1660 : 1659} height={948} fetchPriority={index === 0 ? "high" : "low"} decoding="async" />
        </picture>
      ))}
    </div>
  )
}
