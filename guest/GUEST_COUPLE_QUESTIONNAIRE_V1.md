# GUEST — COUPLE QUESTIONNAIRE V1

Status: CANONICAL INPUT SPECIFICATION
Date: 2026-10-04

Purpose: collect exactly the structured information needed to generate a GUEST invitation in minutes.

The couple should never see implementation language such as fit, focal point, schema, module count or layout state. Those are internal configuration decisions.

## A. Your invitation

1. Which invitation design have you chosen?
- catalog template ID / name.

2. Which typography option do you prefer?
- show only the typography variants approved for that template.

## B. The two of you

3. Name 1 exactly as you want it to appear.
4. Name 2 exactly as you want it to appear.
5. Wedding date.
6. Short place to show on the cover.
Examples: Madrid, Murcia, Cartagena, La Manga.
7. Main contact email for the preview/delivery.

Validation:
- names hard max 30 characters each;
- cover place hard max 36.

## C. Countdown

8. Do you want a countdown?
- Yes / No.

If Yes:
- wedding time if needed;
- timezone is derived from location unless manually corrected.

## D. Your story

9. Do you want to include 'Nuestra historia'?
- No.
- Yes, text only.
- Yes, text + photo.

If Yes:
10. Tell us your story in a few lines.
Guidance shown to couple: 'A short, natural paragraph is enough. We will adapt punctuation/line breaks without changing your voice.'
- hard max 450 characters.

11. Optional short heading.
- leave blank to use the collection default;
- hard max 45.

If photo:
12. Upload one photo.
No instruction about portrait/landscape is necessary; the template supports all approved orientations.

Internal after upload:
- derive width/height/orientation;
- choose crop/full;
- set focusX/focusY when crop is used;
- visual QA that neither partner/important background is lost.

## E. Where are we celebrating?

13. Is ceremony and celebration in the same place?
- Yes, everything is in one place.
- No, ceremony and celebration are in different places.

### If one place
Ask:
- place/venue name;
- start time;
- address;
- Google Maps link (recommended);
- venue website (optional).

### If two places
Ceremony:
- name;
- ceremony time;
- address;
- Google Maps link;
- website optional.

Celebration:
- name;
- start time;
- address;
- Google Maps link;
- website optional.

14. Do you want to include a dress code?
- No.
- Yes -> exact short wording, hard max 60 characters.

15. Do you want guests to be able to add the wedding to their calendar?
- Yes / No.

16. Optional venue image.
- 0 or 1 image.
- Never request two images as a requirement.

## F. Moments of the day

17. Do you want to show an agenda / moments?
- No.
- Yes.

If Yes:
18. How many moments?
- 1 / 2 / 3 / 4 / 5.

For each moment:
- time;
- short label.

Suggested labels:
Ceremonia, Cóctel, Cena, Fiesta, Recena, Brunch, Preboda, Otro.

Hard max:
- label 28 characters.

## G. Practical information

19. Which of these do you want to include?
Multi-select, maximum 4:
- Bus / transport.
- Accommodation.
- Gift.
- Playlist.

If none:
- Practical section is omitted completely.

### G1. Bus / transport

Ask:
- pickup point(s), 1–3;
- outbound time(s), 1–3;
- return time(s), 0–4;
- optional short note, max 120 chars;
- optional maps link for pickup;
- Do you need guests to tell you in RSVP whether they will use the bus? Yes/No.
- If several routes/stops exist, do you need route choice? Yes/No.
- If several return times exist, do you need return-time choice? Yes/No.

Invitation:
- informational only;
- optional 'Cómo llegar';
- no bus reservation button when RSVP collects the choice.

### G2. Accommodation

20. How have you organised accommodation?
Choose ONE:
- Rooms at the finca/venue.
- Rooms pre-reserved in a hotel.
- We will organise/assign rooms ourselves.
- We only want to recommend a hotel/accommodation.
- Guests book directly through an external website.

Then collect common information:
- accommodation/hotel name;
- address;
- public website URL;
- phone/contact;
- optional Google Maps link.

Conditional questions:

Rooms at finca/venue:
- should guests tell you in RSVP if they want to stay?
- do you need nights?
- do you need number of people / occupancy?
- optional price / short note.

Pre-reserved hotel block:
- reservation under what name?
- booking/discount code?
- special rate/discount text?
- deadline?
- should guests book by phone, hotel website or another method?
- do you also need them to tell you in RSVP whether they will stay?

Couple-managed rooms:
- should guests request accommodation in RSVP?
- which nights are available?
- do you need occupancy/number of people?

Recommended only:
- no accommodation RSVP question by default.

External booking:
- booking URL;
- code/discount if applicable;
- deadline if applicable;
- whether you still want to know in RSVP if guests booked/stay there.

Invitation rendering:
- 'Ver hotel' when website exists;
- 'Reservar' only when the guest truly books externally;
- otherwise accommodation choices stay in RSVP.

### G3. Gift

21. Do you want to include gift information?
- No.
- Bank transfer.
- Bizum.
- External gift list/link.
- Short custom message.

Collect only fields relevant to selected mode.
Invitation shows concise wording and, when needed, an action such as 'Ver datos'.

### G4. Playlist

22. Do you want guests to suggest songs?
- No.
- Yes.

If Yes:
- target/link;
- optional short prompt, max 100 chars.

## H. RSVP

23. Allow +1?
- Yes / No.

24. Ask about children?
- Yes / No.

Transport questions:
- automatically derived from Bus answers.

Accommodation questions:
- automatically derived from Accommodation mode/answers.

25. Any additional custom RSVP questions?
- use existing GUEST custom-question capability.

The invitation itself always contains one CTA:
- default: 'Confirmar asistencia'.

## I. Gallery

26. Do you want a final photo gallery?
- No.
- Yes.

If Yes:
27. Upload between 1 and 4 photos and put them in your preferred order.

The couple does NOT need to choose crop mode.
Internal personalization:
- derive orientation;
- choose crop/full per photo;
- set focusX/focusY if cropped;
- verify both people / important environment remain visible.

## J. Closing

28. Closing line:
- use collection default; OR
- optional custom short line, hard max 80 characters.

Names/date are already reused from the main form.

## K. Final check shown to couple

Before submission show a compact summary:
- names;
- date;
- cover place;
- one/two locations;
- agenda count;
- selected practical options;
- gallery photo count;
- RSVP options.

Couple confirms: 'Everything is correct.'

## Internal generation output

The questionnaire does NOT generate arbitrary prose blocks.
It maps to the canonical GUEST invitation config.

Free-text fields are deliberately limited:
- story;
- optional short notes;
- optional closing line;
- optional playlist/gift wording.

All operational information is structured.
