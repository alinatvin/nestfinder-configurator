// Model data for the Saqr configurator (taken from the Claude Design "Configurator redesign" · rooms v3).
// Values in [brackets] are placeholders that were not filled in the design yet.

export type RoomId = 'layout' | 'kitchen' | 'baths' | 'extras'
export type ExtraGroup = 'int' | 'ext'

export interface Finish {
  id: string
  name: string
  /** Fallback colour, shown while the texture loads or when there is no texture. */
  color: string
  texture?: string
  /** `none`: "no finish" option, drawn as a grey struck-through circle. */
  kind?: 'none'
}

export type SizeCode = 'S' | 'M' | 'L'

export interface SizeOption {
  code: SizeCode
  beds: number
  baths: number
  /** Area in m², `null` = not provided in the design yet. */
  area: number | null
  /** Price difference vs. size M, in AED (M is included in the base price). */
  priceDelta: number
}

export interface Extra {
  id: string
  group: ExtraGroup
  name: string
  sub: string
  /** Added to the total when selected, in AED. */
  amount: number
  photo: string
  desc: string
}

export const model = {
  name: 'Saqr',
  bathrooms: 4,
  /**
   * Base price, AED: size M, no extras. The design shows 1,199,880 AED with Underfloor Heating
   * (+64,850) selected, so the base is 1,199,880 − 64,850.
   */
  basePrice: 1_135_030,
  floorPlan: '/images/floor-plan-saqr-3bd.jpg'
}

export const bathroomNames = ['Main bedroom', 'Guest', 'Bedroom 2', 'Bedroom 3', 'Hallway']

export const sizes: SizeOption[] = [
  // TODO(pricing): S and L deltas are temporary placeholders — the design has no prices for them yet.
  { code: 'S', beds: 4, baths: 4, area: null, priceDelta: -100_000 },
  { code: 'M', beds: 3, baths: model.bathrooms, area: 409.49, priceDelta: 0 },
  { code: 'L', beds: 7, baths: 7, area: null, priceDelta: 150_000 }
]

// Kinfolk (APE Grupo), Kinstone 60×60 tile textures
export const bathFinishes: Finish[] = [
  { id: 'steam', name: 'Steam', color: '#C1C1B9', texture: '/images/textures/steam.jpg' },
  { id: 'mist', name: 'Mist', color: '#A4A39E', texture: '/images/textures/mist.jpg' },
  { id: 'chalk', name: 'Chalk', color: '#E0DDD1', texture: '/images/textures/chalk.jpg' },
  { id: 'dakar', name: 'Dakar', color: '#C1BBAB', texture: '/images/textures/dakar.jpg' }
]

// Kitchen finishes as on findnido.com/configurator
export const kitchenFinishes: Finish[] = [
  { id: 'grafito', name: 'Grafito', color: '#87827C', texture: '/images/textures/grafito.jpg' },
  { id: 'perla', name: 'Perla', color: '#EDECE8', texture: '/images/textures/perla.jpg' },
  { id: 'verde-oscuro', name: 'Verde Oscuro', color: '#203026', texture: '/images/textures/verde-oscuro.jpg' },
  { id: 'none', name: 'Without kitchen', color: '#F0F1EF', kind: 'none' }
]

export const extraGroups: { id: ExtraGroup; label: string; focusLabel: string }[] = [
  { id: 'int', label: 'Interior', focusLabel: 'Interior extra' },
  { id: 'ext', label: 'Exterior', focusLabel: 'Exterior extra' }
]

export const extras: Extra[] = [
  { id: 'int0', group: 'int', name: 'Home Automation', sub: 'Smart home control', amount: 48_700, photo: '/images/extras/automation.jpg', desc: 'Complete home automation: lighting, climate control and security.' },
  { id: 'int1', group: 'int', name: 'Underfloor Heating', sub: 'Floor-based heating system', amount: 64_850, photo: '/images/extras/heating.jpg', desc: 'Underfloor radiant heating throughout the home.' },
  { id: 'int2', group: 'int', name: 'Air Conditioning', sub: 'Ducted climate control', amount: 18_950, photo: '/images/extras/ac.jpg', desc: 'Centralized air conditioning with zone control.' },
  { id: 'int3', group: 'int', name: 'Dual-Flow Ventilation', sub: 'Air renewal system', amount: 17_300, photo: '/images/extras/ventilation.jpg', desc: 'Double-flow mechanical ventilation with heat recovery.' },
  { id: 'ext0', group: 'ext', name: 'Swimming Pool', sub: 'Full built-in pool', amount: 102_850, photo: '/images/extras/pool.jpg', desc: 'Private pool with integrated filtration system.' },
  { id: 'ext1', group: 'ext', name: 'Solar Panels', sub: 'Renewable energy', amount: 48_700, photo: '/images/extras/solar.jpg', desc: 'Rooftop photovoltaic solar panel installation.' },
  { id: 'ext2', group: 'ext', name: 'Garage / 2-Car Pergola', sub: 'Parking for two vehicles', amount: 64_950, photo: '/images/extras/garage.jpg', desc: 'Two-car parking structure.' }
]

export const roomPanoNames: Record<RoomId, string> = {
  layout: 'Living room',
  kitchen: 'Kitchen',
  baths: 'Bathroom',
  extras: 'Terrace'
}

// ── money formatting ─────────────────────────────────────────
const aed = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
/** 1199880 → "1,199,880 AED" */
export const formatAED = (n: number) => `${aed.format(Math.round(n))} AED`
/** +48700 → "+48,700 AED", −100000 → "−100,000 AED", 0 → `zeroLabel` */
export const formatDelta = (n: number, zeroLabel = 'Included') =>
  n === 0 ? zeroLabel : `${n > 0 ? '+' : '−'}${aed.format(Math.abs(Math.round(n)))} AED`
