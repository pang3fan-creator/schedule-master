"use client"

import { useState } from "react"
import { PageLayout } from "@/components/PageLayout"
import { BlogCard } from "@/components/BlogCard"
import { CategoryFilter } from "@/components/CategoryFilter"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PageHero } from "@/components/PageHero"

import { Breadcrumb } from "@/components/Breadcrumb"

interface Post {
    slug: string
    title: string
    excerpt: string
    category: string
    date: string
    readTime: string
    coverImage: string
    featured: boolean
}

interface BlogPageClientProps {
    posts: Post[]
    categories: string[]
}

const POSTS_PER_PAGE = 6

export function BlogPageClient({ posts, categories }: BlogPageClientProps) {
    const [activeCategory, setActiveCategory] = useState("All")
    const [currentPage, setCurrentPage] = useState(1)

    const filteredPosts =
        activeCategory === "All"
            ? posts
            : posts.filter((post) => post.category === activeCategory)

    const featuredPost = filteredPosts.find((post) => post.featured)
    const regularPosts = filteredPosts.filter((post) => !post.featured)

    // Pagination logic
    const totalPages = Math.ceil(regularPosts.length / POSTS_PER_PAGE)
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE
    const paginatedPosts = regularPosts.slice(startIndex, startIndex + POSTS_PER_PAGE)

    // Reset to page 1 when category changes
    const handleCategoryChange = (category: string) => {
        setActiveCategory(category)
        setCurrentPage(1)
    }

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
            // Scroll to top of articles
            window.scrollTo({ top: 400, behavior: 'smooth' })
        }
    }

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, '...', totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages)
            } else {
                pages.push(1, '...', currentPage, '...', totalPages)
            }
        }
        return pages
    }

    return (
        <PageLayout bgColor="bg-gray-50/50">
            {/* Breadcrumb Navigation */}
            <div className="container mx-auto px-4 max-w-6xl mb-4">
                <Breadcrumb items={[
                    { label: "Home", href: "/" },
                    { label: "Blog" }
                ]} />
            </div>

            {/* Hero Section */}
            <PageHero
                title="Our Blog"
                description="Insights on productivity, scheduling, and team management."
            />

            {/* Category Filter */}
            <div className="container mx-auto px-4 mb-12">
                <CategoryFilter
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={handleCategoryChange}
                />
            </div>

            {/* Featured Article */}
            {featuredPost && (
                <div className="container mx-auto px-4 mb-12 max-w-6xl">
                    <BlogCard {...featuredPost} featured />
                </div>
            )}

            {/* Article Grid */}
            <div className="container mx-auto px-4 max-w-6xl">
                {paginatedPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedPosts.map((post) => (
                            <BlogCard key={post.slug} {...post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        No articles found in this category.
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
        </PageLayout>
    )
}
