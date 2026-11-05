<script setup lang="ts">
import { press } from '~/utils/motion'
import type { Finish } from '~/data/saqr'

defineProps<{ finishes: Finish[]; label: string }>()
const selected = defineModel<number>({ required: true })
</script>

<template>
  <div role="group" :aria-label="label" class="grid">
    <Motion
      v-for="(f, i) in finishes"
      :key="f.id"
      as="button"
      type="button"
      class="swatch"
      :aria-pressed="selected === i"
      :while-press="press"
      @click="selected = i"
    >
      <!-- selection = ring around the circle, same as the bathroom finishes -->
      <FinishDot :color="f.color" :texture="f.texture" :none="f.kind === 'none'" :size="56" class="swatch__dot" />
      <span class="swatch__name">{{ f.name }}</span>
    </Motion>
  </div>
</template>

<style scoped>
.grid {
  margin: 0 -6px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 4px;
}
.swatch {
  min-height: 96px;
  border: 0;
  border-radius: var(--r-btn);
  background: transparent;
  padding: 8px 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--c-ink);
}
.swatch__dot { transition: box-shadow .2s; }
.swatch[aria-pressed='true'] .swatch__dot { box-shadow: var(--ring-on); }.swatch__name { font-size: 14px; line-height: 1.25; color: var(--c-muted-strong); text-align: center; }
.swatch[aria-pressed='true'] .swatch__name { font-weight: 600; color: var(--c-ink); }

@media (max-width: 899.98px) {
  .grid { gap: 2px; }
  .swatch { padding: 6px 2px; }
  .swatch__name { font-size: 13px; }
}
</style>
