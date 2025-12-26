"use client"

import { FAQSection } from "@/components/FAQSection"

// FAQ data for both display and JSON-LD schema
// SEO-optimized content - approximately 500 words total
export const homepageFAQs = [
    {
        question: "Why is TrySchedule the best free online schedule builder?",
        answer: "TrySchedule stands out for three key reasons:\n\n• Zero Friction – no login or signup required, just start creating immediately.\n• Instant Export – download your schedule as high-quality PNG or PDF with one click.\n• Privacy First – all data stays in your browser's local storage, never uploaded to external servers.\n\nThese features make TrySchedule the fastest way to build a professional weekly schedule online."
    },
    {
        question: "How do I create a weekly schedule in 3 easy steps?",
        answer: "Step 1: Drag and drop on the calendar grid to create time blocks for your activities.\n\nStep 2: Customize each block with 12 vibrant colors to categorize work, study, fitness, or personal time.\n\nStep 3: Click 'Export' to download your finished schedule as PNG, JPG, or PDF – ready to print or share.\n\nThe entire process takes less than 5 minutes, no design skills needed."
    },
    {
        question: "Who needs a schedule maker like TrySchedule?",
        answer: "TrySchedule is designed for everyone who values their time:\n\n• Students – organizing class timetables and study sessions\n• Shift Managers – creating employee work rotations\n• Gym Goers – planning weekly workout routines\n• Freelancers – balancing multiple client projects and deadlines\n\nWhether you need a simple daily planner or a complex weekly schedule, our visual builder adapts to your needs."
    },
    {
        question: "Is this schedule builder completely free to use?",
        answer: "Yes, TrySchedule is 100% free for core features!\n\nCreate unlimited schedules, use all 12 colors, export as PNG or JPG, and save your work locally – all without paying a cent or creating an account.\n\nPro features like PDF export, AI-powered scheduling suggestions, and cross-device cloud sync are available for power users who want advanced capabilities."
    },
    {
        question: "Can I print my schedule after creating it?",
        answer: "Absolutely! TrySchedule is designed to be printable-friendly.\n\nExport your schedule as a high-resolution PNG or PDF, then print it directly on standard paper sizes. The clean, minimalist design ensures your printed schedule looks professional and is easy to read.\n\nPerfect for posting on your wall, refrigerator, or office bulletin board."
    },
    {
        question: "Is my schedule data private and secure?",
        answer: "Your privacy is our priority.\n\nAll schedule data is stored locally in your browser using secure local storage technology – we never upload your personal information to our servers.\n\nYour schedules remain completely private unless you explicitly choose to enable cloud sync with a Pro account. You have full control over your data at all times."
    }
]

export function HomepageSEOContent() {
    return (
        <div className="bg-white border-t border-gray-200">
            {/* FAQ Section - consolidated SEO content */}
            <FAQSection
                subtitle="Everything you need to know about our free schedule builder."
                items={homepageFAQs}
            />
        </div>
    )
}
