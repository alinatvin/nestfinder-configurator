# FindNido · Saqr configurator (rooms v3)

Nuxt 4 + Vue 3 build of the **rooms v3** screens from the Claude Design canvas *Configurator redesign*.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
```

Requires Node.js 20+. On this Mac Node v26.13.0 lives in `~/.local/node`; if `npm` is not found, run
`export PATH="$HOME/.local/node/bin:$PATH"` first (or add that line to `~/.zshrc`).

## Screens → URLs

All five v3 artboards are one responsive page (breakpoint 900px):

| Design artboard | URL |
| --- | --- |
| 3 · Configure · rooms v3 (Extras open) | `/` or `/?room=extras` |
| 3 · Configure · rooms v3 · Bathrooms open | `/?room=baths` |
| 3 · Configure · rooms v3 · Size open | `/?room=layout` |
| Mobile · rooms v3 | `/?room=baths` at < 900px width |
| Mobile · rooms v3 · Extras open | `/?room=extras` at < 900px width |

Also: `?room=kitchen`, `?room=none` (all cards collapsed).

## Structure

```
app/
  data/saqr.ts                  model data: sizes, finishes, extras, prices
  composables/useConfigurator.ts  state (useState) + derived values + actions
  pages/index.vue               layout: stage + cards panel / mobile sheet
  components/
    AppHeader.vue               logos, All homes, EN/ES/AR, m²/ft²
    ViewStage.vue               360° / plan area, total, mini plan
    ConfigCard.vue              collapsible part card
    SizePicker.vue              S/M/L (cards on desktop, grid on mobile)
    SwatchGrid.vue              kitchen finishes
    BathroomFinishes.vue        per-bathroom tiles + "same finish" switch
    ExtrasPicker.vue            interior / exterior extras with tooltips
    SummaryDialog.vue           "Your Saqr" review (modal / bottom sheet)
public/images/                  logos, floor plan, textures, extras photos
```

## Motion

Animations use [motion-v](https://motion.dev/docs/vue) via the `motion-v/nuxt` module (`<Motion>`, `<AnimatePresence>`, `<MotionConfig>` are auto-registered).
Shared timings live in `app/utils/motion.ts` — import them explicitly (`import { motionBase } from '~/utils/motion'`).

| Where | What |
| --- | --- |
| `ConfigCard` | body expands/collapses (CSS grid `.expand` transition, see below), "Change" pill fades in place |
| `AvatarStack` (Kitchen, Bathrooms, Extras thumbs) | based on `AnimatedAvatarStack` from [cyrax111/avatar_stack](https://github.com/cyrax111/avatar_stack) (Flutter), toned down: added bubble grows in its slot, neighbours slide, removed bubble shrinks into its centre, "+N" past 3, image change cross-fades. Soft spring `--ease-spring-soft` (~4% overshoot, no wobble). Extras join the stack in pick order |
| `SlotCounter` (Estimated total) | port of [react-slot-counter](https://almond-bongbong.github.io/react-slot-counter/) defaults: only changed digits roll bottom-up through 6 random digits, 0.7s; separators and "AED" stay still |
| Card subtitles, Size letter | old value fades up, new comes from below (`.swap` in `main.css`) |
| `SegmentedControl` | selection pill slides between options (`layoutId` spring) |
| `ViewStage` | 360° ↔ plan cross-fade, room label swap, mini plan slides in/out |
| `BathroomFinishes` | rows collapse into "All bathrooms", switch knob slides |
| `ExtrasPicker` | Interior ↔ Exterior list slides, press feedback |
| `SwatchGrid` / `SizePicker` | check-mark pop, press feedback, smooth selected state |
| `SummaryDialog` | scrim fade; modal rises on desktop, bottom sheet slides up on mobile |

**Height changes use CSS, not motion-v.** Card bodies and bathroom rows animate `grid-template-rows: 0fr ↔ 1fr`
(`.expand` in `main.css`, wrapped in `<Transition name="expand">`). JS `height: auto` animations measure the final size by
briefly applying it, which makes the browser snap the scroll position of the cards list. The list scroll that accompanies
an expand is driven in `pages/index.vue` with the same timing (`motionHeight`).

`<MotionConfig reduced-motion="user">` in `app.vue` plus a `prefers-reduced-motion` rule in `main.css` turn movement off for users who ask for it.

## Open points carried over from the design

- 360° panorama is a placeholder — plug the real viewer into `ViewStage.vue`.
- Estimated total = base (size M, no extras: 1,135,030 AED) + size difference + selected extras (`totalPrice` in `useConfigurator.ts`). **Size S (−100,000) and L (+150,000) differences are temporary placeholders** — replace `priceDelta` in `app/data/saqr.ts` (marked `TODO(pricing)`).
- Size S / L: area and bathrooms are `[placeholders]`. Size M shows 409.49 m² as in the design.
- Language toggle only switches state; there are no translations / RTL yet.
- "Request my quote" has no action yet.
