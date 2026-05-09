import { useState, type CSSProperties } from 'react';

const FONTS = [
	{
		name: 'Inter',
		stack: '"Inter", system-ui, sans-serif',
		note: 'Default-ish modern sans. Neutral, slightly muted.',
	},
	{
		name: 'Geist',
		stack: '"Geist", system-ui, sans-serif',
		note: 'Vercel’s editorial/tech sans. Crisp, slightly cooler.',
	},
	{
		name: 'Manrope',
		stack: '"Manrope", system-ui, sans-serif',
		note: 'Geometric, friendly, more rounded character than Inter.',
	},
	{
		name: 'DM Sans',
		stack: '"DM Sans", system-ui, sans-serif',
		note: 'Geometric low-contrast. Very modern, warmer than Inter.',
	},
	{
		name: 'Plus Jakarta Sans',
		stack: '"Plus Jakarta Sans", system-ui, sans-serif',
		note: 'Humanist, warm, soft. Editorial luxury feel.',
	},
	{
		name: 'Space Grotesk',
		stack: '"Space Grotesk", system-ui, sans-serif',
		note: 'Geometric with personality. Less muted, slight tech edge.',
	},
] as const;

type ThemeBlockProps = {
	font: string;
};

function ThemeWarmSpeakeasy({ font }: ThemeBlockProps) {
	return (
		<div
			style={{
				background: '#111315',
				padding: 32,
				borderRadius: 18,
				margin: '24px 0',
				color: '#F3EEE6',
				fontFamily: font,
			}}
		>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 28,
				}}
			>
				<h2 style={{ margin: 0, fontSize: 42, letterSpacing: 2, color: '#F3EEE6' }}>
					SWIZZLE
				</h2>
				<button
					style={{
						background: '#D4A85A',
						color: '#111315',
						border: 'none',
						padding: '12px 20px',
						borderRadius: 999,
						fontWeight: 700,
						fontFamily: 'inherit',
					}}
				>
					Explore Drinks
				</button>
			</div>
			<div
				style={{
					background: '#1B1E20',
					border: '1px solid rgba(212,168,90,.35)',
					padding: 24,
					borderRadius: 16,
					maxWidth: 420,
				}}
			>
				<div style={{ fontSize: 14, color: '#B7B1A7', marginBottom: 8 }}>
					FEATURED COCKTAIL
				</div>
				<div style={{ fontSize: 32, fontWeight: 700, marginBottom: 10 }}>
					Last Word
				</div>
				<div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
					<span
						style={{
							background: '#2E5B4F',
							padding: '6px 12px',
							borderRadius: 999,
							fontSize: 13,
						}}
					>
						Classic
					</span>
					<span
						style={{
							background: '#25292B',
							padding: '6px 12px',
							borderRadius: 999,
							fontSize: 13,
							color: '#D4A85A',
						}}
					>
						Gin
					</span>
				</div>
				<p style={{ lineHeight: 1.6, color: '#B7B1A7', margin: 0 }}>
					Elegant modern cocktail discovery inspired by hidden bars and timeless
					classics.
				</p>
			</div>
			<Swatches
				colors={['#111315', '#1B1E20', '#D4A85A', '#2E5B4F', '#F3EEE6']}
				borderColor="#333"
			/>
		</div>
	);
}

function ThemeModernEditorial({ font }: ThemeBlockProps) {
	return (
		<div
			style={{
				background: '#0B0D0E',
				padding: 32,
				borderRadius: 18,
				margin: '24px 0',
				color: '#FAF7F2',
				fontFamily: font,
			}}
		>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 28,
				}}
			>
				<h2 style={{ margin: 0, fontSize: 42, letterSpacing: 2, color: '#FAF7F2' }}>
					SWIZZLE
				</h2>
				<button
					style={{
						background: '#C89B3C',
						color: '#0B0D0E',
						border: 'none',
						padding: '12px 20px',
						borderRadius: 999,
						fontWeight: 700,
						fontFamily: 'inherit',
					}}
				>
					Browse Classics
				</button>
			</div>
			<div
				style={{
					background: '#151819',
					border: '1px solid rgba(200,155,60,.35)',
					padding: 24,
					borderRadius: 16,
					maxWidth: 420,
				}}
			>
				<div style={{ fontSize: 14, color: '#C9C2B8', marginBottom: 8 }}>
					EDITOR&apos;S PICK
				</div>
				<div style={{ fontSize: 32, fontWeight: 700, marginBottom: 10 }}>
					Corpse Reviver #2
				</div>
				<div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
					<span
						style={{
							background: '#3F6A5B',
							padding: '6px 12px',
							borderRadius: 999,
							fontSize: 13,
						}}
					>
						Citrus
					</span>
					<span
						style={{
							background: '#232729',
							padding: '6px 12px',
							borderRadius: 999,
							fontSize: 13,
							color: '#C89B3C',
						}}
					>
						Gin
					</span>
				</div>
				<p style={{ lineHeight: 1.6, color: '#C9C2B8', margin: 0 }}>
					Sharp, cinematic and modern with richer contrast for photography-heavy
					layouts.
				</p>
			</div>
			<Swatches
				colors={['#0B0D0E', '#151819', '#C89B3C', '#3F6A5B', '#FAF7F2']}
				borderColor="#333"
			/>
		</div>
	);
}

function ThemeCreamBrass({ font }: ThemeBlockProps) {
	return (
		<div
			style={{
				background: '#F6F1E8',
				padding: 32,
				borderRadius: 18,
				margin: '24px 0',
				color: '#17191B',
				fontFamily: font,
				border: '1px solid #E0D7C9',
			}}
		>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 28,
				}}
			>
				<h2 style={{ margin: 0, fontSize: 42, letterSpacing: 2, color: '#17191B' }}>
					SWIZZLE
				</h2>
				<button
					style={{
						background: '#C89B3C',
						color: '#fff',
						border: 'none',
						padding: '12px 20px',
						borderRadius: 999,
						fontWeight: 700,
						fontFamily: 'inherit',
					}}
				>
					Discover Cocktails
				</button>
			</div>
			<div
				style={{
					background: '#FFFDF8',
					border: '1px solid rgba(200,155,60,.25)',
					padding: 24,
					borderRadius: 16,
					maxWidth: 420,
					boxShadow: '0 6px 24px rgba(0,0,0,.05)',
				}}
			>
				<div style={{ fontSize: 14, color: '#5E615F', marginBottom: 8 }}>
					SEASONAL FEATURE
				</div>
				<div style={{ fontSize: 32, fontWeight: 700, marginBottom: 10 }}>
					Gold Rush
				</div>
				<div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
					<span
						style={{
							background: '#3E6759',
							color: '#fff',
							padding: '6px 12px',
							borderRadius: 999,
							fontSize: 13,
						}}
					>
						Bourbon
					</span>
					<span
						style={{
							background: '#F3E4BF',
							color: '#7B5A1D',
							padding: '6px 12px',
							borderRadius: 999,
							fontSize: 13,
						}}
					>
						Honey
					</span>
				</div>
				<p style={{ lineHeight: 1.6, color: '#5E615F', margin: 0 }}>
					Elegant daytime version with a premium hospitality feel and softer
					contrast.
				</p>
			</div>
			<Swatches
				colors={['#F6F1E8', '#FFFDF8', '#C89B3C', '#3E6759', '#17191B']}
				borderColor="#ddd"
			/>
		</div>
	);
}

function ThemeEditorialWhite({ font }: ThemeBlockProps) {
	return (
		<div
			style={{
				background: '#FBFAF7',
				padding: 32,
				borderRadius: 18,
				margin: '24px 0',
				color: '#101214',
				fontFamily: font,
				border: '1px solid #EAE6DE',
			}}
		>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 28,
				}}
			>
				<h2 style={{ margin: 0, fontSize: 42, letterSpacing: 2, color: '#101214' }}>
					SWIZZLE
				</h2>
				<button
					style={{
						background: '#D4A85A',
						color: '#fff',
						border: 'none',
						padding: '12px 20px',
						borderRadius: 999,
						fontWeight: 700,
						fontFamily: 'inherit',
					}}
				>
					Start Exploring
				</button>
			</div>
			<div
				style={{
					background: '#FFFFFF',
					border: '1px solid rgba(212,168,90,.25)',
					padding: 24,
					borderRadius: 16,
					maxWidth: 420,
					boxShadow: '0 10px 30px rgba(0,0,0,.05)',
				}}
			>
				<div style={{ fontSize: 14, color: '#6A6E6B', marginBottom: 8 }}>
					HOUSE FAVORITE
				</div>
				<div style={{ fontSize: 32, fontWeight: 700, marginBottom: 10 }}>
					French 75
				</div>
				<div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
					<span
						style={{
							background: '#2B5A4D',
							color: '#fff',
							padding: '6px 12px',
							borderRadius: 999,
							fontSize: 13,
						}}
					>
						Sparkling
					</span>
					<span
						style={{
							background: '#F5E7C8',
							color: '#8A6825',
							padding: '6px 12px',
							borderRadius: 999,
							fontSize: 13,
						}}
					>
						Classic
					</span>
				</div>
				<p style={{ lineHeight: 1.6, color: '#6A6E6B', margin: 0 }}>
					Bright and modern with clean typography and restrained luxury accents.
				</p>
			</div>
			<Swatches
				colors={['#FBFAF7', '#FFFFFF', '#D4A85A', '#2B5A4D', '#101214']}
				borderColor="#ddd"
			/>
		</div>
	);
}

function Swatches({
	colors,
	borderColor,
}: {
	colors: string[];
	borderColor: string;
}) {
	return (
		<div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
			{colors.map((c, i) => (
				<div
					key={`${c}-${i}`}
					style={{
						width: 72,
						height: 72,
						background: c,
						borderRadius: 10,
						border: i < 2 ? `1px solid ${borderColor}` : undefined,
					}}
					title={c}
				/>
			))}
		</div>
	);
}

function FontSample({
	name,
	stack,
	note,
}: {
	name: string;
	stack: string;
	note: string;
}) {
	const wrapper: CSSProperties = {
		fontFamily: stack,
		padding: 20,
		border: '1px solid var(--border)',
		borderRadius: 12,
	};
	return (
		<div style={wrapper}>
			<div
				style={{
					fontSize: 12,
					letterSpacing: 1,
					textTransform: 'uppercase',
					color: 'var(--text)',
					marginBottom: 8,
				}}
			>
				{name}
			</div>
			<div style={{ fontSize: 36, fontWeight: 700, letterSpacing: 1 }}>
				SWIZZLE
			</div>
			<div style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}>
				Corpse Reviver #2
			</div>
			<p style={{ marginTop: 8, lineHeight: 1.55, color: 'var(--text)' }}>
				Equal parts gin, Cointreau, Lillet Blanc, and lemon juice with an absinthe
				rinse. Reviewed and used by bar professionals.
			</p>
			<p style={{ marginTop: 8, fontSize: 13, color: 'var(--text)' }}>{note}</p>
		</div>
	);
}

export function ThemePreviewPage() {
	const [fontStack, setFontStack] = useState<string>(FONTS[0].stack);

	return (
		<div className="mx-auto max-w-[1120px]">
			<h1 style={{ marginTop: 0 }}>Theme & Font Preview</h1>
			<p style={{ color: 'var(--text)', maxWidth: 720 }}>
				Compare four palette directions and a handful of modern sans candidates.
				Pick a font from the row below — it applies live to every theme card.
			</p>

			<fieldset
				style={{
					border: '1px solid var(--border)',
					borderRadius: 12,
					padding: '12px 16px',
					margin: '20px 0 32px',
				}}
			>
				<legend
					style={{
						padding: '0 8px',
						fontSize: 13,
						color: 'var(--text)',
						textTransform: 'uppercase',
						letterSpacing: 1,
					}}
				>
					Font
				</legend>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
					{FONTS.map((f) => {
						const checked = f.stack === fontStack;
						return (
							<label
								key={f.name}
								style={{
									display: 'inline-flex',
									alignItems: 'center',
									gap: 8,
									cursor: 'pointer',
									fontFamily: f.stack,
									fontSize: 16,
									padding: '6px 10px',
									borderRadius: 8,
									border: checked
										? '1px solid var(--accent-border)'
										: '1px solid transparent',
									background: checked ? 'var(--accent-bg)' : 'transparent',
								}}
							>
								<input
									type="radio"
									name="theme-font"
									checked={checked}
									onChange={() => setFontStack(f.stack)}
								/>
								{f.name}
							</label>
						);
					})}
				</div>
			</fieldset>

			<h2 style={{ marginTop: 0 }}>Themes</h2>
			<h3 style={{ color: 'var(--text)', fontWeight: 500 }}>
				Dark — Warm Speakeasy
			</h3>
			<ThemeWarmSpeakeasy font={fontStack} />

			<h3 style={{ color: 'var(--text)', fontWeight: 500 }}>
				Dark — Modern Editorial
			</h3>
			<ThemeModernEditorial font={fontStack} />

			<h3 style={{ color: 'var(--text)', fontWeight: 500 }}>
				Light — Cream &amp; Brass
			</h3>
			<ThemeCreamBrass font={fontStack} />

			<h3 style={{ color: 'var(--text)', fontWeight: 500 }}>
				Light — Editorial White
			</h3>
			<ThemeEditorialWhite font={fontStack} />

			<h2 style={{ marginTop: 48 }}>Font samples</h2>
			<p style={{ color: 'var(--text)' }}>
				Same content rendered in each candidate. Picks the typeface
				independently of color, so you can mix and match.
			</p>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
					gap: 16,
					marginTop: 16,
					marginBottom: 48,
				}}
			>
				{FONTS.map((f) => (
					<FontSample
						key={f.name}
						name={f.name}
						stack={f.stack}
						note={f.note}
					/>
				))}
			</div>
		</div>
	);
}
