## ADDED Requirements

### Requirement: Tailwind CSS configuration
The system SHALL have Tailwind CSS configured with design tokens from guidelines.md.

### Requirement: Design system colors
The Tailwind configuration SHALL include the following color palette:
- Primary: blue-500 (buttons, highlights)
- Secondary: gray-500 (secondary actions)
- Success: green-500 (hits, wins)
- Danger: red-500 (bombs, misses)
- Background: slate-900 (dark theme)
- Surface: slate-800 (cards, boards)

### Requirement: Base styles
The system SHALL set the default background color to slate-900 and use the design system color palette throughout.

### Requirement: Responsive design tokens
The Tailwind configuration SHALL include responsive breakpoints aligned with guidelines.md (mobile <640px, tablet 640-1024px, desktop >1024px).

#### Scenario: Tailwind applies design system colors
- **WHEN** components use Tailwind utility classes with design system colors
- **THEN** the correct hex values from guidelines.md are applied
