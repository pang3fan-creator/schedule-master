"use client"

import { useState, useEffect } from "react"

/**
 * Custom hook to detect if a media query matches
 * @param query - CSS media query string (e.g., "(max-width: 768px)")
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with actual value if on client, false otherwise
  const [matches, setMatches] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches
    }
    return false
  })

  // Track if we've hydrated to avoid double-renders
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Mark as hydrated
    setIsHydrated(true)

    // Check if window is available (client-side)
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia(query)

    // Set initial value (only if different to avoid unnecessary render)
    if (mediaQuery.matches !== matches) {
      setMatches(mediaQuery.matches)
    }

    // Create event listener
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add listener
    mediaQuery.addEventListener("change", handler)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handler)
    }
  }, [query, matches])

  // Return false during SSR to ensure consistent hydration
  if (!isHydrated) return false

  return matches
}

/**
 * Predefined breakpoint hooks for common use cases
 */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)")
}

export function useIsTablet(): boolean {
  return useMediaQuery("(min-width: 768px) and (max-width: 1023px)")
}

export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)")
}
