import Link from "next/link"
import { Database } from "lucide-react"

export function Footer() {
    return (
        <footer className="border-t border-gray-100 bg-white py-8">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                    <Database className="size-4 text-blue-600" />
                    <span className="font-semibold text-gray-900">Schedule Builder</span>
                    <span>© 2025 ScheduleApp, Inc. All rights reserved.</span>
                </div>
                <div className="flex gap-6">
                    <Link href="/pricing" className="hover:text-gray-900">Pricing</Link>
                    <Link href="/terms" className="hover:text-gray-900">Terms</Link>
                    <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
                    <Link href="/contact" className="hover:text-gray-900">Contact</Link>
                </div>
            </div>
        </footer>
    )
}
