# Phase 2 — Design Foundation Checklist

Status: SUBSTANTIALLY COMPLETE — validation remaining

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
- [x] Migrate existing bottom navigation to the shared foundation
- [x] Establish shared button primitives and migrate new/rebuilt screens to them
- [x] Add shared global form-control treatment
- [x] Establish shared modal/sheet foundation for all subsequent rebuilds
- [ ] Verify primitives in a real screen, not only as isolated code
- [ ] Build/type validation

## Design rule
New Phase 3+ screens must consume Phase 2 tokens/primitives first. One-off colours, arbitrary radii and duplicate button styles should not be introduced unless there is a documented feature reason.

## Latest migration pass
- Primary navigation replaced with `rg-app-dock` / `rg-dock-item` foundation.
- Global input/select/textarea focus and surface treatment centralized.
- Existing legacy modals remain functionally intact; their visual rebuild is scheduled in their respective journey phases rather than being cosmetically rewritten here.
