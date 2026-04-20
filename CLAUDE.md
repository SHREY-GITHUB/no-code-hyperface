# Hyperface Studio — CLAUDE.md

## Project Overview
No-code credit card onboarding journey configurator. Lets product managers configure a multi-stage applicant journey (form fields, KYC methods, bureau rules, agreement docs) and preview it in a simulated mobile/desktop UI.

**Stack:** React 18 + Vite 6 + Tailwind CSS 3, Inter font, no external UI library.  
**Dev server:** `npm run dev` → http://localhost:5173

---

## File Map

```
src/
├── App.jsx                          # Root — owns all shared state
├── index.css                        # Global styles + all @keyframes
├── components/
│   ├── LeftPanel.jsx                # Sidebar: stage list, drag-to-reorder, Publish button
│   ├── StageItem.jsx                # Individual stage row (drag handle + toggle)
│   ├── MiddlePanel.jsx              # Main config area: top bar + settings panel router
│   ├── RightPanel.jsx               # Live preview phone mockup (static, reflects config)
│   ├── DemoControlsPanel.jsx        # Floating bottom-right panel with 3 scenario toggles
│   ├── ApplicationFormSettings.jsx  # Fields tab + Validation Rules tab
│   ├── BureauDecisioningSettings.jsx
│   ├── KYCVerificationSettings.jsx
│   ├── AgreementConsentSettings.jsx
│   └── PreviewMode.jsx              # Full-screen animated journey preview (~1100 lines)
```

---

## State Architecture (App.jsx owns everything)

| State | Type | Passed to |
|---|---|---|
| `stages` | `Stage[]` | LeftPanel (r/w), PreviewMode (r) |
| `selectedStage` | `string \| null` | LeftPanel, MiddlePanel, RightPanel |
| `fields` | `Field[]` | MiddlePanel → ApplicationFormSettings, RightPanel, PreviewMode |
| `kycMethods` | `KycMethod[]` | MiddlePanel → KYCVerificationSettings, RightPanel, PreviewMode |
| `clientId` | `'hdfc' \| 'slice' \| 'jupiter'` | MiddlePanel (r/w via ClientSelector), PreviewMode |
| `demoControls` | `{ bureauFailure, manualReview, lowScoreDecline }` | DemoControlsPanel (r/w), MiddlePanel (r, for indicator), PreviewMode (r) |
| `previewOpen` | `boolean` | Controls whether PreviewMode renders |

### Stage shape
```js
{ id: 1|2|3|4, name: 'Application Form'|'Bureau & Decisioning'|'KYC Verification'|'Agreement & Consent', enabled: boolean }
```

### Field shape
```js
{ id, name, type: 'Text'|'Date'|'Dropdown'|'Number', show: boolean, required: boolean, hint: string|null }
```

---

## PreviewMode Key Concepts

**Screen → Stage mapping:**
```js
const STAGE_SCREEN = {
  'Application Form': 1,
  'Bureau & Decisioning': 2,
  'KYC Verification': 3,
  'Agreement & Consent': 4,
}
```

**Disabled stage skipping:** `enabledScreens` filters `stages` by `enabled`, then `next()` jumps to the next enabled screen number.

**Route-based navigation (PreviewMode):** Navigation uses a `route` object `{ screen, kyc, success }` and a `prevRoute` that holds the screen sliding out. Each route has a stable string key via `routeKey(r)`. React matches elements by key, so when a screen moves from "current" to "departing" it keeps the SAME key → same component instance → local state (bureau animation step, form page) is preserved during the slide-out. The incoming screen gets a new key → fresh mount → slides in from right with `animation-fill-mode: both` to prevent one-frame flash. **Never re-introduce `setDepKey`** — incrementing the key forces a remount and causes the content-reset glitch.

**Client data:** `CLIENT_DATA` map at top of file — hdfc, slice, jupiter. Each has `name, bankName, cardName, logoText, logoColor, urlSlug, creditLimit, cardVariant, interestRate`.

**Agreement text:** `getAgreementText(client)` function — injects client name/rate/variant dynamically.

**Demo controls:** `demoControls` prop; Screen2 renders `ApprovalCard | BureauFailureCard | ManualReviewCard | DeclineCard` based on which flag is true (mutually exclusive).

---

## CSS Keyframes (all in index.css)

| Name | Used for |
|---|---|
| `spin` | Loading spinners |
| `springIn` | KYC verified + success checkmark circle |
| `checkDraw` | SVG stroke draw on checkmarks |
| `fadeSlideUp` | Bureau outcome cards appearing |
| `slideInFromRight` | New preview screen entering |
| `slideOutToLeft` | Departing preview screen |
| `stageFadeIn` | Middle panel stage switch |
| `fadeIn` | ClientSelector dropdown |
| `scaleIn` | Bureau row check icon |
| `pulse-ring` | (available, unused) |

---

## Key Design Decisions
- **No React Router** — single page, `previewOpen` boolean gates PreviewMode
- **No state management lib** — all state lifted to App.jsx, prop-drilled intentionally (small app)
- **StageItem toggle is controlled** — `enabled`/`onToggle` come from App via LeftPanel, no local state
- **Validation Rules** are local state inside `ValidationRules` component (not lifted — not needed in preview)
- **DemoControls are mutually exclusive** — toggling one sets the other two to false
- **`key={selectedStage}`** on the middle panel content div triggers `stageFadeIn` on stage switch
- **`key={routeKey(route)}`** on the incoming screen div re-mounts it to re-trigger `slideInFromRight`

---

## QA Checklist — Must Pass Before Every Push to Main

Run through this manually (or via the dev server `npm run dev`) before committing to `main`.

### 1. Homepage
- [ ] All 3 program cards display correctly (name, bank, status badge, metrics)
- [ ] "Configure" button on each card opens the editor for the correct client
- [ ] Stats row shows correct values; trend badges are green
- [ ] "New Program" button in top bar opens editor (HDFC default)
- [ ] Responsive: on mobile (≤640 px) stats collapse to 2-col grid, programs to 1-col

### 2. Left Panel (Editor Sidebar)
- [ ] All 4 stages listed; enabled count badge is correct
- [ ] Clicking a stage highlights it and opens the right settings panel
- [ ] Toggle switches each stage on/off; OFF badge appears for disabled stages
- [ ] Drag-to-reorder: grab the ⠿ handle, reorder stages, list updates
- [ ] "Publish Journey" button opens the Publish modal
- [ ] "H" logo click returns to the Homepage

### 3. Middle Panel — Stage Settings
- [ ] Selecting **Application Form** shows fields list and Validation Rules tab
- [ ] Selecting **Bureau & Decisioning** shows bureau settings
- [ ] Selecting **KYC Verification** shows KYC method toggles
- [ ] Selecting **Agreement & Consent** shows document list
- [ ] Stage switch triggers `stageFadeIn` animation — no flash, no jump
- [ ] Client selector dropdown works; name updates in breadcrumb
- [ ] "Analytics" button toggles the analytics panel; button stays highlighted

### 4. Right Panel (Live Preview)
- [ ] Phone mockup reflects the currently selected stage content
- [ ] Form preview shows visible fields for the active page
- [ ] KYC preview lists enabled methods only
- [ ] Bureau preview shows score + rules
- [ ] Agreement preview shows document list
- [ ] Disabled stage shows the "Stage Off" screen

### 5. PreviewMode — Slide Transitions (most critical)
- [ ] Open Preview → lands on the first enabled screen (no animation on first load)
- [ ] Click "Continue →" on Screen1 → **Screen1 slides OUT to the left at its current form page** (not page 1); Screen2 slides IN from the right — no content reset, no flash
- [ ] Wait for bureau animation to reach the approval card (step=3), then click "Accept Offer" → **approval card slides OUT** (not loading spinners); Screen3 slides IN — no content reset
- [ ] KYC screen → click "Aadhaar OTP" → OTP sub-screen slides in; verify OTP → Agreement screen slides in
- [ ] Agreement screen → sign & submit → Success screen slides in with spring animation
- [ ] Switch Mobile ↔ Desktop while mid-flow — no crash, shells swap correctly
- [ ] Demo controls: enable "Bureau Failure" → Screen2 shows failure card instead of approval

### 6. DemoControls Panel
- [ ] Panel collapses/expands on header click
- [ ] Enabling one scenario disables the others (mutually exclusive)
- [ ] "Scenario Active" indicator appears in the MiddlePanel top bar when any is on

### 7. Publish Modal
- [ ] Opens from left panel "Publish Journey" button
- [ ] Shows correct stages, fields count, and client name
- [ ] Close button (×) dismisses the modal

### 8. Responsive (Mobile ≤768 px)
- [ ] Hamburger button appears in MiddlePanel top bar
- [ ] Tapping hamburger slides in the left drawer
- [ ] Tapping the overlay closes the drawer
- [ ] Right panel is hidden; PreviewMode still opens full-screen
- [ ] Settings grids collapse to single column
- [ ] Publish modal goes full-screen

### 9. Build Check
```bash
npm run build   # must exit 0, no warnings treated as errors
```

### Animation-specific regression tests
- **Never use a function component defined inside another component's render body for animated containers.** React recreates the function reference each render → full unmount/remount → kills running CSS animations.
- **Never increment `departingKey` (or any key) on the departing screen.** A new key = new React instance = local state reset = content glitch visible during slide-out.
- **Always use `animation-fill-mode: both`** on incoming screens (`slideInFromRight`) to prevent the one-frame flash at position 0 before the animation starts.
- **Always use `translate3d` (not `translateX/Y`) in keyframes** to force GPU compositor layers from frame zero.
