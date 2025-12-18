import Link from "next/link"
import Image from "next/image"

export function Footer() {
    return (
        <footer className="relative border-t border-gray-100 bg-gradient-to-b from-white to-gray-50/50 py-10">
            {/* Subtle gradient line at top */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                <div className="flex flex-col items-center md:items-start gap-1">
                    <div className="flex items-center gap-2">
                        <Image src="/logo.png" alt="TrySchedule - Free Online Schedule Builder" width={16} height={16} className="object-contain" />
                        <span className="text-gray-900"><span className="font-bold">Try</span><span className="font-normal">Schedule</span></span>
                        <span>© 2025 TrySchedule. All rights reserved.</span>
                    </div>
                    <p className="text-xs text-gray-400 italic"><strong className="font-medium text-gray-500">Try</strong>Schedule is the easiest <strong className="font-medium text-gray-500">free online schedule builder</strong> for students, managers, and teams.</p>
                </div>
                <div className="flex gap-6">
                    <Link href="/pricing" className="hover:text-violet-600 transition-colors">Pricing</Link>
                    <Link href="/terms" className="hover:text-violet-600 transition-colors">Terms</Link>
                    <Link href="/privacy" className="hover:text-violet-600 transition-colors">Privacy</Link>
                    <Link href="/contact" className="hover:text-violet-600 transition-colors">Contact</Link>
                </div>
            </div>
        </footer>
    )
}
