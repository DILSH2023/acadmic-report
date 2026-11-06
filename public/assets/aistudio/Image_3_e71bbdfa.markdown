---
name: Academic Momentum
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464555'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#684000'
  on-tertiary: '#ffffff'
  tertiary-container: '#885500'
  on-tertiary-container: '#ffd4a4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.04em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system blends a focused academic workspace with encouraging, dopamine-positive gamification cues. It is engineered for students seeking clarity, agency, and steady momentum through their coursework and milestone tracking. The visual philosophy couples **Modern Corporate/Product Clarity** with **Warm Tactile Minimalism**, steering clear of childish graphics or sterile enterprise dashboards.

Key attributes:
- **Calm Momentum:** UI density remains controlled; negative space signals composure rather than administrative burden.
- **Rewarding Progression:** Visual feedback loops (ring charts, milestone badges, status nodes) celebrate incremental consistency over high-stress urgency.
- **Clarity and Focus:** Essential targets, upcoming due dates, and grade weights receive immediate optical priority over passive metadata.

## Colors

The palette establishes an intentional cadence between focused work and rewarding accomplishments:

- **Primary (`#4F46E5` - Royal Indigo):** Used for focal points, high-priority interactive CTAs, active tab indicators, and current grade averages.
- **Secondary (`#10B981` - Vivid Emerald):** Denotes completion states, positive grade deviations, submitted work, streak indicators, and circular progress fills.
- **Tertiary (`#F59E0B` - Warm Amber):** Reserved for impending deadlines (within 48 hours), priority badges, reminders, and medium-tier urgency warnings.
- **Neutral (`#64748B` - Slate Neutral):** Provides precise typographic hierarchies and subtle divider structures.

Background surfaces rely on crisp white (`#FFFFFF`) mounted over soft slate canvas tones (`#F8FAFC`), while deep slate text (`#0F172A`) ensures WCAG AAA accessibility across mobile viewports.

## Typography

The design system uses **Plus Jakarta Sans** across all roles to achieve a contemporary, rounded grotesque feel that remains legible in dense data tables and schedules.

- **Headlines:** Use heavy weights (`700`, `800`) paired with subtle negative tracking (`-0.02em`) to produce firm, grounded section anchors.
- **Body:** Built on regular weights (`400`) at comfortable line heights (1.4–1.5×) to support scanning syllabi, assignment briefs, and study schedules.
- **Labels & Micro-badges:** Employ semi-bold (`600`) and bold (`700`) weights with gentle positive letter-spacing (`0.02em` to `0.04em`) to maintain sharp legibility within compact chips, pill tags, and status counters.

## Layout & Spacing

A strictly mobile-first **fluid grid system** forms the foundation of all application views:

- **Mobile Viewports (< 640px):** Single-column layout with a fixed `1rem` (16px) outer gutter and margin. Component gaps default to `space-md` (16px) for distinct visual separation without causing unnecessary scroll depth.
- **Tablet / Large Mobile (640px - 1024px):** Reflows into a 6-to-8 column fluid layout with `1.5rem` margins and gutters, supporting dual-card layouts (e.g., active coursework side-by-side with milestone rings).
- **Desktop / Web Preview (> 1024px):** Centers content inside a max-width container (960px) utilizing 12 columns for modular split-views between task backlogs and performance metrics.

## Elevation & Depth

Visual depth relies on **tonal contrast** paired with **ambient, color-tinted shadows** rather than harsh outlines:

- **Canvas Level (Ground 0):** Background surface set to `#F8FAFC`.
- **Card Surfaces (Layer 1):** Solid white (`#FFFFFF`) lifted by a subtle, cool ambient shadow: `0 1px 3px rgba(15, 23, 42, 0.04), 0 6px 16px rgba(79, 70, 229, 0.04)`.
- **Raised Interactive Cards (Layer 2):** Assignment cards and interactive task blocks utilize a soft hover/press elevation: `0 4px 12px rgba(15, 23, 42, 0.06), 0 12px 24px rgba(79, 70, 229, 0.08)`.
- **Overlays & Modals (Layer 3):** Bottom sheets and quick-entry drawers cast a diffused shadow: `0 16px 32px -4px rgba(15, 23, 42, 0.12), 0 8px 16px -4px rgba(15, 23, 42, 0.06)`.
- **Borders:** Thin structural borders (`1px solid #E2E8F0`) provide crisp definition where shadows alone might blur hierarchy.

## Shapes

The design system uses a balanced, approachable corner radius profile (`roundedness: 2`):

- **Micro elements (Badges, tags, checkmarks):** `0.375rem` (6px) to `0.5rem` (8px).
- **Core components (Buttons, input boxes, drop-downs):** Standard `0.5rem` (8px) for structural unity.
- **Cards & Task containers:** `1rem` (16px) to give prominent content blocks an organic, tactile frame.
- **Pill Badges & Progress Tracks:** Full radius (9999px) for completion bars, micro-badges, and filter pills.

## Components

### Buttons
- **Primary:** Background `#4F46E5`, foreground `#FFFFFF`, border radius `0.5rem`, padding `0.75rem 1.25rem`. Text style `label-lg`. Active state triggers a subtle scale down (`scale(0.98)`).
- **Secondary:** Subtle indigo background tint (`#EEF2FF`), text `#4F46E5`, zero border.
- **Tertiary/Ghost:** Transparent background with `#64748B` text, shifting to `#0F172A` on press.

### Chips & Micro-Badges
- **Status Chips:** Full pill radius (`9999px`), padding `0.25rem 0.625rem`. Text style `label-sm`.
  - *Completed:* Emerald tint background (`#ECFDF5`), emerald text (`#047857`).
  - *Due Soon:* Amber tint background (`#FFFBEB`), amber text (`#B45309`).
  - *In Progress:* Indigo tint background (`#EEF2FF`), indigo text (`#4338CA`).

### Cards & Progress Containers
- Background `#FFFFFF`, border `1px solid #F1F5F9`, border radius `1rem`, internal padding `1rem` to `1.25rem`.
- Coursework cards include an emerald or amber accent border (3px) along the left boundary to denote priority and status at a glance.

### Inputs & Form Controls
- **Inputs:** Clean white base, border `1px solid #CBD5E1`, border radius `0.5rem`, padding `0.75rem 1rem`. Focus state features a crisp ring: `box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2)` with a border color transition to `#4F46E5`.
- **Checkboxes & Radios:** `1.25rem` square/circle, base border `2px solid #94A3B8`. Selected state transitions smoothly to `#10B981` with an inner white check glyph.

### Progress Gauges & Rings
- **Progress Track:** Flat slate track `#E2E8F0`, 6px stroke-width.
- **Fill Indicator:** Rounded stroke end-caps rendered in `#10B981` (or `#4F46E5` for overall GPA metrics). Center label displays numeric percentage styled with `headline-sm`.