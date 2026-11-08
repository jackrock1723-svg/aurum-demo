import { useMediaQuery } from '@/hooks/useMediaQuery'

/**
 * True when the guest has asked the operating system for reduced motion.
 * Every animation in the experience is gated on this value.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
