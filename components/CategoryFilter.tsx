"use client"

import { cn } from "@/lib/utils"

interface CategoryItem {
    value: string;
    label: string;
}

interface CategoryFilterProps {
    categories: (string | CategoryItem)[]
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
            {categories.map((category) => {
                const value = typeof category === 'string' ? category : category.value;
                const label = typeof category === 'string' ? category : category.label;

                return (
                    <button
                        key={value}
                        onClick={() => onCategoryChange(value)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                            activeCategory === value
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        )}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
}
