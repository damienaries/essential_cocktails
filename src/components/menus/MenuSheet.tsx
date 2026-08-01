import { formatIngredientNames } from '../../lib/drinkDisplay';
import { glassIconName, iceIconName, methodIconName } from '../../lib/metaIcons';
import type { Drink } from '../../types/drink';
import { SvgIcon } from '../atoms/SvgIcon';

/** Drinks that fit one page at a readable size. Beyond this a second page opens. */
export const MENU_PAGE_CAPACITY = 6;

/** A folded sheet has two sides, so this is the point where the type starts to crowd. */
export const MENU_SHEET_CAPACITY = MENU_PAGE_CAPACITY * 2;

type Props = {
	name: string;
	drinks: Drink[];
	/**
	 * Marks this sheet as the one to print. The menus index renders several sheets
	 * as previews; without this the print stylesheet couldn't tell which is which.
	 */
	printable?: boolean;
};

function DrinkEntry({ drink }: { drink: Drink }) {
	const icons = [
		methodIconName(drink.method),
		glassIconName(drink.glass),
		iceIconName(drink.ice),
	].filter((icon): icon is string => Boolean(icon));

	return (
		<li className="menu-sheet-drink">
			<div className="menu-sheet-drink-name">{drink.name}</div>
			{icons.length ? (
				<div className="menu-sheet-drink-icons" aria-hidden>
					{icons.map((icon) => (
						<SvgIcon key={icon} icon={icon} size={24} />
					))}
				</div>
			) : null}
			<p className="menu-sheet-drink-ingredients">
				{formatIngredientNames(drink)}
			</p>
		</li>
	);
}

/** One printed page — half of the folded sheet when there are two. */
function SheetPage({ name, drinks }: { name: string; drinks: Drink[] }) {
	return (
		<div className="menu-sheet-page">
			<div className="menu-sheet-frame">
				<h2 className="menu-sheet-title">{name}</h2>
				<hr className="menu-sheet-rule" />
				{drinks.length ? (
					<ul className="menu-sheet-drinks">
						{drinks.map((drink) => (
							<DrinkEntry key={drink.id} drink={drink} />
						))}
					</ul>
				) : (
					<p className="menu-sheet-empty">No drinks on this menu yet</p>
				)}
			</div>
		</div>
	);
}

/**
 * A printable menu. One page until the drinks outgrow it; past that it becomes a US
 * Letter sheet in landscape, folded down the middle, with the list running across
 * both halves. Pages are never duplicates of each other.
 */
export function MenuSheet({ name, drinks, printable = false }: Props) {
	const spread = drinks.length > MENU_PAGE_CAPACITY;
	// Anything past two pages keeps piling onto the second rather than vanishing.
	const pages = spread
		? [drinks.slice(0, MENU_PAGE_CAPACITY), drinks.slice(MENU_PAGE_CAPACITY)]
		: [drinks];

	return (
		<section
			className={[
				'menu-sheet',
				spread ? 'menu-sheet--spread' : 'menu-sheet--single',
				printable ? 'menu-sheet-print' : '',
			].join(' ')}
			aria-label={`${name} menu`}>
			{pages.map((pageDrinks, index) => (
				<SheetPage
					key={index === 0 ? 'front' : 'back'}
					name={name}
					drinks={pageDrinks}
				/>
			))}
			{spread ? <div className="menu-sheet-fold" aria-hidden /> : null}
		</section>
	);
}
