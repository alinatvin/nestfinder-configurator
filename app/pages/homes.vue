<script setup lang="ts">
useHead({ title: 'All homes · FindNido' })
</script>

<template>
  <div class="placeholder">
    <h1>All homes</h1>
    <p>This screen ("2 · Homes") is not part of the rooms v3 handoff yet.</p>
    <NuxtLink to="/">Back to the configurator</NuxtLink>
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
