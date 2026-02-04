import { useState, useEffect } from "react";

export function useCurrentTime() {
  // Initialize with null to avoid hydration mismatch
  // The actual time will be set in useEffect after client-side hydration
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set time immediately on mount (client-side only)
    setCurrentTime(new Date());

    // Update every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return currentTime;
}
