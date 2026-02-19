"use client";

import { useEffect, useRef } from "react";

interface AdSenseUnitProps {
  adSlot: string;
  adFormat?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  fullWidthResponsive?: boolean;
}

export function AdSenseUnit({
  adSlot,
  adFormat = "auto",
  className = "",
  fullWidthResponsive = true,
}: AdSenseUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isAdPushed = useRef(false);

  useEffect(() => {
    if (!isAdPushed.current && adRef.current && typeof window !== "undefined") {
      // Ensure adsbygoogle is loaded
      if ((window as any).adsbygoogle) {
        try {
          (window as any).adsbygoogle.push({});
          isAdPushed.current = true;
        } catch (error) {
          console.error("AdSense push error:", error);
        }
      }
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={{ display: "block" }}
      data-ad-client="ca-pub-6636417287024414"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive.toString()}
    />
  );
}
