/// <reference types="vite/client" />

declare global {
  interface Window {
    /** Forwarded reservation endpoint for the preview host (falls back to VITE_RESERVATION_ENDPOINT). */
    __AURUM_RESERVATION_ENDPOINT?: string
  }
}

export {}
