import Link from "next/link"
import { Database } from "lucide-react"

export function Footer() {
    return (
        <footer className="relative border-t border-gray-100 bg-gradient-to-b from-white to-gray-50/50 py-10">
            {/* Subtle gradient line at top */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                    <Database className="size-4 text-blue-600" />
                    <span className="font-semibold text-gray-900">Schedule Builder</span>
                    <span>© 2025 ScheduleApp, Inc. All rights reserved.</span>
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
