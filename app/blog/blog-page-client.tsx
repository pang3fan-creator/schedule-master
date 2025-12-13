"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BlogCard } from "@/components/blog-card"
import { CategoryFilter } from "@/components/category-filter"

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

export function BlogPageClient({ posts, categories }: BlogPageClientProps) {
    const [activeCategory, setActiveCategory] = useState("All")

    const filteredPosts =
        activeCategory === "All"
            ? posts
            : posts.filter((post) => post.category === activeCategory)

    const featuredPost = filteredPosts.find((post) => post.featured)
    const regularPosts = filteredPosts.filter((post) => !post.featured)

    return (
        <div className="min-h-screen flex flex-col bg-gray-50/50">
            <Navbar />

            <main className="flex-1 py-16">
                {/* Hero Section */}
                <div className="container mx-auto px-4 text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
                        Our Blog
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Insights on productivity, scheduling, and team management.
                    </p>
                </div>

                {/* Category Filter */}
                <div className="container mx-auto px-4 mb-12">
                    <CategoryFilter
                        categories={categories}
                        activeCategory={activeCategory}
                        onCategoryChange={setActiveCategory}
                    />
                </div>

                {/* Featured Article */}
                {featuredPost && (
                    <div className="container mx-auto px-4 mb-12 max-w-4xl">
                        <BlogCard {...featuredPost} featured />
                    </div>
                )}

                {/* Article Grid */}
                <div className="container mx-auto px-4">
                    {regularPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {regularPosts.map((post) => (
                                <BlogCard key={post.slug} {...post} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            No articles found in this category.
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
