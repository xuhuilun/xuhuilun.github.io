# Article Code Style Implementation Plan

## Objective

Implement the approved editor-style presentation for inline code and fenced code blocks in every MDX article without adding dependencies or changing article content.

## Steps

1. Add a focused `CodeBlock` client component.
   - Read the language from the highlighted `code` class.
   - Preserve the original highlighted React tree.
   - Add a keyboard-accessible copy action and stable success feedback.
   - Verify with TypeScript.

2. Connect the component to shared MDX rendering.
   - Delegate fenced `pre` elements to `CodeBlock`.
   - Give inline and fenced `code` elements separate class names.
   - Verify representative generated MDX contains the expected `hljs` and `language-*` classes.

3. Add the approved visual system to the global component layer.
   - Define light and dark code variables.
   - Style the toolbar, scroll region, inline code, focus state, and highlight.js tokens.
   - Add narrow-screen, reduced-motion, and print behavior.
   - Verify there are no invalid Tailwind directives or broad unrelated selectors.

4. Run project and browser verification.
   - Run `npm run typecheck` and `npm run build`.
   - Inspect a representative code-heavy article in light and dark themes at desktop and mobile widths.
   - Test copy behavior and inspect browser console errors.

5. Complete Git delivery.
   - Commit implementation and documentation on `feature/article-code-style`.
   - Push the feature branch.
   - Merge the verified branch into `main`, push `main`, and remove the feature branch locally and remotely.

## Success Criteria

- All MDX document types share the same code presentation.
- Fenced blocks show a correct language label or `CODE` fallback.
- Copy works by pointer and keyboard and provides accessible feedback.
- Long code scrolls inside the article without causing page overflow.
- Inline code remains legible in light and dark themes.
- Type checking and the production build pass.
- Existing unrelated work remains untouched.
