<script setup lang="ts">
import { motionBase, motionFast, press } from '~/utils/motion'
import type { View } from '~/composables/useConfigurator'

const { state, model, roomName, setView, currentSize } = useConfigurator()

const view = computed({ get: () => state.value.view, set: (v: View) => setView(v) })
const views = [
  { value: 'pano' as const, label: '360°' },
  { value: 'plan' as const, label: 'Plan' }
]
const isPano = computed(() => state.value.view === 'pano')
</script>

<template>
  <section class="stage" :class="{ 'stage--plan': !isPano }" :aria-label="isPano ? 'Panorama' : 'Floor plan'">
    <!-- Cross-fade between panorama (per room) and plan -->
    <AnimatePresence mode="wait" :initial="false">
      <!-- 360° viewer placeholder: plug the real panorama player in here -->
      <Motion
        v-if="isPano"
        :key="`pano-${roomName}`"
        as="span"
        class="pano-hint"
        :initial="{ opacity: 0, y: 6 }"
        :animate="{ opacity: 1, y: 0 }"
        :exit="{ opacity: 0, y: -6 }"
        :transition="motionFast"
      >
        360° panorama · {{ roomName }}<span class="only-desktop">&nbsp;· drag to look around</span>
      </Motion>

      <Motion
        v-else
        key="plan"
        as="figure"
        class="plan"
        :initial="{ opacity: 0, scale: 0.97 }"
        :animate="{ opacity: 1, scale: 1 }"
        :exit="{ opacity: 0, scale: 0.97 }"
        :transition="motionBase"
      >
        <img :src="model.floorPlan" :alt="`Floor plan · ${model.name}, ${currentSize.beds} bedrooms`" class="plan__img">
        <figcaption class="plan__caption only-desktop">Floor plan · {{ model.name }}, {{ currentSize.beds }} bedrooms</figcaption>
      </Motion>
    </AnimatePresence>

    <NuxtLink to="/homes" class="back only-mobile glass" aria-label="Back to homes">
      <AppIcon name="back" :size="20" />
    </NuxtLink>

    <div class="total glass">
      <span class="total__label">Estimated total</span>
      <PriceTotal class="total__value" />
    </div>

    <SegmentedControl v-model="view" :options="views" label="View" variant="pill" class="view-toggle" />

    <AnimatePresence :initial="false">
      <Motion
        v-if="isPano"
        key="mini-plan"
        as="div"
        class="mini-plan glass only-desktop"
        aria-label="Mini plan"
        :initial="{ opacity: 0, y: 12 }"
        :animate="{ opacity: 1, y: 0 }"
        :exit="{ opacity: 0, y: 12 }"
        :transition="motionBase"
      >
        <Motion as="button" type="button" class="mini-plan__btn" aria-label="Open floor plan" :while-hover="{ scale: 1.02 }" :while-press="press" @click="setView('plan')">
          <img :src="model.floorPlan" alt="" class="mini-plan__img">
        </Motion>
        <span class="mini-plan__label">You are in: <strong>{{ roomName }}</strong></span>
      </Motion>
    </AnimatePresence>
  </section>
</template>

<style scoped>
.stage {
  position: relative;
  min-width: 0;
  min-height: 0;
  border-radius: var(--r-stage);
  background: var(--c-pano);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-stage-ink);
  overflow: hidden;
}
.stage { transition: background-color .3s; }
.stage--plan { background: var(--c-plan); }

.pano-hint { font-size: 15px; padding: 0 24px; text-align: center; }

.plan { margin: 0; display: flex; flex-direction: column; align-items: center; gap: 14px; width: 100%; }
.plan__img {
  width: 860px;
  max-width: calc(100% - 48px);
  height: auto;
  display: block;
  border-radius: 16px;
  background: var(--c-surface);
}
.plan__caption { font-size: 13px; color: var(--c-muted-strong); }

.total {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 12px 16px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.total__label { font-size: 13px; color: var(--c-muted-strong); }
.total__value { font-family: var(--f-display); font-weight: 700; font-size: 26px; color: var(--c-ink); }

.view-toggle { position: absolute; left: 20px; bottom: 20px; }

.mini-plan {
  position: absolute;
  right: 20px;
  bottom: 20px;
  padding: 10px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.mini-plan__btn { padding: 0; border: 0; background: transparent; display: block; border-radius: 8px; }
.mini-plan__img { width: 240px; height: auto; display: block; border-radius: 8px; background: var(--c-surface); }
.mini-plan__label { font-size: 12px; color: var(--c-muted-strong); }

.back {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 44px;
  height: 44px;
  border-radius: var(--r-pill);
  color: var(--c-ink);
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 899.98px) {
  .stage { border-radius: 0; }
  .pano-hint { font-size: 13px; }
  .plan__img { width: 358px; max-width: calc(100% - 32px); border-radius: 12px; }
  .total { top: 12px; right: 12px; padding: 8px 12px; border-radius: 14px; gap: 1px; }
  .total__label { font-size: 12px; }
  .total__value { font-size: 19px; }
  /* the sheet overlaps the stage by 20px */
  .view-toggle { left: 12px; bottom: 32px; }
}
</style>
