export const spring = {
  type: "spring",
  stiffness: 180,
  damping: 22,
  mass: 0.9,
} as const

export const softSpring = {
  type: "spring",
  stiffness: 120,
  damping: 18,
  mass: 0.8,
} as const

export const pageTransition = {
  initial: {
    opacity: 0,
    y: 24,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: -24,
    scale: 0.98,
  },
} as const

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
} as const

export const staggerItem = {
  initial: {
    opacity: 0,
    y: 16,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
} as const
