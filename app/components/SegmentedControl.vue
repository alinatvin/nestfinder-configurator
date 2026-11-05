<script setup lang="ts" generic="T extends string">
import { springPill } from '~/utils/motion'
withDefaults(defineProps<{
  options: { value: T; label: string }[]
  label: string
  /** `chip`: header toggles; `tabs`: full-width tabs; `pill`: accent pills on glass (360°/Plan). */
  variant?: 'chip' | 'tabs' | 'pill'
}>(), { variant: 'chip' })

const model = defineModel<T>({ required: true })

// One shared layoutId per control instance, so the selection pill slides between options.
const indicatorId = `seg-${useId()}`
</script>

<template>
  <div role="group" :aria-label="label" class="seg" :class="`seg--${variant}`">
    <button
      v-for="o in options"
      :key="o.value"
      type="button"
      class="seg__btn"
      :aria-pressed="model === o.value"
      @click="model = o.value"
    >
      <Motion
        v-if="model === o.value"
        as="span"
        class="seg__indicator"
        :layout-id="indicatorId"
        :transition="springPill"
        aria-hidden="true"
      />
      <span class="seg__label">{{ o.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.seg { display: flex; }
.seg__btn { position: relative; transition: color .2s; }
.seg__indicator { position: absolute; inset: 0; border-radius: inherit; z-index: 0; }
.seg__label { position: relative; z-index: 1; }

/* header chips */
.seg--chip { padding: 3px; border-radius: 10px; background: var(--c-chip); }
.seg--chip .seg__btn {
  height: 30px; padding: 0 10px; border: 0; border-radius: 8px;
  background: transparent; font-size: 13px; color: var(--c-muted);
}
.seg--chip .seg__btn[aria-pressed='true'] { font-weight: 600; color: var(--c-ink); }
.seg--chip .seg__indicator { background: var(--c-surface); }

/* interior / exterior tabs */
.seg--tabs { padding: 3px; border-radius: 12px; background: var(--c-chip); }
.seg--tabs .seg__btn {
  flex: 1; height: 40px; border: 0; border-radius: 9px;
  background: transparent; font-size: 14px; color: var(--c-muted);
}
.seg--tabs .seg__btn[aria-pressed='true'] { color: var(--c-ink); font-weight: 600; }
.seg--tabs .seg__indicator { background: var(--c-surface); }

/* 360° / plan on the stage */
.seg--pill {
  padding: 4px; border-radius: var(--r-pill);
  background: var(--c-glass); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
}
.seg--pill .seg__btn {
  height: 40px; padding: 0 18px; border: 0; border-radius: var(--r-pill);
  background: transparent; font-size: 14px; color: var(--c-ink);
}
.seg--pill .seg__btn[aria-pressed='true'] { color: #fff; font-weight: 600; }
.seg--pill .seg__indicator { background: var(--c-accent); }

@media (max-width: 899.98px) {
  .seg--pill { padding: 3px; }
  .seg--pill .seg__btn { height: 36px; padding: 0 14px; }
}
</style>
