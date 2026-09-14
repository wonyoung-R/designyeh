# Paperlogy — official self-hosted website fonts

- Official page: https://freesentation.blog/paperlogyfont
- Download link inspected on that page: https://github.com/Freesentation/paperlogy/raw/refs/heads/main/Paperlogy-1.001.zip
- Four unmodified static source TTF files extracted from that archive are retained: `Paperlogy-4Regular.ttf` (400), `Paperlogy-5Medium.ttf` (500), `Paperlogy-6SemiBold.ttf` (600), and `Paperlogy-7Bold.ttf` (700). Their documented combined file size is 5,241,680 bytes. CSS serves the corresponding `.woff2` files with the same names and weights.
- The global `--g-sans` stack starts with Paperlogy, followed by Korean system fallbacks. The mono and Geist font variables alias this stack.
- Weight semantics: body prose and small labels use 400; navigation, buttons, CTA links, and field labels use 500; section headings, FAQ summaries, and strong/b emphasis use 600. Pricing amounts and the reply clock use 500. The homepage hero headline preserves its existing 500 intro and 700 key text, family declaration, size, letter spacing, and line height.
- All four local `@font-face` declarations use their exact static weights, normal style, and `font-display: swap`. The gallery body explicitly uses weight 400, line-height 1.75, and `font-synthesis: none`. There are no font preloads or runtime third-party font requests.
- WOFF2 generation uses Python `fontTools.ttLib.TTFont` and Brotli, with no subsetting. These are conversion-time dependencies, not browser or application runtime dependencies. The converter reopens each WOFF2 and requires identical glyph order and best cmap, and checks that source TTFs and `OFL.txt` remain unchanged.
- Completed full-coverage WOFF2 conversion reduced the combined font size from 5,241,680 to 1,743,428 bytes across weights 400, 500, 600 and 700. Each converted font retains all 14,198 glyphs and 14,093 cmap entries, with no subsetting. Include all four generated WOFF2 files in the release alongside the unchanged source TTFs and `OFL.txt`.

Run from the repository root with `uv` installed. The converter is an external workspace tool, not a repository command; obtain `/opt/data/workspace/designyeh-convert-fonts.py` before running this block. The guard stops if it is absent. Conversion dependencies are installed into an isolated tooling environment, without system pip or application dependency changes.

```sh
(
  set -eu
  test -f /opt/data/workspace/designyeh-convert-fonts.py
  FONT_QA_VENV="$(mktemp -d /opt/data/workspace/designyeh-font-tools.XXXXXX)"
  uv venv "$FONT_QA_VENV"
  uv pip install --python "$FONT_QA_VENV/bin/python" 'fonttools[woff]'
  "$FONT_QA_VENV/bin/python" /opt/data/workspace/designyeh-convert-fonts.py --font-dir public/fonts/paperlogy
  "$FONT_QA_VENV/bin/python" /opt/data/workspace/designyeh-convert-fonts.py --font-dir public/fonts/paperlogy --verify-only
  node --test test/renewal.test.mjs
)
```

The converter prints per-file and combined source/destination byte totals as JSON; `--verify-only` checks existing artifacts without modifying them. Recorded verification: all 59 tests passed, the build passed, and lint completed without warnings or errors. Local browser verification passed for 48 route/viewport combinations, nine JavaScript-disabled records, 151 SEO route checks, and 24 reduced-motion checks. Production verification is a separate post-deployment step; see `docs/release-seo-audit.md` for scope and limitations.

Release QA requires the supplied external `/opt/data/workspace/designyeh-release-qa.cjs`, its configured Playwright package, an already running Chromium CDP endpoint at `http://127.0.0.1:9222`, and a separately started static preview on port 4179. It creates and closes only its own isolated contexts; context creation, visits, crawl checks and cleanup have deadlines.

Run the baseline command while the original TTF build is being served, then switch the preview to the generated WOFF2 build before running the remaining local commands. `PERF_ONLY=1` runs only the two homepage performance visits, skipping the 48-visit matrix and all crawl-file checks, including llms.txt. `NOJS_ONLY=1` runs eight route visits at 390px with JavaScript disabled plus an exported `/404.html` check; it skips performance and crawl checks. The two flags are mutually exclusive.

```sh
PERF_ONLY=1 node /opt/data/workspace/designyeh-release-qa.cjs http://localhost:4179 /opt/data/workspace/designyeh-before-perf
PERF_ONLY=1 node /opt/data/workspace/designyeh-release-qa.cjs http://localhost:4179 /opt/data/workspace/designyeh-after-perf
node /opt/data/workspace/designyeh-release-qa.cjs http://localhost:4179 /opt/data/workspace/designyeh-after
NOJS_ONLY=1 node /opt/data/workspace/designyeh-release-qa.cjs http://localhost:4179 /opt/data/workspace/designyeh-after-nojs
node /opt/data/workspace/designyeh-release-qa.cjs https://dsgnyeh.art /opt/data/workspace/designyeh-production
NOJS_ONLY=1 node /opt/data/workspace/designyeh-release-qa.cjs https://dsgnyeh.art /opt/data/workspace/designyeh-production-nojs
```

Each run saves an aggregate `.json` and append-only `.ndjson` visit evidence. Runs containing performance visits also save homepage performance screenshots. Full runs include the responsive matrix, performance, crawl files and exported 404. Mobile menu interactions apply only when the summary is visible; hidden or absent summaries are recorded as not applicable. No-JavaScript redirect fallbacks require visible destination links, the inherited root canonical and noindex, with no menu expectation. Exported 404 requires noindex and status 404; a loopback static preview may instead return 200. Existing evidence prefixes are rejected. The CLI accepts both TTF and WOFF2 resource URLs. Compare identical server modes and environments; a development build is not comparable to production performance. Measurements are bounded lab observations, not field Core Web Vitals or ranking guarantees. Resource timing sizes may be zero for cross-origin assets without Timing-Allow-Origin; CDP network evidence is included separately. The SEO source audit and its limitations are recorded in `docs/release-seo-audit.md`.
- `OFL.txt` remains untouched and retains the copyright notice and complete SIL Open Font License 1.1, from the same official repository: https://raw.githubusercontent.com/Freesentation/paperlogy/main/OFL%20license.txt
- The official page also links https://www.designptn.com/wp-content/uploads/2024/08/OFL-license.txt ; that URL returned a JavaScript cookie challenge during retrieval, so the official repository copy was used.

The OFL permits embedding and commercial use subject to its conditions. Do not sell the fonts by themselves; retain the copyright notice and license when distributing them.
