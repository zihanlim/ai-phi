# Design System Strategy: The Analytical Monolith

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Socratic."** 

This system moves beyond typical "AI Chatbot" aesthetics to create a space that feels like a high-end, analytical terminal—a place where philosophy meets cold, hard data. It leverages a **Neo-Brutalist** foundation: characterized by razor-sharp precision, intentional monochromatic austerity, and aggressive typographic scales. 

To avoid a "template" look, the layout rejects centered, symmetrical balance in favor of **Structural Asymmetry**. Content is anchored to a rigid, mathematical grid, but elements should overlap and "break" containers to create a sense of depth and intellectual friction. This is not a "soft" interface; it is a high-contrast environment designed for deep thinking.

---

## 2. Colors & Atmospheric Depth
The palette is rooted in a "Deep Abyss" (#09090B). Contrast is our primary tool for hierarchy.

*   **Primary Accent (`primary`):** #00FFA3 (Neon Cyan-Green). Use this as a "Digital Pulse"—only for active states, primary actions, and critical data insights.
*   **Intellectual Agreement (`secondary`):** #3B82F6. Used for logic confirmation and synthesized thoughts.
*   **Intellectual Friction (`error`):** #EF4444. Used for paradoxes, logical fallacies, and high-priority warnings.
*   **Surface Hierarchy:**
    *   `surface-container-lowest`: #000000 (Pure void for background depth)
    *   `surface`: #0e0e10 (Default background)
    *   `surface-container`: #19191c (Elevated logical blocks)

**The "No-Line" Rule for Sectioning:**
Standard 1px borders are prohibited for defining major sections. To separate the "Input" area from the "Philosophy Feed," use a background shift from `surface` to `surface-container-low`. Boundaries must feel like structural shifts in the environment, not lines drawn on top of it.

**Signature Textures:**
For primary CTAs or AI "thinking" states, apply a subtle **Linear Gradient** (e.g., `primary` to `primary-container`). This adds a "Neon Gas" glow that feels premium and alive against the dead-black background.

---

## 3. Typography: The Intellectual Voice
Typography is the core of a philosophical app. We use three distinct voices:

*   **Display & Headlines (Space Grotesk, 700):** This is the "Voice of Authority." It is wide, geometric, and uncompromising. Use large scales (`display-lg`) for philosophical headings to dominate the viewport.
*   **Body (Outfit/Plus Jakarta Sans, 400):** The "Rational Voice." Used for long-form synthesis. It provides high legibility with a modern, humanistic touch to balance the brutalist surroundings.
*   **Metadata (JetBrains Mono/Inter, 400):** The "System Voice." Used for timestamps, logic citations, and technical data. This reinforces the "AI" nature of the philosopher.

**Hierarchy Strategy:** 
Use extreme scale shifts. A `display-lg` headline should sit directly adjacent to a `label-sm` metadata tag. This "high-low" contrast is a hallmark of high-end editorial design.

---

## 4. Elevation & Depth: Tonal Layering
In this system, we do not use drop shadows. Elevation is conveyed through **Tonal Layering** and **Glassmorphism**.

*   **The Layering Principle:** To create a "card," do not use a shadow. Instead, place a `surface-container-high` (#1f1f22) block onto the `surface` background. The 2px radius must be absolute and sharp.
*   **The "Ghost Border" Fallback:** If a component requires definition against a similar background (like an input field), use a **Ghost Border**: `outline-variant` (#48474a) at 20% opacity. 
*   **Neon Glow (The Floating State):** For active elements (e.g., a selected philosophical branch), replace shadows with an **Outer Glow**. Use the `primary` color with a 8px blur at 15% opacity to simulate a screen emitting light.
*   **Glassmorphism:** For persistent navigation or "Floating Wisdom" overlays, use `surface` at 70% opacity with a `backdrop-filter: blur(12px)`. This keeps the "Abyss" visible beneath the UI.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` (#00FFA3) background, black text. Sharp 2px corners. Hover state: add a 4px neon outer glow.
*   **Secondary:** Ghost style. `outline` border at 20% opacity. Text in `on-surface`.
*   **Tertiary:** All caps `label-md` using JetBrains Mono. No container.

### Input Fields
*   **Styling:** `surface-container-lowest` background. No border, except for a 1px `primary` bottom-bar that "activates" (widens) when focused. 
*   **Error State:** Text shifts to `error` (#EF4444), and the bottom-bar glows Red.

### Philosophy Cards & Lists
*   **The "No-Divider" Rule:** Forbid horizontal lines between list items. Use 1.5rem (`spacing-8`) of vertical white space or a subtle shift to `surface-container-low` on alternate rows to create separation.
*   **Asymmetric Headers:** Place the "Topic" (Space Grotesk) on the left and the "Logic Citations" (JetBrains Mono) flush right, slightly overlapping the card boundary.

### Intellectual "Friction" Chips
*   Used to tag logical fallacies. Roundedness is `0px` (Total Brutalism). Background: `error_container` (#9f0519) at 30% opacity with `error` text.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use `JetBrains Mono` for any data that feels "computed" or "technical."
*   **Do** embrace negative space. Let the "Deep Abyss" (#09090B) breathe; it represents the unknown.
*   **Do** align text to a strict 8px baseline grid to ensure the brutalist structure feels intentional.

### Don't:
*   **Don't** use standard "drop shadows." If it needs to float, it must glow or use a different surface tone.
*   **Don't** use 100% opaque borders for decorative framing. It clutters the analytical clarity.
*   **Don't** use rounded corners larger than 2px. Anything "soft" or "bubbly" breaks the intellectual rigor of the system.
*   **Don't** center-align long blocks of text. Stick to rigid left-alignment for an editorial, authoritative feel.