<script setup lang="ts">
// <html lang dir> follows the language toggle: AR switches the whole page to right-to-left,
// so flex rows mirror (panel moves to the left) and text aligns to the right.
const { htmlLang, dir } = useI18n()

// Deep link: ?lang=ar | en
const route = useRoute()
const { setLang } = useI18n()
const q = route.query.lang
if (typeof q === 'string' && ['en', 'ar'].includes(q.toLowerCase())) setLang(q.toUpperCase() as 'EN' | 'AR')

useHead({ htmlAttrs: { lang: htmlLang, dir } })
</script>

<template>
  <!-- reducedMotion="user": honour the OS "reduce motion" setting -->
  <MotionConfig reduced-motion="user">
    <NuxtPage />
  </MotionConfig>
</template>
