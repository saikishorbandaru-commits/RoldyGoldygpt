# Phase 2 — Design Foundation Checklist

Status: IN PROGRESS

## Completed foundation
- [x] Global colour tokens
- [x] Surface and border tokens
- [x] Typography hierarchy
- [x] Spacing scale
- [x] Radius and shadow scale
- [x] Shared button primitive (primary, secondary, ghost, danger)
- [x] Shared screen header primitive
- [x] Shared search field primitive
- [x] Shared modal shell primitive
- [x] Shared loading / empty / error state primitive
- [x] Focus-visible accessibility baseline
- [x] Reduced-motion baseline
- [x] Mobile safe-area baseline

## Remaining in Phase 2
- [ ] Migrate existing bottom navigation to the shared foundation
- [ ] Migrate existing legacy buttons to shared primitives where practical
- [ ] Migrate form controls to shared input treatment
- [ ] Migrate drawers/sheets to shared modal foundation
- [ ] Verify primitives in a real screen, not only as isolated code
- [ ] Build/type validation

## Design rule
New Phase 3+ screens must consume Phase 2 tokens/primitives first. One-off colours, arbitrary radii and duplicate button styles should not be introduced unless there is a documented feature reason.
