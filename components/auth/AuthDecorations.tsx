/**
 * Decorative components for the AuthModal
 */

// Feature item for the left panel
export function FeatureItem({ icon, text }: { icon: string; text: string }) {
    return (
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2.5">
            <span className="text-lg">{icon}</span>
            <span className="text-sm text-white font-medium">{text}</span>
        </div>
    )
}

// Decorative floating circles and orbs
export function DecorativeCircles() {
    return (
        <>
            {/* Large gradient orb - top right */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

            {/* Medium orb - bottom left */}
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-violet-400/20 rounded-full blur-2xl" />

            {/* Small floating circles */}
            <div className="absolute top-20 right-8 w-3 h-3 bg-white/30 rounded-full animate-pulse" />
            <div className="absolute top-32 left-12 w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-24 right-16 w-2 h-2 bg-white/25 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Decorative ring */}
            <div className="absolute top-1/4 -left-8 w-24 h-24">
                <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
                    <circle
                        cx="50" cy="50" r="40"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeDasharray="20 10"
                    />
                </svg>
            </div>

            {/* Another decorative ring */}
            <div className="absolute bottom-1/3 -right-4 w-16 h-16">
                <svg viewBox="0 0 100 100" className="w-full h-full opacity-15">
                    <circle
                        cx="50" cy="50" r="40"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                    />
                </svg>
            </div>
        </>
    )
}

// Calendar preview card in the left panel
export function CalendarPreviewCard() {
    return (
        <div className="bg-white rounded-xl shadow-2xl p-4 w-[220px] transform hover:scale-105 transition-transform duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">T</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">
                        <span className="text-blue-600">Try</span>Schedule
                    </span>
                </div>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
            </div>

            {/* Day headers */}
            <div className="flex gap-1 mb-2">
                {['M', 'T', 'W', 'T', 'F'].map((day, i) => (
                    <div key={i} className="flex-1 text-center text-[10px] font-medium text-gray-400">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="space-y-1.5">
                {/* Row 1 */}
                <div className="flex gap-1 h-3">
                    <div className="flex-1 bg-blue-400 rounded-sm" />
                    <div className="flex-1 bg-blue-400 rounded-sm" />
                    <div className="flex-1 bg-gray-100 rounded-sm" />
                    <div className="flex-1 bg-gray-100 rounded-sm" />
                    <div className="flex-1 bg-violet-400 rounded-sm" />
                </div>
                {/* Row 2 */}
                <div className="flex gap-1 h-3">
                    <div className="flex-1 bg-gray-100 rounded-sm" />
                    <div className="flex-1 bg-emerald-400 rounded-sm" />
                    <div className="flex-1 bg-emerald-400 rounded-sm" />
                    <div className="flex-1 bg-gray-100 rounded-sm" />
                    <div className="flex-1 bg-gray-100 rounded-sm" />
                </div>
                {/* Row 3 */}
                <div className="flex gap-1 h-3">
                    <div className="flex-1 bg-amber-400 rounded-sm" />
                    <div className="flex-1 bg-gray-100 rounded-sm" />
                    <div className="flex-1 bg-gray-100 rounded-sm" />
                    <div className="flex-1 bg-rose-400 rounded-sm" />
                    <div className="flex-1 bg-rose-400 rounded-sm" />
                </div>
                {/* Row 4 */}
                <div className="flex gap-1 h-3">
                    <div className="flex-1 bg-gray-100 rounded-sm" />
                    <div className="flex-1 bg-gray-100 rounded-sm" />
                    <div className="flex-1 bg-sky-400 rounded-sm" />
                    <div className="flex-1 bg-sky-400 rounded-sm" />
                    <div className="flex-1 bg-gray-100 rounded-sm" />
                </div>
            </div>

            {/* Footer indicator */}
            <div className="mt-3 flex items-center justify-center gap-1">
                <div className="w-1 h-1 rounded-full bg-blue-500" />
                <div className="w-1 h-1 rounded-full bg-gray-300" />
                <div className="w-1 h-1 rounded-full bg-gray-300" />
            </div>
        </div>
    )
}
