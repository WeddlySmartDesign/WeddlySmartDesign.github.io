# GUEST — CATALOG TEMPLATE PLUGIN CONTRACT V1

Date: 2026-10-07
Status: REQUIRED FOR DESIGN 01–06

A catalog design is a visual plugin of one common invitation product pipeline.
It is not allowed to create its own commercial or management workflow.

## Required manifest

Each design must define:
- id;
- display name;
- pinned version;
- catalog status;
- supported typography/safe visual presets;
- questionnaire guide imagery for the common sections;
- renderer adapter;
- safe owner controls;
- scalability certification result.

## Common input

All designs receive the same canonical `guest-invitation-config-v1` data model.

A design may hide an optional module when disabled and may express it differently visually.
It may not require the couple or owner to re-enter the same information in a template-specific form.

If a future design genuinely requires a new customer datum, that datum is added once to the common schema/questionnaire after product review. It is not implemented as a private exception inside that design.

## Common renderer interface

Every final catalog renderer must support one operation conceptually:

`applyConfig(config)`

The pipeline passes:
- pinned template id/version;
- couple/date/location data;
- enabled/disabled modules;
- media;
- safe visual tuning;
- RSVP route already decorated with recipient context.

VEIL LIGHT currently exposes this through its frozen `VEIL_APPLY_CONFIG` implementation.
Its production wrapper/adaptor maps that frozen implementation into the common catalog interface; the frozen visual master itself is not redesigned.

Future designs expose an equivalent adapter.

## Common safe-edit rule

Owner controls may edit only:
- customer data/content;
- certified template presets;
- explicitly certified typography/size/focal-point choices.

Never owner-editable per order:
- free CSS;
- arbitrary coordinates;
- animation timing;
- DOM structure;
- bespoke breakpoints;
- one-off media hacks.

If a supported order needs one of those, the template has failed scalability and is removed/repaired globally.

## Common questionnaire

Questionnaire structure and wording remain one product flow.

The selected design supplies only the visual examples that illustrate each section.
Guide imagery must show a normal representative order, never an extreme stress-test order.

This means adding Design 02 does not create Questionnaire 02 as a separate product.
It adds a Design 02 guide pack to the common questionnaire.

## Common owner workspace

The owner Mobile Center must identify the order's `template_id` and load:
- that design's renderer;
- that design's certified safe controls.

Everything else stays the same:
receive -> inspect -> bounded edit if required -> review -> approval -> delivery.

Normal target: no edit.
Maximum operating target: <=5 minutes owner touch time.

## Common delivery bridge

Every final design produces a stable `delivery_url`.

The existing GUEST management application discovers the delivered invitation through the same license and sends that URL through the existing:
- guest list;
- group/subgroup;
- invitation-unit;
- personalized message;
- contact;
- WhatsApp/share;
- RSVP pipeline.

The template never implements sending itself.

## Common recipient context

The final invitation consumes:
- `rt` RSVP token;
- `g` guest OR `u` invitation unit;
- `lang`.

The catalog recipient helper converts those into the existing RSVP route.
The design only renders its CTA.

## Certification

Before a design enters sale:
- complete configuration matrix PASS;
- mobile widths PASS;
- no JS/layout failures;
- second unrelated real-order render PASS;
- no per-couple design intervention;
- review/final parity PASS;
- recipient-context/RSVP bridge PASS;
- owner mobile workflow PASS;
- owner touch target <=5 min.

Only then set registry status to `commercially-frozen`.


---

## Absolute reusable-media contract

Every visual template must treat generated art/motion as reusable master media.

Template media may contain only fixed visual language.
It must not contain baked-in variable wedding data.

All variable content must be supplied through the common config and rendered natively by the template adapter.

A template fails this contract if a supported order requires:
- per-couple AI/Recraft generation;
- manual media editing;
- manual text placement;
- manual layout repair;
- manual timing changes.

This applies to every Design 01–06 and any future catalog template.

Owner operating target remains:
**normal order = review only; total active intervention < 5 minutes.**
