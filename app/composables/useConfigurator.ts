import {
  bathFinishes,
  bathroomNames,
  extraGroups,
  extras,
  formatAED,
  formatDelta,
  kitchenFinishes,
  model,
  roomPanoNames,
  sizes,
  type ExtraGroup,
  type Finish,
  type RoomId,
  type SizeCode
} from '~/data/saqr'

export type View = 'pano' | 'plan'
export type Lang = 'EN' | 'ES' | 'AR'
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
  lang: Lang
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
  lang: 'EN',
  unit: 'm2'
})

export function useConfigurator() {
  const state = useState<ConfiguratorState>('configurator', initialState)

  const bathCount = model.bathrooms
  const bathFocus = computed(() => Math.min(state.value.bathFocus, bathCount - 1))

  const formatArea = (m2: number | null) => {
    if (m2 === null) return state.value.unit === 'm2' ? '[area] m²' : '[area] ft²'
    if (state.value.unit === 'ft2') return `${Math.round(m2 * M2_TO_FT2).toLocaleString('en-US')} ft²`
    return `${m2.toFixed(2)} m²`
  }

  const currentSize = computed(() => sizes.find(s => s.code === state.value.size) ?? sizes[1]!)
  const kitchenFinish = computed(() => kitchenFinishes[state.value.kitchen]!)

  const bathRows = computed(() => {
    if (state.value.sameFinish) {
      return [{ key: 'all', label: 'All bathrooms', index: null as number | null, pick: state.value.bathAll }]
    }
    return Array.from({ length: bathCount }, (_, i) => ({
      key: `bath${i}`,
      label: bathroomNames[i]!,
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
      ? `${bathFinishes[state.value.bathAll]!.name} in all ${bathCount}`
      : `${bathCount} bathrooms, finished separately`
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
    const names = chosenExtras.value.map(e => e.name)
    if (!names.length) return 'None selected'
    if (names.length <= 2) return names.join(', ')
    return `${names.slice(0, 2).join(', ')} +${names.length - 2} more`
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
    if (room === 'baths' && !state.value.sameFinish) return `${bathroomNames[bathFocus.value]} bathroom`
    return room ? roomPanoNames[room] : roomPanoNames.layout
  })

  /**
   * Rows of the "Your Saqr" review. Rows that change the price carry it:
   * Size → difference vs. M ("Included" for M), Extras → one line per chosen extra with its price.
   */
  const summaryRows = computed(() => {
    const rows: SummaryRow[] = [
      {
        key: 'size',
        label: 'Size',
        value: currentSize.value.code,
        specs: { beds: currentSize.value.beds, baths: currentSize.value.baths, area: formatArea(currentSize.value.area) },
        price: formatDelta(currentSize.value.priceDelta),
        room: 'layout'
      },
      { key: 'kitchen', label: 'Kitchen', value: kitchenFinish.value.name, room: 'kitchen' }
    ]
    if (state.value.sameFinish) {
      rows.push({ key: 'bathAll', label: 'All bathrooms', value: bathFinishes[state.value.bathAll]!.name, room: 'baths' })
    } else {
      for (let i = 0; i < bathCount; i++) {
        rows.push({ key: `bath${i}`, label: `${bathroomNames[i]} bath`, value: bathFinishes[state.value.baths[i] ?? 0]!.name, room: 'baths' })
      }
    }
    rows.push({
      key: 'extras',
      label: 'Extras',
      value: chosenExtras.value.length ? '' : 'None',
      items: chosenExtras.value.map(e => ({ key: e.id, name: e.name, price: formatDelta(e.amount) })),
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
    if (state.value.extras[id]) delete state.value.extras[id]
    else state.value.extras[id] = true
  }
  const setExtraTab = (tab: ExtraGroup) => { state.value.extraTab = tab }
  const setView = (view: View) => { state.value.view = view }
  const setLang = (lang: Lang) => { state.value.lang = lang }
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
    formatAED,
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
