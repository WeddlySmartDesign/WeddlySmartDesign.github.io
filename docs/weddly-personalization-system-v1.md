# Weddly Smart Design — Personalization System v1

## Product decision
Weddly Smart Design is no longer positioned as an Etsy-template business. It is a wedding-software brand with a controlled personalization system and an optional done-for-you service.

## Commercial principle
Personalization must feel broad to the couple and remain operationally narrow for Weddly Smart Design.

The engine and functionality do not change between styles. The couple chooses a visual system; data and workflows remain intact.

## Included personalization
Included in the normal product price:
- Couple names
- Wedding date
- Language
- Currency where applicable
- One visual style from the Weddly collection
- Curated accent treatment within that style when technically appropriate

## Done-for-you service
Working name: **Hazlo por mí** / **Set it up for me**.

This is a service layer, not a software feature lock.

Weddly Smart Design prepares the purchased app using information supplied by the couple. Scope should remain controlled and repeatable: names, date, chosen style, core event information, basic existing-list import/setup where offered, and final visual review.

The customer pays primarily for saved time and reduced setup effort.

## Bespoke personalization
Separate premium service for requests outside the controlled design system. Must be priced high enough to protect time. It is not the default sales proposition.

## Initial style collection
Six styles. Same functionality in every style.

1. **Atelier** — editorial, warm, sophisticated. Cream, charcoal, serif-led hierarchy.
2. **Oliva** — Mediterranean, serene, natural. Muted olive, ivory, restrained organic warmth without wedding clichés.
3. **Siena** — contemporary warm palette. Sand, terracotta, deep brown.
4. **Perla** — soft, elegant, romantic-modern. Pearl, mauve-grey, white. No decorative bridal clichés.
5. **Noche** — dark evening celebration. Charcoal, warm ivory, high contrast.
6. **Línea** — graphic contemporary minimalism. White, black, low-radius geometry, strong typographic structure.

## Design rules
- No hearts, rings, eucalyptus illustrations, generic floral ornaments or stock wedding iconography.
- Difference comes from typography, spacing, geometry, surfaces, contrast and hierarchy.
- Every style must remain readable on mobile first.
- Inputs, selects and textareas always maintain strong contrast and obvious affordance.
- Alerts must remain semantically clear regardless of style.
- Functional controls keep their location and meaning across styles.
- The visual seating plan must inherit the chosen style without reducing legibility or interaction.
- A style change must never modify wedding data.

## Architecture rule
Functional checkpoints remain frozen. Visual development happens separately until approved.

- Guests functional checkpoint: v131 / branch `guests-functional-v131`.
- New style experiments must not overwrite this checkpoint.
- Once visually approved, personalization is integrated as a controlled layer over the stable app.

## Why six styles
Current Spanish digital-wedding products commonly commercialize personalization by offering a limited catalogue of designs with the same underlying functionality. Market examples range from 5–8 curated designs through larger catalogues. The commercial lesson is not to maximize quantity; it is to make the act of choosing a style feel like part of purchasing a wedding product.

Weddly should win by combining that familiar personalized-design buying behavior with substantially deeper operational functionality.

## Website merchandising
The future website should show the six styles visually before asking the customer to buy.

Key message:
**La misma app. Vuestra estética.**

Secondary message:
**¿No quieres configurarla? Te la dejamos preparada.**

The style gallery should show the same real app state transformed across styles, proving that personalization is not a separate watered-down template.

## Next implementation sequence
1. Validate the six-style visual direction in the standalone design lab.
2. Remove or refine weak styles; keep a minimum collection of 4 and maximum of 6 for launch.
3. Apply approved style tokens to Guests without changing v131 functional flows.
4. Apply the same shared style system to Payments.
5. Make selected style persist per wedding/user as product rules require.
6. Build the Spanish commercial website around real app demos and the personalization gallery.
7. Define final product + done-for-you pricing after the visual offer is tangible.
