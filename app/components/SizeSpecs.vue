<script setup lang="ts">
withDefaults(defineProps<{ beds: number | string; baths: number | string; area: string; compact?: boolean }>(), { compact: false })
</script>

<template>
  <span class="specs" :class="{ 'specs--compact': compact }">
    <span class="spec">
      <AppIcon name="bed" :width="compact ? 20 : 22" :height="compact ? 14 : 15.4" class="spec__icon" />{{ beds }}<span class="sr-only"> bedrooms</span>
    </span>
    <span class="spec">
      <AppIcon name="bath" :size="compact ? 16 : 18" class="spec__icon" />{{ baths }}<span class="sr-only"> bathrooms</span>
    </span>
    <span class="spec spec--nowrap">
      <AppIcon name="area" :size="compact ? 14 : 16" class="spec__icon" />{{ area }}
    </span>
  </span>
</template>

<style scoped>
.specs { display: flex; align-items: center; gap: 14px; font-size: 14px; color: var(--c-muted); }
.specs--compact { gap: 12px; font-size: 13px; flex-wrap: wrap; }
.spec { display: flex; align-items: center; gap: 5px; }
.specs--compact .spec { gap: 4px; }
.spec--nowrap { white-space: nowrap; }
.spec__icon { color: var(--c-accent); }
</style>
