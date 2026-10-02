# GUEST — BLOQUE 05: estado de QA

Fecha: 2026-10-02
Rama exclusiva: `guest-independent`
Estado: **GOLD 01 RECHAZADO EN ANDROID REAL / GOLD 02 ACTIVO**. No avanzar a catálogo ni publicar.

## Baseline preservado
- Dirección competitiva sellada: `75cee74101df0e3cf76f6b673fe8c2ad08167e0a`.
- GOLD STANDARD PILOT 01 sellado: `89f1a8c9e0c403d572d67969d34adde7b41302d7`.
- Prototipo original GOLD 01 preservado: `guest/gold-01-prototype.html`.
- GOLD 01 gate candidate preservado: `guest/gold-01-gate-candidate.html`.
- GOLD 01 automated gate canonical run: `36992651725`, HEAD `c147cf705776bb4f531a9352b2b08bd1288f1a84` — success.
- ONE, ONE Partner, STUDIO, `main`, compra, producción y motor GUEST siguen sin modificarse.

## GOLD 01 — resultado final
Automated/technical QA: PASS.
Android real-device visual gate: **FAIL**.

### Failure reproduced on owner device
- opening and closing mechanics are acceptable but not impressive;
- most of the interior is visually rejected;
- overall language feels corporate/editorial rather than wedding;
- without the couple image it would not clearly read as a wedding invitation;
- Signature is perceived as visually above GOLD 01 once opening/closing motion is excluded;
- the design remains too reproducible as a basic Canva composition plus motion.

This is a direction failure, not a polish defect. GOLD 01 is frozen as a rejected learning artifact and must not be cosmetically iterated.

## GOLD 02 — active replacement direction
Checkpoint: `guest/GUEST_GOLD_01_REJECTION_GOLD_02_DIRECTION_2026-10-02.md`.

Candidate:
- `guest/gold-02-gate-candidate.html`
- `guest/gold-02-wedding-vellum.css`
- `guest/gold-02-wedding-vellum.js`

Direction: living wedding stationery / vellum + photography + calligraphic gesture + botanical linework + illustrated venue + celebration route + integrated RSVP.

Explicit anti-patterns: corporate chapter grid, beige/black editorial alternation, photo arches/frames, architectural brochure feel, scrapbook/washi shortcuts and generic form ending.

Internal static gate: PASS. Offline in-memory Chromium check at 390x844: no JS errors and no horizontal overflow. Real Android visual gate remains mandatory.

## NEXT ACTION
Open GOLD 02 on the owner's Android device and evaluate the complete experience. Do not build a catalog or integrate into production before this visual gate.
