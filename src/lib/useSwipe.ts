import { useRef, type TouchEvent } from "react";

/**
 * Horizontal swipe handlers for touch screens. A swipe counts when the finger
 * travels 48px or more sideways and clearly more sideways than down, so normal
 * vertical scrolling is never mistaken for one.
 */
export function useSwipe(onNext: () => void, onPrev: () => void) {
  const start = useRef<{ x: number; y: number } | null>(null);
  return {
    onTouchStart(event: TouchEvent) {
      const touch = event.touches[0];
      start.current = { x: touch.clientX, y: touch.clientY };
    },
    onTouchEnd(event: TouchEvent) {
      const from = start.current;
      start.current = null;
      if (!from) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - from.x;
      const dy = touch.clientY - from.y;
      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      if (dx < 0) onNext();
      else onPrev();
    },
  };
}
