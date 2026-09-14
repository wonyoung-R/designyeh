# Release SEO / GEO audit

The site has six canonical, indexable pages on `https://dsgnyeh.art`: `/`, `/pricing/`, `/contact/`, `/homepage-production/`, `/brand-identity/`, and `/operations-automation/`. Each has route-appropriate metadata. Root Organization/ProfessionalService and WebSite JSON-LD use stable production IDs and the confirmed visible contact email, `creativebyyeh@gmail.com`.

Service pages emit linked Service, WebPage, BreadcrumbList and FAQPage JSON-LD, referencing the root agency as provider. Visible FAQ content and structured questions and answers use the same `service.faq` data; the service definition is also visible. JSON-LD serialization escapes less-than characters.

`robots.txt` allows all crawlers, including AI crawlers, through the wildcard user-agent rule. The sitemap lists only the six canonical pages and excludes legacy routes. `llms.txt` reflects current homepage-production positioning and confirmed project scope, including own-project disclosures and basic-package exclusions. It contains no unsupported Seoul location, Design LUKA inquiry-classification claim or GRIT LAB reservation claim.

Legacy about and portfolio routes use `window.location.replace` for full navigation to `/#approach` and `/#works`. Loading a fresh root document prevents stale legacy noindex directives and duplicate metadata from persisting at the destination. The original layouts remain noindex/follow with the root canonical; JavaScript-disabled visitors receive meaningful fallback headings and destination links. The exported 404 page is noindex.

Recorded verification: all 59 tests passed, the production build passed, lint returned no warnings or errors, and npm audit reported zero vulnerabilities. Final local Chromium checks passed for 48 route/viewport combinations, nine JavaScript-disabled records, 151 SEO route checks, and 24 reduced-motion checks. Production verification remains a separate post-deployment step. No Search Console submission, real-device validation, or search visibility outcome is claimed.

Crawl access, metadata, structured data and `llms.txt` do not guarantee indexing, rankings, rich results, AI visibility or citations.
