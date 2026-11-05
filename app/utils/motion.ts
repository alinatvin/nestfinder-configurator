// Shared motion tokens for motion-v. Import explicitly: import { motionBase } from "~/utils/motion"

/** Soft "ease-out-quint" used for most UI movement. */
export const easeOut = [0.22, 1, 0.36, 1] as const

export const motionFast = { duration: 0.18, ease: easeOut }
export const motionBase = { duration: 0.28, ease: easeOut }
export const motionSheet = { duration: 0.36, ease: easeOut }

/**
 * Height changes (card expand/collapse, bathroom rows) and the list scroll that goes with them.
 * Standard ease-in-out: gentle start AND end. Ease-out curves cover most of the distance in the
 * first frame, which reads as a jolt when a large block of content collapses.
 */
export const easeInOut = [0.4, 0, 0.2, 1] as const
export const motionHeight = { duration: 0.32, ease: easeInOut }

/** Spring for the sliding selection pill in segmented controls. */
export const springPill = { type: 'spring', stiffness: 520, damping: 40, mass: 0.8 } as const

/** Press feedback for tappable tiles. */
export const press = { scale: 0.97 }
