# Design System Specification

## 1. Overview & Creative North Star
### Creative North Star: "The Conscious Curator"
This design system rejects the cluttered, "thrift-store" aesthetic typically associated with secondary markets. Instead, it adopts the persona of a high-end digital gallery. We treat every product as a curated asset within a circular economy. 

The visual language is rooted in **Regenerative Sophistication**. We break the standard Bootstrap grid by utilizing generous whitespace, intentional asymmetry, and a "layered paper" philosophy. The goal is to move the user from a transactional mindset to an editorial experience—where lead generation feels like an invitation rather than a sales pitch.

---

## 2. Colors & Surface Philosophy
Our palette balances the growth-oriented **Fresh Green** with the grounding authority of **Deep Blue**.

### The Tonal Palette
*   **Primary (#006c40 / #198754):** Use for "Success" actions, growth indicators, and primary WhatsApp conversion points.
*   **Secondary (#46626f / #2C4854):** The structural anchor. Use for Navbars, primary CTA buttons, and heavy headings.
*   **Surface (#fbf9f9):** The "canvas." A warm, off-white that feels more premium than pure #FFFFFF.

### The "No-Line" Rule
**Designers are prohibited from using 1px solid borders to define sections.** 
In this system, boundaries are created through background color shifts. To separate content:
*   Place a `surface-container-low` section against a `surface` background.
*   Use `surface-container-highest` for sidebars or inset content.
*   Visual separation must feel organic, not structural.

### Signature Textures
*   **The Hero Gradient:** For hero sections and primary CTAs, use a subtle linear gradient: `linear-gradient(135deg, #198754 0%, #006c40 100%)`. This adds a "soul" to the action buttons that flat color cannot achieve.
*   **Glassmorphism:** For floating navigation or over-image overlays, use `surface` at 70% opacity with a `12px` backdrop-blur.

---

## 3. Typography
We use a dual-font strategy to balance editorial elegance with functional clarity.

*   **Display & Headlines (Manrope):** Chosen for its modern, geometric construction. Use `display-lg` for hero statements to create a high-impact, editorial "magazine" feel.
*   **Body & Titles (Inter / gdsherpa):** Optimized for readability.
    *   **Product Titles:** Must use `title-md` with **Medium (500)** weight.
    *   **Prices:** Must use `title-lg` with **Semi-bold (600)** weight to ensure financial prominence.
*   **Hierarchy Note:** Use high contrast in scale. A `display-sm` headline next to a `body-md` description creates the "Digital Curator" look through intentional tension.

---

## 4. Elevation & Depth
We define hierarchy through **Tonal Layering** rather than drop shadows.

*   **The Layering Principle:** Treat the UI as stacked sheets of fine paper. 
    *   Level 0: `surface` (Background)
    *   Level 1: `surface-container-low` (Cards/Content Blocks)
    *   Level 2: `surface-container-lowest` (Inner nested elements)
*   **Ambient Shadows:** If an element must "float" (e.g., a WhatsApp sticky button), use a diffused shadow: `box-shadow: 0 10px 30px rgba(28, 42, 61, 0.06);`. Never use pure black for shadows; use a tinted version of `on-surface`.
*   **The Ghost Border:** If accessibility requires a container boundary, use the `outline-variant` token at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Cards & Thumbnails
*   **Border Radius:** Strictly `1rem` (16px) for all primary containers.
*   **Style:** No borders. Use `surface-container-low` as the card background. 
*   **Spacing:** Use `spacing-6` (1.5rem) for internal padding to give product images room to breathe.

### Buttons
*   **Primary (Secondary Token):** High-contrast Deep Blue (`#2C4854`). Use for the main site actions.
*   **Success (Primary Token):** Fresh Green (`#198754`). Exclusively for WhatsApp and "Lead Secured" actions.
*   **Shape:** `1rem` corner radius to match cards. 
*   **Interaction:** On hover, shift the background color to the `-container` variant rather than adding a shadow.

### Input Fields
*   **Form Style:** Use "Soft Fields." No heavy borders. Use `surface-container-highest` as the background with a `bottom-border` only of `outline-variant` at 20% opacity.
*   **Focus State:** Transition the bottom border to `primary` (#198754) with a subtle 2px glow.

### Chips & Filters
*   **Circular Economy Tags:** Use `secondary-container` with `on-secondary-container` text. These should be pills (`border-radius: full`) to distinguish them from the rectangular product cards.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical margins (e.g., a wider left margin on desktop) to create an editorial layout.
*   **Do** prioritize the "Fresh Green" for the final conversion step in the lead generation funnel.
*   **Do** use `surface-bright` for hover states on list items to create a sophisticated "lit" effect.

### Don't:
*   **Don't** use standard Bootstrap 1px borders. If you feel the need for a line, use a background color change instead.
*   **Don't** use "pure" colors. Always stick to the defined Material tokens which have been tuned for tonal harmony.
*   **Don't** use dividers in lists. Use `spacing-4` or `spacing-5` of vertical whitespace to separate items.
*   **Don't** crowd the product title. If a title is long, truncate it to 2 lines and ensure there is a `spacing-3` buffer below it.

---

## 7. Spacing & Rhythm
Rhythm is maintained through a strict adherence to the **4px baseline**.
*   **Section Spacing:** Use `spacing-16` (4rem) or `spacing-20` (5rem) between major content blocks. 
*   **Content Grouping:** Use `spacing-4` (1rem) for related elements.
*   **The "Breathing" Rule:** If a layout feels "clean but professional," add 25% more whitespace than you think is necessary. This is the hallmark of high-end digital design.