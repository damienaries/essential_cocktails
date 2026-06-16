import { useCallback, useEffect, useMemo, useState } from "react";
import type { Drink } from "../types/drink";
import { useSwipe } from "./useSwipe";

// Outgoing card drifts toward the swipe direction while fading; the incoming
// card slides in from the opposite side. `custom` carries the nav direction.
export const slideVariants = {
  enter: (dir: 1 | -1) => ({ x: dir * 40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: 1 | -1) => ({ x: dir * -40, opacity: 0 }),
};

/**
 * Prev/next navigation for the drink detail modal: swipe gestures, arrow keys,
 * neighbour image preloading, and the slide direction driving the transition.
 * No-ops gracefully when `drinks`/`onNavigate` are omitted or the list is short.
 */
export function useDrinkNavigation(
  drink: Drink,
  drinks: Drink[] | undefined,
  onNavigate: ((drink: Drink) => void) | undefined,
) {
  // Direction of the last navigation: 1 = forward/next, -1 = back/prev.
  // Drives which way the outgoing card exits and the incoming card enters.
  const [direction, setDirection] = useState<1 | -1>(1);

  const list = useMemo(() => drinks ?? [], [drinks]);
  const index = list.findIndex((d) => d.id === drink.id);
  const canNavigate = !!onNavigate && index >= 0 && list.length > 1;

  const navigate = useCallback(
    (dir: 1 | -1) => {
      if (!canNavigate) return;
      const next = list[(index + dir + list.length) % list.length];
      if (next) {
        setDirection(dir);
        onNavigate?.(next);
      }
    },
    [canNavigate, index, list, onNavigate],
  );

  const swipeHandlers = useSwipe(
    () => navigate(1),
    () => navigate(-1),
  );

  useEffect(() => {
    if (!canNavigate) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") navigate(1);
      else if (e.key === "ArrowLeft") navigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canNavigate, navigate]);

  // Warm the browser cache for the neighbouring drinks' images so swiping to
  // them shows the photo instantly. The drink data is already in memory; only
  // the image bytes need fetching ahead of time. Identical URLs hit cache when
  // the neighbour mounts (see drinkPhotoImgProps).
  useEffect(() => {
    if (!canNavigate) return;
    const neighbours = [
      list[(index + 1) % list.length],
      list[(index - 1 + list.length) % list.length],
    ];
    for (const n of neighbours) {
      const url = n?.imageUrl?.trim();
      if (url) {
        const img = new Image();
        img.decoding = "async";
        img.src = url;
      }
    }
  }, [canNavigate, index, list]);

  return { direction, swipeHandlers, canNavigate };
}
