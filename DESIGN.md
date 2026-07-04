---
name: VibeCast
colors:
  surface: '#f4faff'
  surface-dim: '#b5e0f6'
  surface-bright: '#f4faff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#e6f6ff'
  surface-container: '#d9f2ff'
  surface-container-high: '#cbedff'
  surface-container-highest: '#bde9ff'
  on-surface: '#001f2a'
  on-surface-variant: '#41484c'
  inverse-surface: '#003546'
  inverse-on-surface: '#e0f4ff'
  outline: '#71787d'
  outline-variant: '#c0c7cc'
  surface-tint: '#31647a'
  primary: '#31647a'
  on-primary: '#ffffff'
  primary-container: '#a0d2eb'
  on-primary-container: '#275b71'
  inverse-primary: '#9ccee6'
  secondary: '#785a00'
  on-secondary: '#ffffff'
  secondary-container: '#ffd167'
  on-secondary-container: '#765900'
  tertiary: '#006c4f'
  on-tertiary: '#ffffff'
  tertiary-container: '#31e5ae'
  on-tertiary-container: '#006247'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bee9ff'
  primary-fixed-dim: '#9ccee6'
  on-primary-fixed: '#001f2a'
  on-primary-fixed-variant: '#144c61'
  secondary-fixed: '#ffdf9b'
  secondary-fixed-dim: '#edc157'
  on-secondary-fixed: '#251a00'
  on-secondary-fixed-variant: '#5b4300'
  tertiary-fixed: '#54fdc4'
  tertiary-fixed-dim: '#27e0a9'
  on-tertiary-fixed: '#002116'
  on-tertiary-fixed-variant: '#00513b'
  background: '#f4faff'
  on-background: '#001f2a'
  surface-variant: '#bde9ff'
typography:
  display-weather:
    fontFamily: Lexend
    fontSize: 84px
    fontWeight: '700'
    lineHeight: 90px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Lexend
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Lexend
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  margin-mobile: 20px
  margin-desktop: 48px
  gutter: 16px
---

## Brand & Style
The design system is built for a lifestyle-first weather experience that prioritizes emotional resonance over raw data. The brand personality is optimistic, energetic, and highly visual, moving away from traditional utilitarian weather apps toward a "daily companion" aesthetic.

The design style is **Modern Minimalist with Glassmorphic accents**. It utilizes heavy whitespace to allow the vibrant color palette to breathe, while employing soft, translucent layers to simulate the atmospheric nature of weather. The interface should feel light and airy, mimicking the clarity of a bright morning.

## Colors
The palette is inspired by the transition of the sky throughout a perfect day.
- **Morning Breeze (Primary):** Used for the dominant UI state, primary actions, and clear-sky weather conditions.
- **Golden Hour (Secondary):** Used for highlights, warnings, sunset data, and "warm" lifestyle recommendations.
- **Fresh Mint (Tertiary):** Used for success states, air quality indices, and "ideal" outdoor conditions.
- **Deep Navy (Neutral):** Reserved for high-contrast typography and iconography to ensure maximum legibility against soft backgrounds.

Backgrounds should remain off-white (#F8FAFC) to maintain a fresh, clean appearance, while cards use pure white with subtle transparency.

## Typography
Typography is the primary driver of the "trendy" vibe. **Lexend** provides a soft, rounded, and welcoming feel for all numeric weather data and headings, reducing the "clinical" feel of typical data apps. **Inter** is used for body text and labels to ensure that long-form lifestyle tips and granular details remain professional and readable.

For the main temperature display, use `display-weather` with tight letter spacing to create a bold, iconic focal point.

## Layout & Spacing
The design system employs a **Fluid Grid** model centered on an 8px spatial scale. 

- **Mobile:** A 4-column layout with 20px side margins. Content cards usually span the full width to maximize visual impact of photography and gradients.
- **Desktop/Tablet:** A 12-column layout with 48px side margins. Modular "widgets" (e.g., UV Index, Wind Speed) should be grouped into cards that span 3 or 4 columns.

Spacing should be generous (`lg` and `xl` units) between major sections to maintain the "airy" brand promise.

## Elevation & Depth
Depth is created through **Glassmorphism and Ambient Shadows** rather than traditional rigid borders. 

1.  **Base Layer:** Solid light background.
2.  **Surface Layer:** White containers with 80% opacity and a 16px backdrop blur. This allows background weather gradients or photography to bleed through subtly.
3.  **Shadows:** Use extremely soft, tinted shadows (Primary color at 10% opacity) with a large blur radius (20-40px) to make cards appear as if they are floating on a layer of air.
4.  **Floating Action Buttons:** Use a slightly higher elevation with a 15% opacity Deep Navy shadow for crispness.

## Shapes
The shape language is consistently **Rounded**. Hard corners are strictly avoided to maintain the friendly, youthful aesthetic. 

- **Standard Buttons/Inputs:** 0.5rem (8px) radius.
- **Weather Cards/Modals:** 1rem (16px) radius.
- **Contextual Chips/Badges:** Pill-shaped (fully rounded) for a playful, modern look.

## Components
- **Buttons:** Primary buttons use a solid 'Morning Breeze' fill with Deep Navy text. Hover states should include a subtle scale-up (1.02x) rather than a color change.
- **Weather Cards:** Large cards featuring a subtle vertical gradient (e.g., Morning Breeze to white). Data points inside cards should use Lexend Medium.
- **Chips:** Used for "Vibe" tags (e.g., "Perfect for Surfing"). These are pill-shaped with a 10% opacity fill of the Primary or Tertiary color.
- **Inputs:** Search bars are oversized with 16px internal padding and a soft 'Morning Breeze' 1px border.
- **Progress Bars:** Used for UV levels or Humidity. These should be thick (8px height) with fully rounded caps, using the Golden Hour color for the active fill.
- **Icons:** Use a custom set of "Soft Line" icons—thin Deep Navy strokes with rounded terminals and occasional "blobs" of Primary color behind them for secondary depth.