<script setup lang="ts">
/**
 * Estimated total. Digits that change roll like a slot machine (SlotCounter).
 * The number is always laid out left-to-right; the currency is a separate word next to it,
 * so in Arabic (right-to-left) it lands on the left of the number: «1,199,880 درهم».
 */
const { totalPrice, formatNumber, formatPrice } = useConfigurator()
const { t } = useI18n()
const number = computed(() => formatNumber(totalPrice.value))
</script>

<template>
  <span class="price">
    <span class="price__visual" aria-hidden="true">
      <SlotCounter :value="number" dir="ltr" />
      <span class="price__cur">{{ t('common.currency') }}</span>
    </span>
    <!-- screen readers get only the final value, not the rolling digits -->
    <span class="sr-only" aria-live="polite">{{ formatPrice(totalPrice) }}</span>
  </span>
</template>

<style scoped>
.price { display: inline-flex; }
.price__visual { display: inline-flex; align-items: flex-start; gap: .25em; white-space: nowrap; }
.price__cur { line-height: 1.15em; }
</style>
