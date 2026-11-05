<script setup lang="ts">
import { press } from '~/utils/motion'
const { state, sizes, formatArea, formatDelta, setSize } = useConfigurator()
</script>

<template>
  <!-- Desktop: rich size cards (v3 · Size open) -->
  <div class="list only-desktop">
    <Motion
      v-for="s in sizes"
      :key="s.code"
      as="button"
      type="button"
      class="size"
      :aria-pressed="state.size === s.code"
      :while-press="press"
      @click="setSize(s.code)"
    >
      <span class="size__code">{{ s.code }}</span>
      <span class="size__info">
        <span class="size__title">Size {{ s.code }}</span>
        <SizeSpecs compact :beds="s.beds" :baths="s.baths" :area="formatArea(s.area)" />
        <span class="size__price">{{ formatDelta(s.priceDelta) }}</span>
      </span>
    </Motion>
  </div>

  <!-- Mobile: compact S / M / L grid (Mobile · rooms v3) -->
  <div class="grid only-mobile">
    <Motion
      v-for="s in sizes"
      :key="s.code"
      as="button"
      type="button"
      class="tile"
      :aria-pressed="state.size === s.code"
      :while-press="press"
      @click="setSize(s.code)"
    >
      <span class="tile__code">{{ s.code }}</span>
      <!-- icons instead of "4 bd": same bed / bath glyphs as the card header -->
      <span class="tile__sub">
        <span class="tile__spec"><AppIcon name="bed" :width="18" :height="12.6" />{{ s.beds }}<span class="sr-only"> bedrooms</span></span>
        <span class="tile__spec"><AppIcon name="bath" :size="14" />{{ s.baths }}<span class="sr-only"> bathrooms</span></span>
      </span>
    </Motion>
  </div>
</template>

<style scoped>
.list { display: flex; flex-direction: column; gap: 8px; }
.size {
  width: 100%;
  padding: 10px;
  border: 0;
  border-radius: var(--r-tile);
  background: var(--c-tile);
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--c-ink);
  text-align: left;
}
.size, .tile { transition: background-color .2s, box-shadow .2s, color .2s; }
.size[aria-pressed='true'] { background: var(--c-accent-soft); box-shadow: inset 0 0 0 1.5px var(--c-accent); }
.size__code {
  width: 104px;
  height: 72px;
  flex-shrink: 0;
  border-radius: 10px;
  background: var(--c-photo);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--f-display);
  font-size: 28px;
  font-weight: 700;
  color: var(--c-accent);
}
.size__info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.size__title { font-size: 15px; font-weight: 600; }
.size__price { font-size: 13px; font-weight: 600; color: var(--c-accent); }

.grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.tile {
  height: 72px;
  border: 0;
  border-radius: var(--r-btn);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  background: var(--c-tile);
  color: var(--c-ink);
}
.tile[aria-pressed='true'] { background: var(--c-accent); color: #fff; }
.tile__code { font-size: 20px; font-weight: 600; }
.tile__sub { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; color: var(--c-muted); }
.tile__spec { display: flex; align-items: center; gap: 4px; }
.tile__spec :deep(svg) { color: var(--c-accent); }
.tile[aria-pressed='true'] .tile__sub { color: var(--c-on-accent-muted); }
.tile[aria-pressed='true'] .tile__spec :deep(svg) { color: #fff; }
</style>
