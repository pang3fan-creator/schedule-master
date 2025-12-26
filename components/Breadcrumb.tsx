"use client"

import Link from "next/link"
import { Fragment } from "react"

interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbProps {
    items: BreadcrumbItem[]
    className?: string
}

/**
 * Breadcrumb navigation component
 * 
 * Usage:
 * <Breadcrumb items={[
 *     { label: "Home", href: "/" },
 *     { label: "Templates", href: "/templates" },
 *     { label: "Current Page" }
 * ]} />
 */
export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
    return (
        <nav className={`mb-6 ${className}`} aria-label="Breadcrumb">
            <ol className="flex items-center justify-center gap-2 text-sm text-gray-500 flex-wrap">
                {items.map((item, index) => (
                    <Fragment key={index}>
                        {index > 0 && <li className="text-gray-400">&gt;</li>}
                        <li className={index === items.length - 1 ? "text-gray-900 font-medium" : ""}>
                            {item.href ? (
                                <Link href={item.href} className="hover:text-blue-600 transition-colors">
                                    {item.label}
                                </Link>
                            ) : (
                                item.label
                            )}
                        </li>
                    </Fragment>
                ))}
            </ol>
        </nav>
    )
}
