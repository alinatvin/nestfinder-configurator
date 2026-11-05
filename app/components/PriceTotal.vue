<script setup lang="ts">
/** Estimated total. Digits that change roll like a slot machine (SlotCounter). */
import { formatAED } from '~/data/saqr'

const { totalPrice } = useConfigurator()
const label = computed(() => formatAED(totalPrice.value))
</script>

<template>
  <span class="price">
    <SlotCounter :value="label" />
    <!-- screen readers get only the final value, not the rolling digits -->
    <span class="sr-only" aria-live="polite">{{ label }}</span>
  </span>
</template>

<style scoped>
.price { display: inline-flex; }
</style>
