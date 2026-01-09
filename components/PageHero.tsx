"use client";

import { ReactNode } from "react";

interface PageHeroProps {
    title: ReactNode;
    description: string;
    className?: string;
}

export function PageHero({ title, description, className = "" }: PageHeroProps) {
    return (
        <div className={`container mx-auto px-4 text-center mb-12 ${className}`}>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl mb-4">
                {title}
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                {description}
            </p>
        </div>
    );
}
