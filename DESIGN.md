# Design System

## App Colors (UPDATED)

App drag bar, top of app: #202020

Primary text color: #ffffff

Secondary text color: #DCDCDC

### Header

Header color / Default App color: #0C0D14

Icon / button base color: #4B4C53

Icon/ button color on hover: #DCDCDC

Loading spinner color: #DCDCDC

Mode selector background color: #171923

Mode selector text color: #DCDCDC

### Config Items

ConfigItem background color: #12131A

ConfigItem background color on hover: #181921

tooltip and dropdown chevron base color: #4B4C53

dropdown chevron on hover of ConfigItem color: #DCDCDC

Tooltip on mouse hover of its icon: #DCDCDC

Parent item text color: #FFFFFF

Children item text color: #DCDCDC

#### Tooltip

Tooltip message background: #292F49

Tooltip message outline: #12131A

### Toggle Button

Toggle button thumb: #ffffff

Toggle button disabled background: #4B4C53

Toggle button disabled background on hover: #DCDCDC

Toggle button enabled backgroud: #4069FD

Toggle button enabled background on hover: #6E8DFF

## Assets

_Images placed in `src/renderer/src/assets/`_

dropdown-chevron: This should be used as the icon to expand and collapse the ConfigItems that have configurable children. It will be animated to do a 180 degree transition to point upwards when expanded and downwards when collapsed.

spinner.svg: Loading icon

check-mark.svg: This should be used as the check mark signifying the data is up to date

undo-arrow and redo-arrow.svg: these should be used for the undo and redo feature.

anonboot-white-vector-merged-min.svg: Use this for the logo

## Motion

Hover background transition: 120–160ms

Chevron rotate: 160–200ms

Ease: cubic-bezier(0.2, 0.8, 0.2, 1)

When you click the dropdown chevron, (Similar to in Telegram when you do this) there is an animatioon where everyhting below it gets pulled away, revealing the options that were underneath it, almost as if they were always there but just now revealed as the other stuff has been moved down. See Below:

When the chevron is toggled, the row performs an in-flow expand animation.
The expandable content exists directly below the row in the normal document flow and is initially hidden by height and opacity.
On expand, the container animates its height from 0 to its intrinsic content height, causing all subsequent sibling rows to be pushed downward.
No absolute positioning, overlays, or popovers are used.

“The expand/collapse animation should feel like Telegram:
– Height transition (max-height or measured height)
– Opacity fade-in/out
– Fast but smooth easing
– No snapping or reflow jank”

Use an accordion-style, in-flow disclosure animation (Telegram-style), not a dropdown or overlay.

## Design Notes

The ConfigItem components should take the following shape: Leftmost aligned is the name of the item, whether it is Services, Registry, etc. THIS is the leftmost part. To the right of this, spaced properly, is the tooltip information circle. THEN to the right of that, spaced properly, is the dropdown chevron. All the way to the right, similar to how it currently is, is the enable/disable button.

## Toggle Buttons

These are one of the main focal points so it is important we make these a really clean part of the app. This should be made into its own component

Build a ToggleSwitch component (CSS Modules, no Tailwind).
Visual spec: iOS-style switch with clean color fade and thumb overshoot/settle.
Sizes: track 44x24, thumb 20x20, inset 2px, travel distance 20px.
Animations:

Track background-color transition 140ms ease (cubic-bezier(0.2,0.8,0.2,1)).

Thumb uses transform translateX.

On toggle ON: animate thumb with keyframes that overshoot +2px past final position then settle back (duration ~180ms).

On toggle OFF: animate thumb with keyframes that overshoot -2px then settle to 0 (duration ~180ms).

Hover: both ON and OFF tracks lighten slightly.

Disabled: reduce opacity, no hover, cursor not-allowed.

Use prefers-reduced-motion to disable keyframes and only use instant transform + color transitions.
Ensure switch is accessible: button role="switch", aria-checked, keyboard toggles (Space/Enter).

## Sizing and Spacing

Sizing system rules:

All spacing (padding, margins, gaps) uses fixed px values from the spacing scale.

Typography uses rem units based on a 14px root font size.

Only hero elements (app title in header) may use clamp() for responsive sizing.

Do not use vh or percentage units for layout spacing.

UI must look identical on normal screens and only scale identity elements on large screens.

### SVGs

There is three primary sizes for the SVG icons:

small: 16px

medium: 18px

large: 24px

| Icon type                            | Visual size | Notes                        |
| ------------------------------------ | ----------- | ---------------------------- |
| Tooltip info icon (`i`)              | **18px**    | Slightly larger than default |
| Dropdown chevron                     | **18px**    | Matches tooltip icon         |
| Section expand chevron (parent rows) | **18px**    | Primary affordance           |
| Header icons                         | **20px**    | Header needs presence        |

### Header spacing and Sizing

| Element                   | Measurement      | Value              | Unit  |
| ------------------------- | ---------------- | ------------------ | ----- |
| Header height (expanded)  | App bar height   | 96                 | px    |
| Header height (collapsed) | Compact app bar  | 64                 | px    |
| Header horizontal padding | Side padding     | 16                 | px    |
| Logo font size            | Responsive       | clamp(32, 4vw, 44) | px/vw |
| Logo ↔ pill gap           | Vertical spacing | 8                  | px    |
| Pill font size            | Body UI          | 14                 | px    |
| Pill padding              | Internal         | 6 / 12             | px    |
| Icon hit area             | Button size      | 32                 | px    |
| Icon glyph                | Visual size      | 16                 | px    |
| Icon spacing              | Horizontal gap   | 8                  | px    |

The logo should have 24px of horizontal padding, it needs to have breathing room. 

### ConfigItem spacing and sizing

ConfigItems are full-width rows.
Each ConfigItem row stretches 100% of the available app content width (same principle as the header).
The row background/hover background spans left-to-right across the content area.
Internal content is aligned using fixed horizontal padding (not centered cards).

In CSS terms: the row container is width: 100%, and padding creates the internal breathing room.

#### Parent ConfigItem

| Element                  | Measurement name (spec term)       |    Value | Unit     | Notes                                |
| ------------------------ | ---------------------------------- | -------: | -------- | ------------------------------------ |
| Row width                | **Row container width**            |     100% | %        | Must span full app width             |
| Row height               | **Parent row height**              |       56 | px       | Consistent rhythm                    |
| Row padding (L/R)        | **Parent row horizontal padding**  |       16 | px       | Applies to entire row                |
| Row padding (Top/Bottom) | **Parent row vertical padding**    |        0 | px       | Height controls vertical spacing     |
| Label font size          | **Parent label size**              |       18 | px       | Bold/semibold                        |
| Label line-height        | **Parent label line-height**       |      1.2 | unitless | Avoid vertical drift                 |
| Left group gap           | **Inline element gap**             |        8 | px       | Used between label, tooltip, chevron |
| Label → tooltip          | **Label-to-tooltip spacing**       |        8 | px       | Horizontal distance                  |
| Tooltip → chevron        | **Tooltip-to-chevron spacing**     |        8 | px       | Horizontal distance                  |
| Chevron size             | **Chevron icon size**              |       16 | px       | Visual size                          |
| Chevron hit area         | **Chevron button hit area**        |    28×28 | px       | (optional) for easy clicking         |
| Right-aligned toggle     | **Toggle alignment**               |    right | —        | Use `margin-left: auto`              |
| Toggle inset             | **Toggle right padding alignment** |       16 | px       | Toggle aligns to row padding         |
| Hover state              | **Row hover background**           | on hover | —        | Subtle background shift              |

Parent row structure (deterministic)

Left-to-right order inside row:

Label text (left aligned)

Tooltip icon

Chevron (expand/collapse)

Spacer (margin-left: auto)

Toggle switch (right aligned)

Important interaction rule

Clicking the toggle must not expand/collapse the row (stopPropagation).
Clicking the row (or chevron) expands/collapses.

#### Child ConfigItem

| Element              | Measurement name (spec term)       | Value | Unit     | Notes                                                                       |
| -------------------- | ---------------------------------- | ----: | -------- | --------------------------------------------------------------------------- |
| Row width            | **Row container width**            |  100% | %        | Still full-width (background spans full width)                              |
| Row height           | **Child row height**               |    48 | px       | Slightly smaller than parent                                                |
| Row padding (L/R)    | **Child row horizontal padding**   |    16 | px       | Same as parent for consistency                                              |
| Child indentation    | **Child content indent**           |    24 | px       | Applied to the _content group_ (label + icons), not the full row background |
| Label font size      | **Child label size**               |    16 | px       | Slightly smaller                                                            |
| Label line-height    | **Child label line-height**        |   1.2 | unitless | Same as parent                                                              |
| Label → tooltip      | **Label-to-tooltip spacing**       |     8 | px       | Same spacing scale                                                          |
| Tooltip → chevron    | **Tooltip-to-chevron spacing**     |     8 | px       | Same spacing scale                                                          |
| Chevron size         | **Chevron icon size**              |    16 | px       | Same icon size (or omit if child has no expansion)                          |
| Right-aligned toggle | **Toggle alignment**               | right | —        | Use `margin-left: auto`                                                     |
| Toggle inset         | **Toggle right padding alignment** |    16 | px       | Matches parent                                                              |

Child indentation rule (crystal clear)

Child rows remain full-width, but the child content group is indented by 24px.
Concretely: the child label/tooltip/chevron container has padding-left: 24px (or margin-left: 24px) in addition to the row’s normal 16px horizontal padding.

That means visually:

background spans full width

text/icons shift right, clearly indicating nesting

#### Layout Conceptually

Parent row DOM layout (conceptual):

- `Row (width:100%, padding:16px, height:56px, display:flex)`
  - `LeftGroup (display:flex; align-items:center; gap:8px)`
    - `Label`
    - `TooltipIcon`
    - `ChevronButton`
  - `Spacer (margin-left:auto)`
  - `Toggle`

Child row DOM layout (conceptual):

- `Row (width:100%, padding:16px, height:48px, display:flex)`
  - `LeftGroup (display:flex; align-items:center; gap:8px; padding-left:24px)`
    - `Label`
    - `TooltipIcon`
    - (optional) `ChevronButton`
  - `Spacer (margin-left:auto)`
  - `Toggle`

## Header Updates

## A) Header icon placement changes

### 1) Move Undo/Redo to top-left

- Create a **left icon cluster** in the header.
- Place **Undo** and **Redo** in the **top-left corner** of the header.
- They must align to header padding:
  - Their hit areas begin at **16px from the left edge**
  - Their top alignment should be visually “top bar aligned” (same y as right icons)
- Spacing:
  - Each icon button hit area = `32×32px`
  - Gap between Undo and Redo buttons = `8px`
- Behavior:
  - Maintain existing click handlers/actions.
  - Hover state: icon color changes to `#DCDCDC`, optional subtle hover background.

### 2) Move loading/check to the top-right next to Refresh

- Create a **right icon cluster** in the header.
- On the far right, place:
  - Refresh button
  - Immediately to its left: status icon area that shows:
    - spinner while backend is busy
    - checkmark when “up to date”
- Alignment:
  - The right cluster aligns to **16px from the right edge**
  - Buttons use `32×32px` hit areas
  - Gap between status icon and refresh button = `8px`
- Status icon sizing:
  - Visual size: `18px` or `20px` (match header icon scale)
  - Color: `#DCDCDC` (per spec)

## B) ModeSelector redesign as dropdown box

### Goal

Replace the current segmented “Standard / Paranoid / Custom” selector with a single dropdown control:

**[ Mode: Custom ⌄ ]** (in a small rounded box)

### Layout

- ModeSelector sits centered under the logo in the header (same general placement).
- The entire ModeSelector box is clickable (not just the chevron).

### ModeSelector box styling

- Background (base): `#12131A`
- Background (hover): `#181921`
- Text: `#DCDCDC`
- Border radius: `12px` (pill-like but not fully rounded)
- Padding:
  - Vertical: `8px`
  - Horizontal: `12px`
- Gap between text and chevron: `8px`
- Cursor: pointer
- Transition:
  - background-color 120–160ms ease-out
  - chevron rotation 180–220ms ease-out

### Chevron behavior (must match ConfigItem chevrons)

- Chevron is to the **right of the Mode text**
- Chevron icon:
  - size: `18px`
  - base color: `#4B4C53`
  - on hover of the ModeSelector box: `#DCDCDC` (or match your chevron hover rule)
- When dropdown is open:
  - chevron rotates **180°**
  - smooth rotation (same timing as ConfigItems)

### Dropdown menu behavior

- Clicking anywhere inside the ModeSelector box toggles the menu.
- Menu opens directly below the box.
- Click outside closes menu.
- Esc closes menu.

### Dropdown menu styling

- Menu background: `#12131A` (or `#292F49` if you want it to match tooltip style — choose ONE and use consistently)
- Menu item hover background: `#181921`
- Menu text:
  - normal: `#DCDCDC`
  - selected mode: `#FFFFFF` (optional, but recommended)
- Item sizing:
  - Row height: `40px`
  - Horizontal padding: `12px`
- Border radius: `12px`
- Shadow: subtle (optional), no bright outlines

### Modes list

- Menu items:
  - Standard
  - Paranoid
  - Custom
- Selecting an item updates the current mode (existing logic) and closes menu.
