# RoldyGoldy — Phase 1 Scope Freeze & UI Rebuild Inventory

Status: PHASE 1 COMPLETE
Source of truth: RoldyGoldy master plan.pdf + current customer-app repository

## Phase 1 decision
The current repository is frozen as the functional baseline. Existing behaviour, handlers, product data and navigation should be preserved where possible. The legacy visual hierarchy is NOT the design baseline: each in-scope journey must be structurally rebuilt and visually verified.

## A. Blueprint-mandated MVP journeys
| ID | Journey / screen | Current repository evidence | Functional decision | UI decision | Phase |
|---|---|---|---|---|---|
| A01 | Auth & Pincode | LoginScreen, AuthModal, LocationSelectorModal | Keep/integrate | Rebuild | Batch 1 |
| A02 | Home & Catalog | App.tsx, HomeRedesign | Keep/integrate | Rebuild | Batch 2 |
| A03 | Product Detail (PDP) | ProductDetailView | Keep/integrate | Rebuild | Batch 3 |
| A04 | Scrap Valuation | LivePhotoUploadModal | Keep/integrate | Rebuild | Batch 4 |
| A05 | Trial Booking / Cart | TrialConciergeModal, CartDrawer | Keep/integrate | Rebuild | Batch 3/4 |
| A06 | Payment & Confirmation | CheckoutModal, OrderSuccessModal | Keep/integrate | Rebuild | Batch 3 |
| A07 | Live Tracking & Support | OrderLiveTrackingModal | Keep/integrate | Rebuild | Batch 5 |

## B. Current customer-app journeys that remain in scope
| ID | Journey / screen | Current repository evidence | Functional decision | UI decision | Phase |
|---|---|---|---|---|---|
| B01 | Splash & intro | SplashScreen, IntroBannerSlides | Keep | Rebuild/verify | Batch 1 |
| B02 | Wishlist | WishlistDrawer | Keep | Rebuild | Batch 3 |
| B03 | Account | AccountView | Keep | Rebuild | Batch 5 |
| B04 | Boutique discovery | BoutiqueView | Keep | Rebuild | Batch 5 |
| B05 | Bargaining | BargainModal, BargainPickerModal | Keep | Rebuild | Batch 4 |
| B06 | Virtual Try-On | VirtualTryOnModal, VirtualTryOnJewelryOverlay | Keep | Rebuild | Batch 4 |
| B07 | Artisan showcase | ArtisanShowcaseModal | Keep | Rebuild | Batch 5 |
| B08 | Jewellery Mart tour | JewelleryMartTourModal | Keep | Rebuild | Batch 5 |
| B09 | Profile reports | ProfileReportsModal | Keep | Rebuild | Batch 5 |
| B10 | Seller ad booking | SellerAdBookingModal | Keep | Rebuild/verify scope | Batch 5 |

## C. Required state coverage on every rebuilt journey
- Loading
- Empty
- Error/retry where applicable
- Back/cancel behaviour
- Mobile safe-area behaviour
- Accessibility labels and reduced motion
- Location/PIN-dependent availability where relevant

## D. Product-routing rules to preserve
1. PIN establishes the primary location and catalog context.
2. Local Trial-eligible inventory is distinct from Universal Pan-India inventory.
3. Trial-only filtering must remain available from catalog discovery.
4. Trial booking is limited to eligible items and scheduled slots.
5. Universal products communicate standard delivery rather than Trial @Home.
6. Scrap valuation supports material selection, photo submission and instant credit/discount presentation.
7. Checkout/payment distinguishes trial booking fee from full purchase value.
8. Tracking/support supports rider/courier status and trial handover context.

## E. Scope boundaries
- Customer app is the active rebuild target.
- Admin/vendor operations are out of the current visual rebuild unless a dedicated panel is added later.
- Precious 22K/24K gold and certified natural diamond commerce is out of the blueprint scope.
- Existing non-blueprint experimental screens are retained only when already part of the customer experience; they do not define the visual system.

## F. Completion gate for each screen
A screen cannot be marked complete because a commit exists or a build passes. It requires:
1. Actual layout/component structure rebuilt or intentionally retained.
2. Existing core functionality connected.
3. Visual verification against the approved RoldyGoldy direction.
4. Responsive/mobile verification.
5. Empty/loading/error states checked where relevant.
6. Navigation and back/cancel behaviour checked.

## Phase 1 exit criterion
This document is the frozen rebuild inventory. All subsequent UI work must map to one of the IDs above, or be explicitly added to the inventory before implementation.
