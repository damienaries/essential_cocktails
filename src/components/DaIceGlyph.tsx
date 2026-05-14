import { motion } from 'motion/react';

type Props = {
	size?: number;
	className?: string;
};

/** Tumbler glass with "D" and "A" ice cubes that rattle on a subtle loop.
 * Inherits `color` for the glass + cubes; letters render in palm for contrast. */
export function DaIceGlyph({ size = 36, className }: Props) {
	return (
		<svg
			viewBox="0 0 64 64"
			width={size}
			height={size}
			aria-hidden="true"
			className={className}
		>
			{/* Tumbler body */}
			<path
				d="M 10 16 L 14 56 L 50 56 L 54 16"
				fill="none"
				stroke="currentColor"
				strokeWidth={1.6}
				strokeLinejoin="round"
				strokeLinecap="round"
			/>
			{/* Top rim ellipse */}
			<ellipse
				cx="32"
				cy="16"
				rx="22"
				ry="3"
				fill="none"
				stroke="currentColor"
				strokeWidth={1.6}
			/>
			{/* Chiseled facet lines */}
			<line
				x1="20"
				y1="20"
				x2="22"
				y2="50"
				stroke="currentColor"
				strokeWidth={1}
				opacity={0.5}
			/>
			<line
				x1="32"
				y1="20"
				x2="32"
				y2="52"
				stroke="currentColor"
				strokeWidth={1}
				opacity={0.5}
			/>
			<line
				x1="44"
				y1="20"
				x2="42"
				y2="50"
				stroke="currentColor"
				strokeWidth={1}
				opacity={0.5}
			/>

			{/* Ice cube — D */}
			<motion.g
				animate={{
					y: [0, -2, 1, -1, 0],
					rotate: [0, -4, 2, -3, 0],
				}}
				transition={{
					duration: 1.4,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
				style={{ transformOrigin: '24px 38px', transformBox: 'fill-box' }}
			>
				<rect
					x="17"
					y="31"
					width="14"
					height="14"
					rx="2"
					fill="currentColor"
					opacity={0.92}
				/>
				<text
					x="24"
					y="42"
					textAnchor="middle"
					fontSize="10"
					fontWeight={700}
					fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
					fill="var(--color-palm)"
				>
					D
				</text>
			</motion.g>

			{/* Ice cube — A */}
			<motion.g
				animate={{
					y: [0, 1.5, -1.5, 0.5, 0],
					rotate: [0, 3, -2, 4, 0],
				}}
				transition={{
					duration: 1.6,
					repeat: Infinity,
					ease: 'easeInOut',
					delay: 0.2,
				}}
				style={{ transformOrigin: '40px 37px', transformBox: 'fill-box' }}
			>
				<rect
					x="33"
					y="30"
					width="14"
					height="14"
					rx="2"
					fill="currentColor"
					opacity={0.92}
				/>
				<text
					x="40"
					y="41"
					textAnchor="middle"
					fontSize="10"
					fontWeight={700}
					fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
					fill="var(--color-palm)"
				>
					A
				</text>
			</motion.g>
		</svg>
	);
}
