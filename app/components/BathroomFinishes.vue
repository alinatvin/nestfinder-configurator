<script setup lang="ts">
const { state, bathRows, bathFinishes, setBathFinish, toggleSameFinish } = useConfigurator()
const labelId = useId()
</script>

<template>
  <div class="baths">
    <!-- rows swap between "per bathroom" and "All bathrooms" -->

    <div class="same">
      <span :id="labelId" class="same__label">Same finish in all bathrooms</span>
      <button
        type="button"
        role="switch"
        class="switch"
        :aria-checked="state.sameFinish"
        :aria-labelledby="labelId"
        @click="toggleSameFinish"
      >
        <span class="switch__knob" />
      </button>
    </div>

    <!--
      Rows collapse with a CSS grid track (0fr ↔ 1fr), like .expand in main.css, but slower and
      cascading: on "Same finish" the bottom row folds first and the others follow, instead of
      four rows snapping shut at once. No padding/border/gap on the animated element, so a removed
      row really reaches 0px; no JS height measuring, so the scroll position never snaps.
    -->
    <TransitionGroup name="rows">
    <div
      v-for="(row, i) in bathRows"
      :key="row.key"
      class="expand"
      :style="{ '--enter-delay': `${i * 60}ms`, '--leave-delay': `${(bathRows.length - 1 - i) * 60}ms` }"
    >
     <div class="expand__inner">
     <div role="group" :aria-label="row.label" class="row">
      <span class="row__text">
        <span class="row__label">{{ row.label }}</span>
        <span class="row__value">{{ bathFinishes[row.pick]!.name }}</span>
      </span>
      <span class="row__dots">
        <Motion
          v-for="(f, i) in bathFinishes"
          :key="f.id"
          as="button"
          type="button"
          class="dot tex"
          :aria-pressed="row.pick === i"
          :aria-label="`${row.label}: ${f.name}`"
          :style="{ backgroundColor: f.color, backgroundImage: f.texture ? `url(${f.texture})` : undefined }"
          :while-press="{ scale: 0.9 }"
          @click="setBathFinish(row.index, i)"
        />
      </span>
     </div>
     </div>
    </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
/* no flex gap here: exiting rows would keep their gap until removed and the card would jump at the end */
.baths { display: flex; flex-direction: column; }
.same { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 48px; margin-bottom: 4px; }
.same__label { font-size: 15px; }

.switch {
  flex-shrink: 0;
  width: 52px;
  height: 32px;
  border: 0;
  border-radius: var(--r-pill);
  padding: 3px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: var(--c-switch-off);
  transition: background-color .15s;
}
.switch[aria-checked='true'] { background: var(--c-accent); }
.switch[aria-checked='true'] .switch__knob { transform: translateX(20px); }
.switch__knob {
  transition: transform .22s cubic-bezier(.22, 1, .36, 1);
  width: 26px;
  height: 26px;
  border-radius: var(--r-pill);
  background: #fff;
  box-shadow: 0 1px 3px rgba(22, 32, 28, .25);
}

/* Rows: softer, slower than the card expand; the delays cascade the rows (set per row in the template). */
.rows-enter-active {
  transition:
    grid-template-rows .55s cubic-bezier(.45, 0, .2, 1) var(--enter-delay, 0ms),
    opacity .35s ease calc(var(--enter-delay, 0ms) + 150ms);
}
.rows-leave-active {
  transition:
    grid-template-rows .55s cubic-bezier(.45, 0, .2, 1) var(--leave-delay, 0ms),
    opacity .3s ease var(--leave-delay, 0ms);
}
.rows-enter-from,
.rows-leave-to { grid-template-rows: 0fr; opacity: 0; }

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 76px;
  border-top: 1px solid var(--c-chip);
}
.row__text { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.row__label { font-size: 15px; font-weight: 600; }
.row__value { font-size: 13px; color: var(--c-muted); }
.row__dots { display: flex; gap: 14px; flex-shrink: 0; padding-right: 5px; }

.dot {
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: var(--r-pill);
  padding: 0;
}
.dot { transition: box-shadow .2s; }
.dot[aria-pressed='true'] { box-shadow: var(--ring-on); }

@media (max-width: 899.98px) {
  .same { margin-bottom: 0; }
  .row { gap: 10px; min-height: 72px; }
  .row__dots { gap: 12px; }
  .dot { width: 40px; height: 40px; }
}
</style>
