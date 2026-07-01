type Props = {
	name?: string | null;
	email?: string | null;
	photoURL?: string | null;
	size?: number;
};

// User avatar: the account photo when one exists, otherwise the first letter of
// the display name (or email) on a brass disc. Size is a prop, so dimensions use
// inline styles rather than fixed Tailwind utilities.
export function Avatar({ name, email, photoURL, size = 36 }: Props) {
	if (photoURL) {
		return (
			<img
				src={photoURL}
				alt=""
				width={size}
				height={size}
				className="rounded-full object-cover"
			/>
		);
	}

	const source = name?.trim() || email?.trim() || '';
	const initial = (source[0] ?? '?').toUpperCase();
	return (
		<span
			aria-hidden
			className="inline-flex select-none items-center justify-center rounded-full bg-brass font-semibold text-ink"
			style={{ width: size, height: size, fontSize: Math.round(size * 0.45) }}>
			{initial}
		</span>
	);
}
