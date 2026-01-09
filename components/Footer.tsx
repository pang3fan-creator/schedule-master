import Link from "next/link"
import Image from "next/image"
import PHBadge from "@/components/PHBadge"


export function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white py-6 md:py-8">

            {/* Desktop Layout - horizontal (hidden on mobile) */}
            <div className="hidden md:flex container mx-auto px-4 flex-row justify-between items-center gap-4 text-sm text-gray-500">
                <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <Image src="/icon.svg" alt="TrySchedule - Free Online Schedule Builder" width={16} height={16} className="object-contain" />
                            <span className="text-blue-600"><span className="font-bold">Try</span><span className="font-normal">Schedule</span></span>
                        </Link>
                        <span>© 2025 TrySchedule. All rights reserved.</span>
                    </div>
                    <p className="text-xs text-gray-500 italic"><strong className="font-medium">Try</strong>Schedule is the easiest <strong className="font-medium">free online schedule builder</strong> for students, managers, and teams.</p>
                </div>
                <div className="flex gap-6 items-center">
                    <div className="flex items-center gap-4">
                        <PHBadge variant="inline" className="translate-y-0" />
                        <a href="https://www.nxgntools.com/tools/tryschedule?utm_source=tryschedule" target="_blank" rel="noopener" className="inline-block w-auto transition-transform hover:scale-105">
                            <img src="https://www.nxgntools.com/api/embed/tryschedule?type=LAUNCHING_SOON_ON" alt="NextGen Tools Badge - The #1 AI Tools Directory & Launch Platform" className="h-[38px] w-auto" />
                        </a>
                    </div>
                    <Link href="/pricing" className="hover:text-violet-600 transition-colors">Pricing</Link>
                    <Link href="/terms" className="hover:text-violet-600 transition-colors">Terms</Link>
                    <Link href="/privacy" className="hover:text-violet-600 transition-colors">Privacy</Link>
                    <Link href="/contact" className="hover:text-violet-600 transition-colors">Contact</Link>
                </div>
            </div>

            {/* Mobile Layout - stacked (hidden on desktop) */}
            <div className="md:hidden container mx-auto px-4 flex flex-col items-center gap-3 text-sm text-gray-500">
                {/* Row 1: Logo + Brand + Copyright */}
                <div className="flex items-center gap-2 flex-wrap justify-center">
                    <Link href="/" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                        <Image src="/icon.svg" alt="TrySchedule - Free Online Schedule Builder" width={16} height={16} className="object-contain" />
                        <span className="text-blue-600"><span className="font-bold">Try</span><span className="font-normal">Schedule</span></span>
                    </Link>
                    <span className="text-gray-400">© 2025 TrySchedule. All rights reserved.</span>
                </div>

                {/* Row 2: Navigation Links */}
                <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/pricing" className="hover:text-violet-600 transition-colors">Pricing</Link>
                    <Link href="/terms" className="hover:text-violet-600 transition-colors">Terms</Link>
                    <Link href="/privacy" className="hover:text-violet-600 transition-colors">Privacy</Link>
                    <Link href="/contact" className="hover:text-violet-600 transition-colors">Contact</Link>
                </div>

                {/* Row 3: Tagline */}
                <p className="text-xs text-gray-400 italic text-center">
                    <strong className="font-medium">Try</strong>Schedule is the easiest <strong className="font-medium">free online schedule builder</strong> for students, managers, and teams.
                </p>

                {/* Badges for Mobile */}
                <div className="mt-2 flex flex-col items-center gap-3">
                    <PHBadge variant="inline" />
                    <a href="https://www.nxgntools.com/tools/tryschedule?utm_source=tryschedule" target="_blank" rel="noopener" className="inline-block w-auto transition-transform hover:scale-105">
                        <img src="https://www.nxgntools.com/api/embed/tryschedule?type=LAUNCHING_SOON_ON" alt="NextGen Tools Badge - The #1 AI Tools Directory & Launch Platform" className="h-[42px] w-auto" />
                    </a>
                </div>
            </div>
        </footer>
    )
}

