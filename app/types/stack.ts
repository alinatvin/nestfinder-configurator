/** One bubble in <AvatarStack>. `key` must be stable: it is how added / removed / moved items are told apart. */
export interface StackItem {
  key: string
  /** Fallback colour behind the image. */
  color?: string
  image?: string
  /** `plus`: empty-state "+" bubble; `none`: "no finish" bubble (grey, struck through). */
  kind?: 'plus' | 'none'
}
