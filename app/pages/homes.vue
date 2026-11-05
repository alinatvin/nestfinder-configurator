<script setup lang="ts">
const { t } = useI18n()
useHead({ title: computed(() => `${t('homes.title')} · NestFinder`) })
</script>

<template>
  <div class="placeholder">
    <h1>{{ t('homes.title') }}</h1>
    <p>{{ t('homes.text') }}</p>
    <NuxtLink to="/">{{ t('homes.back') }}</NuxtLink>
  </div>
</template>

<style scoped>
.placeholder {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  text-align: center;
  color: var(--c-muted);
}
</style>
