<script setup lang="ts">
import { motionFast } from '~/utils/motion'
import type { ExtraGroup } from '~/data/saqr'

const { state, extraGroups, visibleExtras, toggleExtra, setExtraTab, formatDelta } = useConfigurator()

const tab = computed({ get: () => state.value.extraTab, set: (v: ExtraGroup) => setExtraTab(v) })
const tabs = extraGroups.map(g => ({ value: g.id, label: g.label }))
</script>

<template>
  <div class="extras">
    <SegmentedControl v-model="tab" :options="tabs" label="Extras type" variant="tabs" />
    <!-- Interior ↔ Exterior: lists cross-fade -->
    <AnimatePresence mode="wait" :initial="false">
    <Motion
      :key="state.extraTab"
      as="ul"
      class="list"
      :initial="{ opacity: 0, x: state.extraTab === 'ext' ? 16 : -16 }"
      :animate="{ opacity: 1, x: 0 }"
      :exit="{ opacity: 0, x: state.extraTab === 'ext' ? -16 : 16 }"
      :transition="motionFast"
    >
      <li v-for="x in visibleExtras" :key="x.id" class="item" :class="{ 'item--on': state.extras[x.id] }">
        <Motion as="button" type="button" class="item__main" :aria-pressed="!!state.extras[x.id]" :while-press="{ scale: 0.98 }" @click="toggleExtra(x.id)">
          <span class="item__photo tex" :style="{ backgroundImage: `url(${x.photo})` }" />
          <span class="item__text">
            <span class="item__name">{{ x.name }}</span>
            <span class="item__price">{{ formatDelta(x.amount) }}</span>
          </span>
        </Motion>
        <span class="info">
          <button type="button" class="info__btn" :aria-label="`About ${x.name}`" :aria-describedby="`tip-${x.id}`">
            <AppIcon name="info" :size="20" />
          </button>
          <span :id="`tip-${x.id}`" role="tooltip" class="info__tip">{{ x.desc }}</span>
        </span>
      </li>
    </Motion>
    </AnimatePresence>
  </div>
</template>

<style scoped>
.extras { display: flex; flex-direction: column; gap: 12px; }
.list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }

.item {
  display: flex;
  align-items: center;
  border-radius: var(--r-tile);
  background: var(--c-tile);
  transition: background-color .2s, box-shadow .2s;
}
.item--on { background: var(--c-accent-soft); box-shadow: inset 0 0 0 1.5px var(--c-accent); }
.item__main {
  flex: 1;
  min-width: 0;
  padding: 10px;
  border: 0;
  border-radius: var(--r-tile);
  background: transparent;
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--c-ink);
  text-align: left;
}
.item__photo {
  width: 104px;
  height: 72px;
  flex-shrink: 0;
  border-radius: 10px;
  background-color: var(--c-photo);
}
.item__text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.item__name { font-size: 15px; font-weight: 600; }
.item__price { font-size: 13px; font-weight: 600; color: var(--c-accent); }

.info { position: relative; flex-shrink: 0; margin-right: 6px; }
.info__btn {
  width: 44px;
  height: 44px;
  border: 0;
  padding: 0;
  border-radius: var(--r-pill);
  background: transparent;
  color: var(--c-accent);
  display: flex;
  align-items: center;
  justify-content: center;
}
.info__tip {
  display: none;
  position: absolute;
  top: 44px;
  right: 0;
  z-index: 3;
  width: 200px;
  padding: 10px 12px;
  border-radius: 12px;
  background: var(--c-ink);
  color: #fff;
  font-size: 12px;
  line-height: 1.45;
  text-align: left;
  box-shadow: 0 8px 24px rgba(22, 32, 28, .25);
}
.info:hover .info__tip,
.info:focus-within .info__tip { display: block; }

@media (max-width: 899.98px) {
  .extras { gap: 10px; }
}
</style>
