# GUEST — MOBILE CENTER + GUIDED QUESTIONNAIRE

Date: 2026-10-06
Branch: guest-independent

## Objective

Remove the operational friction exposed by the real pilot:
- no more hunting through multiple HTML files or chat messages;
- owner production work must be practical from a phone;
- the couple questionnaire must visually explain what each block controls.

VEIL LIGHT V5.3.3 remains commercially frozen. This work does not change its renderer, design, motion, layout or visual tokens.

## Guided questionnaire

Canonical artifact:
- /GUEST/MOBILE_CENTER/GUEST_QUESTIONNAIRE_VEIL_LIGHT_GUIDED_V1.html

The questionnaire now:
- shows a real VEIL LIGHT example image for every step;
- uses the example only as guidance, with clear copy that the couple's own data will replace it;
- uses simpler, non-technical Spanish;
- renames ambiguous concepts such as dress code, RSVP and practical details into plain-language labels;
- explains after-midnight Agenda times with an example;
- keeps all existing validations and backend save/submit behavior;
- accepts the questionnaire token dynamically instead of being tied to one pilot order.

Guided steps:
1. Datos principales / Cover.
2. Vuestra historia.
3. Ceremonia y celebración.
4. Horarios del día.
5. Información útil.
6. Confirmación, fotos y cierre.
7. Comprobar datos.

## Single-file owner mobile center

Canonical artifact:
- /GUEST/MOBILE_CENTER/GUEST_MOBILE_CENTER_V1.html

This is the single owner-side file to keep on the phone.

It contains the exact frozen VEIL LIGHT V5.3.3 renderer and adds only an owner operational shell.

From the same file the owner can:
- unlock the private GUEST center;
- create a new complete test order;
- open the guided questionnaire for that test;
- refresh and receive submitted orders;
- prepare/view the invitation;
- edit permitted data and safe visual controls;
- view the questionnaire of the selected order;
- open the exact review path through review_load;
- in test mode, approve or request a change from the couple view;
- open the exact delivered public path through public_load;
- return to the owner center from a persistent CENTRO GUEST control.

No separate Review/Final HTML is required for owner testing anymore.

Production couple links remain a later hosting/wiring concern. Stripe/publication remain unchanged.

## Persistence

Library:
- /GUEST/MOBILE_CENTER/GUEST_MOBILE_CENTER_V1.html
- /GUEST/MOBILE_CENTER/GUEST_QUESTIONNAIRE_VEIL_LIGHT_GUIDED_V1.html

SHA-256:
- Mobile Center: 54a048d1211917c510a91e255b0abd971d5010e1dede0cfbd4b549321e3a7b3b
- Guided Questionnaire: 3e313de4f5ade351b29047852d628674bb944687750df405e7fcbf693b94d41d

## QA

- JavaScript syntax PASS for the guided questionnaire.
- JavaScript syntax PASS for the Mobile Center owner-workbench script.
- The VEIL LIGHT renderer core block is byte-identical to the frozen V5.3.3 master.
- No ONE, ONE Partner or STUDIO files touched.
- No Stripe connection.
- No publication.

## Next action

Owner downloads GUEST_MOBILE_CENTER_V1.html to the phone and uses this file as the only owner operational/test entry point.

If mobile usability passes, this packaging task is closed and Design 02 can start without reopening VEIL LIGHT.
