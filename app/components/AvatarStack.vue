<script setup lang="ts">
/**
 * Animated stack of overlapping round images.
 * Vue/CSS port of the behaviour of AnimatedAvatarStack from cyrax111/avatar_stack (Flutter, BSD-3-Clause),
 * toned down for a form:
 *  - an added item grows in its own slot with a short nudge from the left and a soft spring
 *    (the original flies in from −2 × size across the stack with Curves.elasticOut — too much here);
 *  - the other items slide to their new slots with the same soft spring;
 *  - a removed item shrinks into its centre (Curves.easeOutExpo);
 *  - when there are more items than `max`, the last slot becomes a "+N" info item;
 *  - an item whose image changes in place cross-fades (AnimatedSwitcher).
 * Items are tracked by `key`, so the same key keeps its element and only moves.
 */
import type { StackItem } from '~/types/stack'

const props = withDefaults(defineProps<{
  items: StackItem[]
  /** Max slots, the info item included. */
  max?: number
  label?: string
}>(), { max: 3, label: undefined })

type Slot =
  | (StackItem & { type: 'item' })
  | { key: string; type: 'info'; count: number }

const slots = computed<Slot[]>(() => {
  const all = props.items
  if (all.length <= props.max) return all.map(it => ({ ...it, type: 'item' as const }))
  const shown = all.slice(0, props.max - 1).map(it => ({ ...it, type: 'item' as const }))
  return [...shown, { key: '__info', type: 'info' as const, count: all.length - shown.length }]
})

const faceStyle = (it: StackItem) => ({
  backgroundColor: it.color ?? 'var(--c-photo)',
  backgroundImage: it.image ? `url(${it.image})` : undefined
})
</script>

<template>
  <span class="stack" :style="{ '--n': Math.max(slots.length, 1) }" :aria-label="label" :role="label ? 'img' : undefined">
    <TransitionGroup name="av">
      <span
        v-for="(s, i) in slots"
        :key="s.key"
        class="av"
        :class="{ 'av--plus': s.type === 'item' && s.kind === 'plus', 'av--info': s.type === 'info' }"
        :style="{ '--i': i, zIndex: i + 1 }"
        aria-hidden="true"
      >
        <template v-if="s.type === 'info'">
          <Transition name="av-swap">
            <span :key="s.count" class="av__face av__info">+{{ s.count }}</span>
          </Transition>
        </template>
        <template v-else-if="s.kind === 'plus'">
          <AppIcon name="plus" :size="20" />
        </template>
        <template v-else>
          <!-- image changed under the same key → cross-fade -->
          <Transition name="av-swap">
            <span
              :key="s.kind === 'none' ? '__none' : (s.image ?? s.color)"
              class="av__face tex"
              :class="{ 'finish-none': s.kind === 'none' }"
              :style="s.kind === 'none' ? undefined : faceStyle(s)"
            >
              <AppIcon v-if="s.kind === 'none'" name="slashCircle" :size="20" />
            </span>
          </Transition>
        </template>
      </span>
    </TransitionGroup>
  </span>
</template>

<style scoped>
.stack {
  --av-size: 48px;
  --av-step: 28px; /* size − overlap (20px) */
  --av-move: .6s;  /* package default is 1.4s */
  position: relative;
  display: block;
  flex-shrink: 0;
  height: var(--av-size);
  width: calc(var(--av-size) + (var(--n) - 1) * var(--av-step));
  transition: width .45s var(--ease-out-expo);
}

.av {
  position: absolute;
  top: 0;
  left: calc(var(--i) * var(--av-step));
  width: var(--av-size);
  height: var(--av-size);
  border-radius: var(--r-pill);
  box-shadow: 0 0 0 2px #fff;
  background: var(--c-photo);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  /* slot changes (an item added/removed before this one) */
  transition: left var(--av-move) var(--ease-spring-soft), right var(--av-move) var(--ease-spring-soft);
}
/* right-to-left: the stack grows from the right edge */
[dir='rtl'] .av { left: auto; right: calc(var(--i) * var(--av-step)); }
.av--plus { background: var(--c-accent-soft); color: var(--c-accent); box-shadow: none; }
.av__face { position: absolute; inset: 0; border-radius: inherit; }
.av__info {
  background: var(--c-chip);
  color: var(--c-accent);
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* added: grows in its own slot with a short nudge from the left, soft spring */
.av-enter-active {
  transition:
    transform var(--av-move) var(--ease-spring-soft),
    opacity .2s ease,
    left var(--av-move) var(--ease-spring-soft),
    right var(--av-move) var(--ease-spring-soft);
}
.av-enter-from {
  /* nudge from the start side: from the left in LTR, from the right in RTL */
  transform: translateX(calc(-10px * var(--dir))) scale(.4);
  opacity: 0;
}

/* removed: shrinks into its own centre */
.av-leave-active {
  transition: transform .4s var(--ease-out-expo), opacity .3s ease;
}
.av-leave-to { transform: scale(0); opacity: 0; }

/* same slot, new image */
.av-swap-enter-active,
.av-swap-leave-active { transition: opacity .45s ease; }
.av-swap-enter-from,
.av-swap-leave-to { opacity: 0; }

@media (max-width: 899.98px) {
  .stack { --av-size: 44px; --av-step: 26px; }
}
</style>
