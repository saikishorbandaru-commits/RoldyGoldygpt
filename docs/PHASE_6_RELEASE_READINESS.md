# Phase 6 — QA, Release Validation & Android Readiness

Status: IN PROGRESS

## Scope
- [x] Review build, type-check and Android CI pipeline
- [x] Confirm debug APK artifact is produced by successful CI
- [x] Confirm Android sync is part of validation
- [ ] Complete final UI consistency pass
- [ ] Confirm latest Phase 5 closure CI result
- [ ] Resolve any validation findings
- [ ] Close Phase 6

## Release checklist
- [ ] TypeScript check
- [ ] Web production build
- [ ] Android Capacitor sync
- [ ] Android debug APK assembly
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
