# RoldyGoldy Approved UI/UX Specification

## Source of truth
The approved **RoldyGoldy Jewellery App Showcase** is the visual source of truth. Existing screen markup must be replaced where its composition differs; colour overrides alone are not acceptance.

## Visual system
- Deep maroon/wine primary canvas.
- Warm jewellery-gold accent.
- Ivory/champagne paper surfaces for transactional screens.
- Editorial serif headlines; compact sans-serif controls.
- 10–18px rounded cards, thin gold borders, generous negative space.
- Subtle motion only; no layout shake.

## Approved navigation
1. Home
2. Categories
3. Trial @Home
4. Exchange & Save
5. Account

Wishlist and Cart remain contextual utilities rather than primary bottom-navigation destinations.

## Screen contracts
### Splash
Dark wine canvas, RoldyGoldy wordmark, concise promise, jewellery hero and gold loading accent.

### Onboarding
Full-screen editorial imagery/illustration, one message per screen, gold CTA. Feature sequence follows the approved board.

### Auth and OTP
Light ivory form surface, minimal phone entry, gold Continue CTA, dedicated four-cell OTP verification.

### Home
Brand and delivery location, compact utilities, white search field, maroon Trial @Home banner, two-column visual category grid, and best-seller product grid.

### Categories
Image-led two-column category tiles. Avoid a generic dashboard/filter layout as the primary composition.

### Catalog
Light ivory canvas, compact filter/sort controls, two-column product grid and trial availability markers.

### Product detail
Large product stage, minimal top utilities, name/rating/price below image, Trial @Home and Buy Now as primary actions; exchange and bargain remain contextual.

### Trial @Home
Step flow: Book → Try → Decide. Light paper cards, gold CTA and dedicated day/time selection.

### Exchange
Upload photos, select material category, receive estimate and see pickup-to-credit timeline. Normal indoor lighting must pass when the jewellery is clearly visible.

### Checkout and order
Ivory address/payment/summary surfaces with a large gold primary action. Confirmation is a focused success screen, not a dense dashboard.

### Tracking, returns, profile, wishlist and support
Use simple timelines, list rows, image-led grids and clear contact actions.

## Responsive rules
- Phone-first target: 320–430px.
- Dynamic viewport units for full-screen experiences.
- No fixed widths that overflow phones.
- Two-column product grids only while card width remains usable.
- Approximately 44px minimum interactive targets.
- Sticky actions account for Android safe-area/gesture space.

## Implementation rules
1. Rebuild JSX/component structure when the approved composition differs.
2. Preserve existing business logic and data behind the new UI.
3. A CSS recolour is not a completed redesign.
4. Each screen is visually checked against the approved board.
5. Real-device APK behaviour is the final acceptance gate.

## Rebuild order
1. Home — structural rebuild implemented.
2. Primary navigation — rebuilt to approved five-destination flow.
3. Categories/Catalog.
4. Product detail.
5. Trial flow.
6. Exchange flow.
7. Cart/checkout/order states.
8. Account/tracking/support.
9. Final device QA.
