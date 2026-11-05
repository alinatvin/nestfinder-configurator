<script setup lang="ts">
/**
 * Collapsible card for one part of the home (Size, Kitchen, Bathrooms, Extras).
 * `thumb` slot = round preview on the left, `subtitle` slot = second line, default slot = editor when open.
 */
const props = defineProps<{ id: string; title: string; open: boolean }>()
defineEmits<{ toggle: [] }>()

const bodyId = computed(() => `card-body-${props.id}`)

// The body is clipped unless it is fully open and settled: then tooltips inside may overflow.
// Clipping starts the moment it begins to close, so collapsing content never spills over the cards below.
const settled = ref(props.open)
watch(() => props.open, () => { settled.value = false })
</script>

<template>
  <div class="card" :data-open-card="open ? 'true' : 'false'">
    <button
      type="button"
      class="card__head"
      :aria-expanded="open"
      :aria-controls="bodyId"
      @click="$emit('toggle')"
    >
      <span class="card__thumb"><slot name="thumb" /></span>
      <span class="card__text">
        <span class="card__title">{{ title }}</span>
        <span class="card__sub"><slot name="subtitle" /></span>
      </span>
      <!-- Always in the layout (only faded) so the header text never re-wraps when the card opens -->
      <span class="card__action" :class="{ 'card__action--hidden': open }" aria-hidden="true">Change</span>
    </button>
    <!--
      Height is animated with a CSS grid track (0fr ↔ 1fr), not JS height:auto.
      JS libraries measure "auto" by briefly applying the final size; inside a scrolled list
      that momentarily shortens the content and the browser snaps the scroll position.
    -->
    <Transition name="expand" @after-enter="settled = true">
      <div
        v-if="open"
        :id="bodyId"
        class="card__clip expand"
        :class="{ 'card__clip--settled': settled && open }"
      >
        <div class="expand__inner">
          <div class="card__body">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.card {
  border-radius: var(--r-card);
  background: var(--c-surface);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}
.card__head {
  width: 100%;
  min-height: 72px;
  border: 0;
  border-radius: var(--r-card);
  background: transparent;
  padding: 12px 14px 12px 12px;
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--c-ink);
  text-align: left;
}
.card__thumb { flex-shrink: 0; display: flex; align-items: center; }
.card__text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.card__title { font-size: 16px; font-weight: 600; }
.card__sub {
  font-size: 14px;
  color: var(--c-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card__action {
  flex-shrink: 0;
  height: 36px;
  padding: 0 14px;
  border-radius: var(--r-pill);
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  background: var(--c-chip);
  color: var(--c-accent);
  transition: opacity .18s, transform .18s;
}
.card__action--hidden { opacity: 0; transform: scale(.9); }
.card__clip--settled > .expand__inner { overflow: visible; }
.card__body { padding: 0 14px 16px; }

@media (max-width: 899.98px) {
  .card__head { min-height: 68px; padding: 10px 12px; gap: 12px; }
  .card__action { height: 34px; padding: 0 12px; font-size: 13px; }
  .card__body { padding: 0 12px 14px; }
}
</style>
