<script setup lang="ts">
/** Round colour / texture chip. `none` = the "no finish" option: grey circle struck through. */
const props = withDefaults(defineProps<{
  color: string
  texture?: string
  none?: boolean
  size?: number
}>(), { size: 48 })

const style = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  ...(props.none
    ? {}
    : { backgroundColor: props.color, backgroundImage: props.texture ? `url(${props.texture})` : undefined })
}))
</script>

<template>
  <span class="dot tex" :class="{ 'finish-none': none }" :style="style">
    <AppIcon v-if="none" name="slashCircle" :size="Math.round(size * 0.42)" />
    <slot />
  </span>
</template>

<style scoped>
.dot {
  flex-shrink: 0;
  border-radius: var(--r-pill);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
