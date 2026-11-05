import {
  bathFinishes,
  extraGroups,
  extras,
  requiredPairs,
  kitchenFinishes,
  model,
  sizes,
  type ExtraGroup,
  type Finish,
  type RoomId,
  type SizeCode,
  type Extra
} from '~/data/saqr'
import { isolate } from '~/composables/useI18n'

export type View = 'pano' | 'plan'
export type Unit = 'm2' | 'ft2'

export interface SummaryRow {
  key: string
  label: string
  value: string
  room: RoomId
  /** Size row: the icon block (beds · baths · area). */
  specs?: { beds: number; baths: number; area: string }
  /** Price effect of this row, when it has one. */
  price?: string
  /** Extras row: one line per chosen extra. */
  items?: { key: string; name: string; price: string }[]
}

export interface ConfiguratorState {
  room: RoomId | null
  view: View
  sameFinish: boolean
  bathFocus: number
  extraTab: ExtraGroup
  size: SizeCode
  summaryOpen: boolean
  kitchen: number
  bathAll: number
  baths: number[]
  extras: Record<string, boolean>
  unit: Unit
}

const M2_TO_FT2 = 10.7639

const initialState = (): ConfiguratorState => ({
  room: 'extras',
  view: 'pano',
  sameFinish: false,
  bathFocus: 0,
  extraTab: 'int',
  size: 'M',
  summaryOpen: false,
  kitchen: 0,
  bathAll: 0,
  baths: [0, 1, 2, 0, 0],
  extras: { int1: true },
  unit: 'm2'
})

export function useConfigurator() {
  const state = useState<ConfiguratorState>('configurator', initialState)
  const { t, tList, isRtl, setLang } = useI18n()

  // ── localized names & money ─────────────────────────────
  const modelName = computed(() => t('model.name'))
  const bathroomNames = computed(() => tList('baths.names'))
  const extraName = (x: Extra) => t(`extras.items.${x.id}.name`)
  const extraDesc = (x: Extra) => t(`extras.items.${x.id}.desc`)
  /** Brand finish names (Grafito, Steam…) stay as they are; only "Without kitchen" is translated. */
  const finishName = (f: Finish) => (f.kind === 'none' ? t('kitchen.none') : f.name)

  const num = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
  const formatNumber = (n: number) => num.format(Math.round(n))
  /** "1,199,880 AED" / RTL: number kept left-to-right, then «درهم». */
  const formatPrice = (n: number) =>
    isRtl.value ? `${isolate(formatNumber(n))} ${t('common.currency')}` : `${formatNumber(n)} ${t('common.currency')}`
  /** "+48,700 AED", "−100,000 AED", 0 → "Included". */
  const formatDelta = (n: number) => {
    if (n === 0) return t('common.included')
    const s = `${n > 0 ? '+' : '−'}${formatNumber(Math.abs(n))}`
    return isRtl.value ? `${isolate(s)} ${t('common.currency')}` : `${s} ${t('common.currency')}`
  }

  const bathCount = model.bathrooms
  const bathFocus = computed(() => Math.min(state.value.bathFocus, bathCount - 1))

  const formatArea = (m2: number | null) => {
    let s: string
    if (m2 === null) s = state.value.unit === 'm2' ? '[area] m²' : '[area] ft²'
    else if (state.value.unit === 'ft2') s = `${Math.round(m2 * M2_TO_FT2).toLocaleString('en-US')} ft²`
    else s = `${m2.toFixed(2)} m²`
    return isRtl.value ? isolate(s) : s
  }

  const currentSize = computed(() => sizes.find(s => s.code === state.value.size) ?? sizes[1]!)
  const kitchenFinish = computed(() => kitchenFinishes[state.value.kitchen]!)

  const bathRows = computed(() => {
    if (state.value.sameFinish) {
      return [{ key: 'all', label: t('baths.all'), index: null as number | null, pick: state.value.bathAll }]
    }
    return Array.from({ length: bathCount }, (_, i) => ({
      key: `bath${i}`,
      label: bathroomNames.value[i]!,
      index: i as number | null,
      pick: state.value.baths[i] ?? 0
    }))
  })

  /** Up to three finishes shown as overlapping dots on the Bathrooms card. */
  const bathThumbs = computed<Finish[]>(() =>
    state.value.sameFinish
      ? [bathFinishes[state.value.bathAll]!]
      : state.value.baths.slice(0, Math.min(bathCount, 3)).map(i => bathFinishes[i]!)
  )

  const bathsSummary = computed(() =>
    state.value.sameFinish
      ? t('baths.inAll', { finish: bathFinishes[state.value.bathAll]!.name, n: bathCount })
      : t('baths.separately', { n: bathCount })
  )

  // In the order they were picked (object key order = insertion order; see toggleExtra),
  // so a newly added extra joins the end of the stack instead of pushing the others aside.
  const chosenExtras = computed(() =>
    Object.keys(state.value.extras)
      .filter(id => state.value.extras[id])
      .map(id => extras.find(e => e.id === id))
      .filter((e): e is (typeof extras)[number] => !!e)
  )
  const extrasSummary = computed(() => {
    const names = chosenExtras.value.map(extraName)
    const sep = isRtl.value ? '، ' : ', '
    if (!names.length) return t('common.noneSelected')
    if (names.length <= 2) return names.join(sep)
    return `${names.slice(0, 2).join(sep)} ${t('common.more', { n: names.length - 2 })}`
  })
  const visibleExtras = computed(() => extras.filter(e => e.group === state.value.extraTab))

  /** Estimated total, AED = base (size M, no extras) + size difference + chosen extras. */
  const totalPrice = computed(() =>
    model.basePrice
    + currentSize.value.priceDelta
    + chosenExtras.value.reduce((sum, x) => sum + x.amount, 0)
  )

  const roomName = computed(() => {
    const room = state.value.room
    if (room === 'baths' && !state.value.sameFinish) return t('rooms.bathOf', { name: bathroomNames.value[bathFocus.value]! })
    return t(`rooms.${room ?? 'layout'}`)
  })

  /**
   * Rows of the "Your Saqr" review. Rows that change the price carry it:
   * Size → difference vs. M ("Included" for M), Extras → one line per chosen extra with its price.
   */
  const summaryRows = computed(() => {
    const rows: SummaryRow[] = [
      {
        key: 'size',
        label: t('cards.layout'),
        value: currentSize.value.code,
        specs: { beds: currentSize.value.beds, baths: currentSize.value.baths, area: formatArea(currentSize.value.area) },
        price: formatDelta(currentSize.value.priceDelta),
        room: 'layout'
      },
      { key: 'kitchen', label: t('cards.kitchen'), value: finishName(kitchenFinish.value), room: 'kitchen' }
    ]
    if (state.value.sameFinish) {
      rows.push({ key: 'bathAll', label: t('baths.all'), value: bathFinishes[state.value.bathAll]!.name, room: 'baths' })
    } else {
      for (let i = 0; i < bathCount; i++) {
        rows.push({ key: `bath${i}`, label: t('baths.rowLabel', { name: bathroomNames.value[i]! }), value: bathFinishes[state.value.baths[i] ?? 0]!.name, room: 'baths' })
      }
    }
    rows.push({
      key: 'extras',
      label: t('cards.extras'),
      value: chosenExtras.value.length ? '' : t('common.none'),
      items: chosenExtras.value.map(e => ({ key: e.id, name: extraName(e), price: formatDelta(e.amount) })),
      room: 'extras'
    })
    return rows
  })

  // ── actions ──────────────────────────────────────────────
  const toggleRoom = (room: RoomId) => {
    state.value.room = state.value.room === room ? null : room
  }
  const openRoom = (room: RoomId) => {
    state.value.room = room
    state.value.summaryOpen = false
  }
  const setSize = (size: SizeCode) => { state.value.size = size }
  const setKitchen = (i: number) => { state.value.kitchen = i }
  const setBathFinish = (rowIndex: number | null, finish: number) => {
    if (rowIndex === null) {
      state.value.bathAll = finish
      return
    }
    state.value.baths[rowIndex] = finish
    state.value.bathFocus = rowIndex
  }
  const toggleSameFinish = () => { state.value.sameFinish = !state.value.sameFinish }
  const toggleExtra = (id: string) => {
    // delete (not `false`) so re-adding moves the extra to the end of the pick order
    if (!state.value.extras[id]) {
      state.value.extras[id] = true
      return
    }
    delete state.value.extras[id]
    // Paired extras (see requiredPairs): if the partner is off too, switch it on.
    for (const [a, b] of requiredPairs) {
      const partner = id === a ? b : id === b ? a : null
      if (partner && !state.value.extras[partner]) state.value.extras[partner] = true
    }
  }
  const setExtraTab = (tab: ExtraGroup) => { state.value.extraTab = tab }
  const setView = (view: View) => { state.value.view = view }
  const setUnit = (unit: Unit) => { state.value.unit = unit }
  const openSummary = () => { state.value.summaryOpen = true }
  const closeSummary = () => { state.value.summaryOpen = false }

  return {
    state,
    model,
    sizes,
    bathFinishes,
    kitchenFinishes,
    extraGroups,
    bathCount,
    currentSize,
    kitchenFinish,
    bathRows,
    bathThumbs,
    bathsSummary,
    chosenExtras,
    extrasSummary,
    visibleExtras,
    totalPrice,
    modelName,
    extraName,
    extraDesc,
    finishName,
    formatNumber,
    formatPrice,
    formatDelta,
    roomName,
    summaryRows,
    formatArea,
    toggleRoom,
    openRoom,
    setSize,
    setKitchen,
    setBathFinish,
    toggleSameFinish,
    toggleExtra,
    setExtraTab,
    setView,
    setLang,
    setUnit,
    openSummary,
    closeSummary
  }
}
