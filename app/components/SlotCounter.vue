<script setup lang="ts">
/**
 * Slot-machine style number change, a Vue port of the behaviour of react-slot-counter
 * (https://almond-bongbong.github.io/react-slot-counter/), with its defaults:
 *  - only the digits that changed roll (animateUnchanged: false);
 *  - each rolling digit runs a strip: old digit → 6 random digits (dummyCharacterCount) → new digit;
 *  - direction bottom-up, duration 0.7s;
 *  - separators and other non-digits (",", " ", "AED") stay still.
 * Strings are compared right-aligned, so units stay over units when the number gets longer.
 * Server render / first paint show the plain value; rolling happens only on changes.
 */
const props = withDefaults(defineProps<{
  value: string
  duration?: number
  dummyCount?: number
  /** Extra delay per rolling column, seconds (left → right). */
  stagger?: number
}>(), { duration: 0.7, dummyCount: 6, stagger: 0.03 })

interface Col {
  key: string
  char: string
  /** Present only while this column rolls. */
  strip?: string[]
  delay?: number
}

const isDigit = (c: string | undefined) => c !== undefined && c >= '0' && c <= '9'
const randomDigit = () => String(Math.floor(Math.random() * 10))

const run = ref(0)
const rolling = ref(false)
const cols = ref<Col[]>(toStatic(props.value))

function toStatic(v: string): Col[] {
  // key by position from the right, so columns keep identity when the number grows/shrinks on the left
  return [...v].map((char, i) => ({ key: `s${v.length - i}`, char }))
}

let settleTimer: ReturnType<typeof setTimeout> | undefined

watch(() => props.value, async (to, from) => {
  if (!import.meta.client || to === from) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cols.value = toStatic(to)
    return
  }
  clearTimeout(settleTimer)
  run.value++
  rolling.value = false

  const len = to.length
  const offset = from.length - len
  let rollIndex = 0
  cols.value = [...to].map((char, i) => {
    const prev = from[i + offset]
    const key = `r${run.value}-${len - i}`
    if (!isDigit(char) || prev === char) return { key, char }
    const start = isDigit(prev) ? prev! : '0'
    const strip = [start, ...Array.from({ length: props.dummyCount }, randomDigit), char]
    return { key, char, strip, delay: rollIndex++ * props.stagger }
  })

  // first frame at the start of the strip, next frame: roll to the end (CSS transition)
  await nextTick()
  requestAnimationFrame(() => requestAnimationFrame(() => { rolling.value = true }))

  const total = (props.duration + rollIndex * props.stagger) * 1000 + 50
  settleTimer = setTimeout(() => { cols.value = toStatic(to) }, total)
})

onBeforeUnmount(() => clearTimeout(settleTimer))

const stripStyle = (c: Col) => {
  const steps = (c.strip?.length ?? 1) - 1
  return {
    transform: rolling.value ? `translateY(calc(${-steps} * var(--slot-h)))` : 'translateY(0)',
    transition: rolling.value
      ? `transform ${props.duration}s cubic-bezier(.22, 1, .36, 1) ${c.delay ?? 0}s`
      : 'none'
  }
}
</script>

<template>
  <span class="slot" aria-hidden="true">
    <template v-for="c in cols" :key="c.key">
      <span v-if="c.strip" class="slot__col">
        <span class="slot__strip" :style="stripStyle(c)">
          <span v-for="(d, i) in c.strip" :key="i" class="slot__cell">{{ d }}</span>
        </span>
      </span>
      <span v-else class="slot__cell slot__static" :class="{ 'slot__digit': isDigit(c.char) }">{{ c.char === ' ' ? ' ' : c.char }}</span>
    </template>
  </span>
</template>

<style scoped>
.slot {
  --slot-h: 1.15em;
  /*
   * Every digit gets the same box (react-slot-counter's useMonospaceWidth). The display font (Raleway)
   * has proportional digits — "1" is 0.49em, "0" 0.61em — and tabular-nums does not help, so without
   * this a rolling column (as wide as its widest digit) and the settled digit differ in width and the
   * whole price block shifts at the start and the end of the roll. 0.62em = widest Raleway digit.
   */
  --slot-digit-w: 0.62em;
  display: inline-flex;
  align-items: flex-start;
  font-variant-numeric: tabular-nums;
  line-height: var(--slot-h);
  height: var(--slot-h);
  white-space: nowrap;
}
.slot__col,
.slot__digit { width: var(--slot-digit-w); flex-shrink: 0; }
.slot__col {
  display: inline-block;
  height: var(--slot-h);
  overflow: hidden;
  /* soft fade at the top/bottom edges, like a slot window */
  /* (fade stays inside the line's leading, so the settled digit is not dimmed) */
  -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 9%, #000 91%, transparent 100%);
  mask-image: linear-gradient(to bottom, transparent 0, #000 9%, #000 91%, transparent 100%);
}
.slot__strip {
  display: flex;
  flex-direction: column;
  will-change: transform;
}
.slot__cell {
  display: block;
  height: var(--slot-h);
  text-align: center;
}
</style>
