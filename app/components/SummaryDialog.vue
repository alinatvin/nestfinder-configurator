<script setup lang="ts">
import { motionBase, motionSheet, press } from '~/utils/motion'
const { state, modelName, summaryRows, openRoom, closeSummary } = useConfigurator()
const { t } = useI18n()

const closeBtn = ref<HTMLButtonElement | null>(null)
let returnFocus: HTMLElement | null = null

// Desktop: centred modal rises in. Mobile: bottom sheet slides up.
const isMobile = ref(false)
const hidden = computed(() =>
  isMobile.value ? { y: '100%' } : { opacity: 0, y: 16, scale: 0.98 }
)
const shown = computed(() => (isMobile.value ? { y: 0 } : { opacity: 1, y: 0, scale: 1 }))

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeSummary()
}

watch(() => state.value.summaryOpen, async (open) => {
  if (!import.meta.client) return
  if (open) {
    isMobile.value = window.matchMedia('(max-width: 899.98px)').matches
    returnFocus = document.activeElement as HTMLElement | null
    window.addEventListener('keydown', onKey)
    await nextTick()
    closeBtn.value?.focus()
  } else {
    window.removeEventListener('keydown', onKey)
    returnFocus?.focus()
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <!-- plain root so parent attrs have an element to land on (AnimatePresence renders a fragment) -->
  <div class="summary-root">
  <AnimatePresence>
    <Motion
      v-if="state.summaryOpen"
      key="scrim"
      as="div"
      class="scrim"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0 }"
      :transition="motionBase"
      @click.self="closeSummary"
    >
      <Motion
        as="div"
        role="dialog"
        aria-modal="true"
        aria-labelledby="summary-title"
        class="dialog"
        :initial="hidden"
        :animate="shown"
        :exit="hidden"
        :transition="isMobile ? motionSheet : motionBase"
      >
        <div class="dialog__head">
          <h2 id="summary-title" class="dialog__title">{{ t('common.yourModel', { name: modelName }) }}</h2>
          <button ref="closeBtn" type="button" class="close" :aria-label="t('common.close')" @click="closeSummary">
            <AppIcon name="close" :size="20" />
          </button>
        </div>
        <dl class="rows">
          <div v-for="r in summaryRows" :key="r.key" class="row" :class="{ 'row--multi': r.specs || r.items?.length }">
            <dt class="row__k">{{ r.label }}</dt>
            <dd class="row__v">
              <span class="row__content">
                <!-- Size: code + icon block (beds · baths · area), then its price effect -->
                <template v-if="r.specs">
                  <span class="row__line">
                    <span class="row__code">{{ r.value }}</span>
                    <SizeSpecs compact :beds="r.specs.beds" :baths="r.specs.baths" :area="r.specs.area" class="row__specs" />
                  </span>
                  <span v-if="r.price" class="row__price">{{ r.price }}</span>
                </template>
                <!-- Extras: one line per chosen extra with its price -->
                <template v-else-if="r.items?.length">
                  <span v-for="it in r.items" :key="it.key" class="row__line row__line--item">
                    <span class="row__name">{{ it.name }}</span>
                    <span class="row__price">{{ it.price }}</span>
                  </span>
                </template>
                <template v-else>
                  <span class="row__line">{{ r.value }}</span>
                  <span v-if="r.price" class="row__price">{{ r.price }}</span>
                </template>
              </span>
              <button type="button" class="edit" @click="openRoom(r.room)">{{ t('common.edit') }}</button>
            </dd>
          </div>
        </dl>
        <div class="dialog__foot">
          <div class="total">
            <span class="total__label">{{ t('common.estimatedTotal') }}</span>
            <PriceTotal class="total__value" />
          </div>
          <Motion as="button" type="button" class="cta" :while-press="press">{{ t('common.requestQuote') }}</Motion>
        </div>
      </Motion>
    </Motion>
  </AnimatePresence>
  </div>
</template>

<style scoped>
.scrim {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: var(--c-scrim);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.dialog {
  width: 100%;
  max-width: 520px;
  max-height: min(760px, 100%);
  border-radius: var(--r-stage);
  background: var(--c-surface);
  box-shadow: 0 24px 64px rgba(22, 32, 28, .25);
  display: flex;
  flex-direction: column;
}
.dialog__head { display: flex; align-items: center; justify-content: space-between; padding: 20px 16px 8px 24px; }
.dialog__title { font-size: 26px; }
.close {
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 12px;
  background: var(--c-chip);
  color: var(--c-ink);
  display: flex;
  align-items: center;
  justify-content: center;
}
.rows { flex: 1; overflow-y: auto; margin: 0; padding: 0 24px; }
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  min-height: 48px;
  border-bottom: 1px solid var(--c-chip);
  font-size: 14px;
}
.row--multi { align-items: flex-start; padding: 12px 0; }
.row--multi .row__k { padding-top: 2px; }
.row--multi .edit { margin-top: -4px; }
.row__k { color: var(--c-muted); flex-shrink: 0; }
.row__v { margin: 0; display: flex; align-items: center; gap: 10px; font-weight: 600; text-align: end; min-width: 0; }
.row--multi .row__v { align-items: flex-start; }
.row__content { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; min-width: 0; }
.row__line { display: flex; align-items: center; justify-content: flex-end; gap: 10px; min-width: 0; }
.row__line--item { gap: 12px; }
.row__code { font-weight: 700; }
.row__specs { font-weight: 400; }
.row__name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.row__price { font-size: 13px; font-weight: 600; color: var(--c-accent); white-space: nowrap; }
.edit {
  flex-shrink: 0;
  height: 32px;
  padding: 0 10px;
  border: 0;
  border-radius: 8px;
  background: var(--c-chip);
  font-size: 13px;
  font-weight: 600;
  color: var(--c-accent);
}
.dialog__foot { padding: 16px 24px 24px; display: flex; flex-direction: column; gap: 12px; }
.total { display: flex; justify-content: space-between; align-items: baseline; }
.total__label { font-size: 14px; color: var(--c-muted); }
.total__value { font-family: var(--f-display); font-size: 26px; font-weight: 700; }
.cta {
  height: 52px;
  border: 0;
  border-radius: var(--r-btn);
  background: var(--c-accent);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}
.cta:hover { background: var(--c-accent-hover); }

/* Mobile: bottom sheet */
@media (max-width: 899.98px) {
  .scrim { display: block; padding: 0; }
  .dialog {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 110px;
    max-width: none;
    max-height: none;
    border-radius: 24px 24px 0 0;
    box-shadow: none;
  }
  .dialog__head { padding: 16px 12px 8px 20px; }
  .dialog__title { font-size: 22px; }
  .rows { padding: 0 20px; }
  .row { min-height: 52px; }
  .dialog__foot { padding: 14px 20px max(16px, env(safe-area-inset-bottom)); gap: 10px; }
  .total__value { font-size: 22px; }
}
</style>
