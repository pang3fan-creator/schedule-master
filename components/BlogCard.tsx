import Link from "next/link"
import Image from "next/image"

interface BlogCardProps {
    slug: string
    title: string
    excerpt: string
    category: string
    date: string
    readTime: string
    coverImage?: string
    featured?: boolean
}

function ImagePlaceholder({ size = "normal" }: { size?: "normal" | "large" }) {
    const sizeClass = size === "large" ? "w-16 h-16" : "w-12 h-12"
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-300 dark:text-blue-600">
            <svg className={sizeClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
    )
}

function CoverImage({ src, alt, size = "normal" }: { src?: string; alt: string; size?: "normal" | "large" }) {
    if (!src) {
        return <ImagePlaceholder size={size} />
    }
    return (
        <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes={size === "large" ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
        />
    )
}

export function BlogCard({
    slug,
    title,
    excerpt,
    category,
    date,
    readTime,
    coverImage,
    featured = false,
}: BlogCardProps) {
    if (featured) {
        return (
            <Link
                href={`/blog/${slug}`}
                className="group block rounded-2xl border border-slate-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
                <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[280px]">
                        <CoverImage src={coverImage} alt={title} size="large" />
                    </div>
                    <div className="p-6 md:p-8 flex flex-col justify-center">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-300 mb-2">Featured Article</span>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors mb-3">
                            {title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{excerpt}</p>
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                            {date} • {readTime}
                        </div>
                    </div>
                </div>
            </Link>
        )
    }

    return (
        <Link
            href={`/blog/${slug}`}
            className="group block rounded-xl border border-slate-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
            <div className="relative aspect-[16/10]">
                <CoverImage src={coverImage} alt={title} />
            </div>
            <div className="p-5">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-300">{category}</span>
                <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors line-clamp-2">
                    {title}
                </h3>
                <div className="mt-3 text-sm text-gray-500 dark:text-gray-300">
                    {date} • {readTime}
                </div>
            </div>
        </Link>
    )
}

