# Phase 4 — Signature RoldyGoldy Features

Status: COMPLETE

## In scope
- [x] Trial @Home scheduling, eligibility, fee and staged OTP journey preserved
- [x] AI Jewellery Exchange / photo valuation journey preserved
- [x] Bargaining picker and live negotiation journey preserved
- [x] Shared signature feature shell applied across feature journeys
- [x] Unified feature surface, header, input and focus treatment
- [x] Build/type/Android validation (successful CI after feature migration and Virtual Try-On removal)
- [x] Resolve validation findings
- [x] Close Phase 4

## Scope change
- Virtual Try-On is discontinued by product decision because of major feature issues.
- It is removed from active Phase 4 scope and must not be treated as a required customer feature.
- Future feature work must not add new Virtual Try-On entry points.

## Guardrail
Phase 4 UI migration must preserve existing feature state machines and entry points. In particular, Trial @Home eligibility and staged delivery/return OTP behaviour, exchange valuation flow and bargaining deal application must not be removed by the redesign.

## Phase 4 exit record
Phase 4 is closed with Virtual Try-On intentionally discontinued. Trial @Home, AI Jewellery Exchange / photo valuation, and Bargaining journeys remain in scope and retain their existing state machines and business actions. The latest CI validation after the Virtual Try-On removal completed successfully (GitHub Actions run #103, commit `df890f4cdd00902870f4c0bfb042003303f9bd30`).
