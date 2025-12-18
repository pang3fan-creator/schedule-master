import fs from "fs"
import path from "path"
import matter from "gray-matter"

export interface Post {
    slug: string
    title: string
    excerpt: string
    category: string
    date: string
    readTime: string
    coverImage: string
    author: string
    featured: boolean
    content: string
}

const postsDirectory = path.join(process.cwd(), "posts")

export function getAllPosts(): Post[] {
    if (!fs.existsSync(postsDirectory)) {
        return []
    }

    const fileNames = fs.readdirSync(postsDirectory)
    const allPosts = fileNames
        .filter((fileName) => fileName.endsWith(".mdx"))
        .map((fileName) => {
            const slug = fileName.replace(/\.mdx$/, "")
            const fullPath = path.join(postsDirectory, fileName)
            const fileContents = fs.readFileSync(fullPath, "utf8")
            const { data, content } = matter(fileContents)

            return {
                slug,
                title: data.title || "",
                excerpt: data.excerpt || "",
                category: data.category || "Uncategorized",
                date: data.date || "",
                readTime: data.readTime || "",
                coverImage: data.coverImage || "",
                author: data.author || "Anonymous",
                featured: data.featured || false,
                content,
            }
        })

    // Sort by date descending
    return allPosts.sort((a, b) => (a.date > b.date ? -1 : 1))
}

export function getPostBySlug(slug: string): Post | null {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)

    if (!fs.existsSync(fullPath)) {
        return null
    }

    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    return {
        slug,
        title: data.title || "",
        excerpt: data.excerpt || "",
        category: data.category || "Uncategorized",
        date: data.date || "",
        readTime: data.readTime || "",
        coverImage: data.coverImage || "",
        author: data.author || "Anonymous",
        featured: data.featured || false,
        content,
    }
}

export function getAllCategories(): string[] {
    const posts = getAllPosts()
    const categories = new Set(posts.map((post) => post.category))
    return ["All", ...Array.from(categories)]
}
