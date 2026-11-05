<script setup lang="ts">
import { motionBase, motionFast, press } from '~/utils/motion'
import type { View } from '~/composables/useConfigurator'

const { state, model, modelName, roomName, setView, currentSize } = useConfigurator()
const { t } = useI18n()

const view = computed({ get: () => state.value.view, set: (v: View) => setView(v) })
const views = computed(() => [
  { value: 'pano' as const, label: t('stage.pano') },
  { value: 'plan' as const, label: t('stage.plan') }
])
const isPano = computed(() => state.value.view === 'pano')
</script>

<template>
  <section class="stage" :class="{ 'stage--plan': !isPano }" :aria-label="isPano ? t('stage.panoramaAria') : t('stage.planAria')">
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
        {{ t('stage.panorama', { room: roomName }) }}<span class="only-desktop">{{ t('stage.dragHint') }}</span>
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
        <img :src="model.floorPlan" :alt="t('stage.floorPlan', { name: modelName, beds: currentSize.beds })" class="plan__img">
        <figcaption class="plan__caption only-desktop">{{ t('stage.floorPlan', { name: modelName, beds: currentSize.beds }) }}</figcaption>
      </Motion>
    </AnimatePresence>

    <NuxtLink to="/homes" class="back only-mobile glass" :aria-label="t('common.backToHomes')">
      <AppIcon name="back" :size="20" />
    </NuxtLink>

    <div class="total glass">
      <span class="total__label">{{ t('common.estimatedTotal') }}</span>
      <PriceTotal class="total__value" />
    </div>

    <SegmentedControl v-model="view" :options="views" :label="t('stage.view')" variant="pill" class="view-toggle" />

    <AnimatePresence :initial="false">
      <Motion
        v-if="isPano"
        key="mini-plan"
        as="div"
        class="mini-plan glass only-desktop"
        :aria-label="t('stage.miniPlan')"
        :initial="{ opacity: 0, y: 12 }"
        :animate="{ opacity: 1, y: 0 }"
        :exit="{ opacity: 0, y: 12 }"
        :transition="motionBase"
      >
        <Motion as="button" type="button" class="mini-plan__btn" :aria-label="t('stage.openPlan')" :while-hover="{ scale: 1.02 }" :while-press="press" @click="setView('plan')">
          <img :src="model.floorPlan" alt="" class="mini-plan__img">
        </Motion>
        <span class="mini-plan__label">{{ t('stage.youAreIn') }} <strong>{{ roomName }}</strong></span>
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
  inset-inline-end: 20px;
  padding: 12px 16px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.total__label { font-size: 13px; color: var(--c-muted-strong); }
.total__value { font-family: var(--f-display); font-weight: 700; font-size: 26px; color: var(--c-ink); }

.view-toggle { position: absolute; inset-inline-start: 20px; bottom: 20px; }

.mini-plan {
  position: absolute;
  inset-inline-end: 20px;
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
  inset-inline-start: 12px;
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
  .total { top: 12px; inset-inline-end: 12px; padding: 8px 12px; border-radius: 14px; gap: 1px; }
  .total__label { font-size: 12px; }
  .total__value { font-size: 19px; }
  /* the sheet overlaps the stage by 20px */
  .view-toggle { inset-inline-start: 12px; bottom: 32px; }
}
</style>
