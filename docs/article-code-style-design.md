# Article Code Style Design

## Goal

Improve the presentation of inline code and fenced code blocks across blog, note, and paper articles. The result should feel like a restrained code editor embedded in the reading flow while remaining clear in light theme, dark theme, mobile layouts, print, and keyboard navigation.

## Scope

- Apply the same rendering to all MDX document types through the shared MDX component map.
- Restyle inline code without changing its Markdown syntax or surrounding typography.
- Give fenced code blocks a compact header with a language label and copy action.
- Preserve `rehype-highlight` and its generated `hljs` token classes.
- Keep long lines horizontally scrollable without widening the article layout.
- Provide a clean fallback when a fenced block has no language class.
- Do not edit article content, replace the syntax highlighter, or add a third-party dependency.

## Visual Direction

Use the approved "editor reading panel" direction:

- A low-glare charcoal code surface with a subtle teal identifier.
- A compact toolbar separated from the code by a quiet border.
- Uppercase language labels derived from `language-*` classes, with `CODE` as the fallback.
- An icon-first copy button with a tooltip and a short copied state.
- A restrained shadow and a maximum 8 px corner radius so blocks are distinct without looking like promotional cards.
- Inline code uses a pale cool-gray/teal surface in light mode and a muted slate surface in dark mode.
- Syntax colors use cyan, violet, amber, green, and rose accents so the block is not dominated by one hue.

## Component Design

### `CodeBlock`

A client component owns fenced-code presentation and copy interaction. It receives the normal `pre` element props, inspects its single `code` child for a `language-*` class, and renders:

1. An outer `figure` used only as the framed code tool.
2. A toolbar containing the normalized language label and copy button.
3. The original `pre` and highlighted `code` tree without altering syntax tokens.
4. A screen-reader live region for copy feedback.

The component extracts plain text from nested React children for the Clipboard API. Copy success changes the icon and accessible label to "已复制" for two seconds. Copy failure leaves the default state and does not interrupt reading.

### MDX component mapping

The shared `pre` mapping delegates to `CodeBlock`. The `code` mapping distinguishes inline code from fenced code by the presence of a `language-*` or `hljs` class and applies only the corresponding class names. This keeps blog, note, and paper pages consistent without changing their page components.

### Styling

Code-specific styles live in `styles/globals.css` under the existing component layer. CSS variables define the code surface, borders, text, and token colors for light and dark themes. Existing typography plugin defaults are overridden through component-specific selectors to avoid affecting unrelated `pre` elements.

## Responsive And Accessible Behavior

- The toolbar remains a stable height and never changes the code area's dimensions during copy feedback.
- Code text uses a fixed readable size with a compact line height; font size does not scale with viewport width.
- The `pre` element scrolls horizontally on narrow screens and uses momentum scrolling on touch devices.
- The copy control is a native button with a visible focus ring, `aria-label`, and a `title` tooltip.
- Decorative icons are hidden from assistive technology.
- Users who prefer reduced motion receive no animated state transition.
- Print output removes the toolbar and shadow, uses a light surface, wraps long code where practical, and retains a border.

## Data Flow And Failure Handling

MDX compilation continues to produce highlighted HTML through `rehype-highlight`. At render time, `CodeBlock` reads the code child's class and text, displays the language label, and writes the plain source to `navigator.clipboard` only after the user activates the button. If Clipboard API access is unavailable or rejected, the component returns to the normal copy state without throwing or mutating article content.

## Verification

- Type-check the project.
- Run the production build so Contentlayer, MDX rendering, static export, and feed generation are exercised together.
- Inspect a representative article containing Python and text code blocks in light and dark themes.
- Verify desktop and mobile widths for overflow, toolbar stability, and non-overlapping controls.
- Activate copy with pointer and keyboard and confirm the source text and feedback state.
- Confirm inline code remains readable inside paragraphs, links, and list items.
- Confirm the browser console has no new errors.

## Documentation

This document is the implementation reference. No interface, database, deployment, or configuration documentation changes are required because the work changes only shared article presentation.
