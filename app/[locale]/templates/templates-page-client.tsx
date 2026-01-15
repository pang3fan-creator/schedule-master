"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { PageLayout } from "@/components/PageLayout";
import Link from "next/link";
import { Briefcase, GraduationCap, Dumbbell, Palette, Sparkles, Crown, ChevronLeft, ChevronRight, Search, Home, SprayCan, HardHat } from "lucide-react";
import { getAllTemplates } from "@/lib/templates";
import { getTemplateTranslation } from "@/lib/templates-translations";
import { CategoryFilter } from "@/components/CategoryFilter";
import { FAQSection } from "@/components/FAQSection";
import { PageHero } from "@/components/PageHero";
import { Input } from "@/components/ui/input";
import { Breadcrumb } from "@/components/Breadcrumb";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Briefcase,
    GraduationCap,
    Dumbbell,
    Palette,
    Sparkles,
    Home,
    SprayCan,
    HardHat,
};

const TEMPLATES_PER_PAGE = 18;

interface TemplatesPageClientProps {
    locale: string;
}

export function TemplatesPageClient({ locale }: TemplatesPageClientProps) {
    const t = useTranslations('Templates');
    const router = useRouter();
    const allTemplates = getAllTemplates();
    const [activeCategory, setActiveCategory] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    // Get unique categories from templates
    const categories = ["All", ...Array.from(new Set(allTemplates.map(t => t.category)))];

    // Filter templates by category and search query
    const filteredTemplates = allTemplates.filter(template => {
        const matchesCategory = activeCategory === "All" || template.category === activeCategory;
        const matchesSearch = searchQuery.trim() === "" ||
            template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredTemplates.length / TEMPLATES_PER_PAGE);
    const startIndex = (currentPage - 1) * TEMPLATES_PER_PAGE;
    const paginatedTemplates = filteredTemplates.slice(startIndex, startIndex + TEMPLATES_PER_PAGE);

    const handleCategoryChange = (category: string) => {
        setActiveCategory(category);
        setCurrentPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 200, behavior: 'smooth' });
        }
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

    // Generate template URL based on locale
    const getTemplateUrl = (slug: string) => {
        return locale === 'en' ? `/templates/${slug}` : `/${locale}/templates/${slug}`;
    };

    // FAQ items from translations
    const faqItems = t.raw('faqs.items') as Array<{ question: string; answer: string }>;

    // FAQ Schema for SEO
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer,
            },
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <PageLayout>
                {/* Breadcrumb Navigation */}
                <div className="container mx-auto px-4 max-w-6xl mb-4">
                    <Breadcrumb items={[
                        { label: t('breadcrumb.home'), href: "/" },
                        { label: t('breadcrumb.templates') }
                    ]} />
                </div>

                {/* Hero Section */}
                <PageHero
                    title={t('hero.title')}
                    description={t('hero.description')}
                />

                {/* Search Box */}
                <div className="container mx-auto px-4 max-w-6xl mb-8">
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <Input
                            type="text"
                            placeholder={t('search.placeholder')}
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="pl-10 pr-10"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                                aria-label={t('search.clear')}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Category Filter */}
                <div className="container mx-auto px-4 mb-8">
                    <CategoryFilter
                        categories={categories}
                        activeCategory={activeCategory}
                        onCategoryChange={handleCategoryChange}
                    />
                </div>

                {/* Templates Grid */}
                <div className="container mx-auto px-4 max-w-6xl">
                    {paginatedTemplates.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedTemplates.map((template) => {
                                const Icon = template.icon ? iconMap[template.icon] : Briefcase;
                                // Get translated data if available
                                const translation = getTemplateTranslation(template.slug, locale);
                                const displayTitle = translation?.title || template.title;
                                const displayDescription = translation?.description || template.description;

                                return (
                                    <Link
                                        key={template.slug}
                                        href={getTemplateUrl(template.slug)}
                                        className="group bg-gray-50 dark:bg-gray-800/80 rounded-xl border border-slate-200 dark:border-gray-600 p-6 shadow-sm hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-500 transition-all duration-200 relative h-full flex flex-col"
                                    >
                                        {/* Pro Badge */}
                                        {template.requiresPro && (
                                            <div className="absolute top-3 right-3">
                                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                                                    <Crown className="size-2.5" />
                                                    {t('badge.pro')}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors shrink-0 mt-1">
                                                <Icon className="size-6 text-blue-600 dark:text-blue-300" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-xs font-medium text-blue-600 dark:text-blue-300 uppercase tracking-wide">
                                                    {template.category}
                                                </span>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors line-clamp-1">
                                                    {displayTitle}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-300 mt-2 line-clamp-2">
                                                    {displayDescription}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            {t('list.noTemplates')}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-12">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label={t('list.previousPage')}
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
                                            : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ) : (
                                    <span key={index} className="w-10 h-10 flex items-center justify-center text-gray-400 dark:text-gray-600">
                                        {page}
                                    </span>
                                )
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label={t('list.nextPage')}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                {/* FAQ Section - using unified FAQSection component */}
                <div className="mt-16">
                    <FAQSection
                        items={faqItems}
                    />
                </div>
            </PageLayout>
        </>
    );
}
