<script setup lang="ts">
// Stroke-free filled icons copied from the design file.
const icons = {
  back: { viewBox: '0 0 24 24', d: ['M15.793 2.293a1 1 0 1 1 1.414 1.414L8.914 12l8.293 8.293a1 1 0 1 1-1.414 1.414l-9-9a1 1 0 0 1 0-1.414z'] },
  arrowRight: { viewBox: '0 0 24 24', d: ['M11.293 2.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 1 1-1.414-1.414L18.586 13H3a1 1 0 0 1 0-2h15.586l-7.293-7.293a1 1 0 0 1 0-1.414'] },
  plus: { viewBox: '0 0 24 24', d: ['M12 3a1 1 0 0 1 1 1v7h7a1 1 0 1 1 0 2h-7v7a1 1 0 1 1-2 0v-7H4a1 1 0 1 1 0-2h7V4a1 1 0 0 1 1-1'] },
  check: { viewBox: '0 0 24 24', d: ['M19.793 5.293a1 1 0 1 1 1.414 1.414l-11.5 11.5a1 1 0 0 1-1.414 0l-5.5-5.5a1 1 0 1 1 1.414-1.414L9 16.086z'] },
  close: { viewBox: '0 0 24 24', d: ['M17.793 4.793a1 1 0 1 1 1.414 1.414L13.414 12l5.793 5.793a1 1 0 1 1-1.414 1.414L12 13.414l-5.793 5.793a1 1 0 1 1-1.414-1.414L10.586 12 4.793 6.207a1 1 0 1 1 1.414-1.414L12 10.586z'] },
  slashCircle: { viewBox: '0 0 24 24', d: ['M12 1c3.037 0 5.789 1.232 7.778 3.222A10.97 10.97 0 0 1 23 12c0 6.075-4.925 11-11 11a10.97 10.97 0 0 1-7.778-3.222A10.97 10.97 0 0 1 1 12C1 5.925 5.925 1 12 1M6.383 19.03A9 9 0 0 0 19.03 6.383zM12 3a9 9 0 0 0-7.031 14.616L17.616 4.97A8.96 8.96 0 0 0 12 3'] },
  info: { viewBox: '0 0 24 24', d: ['M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1m0 2a9 9 0 1 0 0 18 9 9 0 0 0 0-18m0 8.5a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1m0-5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3'] },
  bed: { viewBox: '2 5 20 14', d: ['M22 12c0-1.1-.9-2-2-2V7c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v3c-1.1 0-2 .9-2 2v5h1.33L4 19h1l.67-2h12.67l.66 2h1l.67-2H22zm-4-2h-5V7h5zM6 7h5v3H6zm-2 5h16v3H4z'] },
  bath: {
    viewBox: '2 2 20 20',
    d: [
      'M7 5a2 2 0 1 0 0 4a2 2 0 1 0 0-4',
      'M20 13V4.83C20 3.27 18.73 2 17.17 2c-.75 0-1.47.3-2 .83l-1.25 1.25c-.16-.05-.33-.08-.51-.08c-.4 0-.77.12-1.08.32l2.76 2.76c.2-.31.32-.68.32-1.08c0-.18-.03-.34-.07-.51l1.25-1.25a.828.828 0 0 1 1.41.59V13h-6.85c-.3-.21-.57-.45-.82-.72l-1.4-1.55c-.19-.21-.43-.38-.69-.5A2.25 2.25 0 0 0 5 12.25V13H2v6c0 1.1.9 2 2 2c0 .55.45 1 1 1h14c.55 0 1-.45 1-1c1.1 0 2-.9 2-2v-6zm0 6H4v-4h16z'
    ]
  },
  area: { viewBox: '3 3 18 18', d: ['M3 5v4h2V5h4V3H5c-1.1 0-2 .9-2 2m2 10H3v4c0 1.1.9 2 2 2h4v-2H5zm14 4h-4v2h4c1.1 0 2-.9 2-2v-4h-2zm0-16h-4v2h4v4h2V5c0-1.1-.9-2-2-2'] }
} as const

export type IconName = keyof typeof icons

const props = withDefaults(defineProps<{ name: IconName; size?: number | string; width?: number | string; height?: number | string }>(), {
  size: 16
})

const icon = computed(() => icons[props.name])
</script>

<template>
  <svg
    :width="width ?? size"
    :height="height ?? size"
    :viewBox="icon.viewBox"
    aria-hidden="true"
    focusable="false"
    style="display: block; flex-shrink: 0"
  >
    <path v-for="(d, i) in icon.d" :key="i" fill="currentColor" :d="d" />
  </svg>
</template>
