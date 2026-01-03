"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { HardHat, Hammer, CheckCircle2, Circle, AlertCircle, TrendingUp, X, MapPin } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils" // Added cn import

export interface ProjectDashboardProps {
    variant?: 'default' | 'compact'
}

export function ProjectDashboard({ variant = 'default' }: ProjectDashboardProps) {
    const [isOpen, setIsOpen] = useState(false)
    // Local state for milestones 
    const [milestones, setMilestones] = useState([
        { name: "Site Prep & Excavation", status: "completed", date: "Week 1" },
        { name: "Foundation Pouring", status: "in-progress", date: "Week 2" },
        { name: "Framing & Roofing", status: "pending", date: "Week 3-4" },
        { name: "HVAC & Electrical", status: "pending", date: "Week 5" },
        { name: "Interior Finishing", status: "pending", date: "Week 6" },
    ])

    const [weatherCheck, setWeatherCheck] = useState<{ type: 'alert' | 'success', message: string } | null>(null)
    const [coords, setCoords] = useState<{ lat: number, long: number } | null>(null) // Start with null to prompt user

    const fetchWeather = (lat: number, long: number) => {
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=weather_code&timezone=auto&forecast_days=3`)
            .then(res => res.json())
            .then(data => {
                const codes = data.daily?.weather_code || []
                const badWeatherDayIndex = codes.findIndex((c: number) => c >= 51)

                if (badWeatherDayIndex === 0) {
                    setWeatherCheck({ type: 'alert', message: "Site Alert: Rain/Snow expected TODAY. Cover sensitive materials." })
                } else if (badWeatherDayIndex > 0) {
                    setWeatherCheck({ type: 'alert', message: `Forecast: Bad weather expected in ${badWeatherDayIndex} days. Plan indoor tasks.` })
                } else {
                    setWeatherCheck({ type: 'success', message: "Forecast Clear: Optimal conditions for outdoor site work." })
                }
            })
            .catch(() => setWeatherCheck({ type: 'success', message: "Weather Data Unavailable." }))
    }

    // Default to New York only if no user location, but let's wait for user input or default
    useEffect(() => {
        if (coords) {
            fetchWeather(coords.lat, coords.long)
        } else {
            // Default demo location (New York) so it's not empty, but allow override
            fetchWeather(40.71, -74.01)
        }
    }, [coords])

    const handleLocate = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoords({
                        lat: position.coords.latitude,
                        long: position.coords.longitude
                    })
                },
                (error) => {
                    console.error("Location access denied", error)
                    alert("Please enable location access to get local site weather.")
                }
            )
        }
    }

    // Dynamic progress calculation
    const completedCount = milestones.filter(m => m.status === "completed").length
    const inProgressCount = milestones.filter(m => m.status === "in-progress").length
    const total = milestones.length
    // Weight: Completed = 1, In-Progress = 0.5
    const progress = Math.round(((completedCount + (inProgressCount * 0.5)) / total) * 100)

    const toggleStatus = (index: number) => {
        setMilestones(prev => prev.map((m, i) => {
            if (i !== index) return m
            // Cycle: pending -> in-progress -> completed -> pending
            if (m.status === 'pending') return { ...m, status: 'in-progress' }
            if (m.status === 'in-progress') return { ...m, status: 'completed' }
            return { ...m, status: 'pending' }
        }))
    }

    if (variant === 'compact') {
        return (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        size="icon"
                        className={`size-12 rounded-full shadow-lg border-0 transition-all bg-orange-500 hover:bg-orange-600 text-white ${isOpen ? 'ring-2 ring-orange-300 ring-offset-2' : ''}`}
                        title="Project Dashboard"
                    >
                        {isOpen ? (
                            <X className="size-6" />
                        ) : (
                            <HardHat className="size-6" />
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-72 p-0 overflow-hidden">
                    <DashboardContent progress={progress} milestones={milestones} onToggle={toggleStatus} weather={weatherCheck} onLocate={handleLocate} hasCustomLocation={!!coords} />
                </PopoverContent>
            </Popover>
        )
    }

    // Default variant for Sidebar
    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    className={`justify-start gap-3 w-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 ${isOpen ? 'bg-gray-100' : ''}`}
                >
                    <HardHat className="size-5 text-orange-600" />
                    Project Dashboard
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" side="right" className="w-[320px] p-0 overflow-hidden ml-2 shadow-xl border-orange-100">
                <DashboardContent progress={progress} milestones={milestones} onToggle={toggleStatus} weather={weatherCheck} onLocate={handleLocate} hasCustomLocation={!!coords} />
            </PopoverContent>
        </Popover>
    )
}

function DashboardContent({
    progress,
    milestones,
    onToggle,
    weather,
    onLocate,
    hasCustomLocation
}: {
    progress: number
    milestones: { name: string, status: string, date: string }[]
    onToggle: (index: number) => void
    weather: { type: 'alert' | 'success', message: string } | null
    onLocate: () => void
    hasCustomLocation: boolean
}) {
    return (
        <div className="bg-white">
            {/* Header */}
            <div className="bg-zinc-900 p-5 text-white">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-orange-500/20 rounded-md">
                            <Hammer className="size-4 text-orange-500" />
                        </div>
                        <div>
                            <span className="block font-bold text-sm leading-tight text-white">Project A-72</span>
                            <span className="text-[10px] text-zinc-400 font-medium">CONSTRUCTION PHASE</span>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold tracking-wider bg-zinc-800 px-2 py-1 rounded text-zinc-300 uppercase">
                        On Track
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                        <span className="text-xs font-medium text-zinc-400">Completion</span>
                        <span className="text-sm font-bold text-orange-400">{progress}%</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(251,146,60,0.3)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Milestones List */}
            <div className="p-4 bg-gray-50/50">
                <h4 className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                    <span>Key Milestones</span>
                    <span className="text-[9px] font-normal text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Click to update</span>
                </h4>
                <div className="space-y-2">
                    {milestones.map((milestone, idx) => (
                        <button
                            key={idx}
                            onClick={() => onToggle(idx)}
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white hover:shadow-sm hover:border-orange-100 border border-transparent transition-all group text-left"
                        >
                            <div className="mt-0.5 shrink-0 transition-transform group-hover:scale-110">
                                {milestone.status === 'completed' && (
                                    <CheckCircle2 className="size-5 text-green-500" />
                                )}
                                {milestone.status === 'in-progress' && (
                                    <TrendingUp className="size-5 text-blue-500" />
                                )}
                                {milestone.status === 'pending' && (
                                    <Circle className="size-5 text-gray-300 group-hover:text-gray-400" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className={cn(
                                    "text-sm font-medium transition-colors truncate",
                                    milestone.status === 'completed' ? "text-gray-400 line-through" : "text-gray-900"
                                )}>
                                    {milestone.name}
                                </div>
                                <div className="text-[11px] text-gray-500">
                                    {milestone.date}
                                </div>
                            </div>
                            {milestone.status === 'in-progress' && (
                                <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-tight">
                                    Active
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-start justify-between gap-2.5 px-1 opacity-90">
                    <div className="flex gap-2.5">
                        {weather?.type === 'alert' ? (
                            <>
                                <AlertCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-800/80 leading-snug">
                                    <span className="font-semibold text-amber-900">Weather Alert:</span> {weather.message}
                                </p>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-emerald-800/80 leading-snug">
                                    <span className="font-semibold text-emerald-900">Site Status:</span> {weather?.message || "Checking forecast..."}
                                </p>
                            </>
                        )}
                    </div>
                    <button
                        onClick={onLocate}
                        className={`shrink-0 p-1 rounded hover:bg-gray-200 transition-colors ${hasCustomLocation ? 'text-blue-500' : 'text-gray-400'}`}
                        title="Update Site Location"
                    >
                        <MapPin className="size-3.5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
