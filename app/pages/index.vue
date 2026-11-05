<script setup lang="ts">
import { animate } from 'motion-v'
import { motionHeight, press } from '~/utils/motion'
import type { RoomId } from '~/data/saqr'
import type { StackItem } from '~/types/stack'

const {
  state, modelName, currentSize, kitchenFinish, kitchenFinishes, bathThumbs, bathsSummary,
  chosenExtras, extrasSummary, finishName, formatArea, toggleRoom, setKitchen, openSummary
} = useConfigurator()
const { t } = useI18n()

useHead({ title: computed(() => t('meta.title', { name: modelName.value })) })

// Deep-link a card: /?room=layout | kitchen | baths | extras | none
const route = useRoute()
const rooms: RoomId[] = ['layout', 'kitchen', 'baths', 'extras']
const q = route.query.room
if (typeof q === 'string') {
  if ((rooms as string[]).includes(q)) state.value.room = q as RoomId
  else if (q === 'none') state.value.room = null
}

const kitchen = computed({ get: () => state.value.kitchen, set: (i: number) => setKitchen(i) })
// Kitchen: a one-bubble stack, so the finish change cross-fades exactly like the bathroom bubbles.
const kitchenStack = computed<StackItem[]>(() => [
  { key: 'kitchen', color: kitchenFinish.value.color, image: kitchenFinish.value.texture, kind: kitchenFinish.value.kind }
])

// Animated stacks on the card headers. Keys are stable so AvatarStack can tell added / removed / moved.
// Bathrooms: one bubble per bathroom (first 3). "Same finish" keeps the first bubble (key b0) and the rest shrink away.
const bathStack = computed<StackItem[]>(() =>
  bathThumbs.value.map((f, i) => ({ key: `b${i}`, color: f.color, image: f.texture }))
)
// Extras: one bubble per chosen extra (keyed by extra id); "+" bubble when nothing is chosen; "+N" past 3.
const extrasStack = computed<StackItem[]>(() =>
  chosenExtras.value.length
    ? chosenExtras.value.map(x => ({ key: x.id, color: '#DCE1DC', image: x.photo }))
    : [{ key: 'empty', kind: 'plus' as const }]
)

// Keep the cards list scroll in sync with expand/collapse.
// We work out where the list will end up *after* the animation and scroll there with the same timing:
//  - mobile: the card that opened goes to the top of the sheet;
//  - closing / shorter content: scroll eases down to the new maximum together with the collapse.
// Height itself is a CSS grid transition (.expand in main.css) with the same timing as motionHeight.
const scroller = ref<HTMLElement | null>(null)
let scrollAnim: { stop: () => void } | null = null

const syncScroll = async (instant: boolean) => {
  if (!import.meta.client) return
  await nextTick()
  const box = scroller.value
  if (!box) return
  const el = box.querySelector<HTMLElement>('[data-open-card="true"]')

  // Bodies of cards that are closing (still in the DOM while they animate out).
  let collapsing = 0
  let collapsingAbove = 0
  let seenOpen = false
  for (const card of Array.from(box.children) as HTMLElement[]) {
    if (card === el) { seenOpen = true; continue }
    const body = card.querySelector<HTMLElement>('[id^="card-body-"]')
    if (!body) continue
    collapsing += body.offsetHeight
    if (!seenOpen) collapsingAbove += body.offsetHeight
  }
  // The opening body starts at 0fr; the inner clip's scrollHeight is its natural (final) height.
  const openingBody = el?.querySelector<HTMLElement>('[id^="card-body-"]')
  const openingNow = openingBody?.offsetHeight ?? 0
  const openingFinal = (openingBody?.firstElementChild as HTMLElement | null)?.scrollHeight ?? openingNow

  const finalMax = Math.max(0, box.scrollHeight - collapsing - openingNow + openingFinal - box.clientHeight)
  const isMobile = window.matchMedia('(max-width: 899.98px)').matches
  const wanted = el && isMobile ? el.offsetTop - collapsingAbove - 4 : box.scrollTop
  const target = Math.round(Math.min(Math.max(0, wanted), finalMax))
  if (Math.abs(target - box.scrollTop) < 1) return

  scrollAnim?.stop()
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (instant || reduce) {
    box.scrollTop = target
    return
  }
  scrollAnim = animate(box.scrollTop, target, { ...motionHeight, onUpdate: (v: number) => { box.scrollTop = v } })
}
watch(() => state.value.room, () => syncScroll(false))
onMounted(() => syncScroll(true))
</script>

<template>
  <div class="app">
    <AppHeader />

    <main class="layout">
      <ViewStage class="layout__stage" />

      <aside class="panel" :aria-label="t('common.configureAria')">
        <span class="panel__grabber only-mobile" aria-hidden="true" />
        <div class="panel__head">
          <h1 class="panel__title">{{ modelName }}</h1>
          <span class="panel__hint only-desktop">{{ t('common.chooseHint') }}</span>
          <span class="panel__hint only-mobile">{{ t('common.tapHint') }}</span>
        </div>

        <div ref="scroller" class="panel__cards">
          <ConfigCard id="layout" :title="t('cards.layout')" :open="state.room === 'layout'" @toggle="toggleRoom('layout')">
            <template #thumb>
              <span class="thumb thumb--icon">
                <span class="swap"><Transition name="swap"><span :key="currentSize.code" class="swap__item">{{ currentSize.code }}</span></Transition></span>
              </span>
            </template>
            <template #subtitle>
              <span class="swap">
                <Transition name="swap">
                  <SizeSpecs
                    :key="`${state.size}-${state.unit}`"
                    class="swap__item"
                    :beds="currentSize.beds"
                    :baths="currentSize.baths"
                    :area="formatArea(currentSize.area)"
                  />
                </Transition>
              </span>
            </template>
            <SizePicker />
          </ConfigCard>

          <ConfigCard id="kitchen" :title="t('cards.kitchen')" :open="state.room === 'kitchen'" @toggle="toggleRoom('kitchen')">
            <template #thumb>
              <AvatarStack :items="kitchenStack" />
            </template>
            <template #subtitle>
              <span class="swap"><Transition name="swap"><span :key="finishName(kitchenFinish)" class="swap__item">{{ finishName(kitchenFinish) }}</span></Transition></span>
            </template>
            <SwatchGrid v-model="kitchen" :finishes="kitchenFinishes" :label="t('kitchen.finish')" />
          </ConfigCard>

          <ConfigCard id="baths" :title="t('cards.baths')" :open="state.room === 'baths'" @toggle="toggleRoom('baths')">
            <template #thumb>
              <AvatarStack :items="bathStack" />
            </template>
            <template #subtitle>
              <span class="swap"><Transition name="swap"><span :key="bathsSummary" class="swap__item">{{ bathsSummary }}</span></Transition></span>
            </template>
            <BathroomFinishes />
          </ConfigCard>

          <ConfigCard id="extras" :title="t('cards.extras')" :open="state.room === 'extras'" @toggle="toggleRoom('extras')">
            <template #thumb>
              <AvatarStack :items="extrasStack" />
            </template>
            <template #subtitle>
              <span class="swap"><Transition name="swap"><span :key="extrasSummary" class="swap__item">{{ extrasSummary }}</span></Transition></span>
            </template>
            <ExtrasPicker />
          </ConfigCard>
        </div>

        <div class="panel__foot">
          <Motion as="button" type="button" class="cta" :while-press="press" @click="openSummary">
            {{ t('common.review') }}<AppIcon name="arrowRight" :size="16" class="cta__arrow" />
          </Motion>
        </div>
      </aside>
    </main>

    <SummaryDialog />
  </div>
</template>

<style scoped>
.app {
  height: 100vh;
  height: 100dvh;
  min-height: 640px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--c-bg);
}

.layout {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 16px;
  padding: 16px;
}
.layout__stage { flex: 999 1 600px; }

/* Fixed width: it must not depend on which card is open, or every card shifts sideways */
.panel {
  flex: 0 0 440px;
  width: 440px;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.panel__head { padding: 8px 4px 16px; display: flex; flex-direction: column; gap: 4px; }
.panel__title { font-size: 30px; }
.panel__hint { font-size: 14px; color: var(--c-muted); }
.panel__cards {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-anchor: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 12px;
}

@media (min-width: 900px) and (max-width: 1199.98px) {
  .panel { flex-basis: 380px; width: 380px; }
}
.panel__foot { padding: 8px 0 0; }

.cta {
  width: 100%;
  height: 52px;
  border: 0;
  border-radius: var(--r-btn);
  background: var(--c-accent);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.cta { transition: background-color .2s; }
.cta:hover { background: var(--c-accent-hover); }
.cta__arrow { transition: transform .25s cubic-bezier(.22, 1, .36, 1); }
.cta:hover .cta__arrow { transform: translateX(calc(3px * var(--dir))); }

.thumb {
  width: 48px;
  height: 48px;
  border-radius: var(--r-pill);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-accent);
}
.thumb--icon { background: var(--c-tile); font-size: 15px; font-weight: 600; }
.thumb--plus { background: var(--c-accent-soft); }

/* ── Mobile: stage on top, cards in a bottom sheet ─────────── */
@media (max-width: 899.98px) {
  .app { min-height: 0; }
  .layout { flex-direction: column; gap: 0; padding: 0; }
  .layout__stage { flex: 0 0 300px; }

  .panel {
    flex: 1;
    width: auto;
    max-width: none;
    margin-top: -20px;
    position: relative;
    border-radius: 24px 24px 0 0;
    background: var(--c-bg);
    padding-top: 10px;
  }
  .panel__grabber {
    align-self: center;
    width: 40px;
    height: 4px;
    border-radius: var(--r-pill);
    background: var(--c-switch-off);
  }
  .panel__head {
    padding: 10px 16px 8px;
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
  }
  .panel__title { font-size: 24px; }
  .panel__hint { font-size: 13px; }
  .panel__cards { padding: 0 12px 12px; position: relative; }
  .panel__foot { padding: 8px 16px calc(24px + env(safe-area-inset-bottom)); }

  .thumb { width: 44px; height: 44px; }
  .thumb-dot { width: 44px !important; height: 44px !important; }
}
</style>
