# Phase 6 — QA, Release Validation & Android Readiness

Status: REOPENED — REAL DEVICE BUG FIX CYCLE

## Scope
- [x] Review build, type-check and Android CI pipeline
- [x] Confirm debug APK artifact is produced by successful CI
- [x] Confirm Android sync is part of validation
- [x] Complete final UI consistency pass (Phases 1–5 shared design-system migration complete)
- [x] Confirm latest completed Phase 5 CI baseline (run #114 successful)
- [x] Resolve known validation findings
- [x] Close Phase 6 implementation work

## Release checklist
- [x] TypeScript check (latest completed baseline successful)
- [x] Web production build (latest completed baseline successful)
- [x] Android Capacitor sync (latest completed baseline successful)
- [x] Android debug APK assembly (latest completed baseline successful)
- [ ] Download/install smoke test on a physical Android device (manual device gate)
- [ ] Customer critical-flow smoke test (manual acceptance gate)
- [x] Release APK/signing decision documented (debug APK = internal testing; signed release build required for production distribution)

## Critical customer flows
1. Open app → browse products → product detail
2. Wishlist → cart → checkout → order success
3. Trial @Home booking and OTP stages
4. Exchange / photo valuation journey
5. Bargaining → accepted deal → commerce application
6. Account → orders → live tracking → reports
7. Login/signup/logout

## Note
Virtual Try-On remains intentionally discontinued and is not part of release acceptance.

## Automated validation result
Latest Phase 6 CI validation completed successfully: GitHub Actions run #118. The successful run produced both the web build artifact and the Android debug APK artifact. The debug APK artifact is available in GitHub Actions as `roldygoldy-debug-apk` (8,815,281 bytes compressed artifact), retained for 7 days.

## Current checkpoint
Release documentation is now aligned with the actual RoldyGoldy product scope. The CI workflow already performs the automated type, web build, Android sync and debug APK assembly gates. The automated release candidate is prepared. Remaining release acceptance is the latest queued CI confirmation plus a physical-device installation and critical-flow smoke test before treating a production release as customer-ready.

## Phase 6 implementation exit record
All automated engineering and release-readiness tasks in Phase 6 are complete. Multiple completed CI runs through run #120 are successful. Runs #121 and #122 are the latest documentation-triggered validations and are still in progress at this checkpoint. Physical-device installation and customer smoke testing remain external/manual acceptance gates and are explicitly not claimed as completed.

## UI parity completion pass
The approved showcase parity layer has now been extended to transactional drawers and customer modals: cart, wishlist, checkout, bargaining, Trial @Home, location selection, order success and live order tracking. These flows now share the same cream paper surfaces, burgundy accents, gold primary actions and responsive mobile treatment as the rebuilt core screens.

## Real-device bug cycle
User-reported device issues reopened Phase 6. Current fixes address responsive sizing/safe areas, layout stability and exchange photo verification being overly strict about normal indoor lighting. Phase 6 must not be re-closed until the rebuilt APK is tested on the reporting device and the remaining recording findings are resolved.
