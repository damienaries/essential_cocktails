import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { drinkPhotoImgProps } from '../lib/drinkImageAttrs';
import type { Drink } from '../types/drink';

type Props = {
	drink: Drink;
	onSelect: (drink: Drink) => void;
};

export function CocktailCard({ drink, onSelect }: Props) {
	const imageUrl = drink.imageUrl?.trim();
	const ref = useRef<HTMLButtonElement | null>(null);
	const [shouldLoad, setShouldLoad] = useState(false);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		if (!imageUrl || shouldLoad) return;
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting)) {
					setShouldLoad(true);
					observer.disconnect();
				}
			},
			{ rootMargin: '200px' },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [imageUrl, shouldLoad]);

	return (
		<motion.button
			type="button"
			ref={ref}
			onClick={() => onSelect(drink)}
			aria-label={`Open details for ${drink.name}`}
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			viewport={{ once: true, margin: '0px 0px -10% 0px' }}
			transition={{ duration: 0.5, ease: 'easeOut' }}
			className="group m-0 w-full cursor-pointer rounded-lg border-0 bg-transparent p-0 text-left font-[inherit] shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass/50">
			<span className="relative block h-[200px] w-full overflow-hidden rounded-lg">
				<span
					aria-hidden
					className="absolute inset-0 bg-[linear-gradient(145deg,rgba(42,36,56,0.95),rgba(26,23,32,0.98))]"
				/>
				{imageUrl && shouldLoad ? (
					<motion.img
						src={imageUrl}
						alt=""
						width={440}
						height={200}
						className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
						loading="lazy"
						onLoad={() => setLoaded(true)}
						initial={{ opacity: 0 }}
						animate={{ opacity: loaded ? 1 : 0 }}
						transition={{ duration: 0.5, ease: 'easeOut' }}
						{...drinkPhotoImgProps}
					/>
				) : null}
				<span
					aria-hidden
					className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(to_right,rgba(0,0,0,.5),rgba(0,0,0,.5))]">
					<span className="relative px-3 text-center text-[1.15rem] font-medium capitalize text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">
						{drink.name}
					</span>
				</span>
				<span
					aria-hidden
					className="pointer-events-none absolute inset-0 bg-palm/0 transition-colors duration-300 group-hover:bg-palm/10 dark:group-hover:bg-brass/10"
				/>
			</span>
		</motion.button>
	);
}
