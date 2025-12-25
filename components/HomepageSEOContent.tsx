"use client"

import { FAQSection } from "@/components/FAQSection"

// FAQ data for both display and JSON-LD schema
// Consolidated SEO content - approximately 500 words total
export const homepageFAQs = [
    {
        question: "Is this schedule builder really free?",
        answer: "Yes! TrySchedule is 100% free to use. Create, customize, and export your schedule as PNG or JPG without creating an account. Pro features like PDF export, AI scheduling, and cloud sync are available for users who need advanced capabilities."
    },
    {
        question: "How do I create a weekly schedule?",
        answer: "It's simple: (1) Click and drag on the calendar to create time blocks; (2) Choose from 12 colors to categorize your activities; (3) Export as PNG, JPG, or PDF to print or share. The whole process takes less than 5 minutes."
    },
    {
        question: "Who is TrySchedule designed for?",
        answer: "TrySchedule works great for students planning class schedules, managers creating employee shift rotations, fitness enthusiasts building workout plans, and freelancers managing client projects. Anyone who wants to organize their time visually will love it."
    },
    {
        question: "Do I need to create an account?",
        answer: "No account required! Start building your schedule immediately. Your work is automatically saved in your browser's local storage, so it persists between sessions. Sign up only if you want cloud sync across devices."
    },
    {
        question: "Is my schedule data private?",
        answer: "Absolutely. All schedule data is stored locally in your browser - we never upload your information to our servers. Your privacy is guaranteed unless you explicitly choose cloud sync with a Pro account."
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
