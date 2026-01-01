import React from 'react';

interface PHBadgeProps {
    className?: string;
    variant?: 'fixed' | 'navbar' | 'inline';
}

const PHBadge = ({ className = "", variant = 'fixed' }: PHBadgeProps) => {
    // Positioning classes based on variant:
    // - fixed: Global overlay (legacy, to be removed)
    // - navbar: Absolute positioning inside Navbar header
    // - inline: Standard block/inline flow (for Footers)
    let containerClasses = "";

    if (variant === 'fixed') {
        containerClasses = "fixed top-1 left-[210px] z-[60] hidden md:block";
    } else if (variant === 'navbar') {
        // Relative to Navbar header container. Navbar has h-16 (64px).
        // Scaling down (scale-70) makes it ~38px high.
        containerClasses = "absolute top-1 left-[210px] z-10 hidden md:block";
    } else {
        // inline
        containerClasses = "block";
    }

    // Common styling for the interactive part
    const interactiveClasses = "transition-transform hover:scale-[0.75] scale-[0.7] origin-left";
    const mobileFooterScaling = variant === 'inline' ? "scale-90" : "";

    // Tooltip position: 
    // - top-left (fixed/navbar): below badge
    // - inline/footer: above badge
    const isTopPositioned = variant === 'fixed' || variant === 'navbar';

    const tooltipClasses = isTopPositioned
        ? "absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
        : "absolute -top-14 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none";

    const arrowClasses = isTopPositioned
        ? "absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-600 rotate-45"
        : "absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-600 rotate-45";

    return (
        <div className={`${containerClasses} ${className} ${variant === 'inline' ? mobileFooterScaling : interactiveClasses}`}>
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
