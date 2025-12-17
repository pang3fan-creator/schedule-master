"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { Briefcase, GraduationCap, Dumbbell, Palette, Sparkles, Calendar, Crown, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { getAllTemplates } from "@/lib/templates";
import { useSubscription } from "@/components/SubscriptionContext";
import { UpgradeModal } from "@/components/UpgradeModal";
import { CategoryFilter } from "@/components/category-filter";
import { FAQAccordion } from "@/components/faq-accordion";
import { PageHero } from "@/components/page-hero";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Icon mapping for templates
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Briefcase,
    GraduationCap,
    Dumbbell,
    Palette,
    Sparkles,
    Calendar,
};

const TEMPLATES_PER_PAGE = 6;

export default function TemplatesPage() {
    const router = useRouter();
    const allTemplates = getAllTemplates();
    const { isPro } = useSubscription();
    const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
    const [blankCanvasDialogOpen, setBlankCanvasDialogOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);

    // Get unique categories from templates
    const categories = ["All", ...Array.from(new Set(allTemplates.map(t => t.category)))];

    // Filter templates by category
    const filteredTemplates = activeCategory === "All"
        ? allTemplates
        : allTemplates.filter(t => t.category === activeCategory);

    // Pagination logic
    const totalPages = Math.ceil(filteredTemplates.length / TEMPLATES_PER_PAGE);
    const startIndex = (currentPage - 1) * TEMPLATES_PER_PAGE;
    const paginatedTemplates = filteredTemplates.slice(startIndex, startIndex + TEMPLATES_PER_PAGE);

    const handleCategoryChange = (category: string) => {
        setActiveCategory(category);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 200, behavior: 'smooth' });
        }
    };

    const handleTemplateClick = (e: React.MouseEvent, template: { slug: string; requiresPro?: boolean }) => {
        if (template.requiresPro && !isPro) {
            e.preventDefault();
            setUpgradeModalOpen(true);
        }
    };

    const handleBlankCanvasClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setBlankCanvasDialogOpen(true);
    };

    const handleBlankCanvasConfirm = () => {
        // Clear events from localStorage
        localStorage.removeItem("schedule-builder-events");
        // Reset settings to defaults
        localStorage.removeItem("schedule-builder-settings");
        // Close dialog and navigate
        setBlankCanvasDialogOpen(false);
        router.push("/");
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage, '...', totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50/50">
            <Navbar />

            <main className="flex-1 py-16">
                {/* Hero Section */}
                <PageHero
                    title="Schedule Templates"
                    description="Get started quickly with professionally designed templates. Choose one that fits your needs."
                />

                {/* Category Filter */}
                <div className="container mx-auto px-4 mb-12">
                    <CategoryFilter
                        categories={categories}
                        activeCategory={activeCategory}
                        onCategoryChange={handleCategoryChange}
                    />
                </div>

                {/* Templates Grid */}
                <div className="container mx-auto px-4 max-w-6xl">
                    {paginatedTemplates.length > 0 || activeCategory === "All" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Blank Schedule Builder - First Card (only show on first page of "All" category) */}
                            {activeCategory === "All" && currentPage === 1 && (
                                <Link
                                    href="/"
                                    onClick={handleBlankCanvasClick}
                                    className="group bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border-2 border-blue-200 p-6 hover:shadow-lg hover:border-blue-400 transition-all duration-200 relative h-full flex flex-col"
                                >
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="p-3 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors shrink-0 mt-1">
                                            <Calendar className="size-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">
                                                BLANK CANVAS
                                            </span>
                                            <h3 className="text-lg font-semibold text-gray-900 mt-1 group-hover:text-blue-700 transition-colors">
                                                Schedule Builder
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                Start fresh with a blank schedule. Create your own custom layout from scratch.
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            )}

                            {paginatedTemplates.map((template) => {
                                const Icon = template.icon ? iconMap[template.icon] : Briefcase;
                                return (
                                    <Link
                                        key={template.slug}
                                        href={`/templates/${template.slug}`}
                                        onClick={(e) => handleTemplateClick(e, template)}
                                        className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-200 relative h-full flex flex-col"
                                    >
                                        {/* Pro Badge */}
                                        {template.requiresPro && (
                                            <div className="absolute top-3 right-3">
                                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                                                    <Crown className="size-2.5" />
                                                    PRO
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors shrink-0 mt-1">
                                                <Icon className="size-6 text-blue-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                                                    {template.category}
                                                </span>
                                                <h3 className="text-lg font-semibold text-gray-900 mt-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                                                    {template.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                                    {template.description}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            No templates found in this category.
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-12">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label="Previous page"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {getPageNumbers().map((page, index) => (
                                typeof page === 'number' ? (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ) : (
                                    <span key={index} className="w-10 h-10 flex items-center justify-center text-gray-400">
                                        {page}
                                    </span>
                                )
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label="Next page"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                {/* FAQ Section */}
                <section className="container mx-auto px-4 max-w-6xl mt-16">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Frequently Asked Questions
                    </h2>
                    <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
                        <FAQAccordion items={[
                            {
                                question: "Are these templates really free?",
                                answer: "Yes! All our schedule templates are completely free to use. You can preview, customize, and export your schedules without any cost. Some advanced features like PDF export and AI generation require a Pro subscription."
                            },
                            {
                                question: "How do I use a template?",
                                answer: "Simply click on any template to preview it, then click 'Use This Template' to load it into the editor. From there, you can customize colors, times, labels, and add or remove events to match your needs."
                            },
                            {
                                question: "Can I customize the templates?",
                                answer: "Absolutely! Once you load a template into the editor, you have full control to modify every aspect - change event times, colors, titles, add new events, or delete existing ones. The templates are just starting points."
                            },
                            {
                                question: "What export formats are available?",
                                answer: "Free users can export schedules as PNG or JPG images (with watermark). Pro users get access to watermark-free exports, PDF format for high-quality printing, and Excel/CSV format for data analysis."
                            },
                            {
                                question: "Will my schedule be saved?",
                                answer: "Your schedule is automatically saved in your browser's local storage. Pro users also get cloud sync, which allows you to access your schedules from any device."
                            }
                        ]} />
                    </div>
                </section>
            </main>

            <Footer />

            {/* Upgrade Modal */}
            <UpgradeModal
                open={upgradeModalOpen}
                onOpenChange={setUpgradeModalOpen}
                feature="AI Schedule Generator"
            />

            {/* Blank Canvas Confirmation Dialog */}
            <Dialog open={blankCanvasDialogOpen} onOpenChange={setBlankCanvasDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-full">
                                <AlertTriangle className="size-5 text-amber-600" />
                            </div>
                            <DialogTitle>Start Fresh?</DialogTitle>
                        </div>
                        <DialogDescription className="pt-3">
                            This will reset your calendar and clear all existing events. Your settings will also be restored to defaults.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setBlankCanvasDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleBlankCanvasConfirm}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Yes, Start Fresh
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
