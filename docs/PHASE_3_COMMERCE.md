# Phase 3 — Product Discovery & Commerce

Status: IN PROGRESS

## Scope
- [x] Product discovery/catalog foundation from HomeRedesign
- [x] Product detail visual hierarchy migration started
- [x] Product detail visual hierarchy and shared header migration
- [x] Wishlist shared commerce shell migration
- [x] Cart shared commerce shell migration
- [x] Checkout shared commerce shell migration
- [ ] Product → cart → checkout critical-flow validation

## Rule
Phase 3 keeps existing commerce handlers and data contracts. UI changes must not remove Trial @Home, bargaining, exchange credit, wishlist or direct-buy entry points already connected to the commerce flow.

## Current implementation checkpoint
Phase 3 commerce surfaces now share the Phase 2 token foundation while preserving existing commerce handlers. Final remaining gate is end-to-end build and critical-flow validation, followed by any fixes exposed by CI.
