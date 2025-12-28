/**
 * Event Card Display Utilities
 * 
 * Height-based adaptive display modes for event cards.
 * Based on rowHeight = 80px (1 hour)
 */

export type DisplayMode = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

/**
 * Get display mode based on event card height in pixels
 */
export function getDisplayMode(heightPx: number): DisplayMode {
    if (heightPx < 30) return 'xs'
    if (heightPx < 50) return 'sm'
    if (heightPx < 80) return 'md'
    if (heightPx < 160) return 'lg'
    if (heightPx < 400) return 'xl'
    return 'xxl'
}

/**
 * Get container classes based on display mode
 */
export function getContainerClasses(mode: DisplayMode): string {
    switch (mode) {
        case 'xs':
            return 'p-0.5 gap-0'
        case 'sm':
            return 'p-1 gap-0.5'
        case 'md':
            return 'p-1.5 gap-0.5'
        case 'lg':
            return 'p-2 gap-2'
        case 'xl':
            return 'p-4 gap-3'
        case 'xxl':
            return 'p-6 gap-4'  // Extra large padding and gap for very tall cards
    }
}

/**
 * Get title classes based on display mode
 */
export function getTitleClasses(mode: DisplayMode, colorTextClass: string): string {
    const baseClasses = `${colorTextClass} truncate`
    switch (mode) {
        case 'xs':
            return `text-[10px] font-medium leading-tight ${baseClasses}`
        case 'sm':
            return `text-xs font-semibold leading-tight ${baseClasses}`
        case 'md':
            return `text-xs md:text-sm font-semibold ${baseClasses}`
        case 'lg':
            return `text-sm font-semibold ${baseClasses}`
        case 'xl':
            return `text-sm md:text-base font-semibold ${baseClasses}`
        case 'xxl':
            return `text-base md:text-lg font-bold ${baseClasses}`  // Larger title for XXL
    }
}

/**
 * Check if time should be displayed
 */
export function shouldShowTime(mode: DisplayMode): boolean {
    return mode !== 'xs'
}

/**
 * Get time classes based on display mode
 * Time font should always be smaller than title
 */
export function getTimeClasses(mode: DisplayMode, colorTextSecondaryClass: string): string {
    const baseClasses = `${colorTextSecondaryClass} truncate`
    switch (mode) {
        case 'sm':
            return `text-[8px] leading-tight ${baseClasses}`  // Smaller than title
        case 'md':
            return `text-[8px] md:text-[10px] ${baseClasses}`  // Smaller than title
        case 'lg':
            return `text-[10px] ${baseClasses}`  // Smaller than title (text-sm)
        case 'xl':
            return `text-[10px] md:text-xs ${baseClasses}`  // Smaller than title (text-base)
        case 'xxl':
            return `text-xs ${baseClasses}`  // Smaller than title (text-lg)
        default:
            return `text-[10px] ${baseClasses}`
    }
}

/**
 * Check if description should be displayed
 */
export function shouldShowDescription(mode: DisplayMode, isMobile: boolean): boolean {
    // XS and SM: never show description
    // MD, LG, XL, XXL: always show (on both mobile and desktop)
    if (mode === 'xs' || mode === 'sm') return false
    return true
}

/**
 * Get description classes based on display mode
 * Uses flex-1 + overflow-hidden to dynamically fill available space
 */
export function getDescriptionClasses(mode: DisplayMode, colorTextSecondaryClass: string): string {
    const baseClasses = `${colorTextSecondaryClass} overflow-hidden text-ellipsis`
    switch (mode) {
        case 'md':
            return `text-[10px] md:text-xs ${baseClasses} line-clamp-1`  // Compact: 1 line
        case 'lg':
        case 'xl':
        case 'xxl':
            return `text-xs flex-1 min-h-0 ${baseClasses}`  // Dynamic: fills available space
        default:
            return `text-xs ${baseClasses}`
    }
}

// ============== Mobile Weekly View Specific Functions ==============
// These functions provide special styling for mobile weekly view only:
// - Unified XS font sizes for all breakpoints
// - Text wrapping instead of truncation
// - Priority: Title > Time > Description

/**
 * Get container classes for mobile weekly view
 * Uses smaller padding and tighter gaps
 */
export function getMobileWeeklyContainerClasses(mode: DisplayMode): string {
    switch (mode) {
        case 'xs':
            return 'p-0.5 gap-0'
        case 'sm':
        case 'md':
            return 'p-0.5 gap-0.5'
        case 'lg':
        case 'xl':
        case 'xxl':
            return 'p-1 gap-0.5'
    }
}

/**
 * Get title classes for mobile weekly view
 * All modes use XS-level font size with text wrapping
 */
export function getMobileWeeklyTitleClasses(mode: DisplayMode, colorTextClass: string): string {
    // All modes use same small font, with word wrap enabled
    const baseClasses = `${colorTextClass} break-words hyphens-auto leading-tight`
    if (mode === 'xs') {
        return `text-[10px] font-medium ${baseClasses}`
    }
    return `text-[10px] font-semibold ${baseClasses}`
}

/**
 * Get time classes for mobile weekly view
 * All modes use small font size (smaller than title)
 */
export function getMobileWeeklyTimeClasses(mode: DisplayMode, colorTextSecondaryClass: string): string {
    // Use 8px font, smaller than title's 10px
    return `text-[8px] leading-tight break-words ${colorTextSecondaryClass}`
}

/**
 * Check if description should be displayed in mobile weekly view
 * Only show if there's enough space (MD and above)
 */
export function shouldShowMobileWeeklyDescription(mode: DisplayMode): boolean {
    // Only show description for MD and above in mobile weekly view
    if (mode === 'xs' || mode === 'sm') return false
    return true
}

/**
 * Get description classes for mobile weekly view
 * Uses XS-level font size with text wrapping, fills remaining space
 */
export function getMobileWeeklyDescriptionClasses(mode: DisplayMode, colorTextSecondaryClass: string): string {
    // Uses flex-1 to fill remaining space, with word wrap
    return `text-[10px] leading-tight break-words flex-1 min-h-0 overflow-hidden ${colorTextSecondaryClass}`
}
