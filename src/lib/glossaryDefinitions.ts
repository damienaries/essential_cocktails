/**
 * Editorial content for glossary entries.
 *
 * Phase A: hardcoded by `glossarySlug(name)` key. Add new entries below as you
 * write them. No code changes needed elsewhere.
 *
 * Migration to Firestore (Phase B+) is a swap: same shape, replace the lookup
 * function with one that reads from a `glossary/{slug}` collection.
 */

export type RecipeBlock = {
	yield?: string;
	ingredients: string[];
	steps: string[];
	notes?: string;
};

export type GlossaryDefinition = {
	/** One-line blurb shown directly under the entry name. */
	definition?: string;
	/** Optional recipe rendered in a collapsible block. */
	recipe?: RecipeBlock;
};

/**
 * Keys are normalized via the same slug helper used for deep-linking
 * (`glossarySlug(name)`: lowercased, accent-stripped, hyphen-separated).
 *
 * Definitions are written from common bartending references. Verify against
 * a producer site (or Difford's / IBA) before quoting any specifics in user
 * communications.
 */
const ENTRIES: Record<string, GlossaryDefinition> = {
	// ── MODIFIERS ────────────────────────────────────────────────────────────
	aperol: {
		definition:
			'Italian aperitif, lighter and sweeter than Campari, with notes of rhubarb and gentian. About 11% ABV. Used in the Aperol Spritz.',
	},
	benedictine: {
		definition:
			'French herbal liqueur made on a brandy base with 27 herbs and spices. Produced in Fécamp, Normandy since 1863.',
	},
	campari: {
		definition:
			'Italian bitter aperitif (amaro), bright red, made with herbs and citrus peels. Created in 1860 by Gaspare Campari.',
	},
	cointreau: {
		definition:
			'French triple sec made from sweet and bitter orange peels. About 40% ABV. The premium reference for triple sec in classic cocktails.',
	},
	'creme-de-cacao': {
		definition:
			'Chocolate liqueur made with cacao beans and vanilla. Comes in white (clear) and dark (brown) versions.',
	},
	'creme-de-violette': {
		definition:
			'Violet liqueur, deep purple, made from macerated violet petals. The defining ingredient of the Aviation cocktail.',
	},
	'dry-curacao': {
		definition:
			'Aged orange liqueur of Dutch origin, drier and more complex than triple sec. Often used in Mai Tais and classic punches; Pierre Ferrand is a benchmark.',
	},
	'dry-vermouth': {
		definition:
			'A drier aromatized fortified wine, about 17–18% ABV. Used in the Martini and many stirred drinks.',
	},
	'elderflower-cordial': {
		definition:
			'Non-alcoholic sweet syrup made from elderflower blossoms, sugar, lemon, and water. Provides floral sweetness; St-Germain liqueur is the alcoholic equivalent.',
	},
	'fernet-branca': {
		definition:
			'Italian amaro, intensely bitter with menthol and herbal notes. About 39% ABV. Known as the "bartender\'s handshake".',
	},
	'fino-sherry': {
		definition:
			'The driest style of sherry, aged under a layer of yeast called flor. Pale, briny, yeasty. About 15% ABV.',
	},
	'green-chartreuse': {
		definition:
			'Herbal French liqueur made by Carthusian monks since 1764, with 130 botanicals. 55% ABV (110 proof). Strong vegetal and herbal flavor.',
	},
	lillet: {
		definition:
			'French aromatized wine aperitif from Bordeaux, made with wine and citrus liqueurs. The original "Kina Lillet" (quinine-bitter) was discontinued in 1986.',
	},
	'lillet-white': {
		definition:
			'White version of Lillet (Lillet Blanc), the most common today. Light, slightly sweet, with honey and citrus notes. About 17% ABV.',
	},
	maraschino: {
		definition:
			'Italian cherry liqueur made from sour Marasca cherries and their pits. Dry and nutty despite the name. Luxardo is the reference brand.',
	},
	'pimm-s': {
		definition:
			"English gin-based liqueur with herbs, spices, and citrus. About 25% ABV. The base of the Pimm's Cup.",
	},
	'punt-e-mes': {
		definition:
			'Italian sweet vermouth (Carpano) with an extra bitter, quinine-forward character. Name means "point and a half" in Piedmontese.',
	},
	'ruby-port': {
		definition:
			'Fortified Portuguese wine in its youngest, fruitiest style. Deep red, sweet, with fresh-fruit notes. About 19–22% ABV.',
	},
	'sweet-vermouth': {
		definition:
			'Aromatized fortified wine sweetened with sugar and infused with herbs and spices. Used in the Manhattan and Negroni.',
	},
	'triple-sec': {
		definition:
			'Generic category of clear orange liqueurs, distilled from dried orange peels. Sweetness and quality vary widely; Cointreau is the premium standard.',
	},

	// ── SYRUPS (definition + recipe where home-makeable) ─────────────────────
	'agave-syrup': {
		definition:
			'Sweetener made from agave plant nectar. Commercial agave nectar is thick; bartenders dilute it for easier mixing.',
		recipe: {
			yield: 'About 200 ml',
			ingredients: ['100 ml light agave nectar', '100 ml warm water'],
			steps: [
				'Stir agave into warm water until fully combined.',
				'Bottle, refrigerate. Lasts about 2 weeks.',
			],
		},
	},
	'demerara-syrup': {
		definition:
			'Demerara sugar dissolved in water at a 2:1 ratio. Adds molasses depth; often paired with aged spirits.',
		recipe: {
			yield: 'About 300 ml',
			ingredients: ['400 g demerara sugar', '200 ml water'],
			steps: [
				'Combine in a saucepan over low heat.',
				'Stir until fully dissolved. Do not boil.',
				'Cool, bottle, refrigerate. Lasts about 3 weeks.',
			],
		},
	},
	falernum: {
		definition:
			'Spiced syrup from the Caribbean with almond, lime, clove, and ginger. Comes alcoholic (~11% ABV) or non-alcoholic; tiki essential.',
		recipe: {
			yield: 'About 500 ml',
			ingredients: [
				'250 ml overproof white rum (e.g. Wray & Nephew)',
				'Zest of 9 limes',
				'40 whole cloves',
				'2 inches fresh ginger, peeled and grated',
				'40 raw almonds, toasted and crushed',
				'250 ml fresh lime juice',
				'250 g caster sugar',
			],
			steps: [
				'Combine rum, lime zest, cloves, ginger, and almonds in a jar.',
				'Seal and steep at room temperature for 24 hours, shaking occasionally.',
				'Strain through fine mesh, then through coffee filter.',
				'Stir in lime juice and sugar until sugar dissolves.',
				'Bottle, refrigerate. Lasts about 1 month.',
			],
			notes:
				'Based on Paul Clarke / Cocktail Chronicles tradition. Yields a moderately alcoholic falernum (~11% ABV).',
		},
	},
	'ginger-syrup': {
		definition:
			'Syrup made from fresh ginger and sugar. Used in mules, the Penicillin, and Dark & Stormy variants.',
		recipe: {
			yield: 'About 250 ml',
			ingredients: [
				'120 ml fresh ginger juice (from ~250 g ginger, juiced)',
				'120 g caster sugar',
			],
			steps: [
				'Whisk sugar into ginger juice until fully dissolved.',
				'Let stand 30 minutes for solids to settle.',
				'Strain off the foam at the top.',
				'Bottle, refrigerate. Lasts about 1 week.',
			],
			notes:
				'Best with a juicer. No-juicer method: simmer 1 cup sliced ginger with 1 cup water + 1 cup sugar for 5 minutes, steep 1 hour, strain.',
		},
	},
	grenadine: {
		definition:
			'Pomegranate-based syrup, historically deep red with real pomegranate flavor. Most supermarket versions are artificial; home-made is dramatically better.',
		recipe: {
			yield: 'About 400 ml',
			ingredients: [
				'250 ml pure pomegranate juice (unsweetened)',
				'250 g caster sugar',
				'1 tsp orange flower water (optional)',
			],
			steps: [
				'Combine pomegranate juice and sugar in a saucepan over low heat.',
				'Stir until sugar dissolves. Do not boil.',
				'Off heat, stir in orange flower water.',
				'Cool, bottle, refrigerate. Lasts about 3 weeks.',
			],
		},
	},
	'honey-syrup': {
		definition:
			"Honey thinned with warm water (typically 3:1) so it pours and mixes cleanly. Used in the Bee's Knees, Gold Rush, Penicillin.",
		recipe: {
			yield: 'About 200 ml',
			ingredients: ['150 g honey', '50 ml warm water'],
			steps: [
				'Stir honey into warm water until fully combined.',
				'Bottle, refrigerate. Lasts about 1 month.',
			],
			notes:
				'A 3:1 honey:water ratio keeps the honey flavor dominant. Use a milder honey unless you want the flavor to lead the drink.',
		},
	},
	orgeat: {
		definition:
			'Almond syrup with orange flower water. Tiki essential; defines the Mai Tai and Trinidad Sour.',
		recipe: {
			yield: 'About 500 ml',
			ingredients: [
				'250 g raw almonds',
				'500 ml water',
				'400 g caster sugar',
				'15 ml orange flower water',
				'15 ml vodka or brandy (preservative)',
			],
			steps: [
				'Toast almonds in a dry pan until fragrant. Cool.',
				'Pulse in a blender until coarsely ground.',
				'Add water, blend on high for 1–2 minutes.',
				'Strain through fine mesh, then squeeze through cheesecloth to extract almond milk.',
				'Combine almond milk with sugar in a saucepan over low heat.',
				'Stir until dissolved. Do not boil.',
				'Off heat, stir in orange flower water and vodka.',
				'Bottle, refrigerate. Lasts about 2 weeks.',
			],
			notes:
				"Orange flower water varies in intensity; start with 10 ml and adjust to taste. Don Lee's recipe in PDT Cocktail Book is a good benchmark.",
		},
	},
	'simple-syrup': {
		definition:
			'Sugar dissolved in equal parts water. The standard bartender sweetener.',
		recipe: {
			yield: 'About 250 ml',
			ingredients: ['200 g caster sugar', '200 ml hot water'],
			steps: [
				'Stir sugar into hot (not boiling) water until fully dissolved.',
				'Cool, bottle, refrigerate. Lasts about 2 weeks.',
			],
		},
	},

	// ── TINCTURES (definition + recipe) ──────────────────────────────────────
	'chili-tincture': {
		definition:
			'Neutral spirit infused with chilies, used by the drop to add heat without diluting the drink.',
		recipe: {
			yield: 'About 100 ml',
			ingredients: [
				'2–3 small dried chilies (e.g. árbol or Thai), or 1 fresh',
				'100 ml high-proof neutral vodka (40%+ ABV)',
			],
			steps: [
				'Lightly crush dried chilies (or slice the fresh one).',
				'Combine with vodka in a small jar.',
				'Steep at room temperature for 24–72 hours, tasting daily.',
				'Strain when the heat reaches the level you want. Bottle in a dasher.',
			],
			notes:
				'Start with one or two dashes per drink. Tinctures intensify over time; pull the chilies as soon as the heat is right.',
		},
	},
	'saline-solution': {
		definition:
			'A 20% salt-in-water solution dosed by the drop. Sharpens citrus and rounds bitter aperitifs.',
		recipe: {
			yield: 'About 50 ml',
			ingredients: ['10 g fine sea salt', '40 ml warm water'],
			steps: [
				'Stir salt into warm water until fully dissolved.',
				'Bottle in a dasher. Keeps indefinitely refrigerated.',
			],
			notes: 'A few drops per drink. Too much and the cocktail tastes salty.',
		},
	},
};

export function lookupGlossaryDefinition(
	slug: string,
): GlossaryDefinition | null {
	return ENTRIES[slug] ?? null;
}
