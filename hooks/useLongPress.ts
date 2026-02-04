"use client";

import { useRef, useCallback } from "react";

interface LongPressOptions {
  delay?: number;
  onLongPress: () => void;
  onPress?: () => void;
}

/**
 * Hook to detect long press gestures on touch devices
 * @param options - Configuration options
 * @returns Event handlers to attach to an element
 */
export function useLongPress({
  delay = 500,
  onLongPress,
  onPress,
}: LongPressOptions) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  const start = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      isLongPressRef.current = false;

      // Store initial position for move detection
      if ("touches" in e) {
        startPosRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }

      timerRef.current = setTimeout(() => {
        isLongPressRef.current = true;
        onLongPress();
      }, delay);
    },
    [delay, onLongPress],
  );

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!startPosRef.current) return;

      const { clientX, clientY } = e.touches[0];
      const moveThreshold = 10; // pixels

      // Cancel long press if user moved finger too much
      if (
        Math.abs(clientX - startPosRef.current.x) > moveThreshold ||
        Math.abs(clientY - startPosRef.current.y) > moveThreshold
      ) {
        cancel();
      }
    },
    [cancel],
  );

  const handleEnd = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      cancel();

      // If it wasn't a long press and onPress is provided, call it
      if (!isLongPressRef.current && onPress) {
        // Only trigger click if it was a quick tap
        onPress();
      }

      startPosRef.current = null;
    },
    [cancel, onPress],
  );

  return {
    onTouchStart: start,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleEnd,
    onTouchCancel: cancel,
  };
}
