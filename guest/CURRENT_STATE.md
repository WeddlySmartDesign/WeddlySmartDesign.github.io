# GUEST by WeddlySmartDesign — CURRENT STATE
Updated: 2026-10-01

## Continuity rule
This file is the FIRST file to read before doing any further GUEST work.
Never resume from chat text alone.
Never restart a closed block.
Never infer the current block from the user's last visible message.
Resume from the exact "NEXT ACTION" below.

## Closed blocks
- B0 extraction independent — CLOSED
- B1 standalone GUEST shell/product — CLOSED
- B2 technical isolation — CLOSED
- B3 commercial base flow — CLOSED
- B4 automatic QA base — CLOSED
- B5 latest-ONE parity audit — PASS / SEALED
- B6.1 shell / install / navigation / settings — PASS / CLOSED
- B6.2 Today + Guests — PASS / CLOSED
- B6.3 Invitation + RSVP + Essential/Signature — PASS / CLOSED
- B6.4 Tables + lists — PASS / CLOSED
- B6.5 Extra events — PASS / CLOSED
- B6.6 Two-device synchronization + error states — PASS / CLOSED
- B6 functional/mobile QA — PASS / SEALED
- B7.1 Mobile hierarchy — PASS / CLOSED
- B7.2 Hoy + Invitados — PASS / CLOSED
- B7.3 Invitación + RSVP — PASS / CLOSED
- B7.4 Mesas + Listados — PASS / CLOSED
- B7.5 Eventos extra — PASS / CLOSED
- B7.6 Coherencia global + escritorio + accesibilidad visual — PASS / CLOSED
- B7.7 QA visual final — PASS / CLOSED
- B7 UX/visual premium — PASS / SEALED
- B8.1 landing → selección → checkout — PASS / CLOSED
- B8.2 checkout → pago → retorno + webhook resiliente — PASS / CLOSED

B7 final sealed report:
`guest/B7_7_FINAL_VISUAL_SEAL_QA_2026-10-01.md`

Validated B7 HEAD:
`4728b6ff8cf78d904c94cfb11927cea4624ffbba`

Validated GitHub Actions run:
`36733355182` — 14/14 jobs `success`

## Current block
B8.3 + B8.4 — personalización y entrega/activación

Current branch:
`guest-independent`

## B8 scope
B8 = QA del flujo comercial completo, sin rediseñar el producto funcional ya sellado.

Microbloques:
- B8.1 landing comercial → selección Essential/Signature → entrada a checkout
- B8.2 checkout → pago → retorno y preservación de pedido
- B8.3 recogida de datos/personalización tras compra
- B8.4 activación/entrega y acceso real al producto
- B8.5 estados de error, cancelación, reintento y duplicidad
- B8.6 regresión comercial móvil/escritorio + sellado final de B8

## Exact current failure
B8.2 is PASS / CLOSED.

B8.3 product flow has not shown a product defect so far. Two red runs were QA defects:
1. wait condition did not account for already-submitted orders;
2. QA attempted to submit without selecting the required design.
Both test defects are corrected. Latest B8.3 rerun is pending.

B8.4 audit found one real product gap: paid provisioning generated an activation code but no customer-facing delivery path used it, so a buyer could complete personalization without receiving a usable GUEST activation.

Fix implemented on branch:
- controlled `deliver` action in GUEST Stripe backend;
- per-order operator token stored only as SHA-256 hash;
- internal order email receives the delivery link;
- `guest-deliver.html` sends access only when WeddlySmartDesign deliberately releases the prepared invitation;
- customer delivery email contains activation link + manual activation code;
- delivery is recorded idempotently with `guest_access_delivered_at`;
- B8.4 QA covers activation, partner join, invalid code and controlled-delivery invariants.

Important: hardened backend commit is in GitHub, but its latest deployment attempt was blocked by tool safety controls. The previous live checkout backend remains active. Do not claim B8.4 production PASS until the hardened version is deployed and probed.

## NEXT ACTION
1. Resolve the latest B8.3 CI result; seal B8.3 only if green.
2. Get B8.4 CI green.
3. Deploy the hardened GUEST checkout backend containing controlled delivery, then probe LIVE config/signature without triggering a real customer delivery.
4. Only then seal B8.4 and proceed to B8.5 error/cancel/retry/duplicate states.

## Working method from now on
Every microblock has only three states:
- ACTIVE
- PASS / SEALED
- FAIL with one exact NEXT ACTION

After every meaningful fix that changes the unresolved failure, update this file before continuing.
If a chat/tool session is interrupted, re-read this file and resume from NEXT ACTION.
