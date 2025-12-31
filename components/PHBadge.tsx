import React from 'react';

interface PHBadgeProps {
    className?: string;
    isFixed?: boolean;
}

const PHBadge = ({ className = "", isFixed = true }: PHBadgeProps) => {
    // containerClasses handles the positioning:
    // - Fixed mode (Desktop): Top-left floating above navbar area, scaled down
    // - Inline mode (Mobile Footer): Standard block element
    const containerClasses = isFixed
        ? "fixed top-1 left-[210px] z-[60] transition-transform hover:scale-[0.75] scale-[0.7] origin-left hidden md:block" // Desktop: Even higher
        : "transition-transform hover:scale-105"; // Mobile: Inline in footer

    // Tooltip position: 
    // - Top-left badge (Desktop): Tooltip should appear below to avoid being cut off
    // - Footer badge (Mobile): Tooltip appears above
    const tooltipClasses = isFixed
        ? "absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
        : "absolute -top-14 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none";

    const arrowClasses = isFixed
        ? "absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-600 rotate-45"
        : "absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-600 rotate-45";

    return (
        <div className={`${containerClasses} ${className}`}>
            <div className="relative group">
                {/* Tooltip 文字部分 */}
                <div className={tooltipClasses}>
                    Love our no-signup builder? Support us! 🚀
                    {/* 小箭头 */}
                    <div className={arrowClasses}></div>
                </div>

                <a
                    href="https://www.producthunt.com/products/tryschedule?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-tryschedule"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1056411&theme=light&t=1767147184370"
                        alt="TrySchedule - Free Online Schedule Builder - No Signup Required | Product Hunt"
                        width="250"
                        height="54"
                        style={{ width: '250px', height: '54px' }}
                    />
                </a>
            </div>
        </div>
    );
};

export default PHBadge;
