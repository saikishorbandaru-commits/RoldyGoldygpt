# RoldyGoldy Release Candidate

## Candidate status
**AUTOMATED VALIDATION PASSED — MANUAL DEVICE ACCEPTANCE REQUIRED**

The current release candidate is eligible for Android device smoke testing once the latest CI run completes successfully.

## Automated gates
- TypeScript check
- Production web build
- Capacitor Android sync
- Android debug APK assembly
- Debug APK artifact upload

## Manual gates before customer release
1. Install the generated APK on a physical Android device.
2. Complete the critical-flow checklist in `docs/ANDROID_SMOKE_TEST.md`.
3. Record blocking defects and resolve them.
4. Decide whether the debug artifact is sufficient for internal testing or whether a signed release APK/AAB is required for distribution.

## Scope confirmation
Included: commerce, Trial @Home, exchange/valuation, bargaining, account, orders, tracking, reports and authentication.

Excluded: Virtual Try-On (intentionally discontinued).

## Distribution note
The current CI output is a **debug APK**. It is suitable for internal installation/testing, but production distribution should use an appropriate signed release build after manual acceptance.
