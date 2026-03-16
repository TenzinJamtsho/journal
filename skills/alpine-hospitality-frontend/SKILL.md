---
name: alpine-hospitality-frontend
description: Use when generating or refining frontend UI that should follow a warm, premium Modern Alpine hospitality aesthetic inspired by gasthof-enzian.at, with elegant typography, restrained luxury, editorial layouts, and hospitality-focused interaction patterns.
---

# Modern Alpine Frontend

Use this skill when the user wants frontend work that should feel like premium Alpine hospitality rather than generic SaaS or startup UI.

This style should feel:

- warm
- refined
- architectural
- editorial
- quiet
- premium

It should not feel:

- corporate dashboard-like
- neon or overly trendy
- hyper-minimal to the point of sterility
- crowded or template-generated

## Use This Skill For

- hotel, lodge, resort, chalet, restaurant, and hospitality websites
- booking flows that need premium visual treatment
- landing pages that should feel warm and aspirational
- content sections built around scenery, rooms, dining, wellness, or local experience
- frontend redesigns where the user wants an upscale European hospitality look

## Core Design Direction

Design toward "Warm, Traditional, Architecturally Clean."

The visual language should combine:

- Alpine warmth: natural materials, quiet luxury, heritage cues
- editorial spacing: generous rhythm, image-led storytelling, strong hierarchy
- modern restraint: clean alignment, limited accent usage, calm surfaces

## Workflow

When applying this skill:

1. Define a clear visual system before composing sections.
2. Establish color variables and typography choices early.
3. Build layout with strong spacing and hierarchy first.
4. Use imagery, cards, and call-to-action areas to create mood.
5. Add restrained motion only after layout is strong.
6. Check mobile behavior last without collapsing the visual identity.

Do not start by assembling generic sections from memory. Start with the visual language and page rhythm.

## Visual Tokens

Use these as the default palette unless the user gives different brand colors.

- Deep Forest Green: `#2D4739`
- Slate Gray: `#4A4A4A`
- Warm Off-White: `#F9F7F2`
- Soft Stone: `#D9D2C3`
- Burnt Orange accent: `#B86A3B`
- Muted Gold accent: `#B59A5A`

### Color Guidance

- Primary actions should use burnt orange or muted gold sparingly.
- Main surfaces should lean warm, not icy.
- Dark sections should use moss, charcoal, or deep forest tones instead of pure black.
- Avoid bright blue UI accents unless explicitly required.
- Avoid pure white full-page backgrounds; prefer cream, parchment, or layered warm neutrals.

## Typography

Default type pairing:

- Headings: `Cormorant Garamond` or similar high-contrast serif
- Body: `Inter` or similarly clean sans-serif

Typography rules:

- Headings should feel elegant and spacious, with strong scale contrast.
- Body copy should stay highly legible and calm.
- Labels and meta text can use uppercase with tracking.
- Do not mix serif and sans within the same phrase unless there is a deliberate editorial reason.
- Avoid chunky display fonts, geometric futurist fonts, or playful rounded type.

### Recommended Hierarchy

- Hero heading: large serif, dramatic but not flashy
- Section heading: serif or refined sans depending on tone
- Eyebrow text: small uppercase sans with letter spacing
- Body text: understated sans, usually 14px to 16px equivalent

## Layout Patterns

Prefer:

- full-width hero imagery with centered or asymmetrical headline blocks
- alternating image and text sections
- asymmetrical grid compositions
- large whitespace bands between sections
- quiet cards with soft separation rather than hard borders everywhere

Page rhythm should feel like a luxury hospitality editorial spread, not a compact product dashboard.

### Section Types That Fit Well

- hero with scenic imagery and booking call-to-action
- featured rooms or spaces grid
- dining or experience highlights
- story/about section with image + copy pairing
- testimonial or guest quote strip
- seasonal callout or booking banner
- gallery mosaic

## Component Patterns

### Hero

- Use large visual imagery or atmospheric background treatment.
- Keep copy concise.
- Pair a serif headline with a compact supporting paragraph.
- CTA buttons should be prominent but restrained.

### Cards

- Use borderless or lightly bordered cards.
- Prefer soft shadows and layered surfaces over hard outlines.
- Use large internal padding.
- Let imagery lead when relevant.

### Navigation

- Keep it minimal.
- Use transparent-to-solid behavior on scroll if appropriate.
- Avoid bulky nav chrome.

### Buttons

- Rounded or softly squared corners are both acceptable.
- Primary buttons should feel tactile and refined.
- Secondary actions should be understated, not ghosted to invisibility.
- Hover states should be subtle: small lift, warmth shift, soft shadow, or slight scale.

### Forms

- Forms should feel premium and calm, not enterprise-heavy.
- Use clear spacing and readable labels.
- Inputs should have warm surfaces and subtle focus states.
- Avoid harsh blue focus rings if a brand-aligned focus treatment is available.

### Icons

- Use `lucide-react`.
- Prefer thin, elegant icons.
- Keep icon usage sparse and intentional.

## Motion

Motion should support elegance, not novelty.

Use:

- fade and slide reveals
- soft scale on buttons or cards
- slow background movement only when subtle
- staggered entry for grids when useful

Avoid:

- springy or playful motion
- exaggerated bounce
- flashy parallax
- over-animated microinteractions

## CSS / Implementation Guidance

- Use Tailwind CSS for styling.
- Define CSS variables for the palette and key surfaces.
- Use CSS Grid for editorial and gallery-like sections.
- Use Flexbox for local alignment, not entire-page structure by default.
- Keep shadow language consistent across the page.
- Prefer a small number of strong visual decisions over many decorative effects.

## Mobile Guidance

On mobile:

- keep the warmth and editorial tone intact
- stack sections cleanly without flattening the design
- preserve generous spacing where possible
- simplify asymmetry thoughtfully rather than collapsing everything into bland vertical cards

Do not let the mobile version become a generic app screen.

## Content Tone

Text should feel:

- calm
- confident
- welcoming
- understated

Avoid copy that sounds:

- aggressively salesy
- startup-like
- overly clever
- sterile or technical

## Accessibility

Maintain:

- sufficient contrast on all text and controls
- readable body copy sizes
- visible focus states
- clear button and link affordances
- sensible heading hierarchy

Do not sacrifice usability for atmosphere.

## Anti-Patterns

Do not generate:

- generic white cards on gray background SaaS layouts
- bright purple or electric blue accent systems
- cramped dense grids with tiny gutters
- excessive glassmorphism
- oversized pill UI everywhere
- default dashboard sidebars unless explicitly required
- loud gradients that overpower the content

## Quality Check

Before finishing, verify:

- does this feel like hospitality, not software?
- does the page have enough whitespace?
- are the headings visually expressive enough?
- are the accents restrained and intentional?
- does the mobile layout still feel premium?
- would this look credible for a boutique Alpine hotel brand?
