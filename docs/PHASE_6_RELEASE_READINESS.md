# Phase 6 — QA, Release Validation & Android Readiness

Status: IN PROGRESS

## Scope
- [x] Review build, type-check and Android CI pipeline
- [x] Confirm debug APK artifact is produced by successful CI
- [x] Confirm Android sync is part of validation
- [x] Complete final UI consistency pass (Phases 1–5 shared design-system migration complete)
- [x] Confirm latest completed Phase 5 CI baseline (run #114 successful)
- [x] Resolve known validation findings
- [ ] Close Phase 6

## Release checklist
- [x] TypeScript check (latest completed baseline successful)
- [x] Web production build (latest completed baseline successful)
- [x] Android Capacitor sync (latest completed baseline successful)
- [x] Android debug APK assembly (latest completed baseline successful)
- [ ] Download/install smoke test on a physical Android device
- [ ] Customer critical-flow smoke test
- [ ] Release APK/signing decision

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

## Current checkpoint
Release documentation is now aligned with the actual RoldyGoldy product scope. The CI workflow already performs the automated type, web build, Android sync and debug APK assembly gates. Remaining release acceptance is the latest queued CI confirmation plus a physical-device installation and smoke test before treating a release APK as customer-ready.
