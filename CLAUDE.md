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

**Dual slide transition:** `departingEl` state captures current `renderScreen()` JSX before navigation. Departing div is `position: absolute; inset: 0; animation: slideOutToLeft`. Incoming div is `position: absolute; inset: 0; animation: slideInFromRight`. Both inside a `position: relative; overflow: hidden` wrapper inside the shell.

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
- **`key={screenKey}`** on the incoming screen div re-mounts it to re-trigger `slideInFromRight`
