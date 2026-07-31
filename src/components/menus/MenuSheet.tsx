import { formatIngredientNames } from '../../lib/drinkDisplay';
import { glassIconName, iceIconName, methodIconName } from '../../lib/metaIcons';
import type { Drink } from '../../types/drink';
import { SvgIcon } from '../atoms/SvgIcon';

/** Drinks per half before the type starts to crowd. Used for the over-capacity hint. */
export const MENU_SHEET_CAPACITY = 10;

type Props = {
	name: string;
	drinks: Drink[];
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

/** One half of the folded sheet. Both halves render identically. */
function SheetHalf({ name, drinks }: Props) {
	return (
		<div className="menu-sheet-half">
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
 * A US Letter sheet in landscape, folded down the middle. Both halves carry the same
 * content so the folded card reads the same from either side.
 */
export function MenuSheet({ name, drinks }: Props) {
	return (
		<section className="menu-sheet" aria-label={`${name} menu`}>
			<SheetHalf name={name} drinks={drinks} />
			<div className="menu-sheet-fold" aria-hidden />
			{/* The mirrored half is decorative — the first one is already announced. */}
			<div aria-hidden className="contents">
				<SheetHalf name={name} drinks={drinks} />
			</div>
		</section>
	);
}
