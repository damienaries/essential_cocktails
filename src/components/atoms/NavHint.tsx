import { motion } from "motion/react";

type Props = {
  side: "left" | "right";
};

// Thin chevron that fades in and out to hint at swipe/scroll navigation.
// Purely decorative — actual navigation is handled by swipe and arrow keys.
export function NavHint({ side }: Props) {
  return (
    <motion.span
      aria-hidden="true"
      className={[
        "pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 text-white",
        side === "left" ? "left-3" : "right-3",
      ].join(" ")}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.9, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        viewBox="0 0 10 30"
        className="h-7 w-2.5 drop-shadow-md"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {side === "left" ? (
          <polyline points="8 3 3 15 8 27" />
        ) : (
          <polyline points="2 3 7 15 2 27" />
        )}
      </svg>
    </motion.span>
  );
}
