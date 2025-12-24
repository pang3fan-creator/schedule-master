import type { Metadata } from "next"
import { getAllPosts, getAllCategories } from "@/lib/posts"
import { BlogPageClient } from "./blog-page-client"

export const metadata: Metadata = {
    title: "Blog | TrySchedule - Scheduling Tips & Productivity Guides",
    description: "Discover scheduling tips, productivity guides, and best practices for students, managers, and teams. Learn how to optimize your time with TrySchedule.",
    keywords: [
        "scheduling tips",
        "productivity blog",
        "time management",
        "schedule builder tips",
        "employee scheduling guide",
    ],
    openGraph: {
        title: "TrySchedule Blog - Scheduling Tips & Guides",
        description: "Discover scheduling tips and productivity guides for students, managers, and teams.",
        type: "website",
    },
    alternates: {
        canonical: "https://www.tryschedule.com/blog",
    },
}

export default function BlogPage() {
    const posts = getAllPosts()
    const categories = getAllCategories()

    return <BlogPageClient posts={posts} categories={categories} />
}
