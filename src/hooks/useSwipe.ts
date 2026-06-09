import { useRef } from 'react';
import type { TouchEvent } from 'react';

type SwipeHandlers = {
	onTouchStart: (e: TouchEvent) => void;
	onTouchEnd: (e: TouchEvent) => void;
};

/**
 * Horizontal swipe detection for touch devices. A swipe only fires when the
 * horizontal travel clears `threshold` and dominates the vertical travel, so it
 * never hijacks vertical scrolling inside the swiped element.
 */
export function useSwipe(
	onSwipeLeft?: () => void,
	onSwipeRight?: () => void,
	threshold = 50,
): SwipeHandlers {
	const start = useRef<{ x: number; y: number } | null>(null);

	return {
		onTouchStart: (e) => {
			const t = e.changedTouches[0];
			start.current = t ? { x: t.clientX, y: t.clientY } : null;
		},
		onTouchEnd: (e) => {
			const s = start.current;
			start.current = null;
			const t = e.changedTouches[0];
			if (!s || !t) return;
			const dx = t.clientX - s.x;
			const dy = t.clientY - s.y;
			if (Math.abs(dx) < threshold || Math.abs(dx) <= Math.abs(dy)) return;
			if (dx < 0) onSwipeLeft?.();
			else onSwipeRight?.();
		},
	};
}
