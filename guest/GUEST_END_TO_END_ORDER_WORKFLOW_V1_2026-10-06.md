# GUEST — END-TO-END ORDER WORKFLOW V1

Status: PILOT READY / NOT PUBLISHED
Date: 2026-10-06
Branch: guest-independent

## Purpose

Validate the real operating model before building more catalog designs.

The pilot covers the entire sequence:
1. couple completes the real structured questionnaire on mobile or desktop;
2. uploads Story / venue / Gallery photos;
3. exact answers are autosaved and reviewed before submission;
4. WeddlySmartDesign receives the order;
5. owner opens the private order manager;
6. order config is generated from the questionnaire;
7. VEIL LIGHT production workbench loads that config over the frozen scalable visual master;
8. invitation is marked ready for review;
9. couple can approve or request changes;
10. owner receives the response;
11. approved invitation is delivered;
12. test harness can reopen the final invitation.

This pilot deliberately happens BEFORE Design 02 so questionnaire/operations mistakes are fixed once for the catalog system.

## Backend

Supabase project:
- Weddly Smart Design VENDORS Project
- project ref: dnjsxequwgtyyauuofxj

### Table

public.guest_invitation_orders

Statuses:
- draft
- submitted
- designing
- review_ready
- review_sent
- changes_requested
- approved
- delivered
- cancelled

Security:
- RLS enabled;
- no direct browser table policy;
- access is mediated by Edge Function capability tokens or the existing Weddly owner-manager session.

### Storage

Private:
- guest-invitation-uploads
- 15 MB per image
- JPEG / PNG / WebP / HEIC / HEIF

Public final:
- guest-invitation-public
- used only when an approved order is delivered.

### Edge Function

guest-invitation-flow
Current deployed version at this checkpoint: v2.

Public capability flows:
- questionnaire load/save/upload/remove/submit;
- couple review load + approve/request changes;
- final delivered invitation load.

Private owner flows:
- list/detail orders;
- create isolated test order;
- start design;
- save resolved config;
- mark ready for review;
- send review;
- internal notes;
- deliver approved invitation.

Test-mode review/delivery emails do not contain broken production links. They confirm the email workflow while the pilot uses the local exact-master review/final artifacts.

## Questionnaire pilot

Two independent test orders were created:
- mobile UX pilot;
- desktop UX pilot.

The questionnaire is based on GUEST_COUPLE_QUESTIONNAIRE_V1 and preserves the V5 direction:
- no numeric step count;
- GUEST by WeddlySmartDesign brand lockup;
- contextual references, not a live self-service builder;
- real photo uploads;
- exact final review;
- agenda auto-sort;
- structured accommodation/gift data;
- full confirmation settings;
- Story photo optional;
- one or two locations.

## Owner manager

Pilot artifact:
- guest-orders-admin-v2.html

Uses the existing owner manager login, then reads/writes only the new order workflow.

It shows:
- status pipeline;
- exact questionnaire data;
- uploaded photos;
- internal notes;
- review requests;
- production actions.

## Design workbench

Pilot artifact:
- GUEST_VEIL_LIGHT_PRODUCTION_WORKBENCH.html

It is built directly from the frozen scalable VEIL LIGHT master:
- GUEST_VEIL_LIGHT_VISUAL_MASTER_SCALABLE_LOCKED_2026-10-06.html

The production panel is an external overlay and is not part of the invitation.
When an order is loaded:
- the owner workflow generates/resolves config;
- signed uploaded-photo URLs are hydrated;
- window.VEIL_APPLY_CONFIG(config) applies the order to the exact frozen master.

Therefore the pilot tests the real question that matters:
Does the questionnaire produce the intended invitation without redesigning the template?

## Couple review harness

Test artifacts:
- GUEST_REVIEW_TEST_MOBILE.html
- GUEST_REVIEW_TEST_PC.html

They use the same exact VEIL LIGHT scalable master and fixed test review capabilities.

After the owner marks the invitation ready:
- opening the review artifact loads the order config;
- couple sees the real invitation;
- couple can approve or request a concrete change;
- response updates the order workflow.

## Final-delivery harness

Test artifacts:
- GUEST_FINAL_TEST_MOBILE.html
- GUEST_FINAL_TEST_PC.html

After delivery:
- final public capability loads the delivered config;
- private uploaded assets are copied to the public final bucket;
- invitation opens on the same frozen master.

## Email behavior

Questionnaire submission:
- WeddlySmartDesign internal notification;
- couple confirmation.

Review:
- test-mode review-ready email proves email delivery without pointing to a nonexistent production URL;
- commercial hosted review URL will be wired only after the questionnaire/operations pilot is accepted.

Delivery:
- test-mode delivery email confirms delivery workflow;
- production order can additionally include the existing GUEST activation/access link when a paid license exists.

## Important production boundary

The commercial website/Stripe flow is NOT switched to this workflow yet.

Reason:
The owner explicitly requested a real pilot of questionnaire + operations before rolling it across the catalog or replacing the live checkout handoff.

After pilot acceptance:
1. host the customer questionnaire/review/final pages on the commercial surface;
2. connect guest-stripe-checkout to create guest_invitation_orders and email the new questionnaire route;
3. connect production RSVP/access provisioning;
4. retire the old guest-order.html path;
5. only then begin Design 02.

This avoids testing the operational architecture separately for every design.

## Pilot acceptance questions

Evaluate, through use rather than theoretical QA:
- Does the questionnaire feel short and natural on mobile?
- Does desktop feel intentionally designed rather than stretched?
- Are conditional questions understandable?
- Are uploads easy?
- Is final review exact enough to prevent misunderstandings?
- Does the owner receive enough information without opening raw JSON?
- Can VEIL LIGHT be produced from the answers without bespoke layout work?
- Is the couple review/change loop clear?
- Are emails timely and understandable?
- What should be removed or simplified before commercial wiring?

No additional catalog design work should start until this pilot is accepted.
