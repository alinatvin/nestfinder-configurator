<script setup lang="ts">
import type { Lang, Unit } from '~/composables/useConfigurator'

const { state, setLang, setUnit } = useConfigurator()

const lang = computed({ get: () => state.value.lang, set: (v: Lang) => setLang(v) })
const unit = computed({ get: () => state.value.unit, set: (v: Unit) => setUnit(v) })

const langs = [
  { value: 'EN' as const, label: 'EN' },
  { value: 'ES' as const, label: 'ES' },
  { value: 'AR' as const, label: 'AR' }
]
const units = [
  { value: 'm2' as const, label: 'm²' },
  { value: 'ft2' as const, label: 'ft²' }
]
</script>

<template>
  <header class="header">
    <div class="logos">
      <img src="/images/findnido-logo.svg" alt="FindNido" class="logo logo--brand">
      <img src="/images/dubai-municipality.png" alt="Dubai Municipality" class="logo logo--partner">
    </div>
    <div class="controls only-desktop">
      <NuxtLink to="/homes" class="back">
        <AppIcon name="back" :size="14" />All homes
      </NuxtLink>
      <SegmentedControl v-model="lang" :options="langs" label="Language" />
      <SegmentedControl v-model="unit" :options="units" label="Units" />
    </div>
  </header>
</template>

<style scoped>
.header {
  height: 64px;
  flex-shrink: 0;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 24px;
  background: var(--c-surface);
}
.logos { display: flex; align-items: center; gap: 20px; flex-shrink: 0; }
.logo { width: auto; display: block; }
.logo--brand { height: 28px; }
.logo--partner { height: 26px; }
.controls { margin-left: auto; display: flex; align-items: center; gap: 24px; }
.back {
  height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  background: var(--c-chip);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
}

@media (max-width: 899.98px) {
  .header { height: 52px; padding: 0 16px; }
  .logos { width: 100%; justify-content: space-between; }
  .logo--brand { height: 22px; }
  .logo--partner { height: 20px; }
}
</style>
