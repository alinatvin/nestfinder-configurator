<script setup lang="ts">
import type { Lang } from '~/composables/useI18n'
import type { Unit } from '~/composables/useConfigurator'

const { state, setUnit } = useConfigurator()
const { lang: langState, setLang, t } = useI18n()

const lang = computed({ get: () => langState.value, set: (v: Lang) => setLang(v) })
const unit = computed({ get: () => state.value.unit, set: (v: Unit) => setUnit(v) })

const langs = [
  { value: 'EN' as const, label: 'EN' },
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
      <img src="/images/nestfinder-logo.svg" alt="NestFinder" class="logo logo--brand">
      <img src="/images/dubai-municipality.png" alt="Dubai Municipality" class="logo logo--partner">
    </div>
    <div class="controls only-desktop">
      <NuxtLink to="/homes" class="back">
        <AppIcon name="back" :size="14" />{{ t('common.allHomes') }}
      </NuxtLink>
      <SegmentedControl v-model="lang" :options="langs" :label="t('common.language')" />
      <SegmentedControl v-model="unit" :options="units" :label="t('common.units')" />
    </div>
    <!-- mobile: language only (the design has no header controls; without this AR is unreachable on phones) -->
    <SegmentedControl v-model="lang" :options="langs" :label="t('common.language')" class="lang-mobile only-mobile" />
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
.controls { margin-inline-start: auto; display: flex; align-items: center; gap: 24px; }
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
  .header { height: 52px; padding: 0 16px; gap: 12px; }
  .logos { gap: 12px; min-width: 0; }
  .logo--brand { height: 22px; }
  .logo--partner { height: 20px; }
  .lang-mobile { margin-inline-start: auto; }
}
</style>
