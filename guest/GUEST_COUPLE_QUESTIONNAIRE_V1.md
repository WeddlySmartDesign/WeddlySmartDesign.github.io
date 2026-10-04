# GUEST — COUPLE QUESTIONNAIRE V1

Status: CANONICAL INPUT SPECIFICATION
Date: 2026-10-04

Purpose: collect only the information needed to generate a premium GUEST invitation in minutes.

## Experience rule

The couple must feel that they are **telling us their information**, not designing the invitation.

Therefore:
- no layout decisions;
- no crop/focus terminology;
- no font names;
- no module-count terminology;
- no design controls;
- conditional questions appear only when relevant;
- most choices are simple cards/toggles;
- free text is kept to a minimum.

The visual titles/section names of each catalog template are fixed by WeddlySmartDesign and are not editable by the couple. This preserves art direction, hierarchy and scalability.

The only typography choice exposed is a **single global display-style choice** from the pre-approved options of the selected template. Body/functional typography remains fixed.

---

## A. Vosotros

1. Nombre 1 exactamente como queréis que aparezca.
2. Nombre 2 exactamente como queréis que aparezca.
3. Fecha de la boda.

### Portada
The cover always renders:
- **“Nos casamos”**;
- names;
- date.

Optional cover fields:
4. ¿Queréis que aparezca el lugar en portada?
- No.
- Sí -> short place/city.

5. ¿Queréis que aparezca la hora en portada?
- No.
- Sí -> time.

Validation:
- names hard max 30 characters each;
- cover place hard max 36;
- cover time short format.

6. Elige el estilo de letra para vuestros nombres.
Show visual cards only, never font names.
Example template labels:
- Clásica.
- Romántica.
- Contemporánea.

Only template-approved variants are shown.

---

## B. Nuestra historia

7. ¿Queréis incluir “Nuestra historia”?
- No.
- Sí.

If Yes, show six simple cards:

### Texto 1 — Cotidiano
“Llevamos años compartiendo planes, viajes, domingos tranquilos y muchas risas. Ahora nos hace muchísima ilusión celebrar el siguiente capítulo con vosotros.”

### Texto 2 — Alegre
“No sabemos exactamente cuándo empezó todo, pero sí sabemos que desde entonces la vida es mucho más divertida juntos. Y este día no tendría sentido sin vosotros.”

### Texto 3 — Cercano
“Entre planes improvisados, viajes, cenas que se alargan y días de sofá, hemos ido construyendo lo nuestro. Ahora toca celebrarlo con nuestra gente.”

### Texto 4 — Emotivo
“Después de tantos momentos compartidos, ha llegado uno que queremos vivir rodeados de las personas que forman parte de nuestra historia: vosotros.”

### Texto 5 — Sencillo
“Nos elegimos hace tiempo y seguimos eligiéndonos cada día. Ahora queremos celebrarlo como más nos gusta: con nuestra familia y amigos cerca.”

### Texto libre
“Prefiero escribirlo yo.”

If free text:
- hard max 450 characters;
- guidance: one short natural paragraph is enough.

8. ¿Queréis añadir una foto a vuestra historia?
- No.
- Sí -> upload one photo.

The couple is not asked about orientation/crop.
Internal production chooses crop/full + focus when needed.

---

## C. Dónde nos vemos

9. ¿Ceremonia y celebración son en el mismo lugar?
- Sí, todo es en el mismo sitio.
- No, son en sitios diferentes.

### If one place
Ask only:
- venue/place name;
- start time;
- address;
- Google Maps link;
- venue website optional.

### If two places
Ceremony:
- name;
- time;
- address;
- Google Maps link;
- website optional.

Celebration:
- name;
- time;
- address;
- Google Maps link;
- website optional.

10. ¿Queréis incluir dress code?
- No.
- Sí -> short wording, hard max 60.

11. Optional venue image.
- upload 0 or 1 image;
- never require two images.

**Removed:** “Guardar fecha” from Locations. Add-to-calendar belongs to the GUEST RSVP experience and is not duplicated in the invitation location block.

---

## D. Así será el día

12. ¿Queréis mostrar los momentos del día?
- No.
- Sí.

If Yes:
13. Add between 1 and 5 moments.

For each:
- time;
- short label.

Suggested labels shown as quick picks:
- Ceremonia
- Cóctel
- Cena
- Fiesta
- Recena
- Brunch
- Preboda
- Otro

Hard max:
- label 28 characters.

The couple does not choose layout/order style; the template handles 1–5 automatically.

---

## E. Para que lo tengáis fácil

14. ¿Queréis añadir alguna información práctica?
Show four cards; select 0–4:
- Bus / transporte.
- Alojamiento.
- Regalo.
- Playlist.

If none:
- the whole Practical section disappears.

### E1. Bus / transporte

Ask only what applies:
- pickup point(s), 1–3;
- outbound time(s), 1–3;
- return time(s), 0–4;
- optional short note, max 120 chars;
- optional maps link for pickup;
- ¿Necesitáis saber en el RSVP quién usará el bus? Yes/No.
- if several routes/stops: ¿Necesitáis saber cuál? Yes/No.
- if several return times: ¿Necesitáis saber qué vuelta prefiere cada invitado? Yes/No.

Invitation:
- information only;
- optional “Cómo llegar”;
- no reservation button when RSVP collects the choice.

### E2. Alojamiento

First ask one beautiful choice screen:

**¿Cómo habéis organizado el alojamiento?**
- Hay habitaciones en la propia finca/lugar.
- Tenemos habitaciones pre-reservadas en un hotel.
- Nosotros organizaremos/asignaremos las habitaciones.
- Solo queremos recomendar un alojamiento.
- Los invitados reservan directamente en una web.

Then reveal only the relevant fields.

Common:
- accommodation/hotel name;
- address;
- public website URL;
- phone/contact;
- optional Google Maps link.

#### Rooms at finca/venue
- do guests tell you in RSVP if they want to stay?
- nights?
- number of people / occupancy?
- optional short price/note.

#### Pre-reserved hotel block
- reservation under what name?
- booking/discount code?
- special rate/discount text?
- deadline?
- book by phone / hotel website / other?
- do you also need RSVP confirmation of who will stay?

#### Couple-managed rooms
- should guests request accommodation in RSVP?
- available nights?
- occupancy/number of people?

#### Recommended only
- no accommodation RSVP question by default.

#### External booking
- booking URL;
- code/discount if applicable;
- deadline if applicable;
- whether you still want to know in RSVP if guests will stay.

Invitation rendering:
- “Ver hotel” when website exists;
- “Reservar” only when booking genuinely happens externally;
- otherwise accommodation choices remain in RSVP.

### E3. Regalo

Ask:
- No gift information.
- Bank transfer.
- Bizum.
- External gift-list link.
- Short custom message.

Collect only the relevant fields.
Invitation uses concise wording + “Ver datos”/external link when needed.

### E4. Playlist

Ask:
- No.
- Yes -> target/link + optional short prompt.

---

## F. Confirmación de asistencia

The invitation always shows one GUEST RSVP CTA.

15. ¿Permitís acompañante (+1)?
- Yes / No.

16. ¿Queréis preguntar por niños?
- Yes / No.

Transport questions:
- derived automatically from Bus settings.

Accommodation questions:
- derived automatically from Accommodation settings.

17. Additional custom RSVP questions?
- existing GUEST custom-question capability.

The couple does not configure “Add to calendar” here as a design choice; GUEST RSVP already provides the calendar action where defined by the product.

---

## G. Fotos

18. ¿Queréis una galería final?
- No.
- Sí.

If Yes:
19. Upload 1–4 photos and put them in preferred order.

The couple does NOT choose crop mode.
Internal production:
- derives orientation;
- chooses crop/full per photo;
- adjusts focus if cropped;
- verifies both people / important environment remain visible.

---

## H. Cierre

The closing title/visual language is fixed by the selected catalog template.

20. Closing line:
- use collection default; OR
- optional custom short line, hard max 80 characters.

Names/date are reused automatically.

---

## Fixed-title policy

The couple does NOT edit section titles.

Each template owns its titles, for example in VEIL LIGHT:
- Cover: “Nos casamos”.
- Story: “Nuestra historia”.
- Locations: “Dónde nos vemos”.
- Agenda: “Así será el día”.
- Practical: “Para que lo tengáis fácil”.
- Gallery: “Un poco de nosotros” / collection-approved fixed label.
- RSVP: collection-approved fixed title/CTA context.
- Closing: collection-defined.

Reason:
- titles are part of the art direction;
- title length affects composition;
- fixed titles make personalization fast and predictable;
- the invitation should feel professionally designed, not self-authored in a builder.

---

## Internal generation output

The questionnaire maps directly to the canonical GUEST invitation config.

Free-text is deliberately limited to:
- optional story custom text;
- optional short notes;
- optional dress code wording;
- optional gift/playlist wording;
- optional closing line.

Operational data remains structured.


## Preview-first questionnaire UX

The questionnaire is not shown as a generic multi-step form.

Core UX:
- no visible “1/6”, “2/6”… counters;
- show only a subtle progress bar and the human-facing section name;
- each step displays a live preview of the selected invitation template section before the questions;
- preview uses the couple's current answers where available;
- section names use guest-facing language, never internal terms such as Story, Practical, module count, fit or schema.

Suggested step labels:
- Portada.
- Nuestra historia.
- Lugares.
- Momentos.
- Detalles.
- Fotos y RSVP.
- Revisar.

Purpose:
- the couple always understands what they are configuring because they see the exact place in the invitation;
- they should never have to imagine what “agenda” or “practical” means;
- the questionnaire must feel like “tell us about your wedding”, not “design your invitation”.

### RSVP presentation inside questionnaire

The questionnaire does NOT create a second RSVP product.

It configures the existing GUEST RSVP.

Show a small preview of the GUEST RSVP and explain this explicitly.

Ask only the settings that cannot be derived from prior answers:
- +1 enabled yes/no;
- children enabled yes/no;
- optional custom RSVP questions.

Derived automatically:
- transport question(s) from Bus answers;
- accommodation question(s) from Accommodation mode/settings;
- add-to-calendar remains part of the GUEST RSVP/product and is not duplicated as a questionnaire design choice.

### Final review / acceptance

The last screen must show the exact resolved content, not only a summary of selected modules.

At minimum it displays:
- exact cover names/date/place/time choices;
- exact selected Story preset text or custom text;
- exact location names, times and addresses;
- exact agenda moments;
- exact Bus/Accommodation/Gift/Playlist data;
- exact RSVP settings and derived questions;
- gallery enabled/count/order metadata;
- other relevant optional details.

Each section offers an Edit action.

Before submission the couple confirms that they have reviewed the information and that it is correct.

This final resolved review exists to reduce misunderstandings and post-delivery disputes.


---

## QUESTIONNAIRE UX V3 — CONTEXT WITHOUT SELF-DESIGN

This section supersedes any earlier UI behavior that made the couple feel they were previewing/designing the finished invitation.

### Brand header
Always render:
- **GUEST**
- **by WeddlySmartDesign** immediately associated with it;
- “by WeddlySmartDesign” uses Caveat in the product UI.

Never show “GUEST” without the full brand lockup in the questionnaire header.

### Progress
Do NOT show “1/6”, “2/6”, etc.
Use:
- a quiet progress bar;
- the human section name only.

Reason: the form is fast, but a visible multi-page count makes it feel longer.

### Context reference, not finished preview
At the top of each section show a **static contextual reference of the chosen template** so the couple understands where the requested information belongs.

The reference:
- explains *which area of the invitation* is being completed;
- may use the chosen template’s art direction and generic/sample content;
- must NOT render a polished live final invitation using the couple’s own entered data;
- must NOT expose crop/layout/design controls;
- must preserve the sense that WeddlySmartDesign performs the design work.

Couple experience:
“I know exactly what information you are asking me for and where it will appear.”
NOT:
“I am building/designing my invitation myself.”

### Real file uploads
All questionnaire upload actions must use real file inputs and show:
- uploaded filename;
- thumbnail when useful;
- replace/remove action.

Required uploads:
- Story photo when enabled;
- one optional celebration/venue photo in Locations;
- 1–4 Gallery photos.

Location-photo rule:
- ask for **one optional photo of the celebration venue/place**;
- if none is uploaded, the selected template uses its default collection visual;
- never require a separate ceremony photo.

### Agenda automatic chronological ordering
Moments are data, not manually positioned design elements.

Rules:
- after add/edit/remove, moments automatically sort by time;
- times after midnight that logically belong to the wedding night (00:00–05:59) sort after late-evening times;
- example: 19:00 Cóctel, add 19:30 Fotos, 00:00 Fiesta -> order becomes 19:00 / 19:30 / 00:00 automatically;
- blank times remain after timed moments until completed;
- max 5 moments.

### Practical copy
Never use internal/project language in couple-facing text such as “Practical”, “module”, “layout”, “renderer” or explanations written for the product team.

Use natural prompts such as:
“¿Necesitáis contarles algo más a vuestros invitados?”

### Bus
When Bus is enabled:
- questionnaire collects informational data only: stop(s), outbound time(s), return time(s), optional note/map;
- DO NOT ask whether RSVP should ask about bus usage;
- selecting Bus automatically configures the existing confirmation flow to ask the relevant transport question(s);
- invitation remains informational.

### Gift — required structured details
If Gift is enabled, first choose:
- Bank transfer;
- Bizum;
- External gift list/link;
- Short custom message.

Then collect the actual destination:
- BANK: account holder + IBAN; optional BIC/SWIFT;
- BIZUM: phone number / recipient reference;
- EXTERNAL_LINK: URL + optional label;
- SHORT_TEXT: message.

The final review shows the exact supplied details.

### Confirmation of attendance — existing product, configured here
The couple-facing questionnaire must NOT say “RSVP de GUEST” as if the customer is expected to know product terminology.

Use:
- **Confirmación de asistencia**;
- explain simply: “Estas son las preguntas que recibirán vuestros invitados al confirmar.”

This questionnaire configures the existing confirmation system already built into the product. It does not create a second RSVP.

Show/configure the relevant existing options:
- attendance: always;
- menu choice: optional/configurable;
- allergies / intolerances / dietary information: optional/configurable;
- +1: optional;
- children: optional;
- transport: automatically derived when Bus is enabled;
- accommodation: automatically derived when the accommodation mode needs a guest response;
- existing custom questions capability.

Do NOT mention “Añadir al calendario” in the questionnaire UI.

### Final review — contractual clarity
The final screen must show the **exact content/data supplied**, not only a list of selected features.

Review includes, as applicable:
- exact names/date/optional cover place/time;
- exact Story preset text or exact custom text;
- uploaded Story filename;
- exact location names, times, addresses, links and optional venue-photo filename;
- exact Agenda moments in their automatically sorted order;
- exact Bus information;
- exact accommodation mode and values;
- exact Gift destination/details;
- exact Playlist URL/prompt;
- exact confirmation questions/options;
- exact Gallery filenames/order;
- exact closing text where custom.

Each section has Edit.
Final checkbox confirms the couple has reviewed the information before submission.


---

## RSVP PARITY CONTRACT — MUST MATCH EXISTING PRODUCT

The questionnaire configures the existing confirmation-of-attendance engine. It must not create a reduced RSVP.

### Main invited person
When enabled by configuration, the attending person answers:
- attendance;
- menu;
- allergies / intolerances;
- high chair when the selected menu requires/uses it;
- transport;
- accommodation;
- custom questions.

### Accompanying guest / +1
If +1 is enabled and an accompanying guest is added, that person has **their own independent response fields**, not one shared answer:
- name;
- menu;
- allergies / intolerances;
- high chair when applicable;
- transport when enabled;
- accommodation when enabled;
- custom questions when configured.

The +1 response is stored independently in the RSVP payload and guest-management flow.

### Children
If Children is enabled, the public confirmation asks:
1. whether children are coming;
2. number of children;
3. for each child:
   - name;
   - age;
   - menu;
   - allergies / intolerances;
   - whether a high chair is needed.

These fields are repeated per child and saved per child.

### Configuration semantics
- Children OFF: no child question appears.
- Children ON: the child block must appear in the public invitation confirmation.
- Bus/transport: invitation is informational; the confirmation question is enabled automatically from the transport configuration.
- Accommodation: confirmation behavior is derived from accommodation mode.
- Custom questions: use the existing configurable question engine.
- Extra event questions/responses remain existing product behavior and are not recreated by the invitation questionnaire.

### Regression rule
Saving or editing the invitation must NEVER overwrite unrelated RSVP question keys.
When invitation data is synchronized back to RSVP, the existing `questions` object is merged/preserved rather than reconstructed from a subset of keys.
