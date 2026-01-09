"use client"

import { cn } from "@/lib/utils"

interface CategoryFilterProps {
    categories: string[]
    activeCategory: string
    onCategoryChange: (category: string) => void
}

export function CategoryFilter({
    categories,
    activeCategory,
    onCategoryChange,
}: CategoryFilterProps) {
    return (
        <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                        activeCategory === category
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    )}
                >
                    {category}
                </button>
            ))}
        </div>
    )
}
