"use client"

import * as React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

// Settings types
export interface CalendarSettings {
  weekStartsOnSunday: boolean  // true = Sunday, false = Monday (PRD: default Sunday)
  use12HourFormat: boolean     // true = 12h AM/PM, false = 24h (PRD: default 12h)
  timeIncrement: 5 | 15 | 30 | 60  // minutes
  workingHoursStart: number    // 0-23 (default: 8)
  workingHoursEnd: number      // 0-23 (default: 17)
}

const DEFAULT_SETTINGS: CalendarSettings = {
  weekStartsOnSunday: true,    // PRD requirement: US default is Sunday
  use12HourFormat: true,       // PRD requirement: US default is 12h AM/PM
  timeIncrement: 5,
  workingHoursStart: 8,        // 8 AM
  workingHoursEnd: 17,         // 5 PM
}

const SETTINGS_STORAGE_KEY = "schedule-builder-settings"

interface SettingsContextType {
  settings: CalendarSettings
  updateSettings: (newSettings: Partial<CalendarSettings>) => void
  resetSettings: () => void
  reloadSettings: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

// Load settings from localStorage
function loadSettingsFromStorage(): CalendarSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS

  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...DEFAULT_SETTINGS, ...parsed }
    }
  } catch (error) {
    console.error("Error loading settings from localStorage:", error)
  }
  return DEFAULT_SETTINGS
}

// Save settings to localStorage
function saveSettingsToStorage(settings: CalendarSettings): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error("Error saving settings to localStorage:", error)
  }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<CalendarSettings>(DEFAULT_SETTINGS)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedSettings = loadSettingsFromStorage()
    setSettings(storedSettings)
    setIsLoaded(true)
  }, [])

  // Listen for storage events (when another tab/context writes to localStorage)
  // Also used to reload settings after template is applied
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SETTINGS_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          setSettings({ ...DEFAULT_SETTINGS, ...parsed })
        } catch (error) {
          console.error("Error parsing settings from storage event:", error)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveSettingsToStorage(settings)
    }
  }, [settings, isLoaded])

  const updateSettings = useCallback((newSettings: Partial<CalendarSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
  }, [])

  // Reload settings from localStorage (useful after template is applied)
  const reloadSettings = useCallback(() => {
    const storedSettings = loadSettingsFromStorage()
    setSettings(storedSettings)
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings, reloadSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
