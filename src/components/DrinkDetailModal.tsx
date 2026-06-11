import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { UnitToggle } from "./atoms/UnitToggle";
import { Modal } from "./atoms/Modal";
import { IngredientList } from "./IngredientList";
import { MetaCell } from "./atoms/MetaCell";
import type { Drink } from "../types/drink";
import { drinkPhotoImgProps } from "../lib/drinkImageAttrs";
import { SvgIcon } from "./atoms/SvgIcon";
import { formatGarnish, formatIce, formatMethod } from "../lib/drinkDisplay";
import { glassIconName, iceIconName, methodIconName } from "../lib/metaIcons";
import { slideVariants, useDrinkNavigation } from "../hooks/useDrinkNavigation";

type Props = {
  drink: Drink;
  onClose: () => void;
  drinks?: Drink[]; // Ordered list the drink belongs to, enabling prev/next navigation.
  onNavigate?: (drink: Drink) => void; // Called with the neighbouring drink when navigating.
};

export function DrinkDetailModal({
  drink,
  onClose,
  drinks,
  onNavigate,
}: Props) {
  const [metric, setMetric] = useState(false);
  const { direction, swipeHandlers } = useDrinkNavigation(
    drink,
    drinks,
    onNavigate,
  );

  const ingredients = drink.ingredients ?? [];
  const imageUrl = drink.imageUrl?.trim();
  const methodStr = formatMethod(drink);
  const garnishStr = formatGarnish(drink);
  const iceStr = formatIce(drink);

  return (
    <Modal onClose={onClose} ariaLabelledBy="drink-detail-title">
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={drink.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.16, ease: "easeOut" }}
          className="flex w-full min-w-0 flex-row flex-wrap overflow-hidden"
          {...swipeHandlers}
        >
          <div
            className={[
              "relative min-w-0 overflow-hidden bg-[linear-gradient(145deg,#2a2438,#1a1720)]",
              "w-full flex-[1_1_100%]",
              "min-h-30 max-h-[min(48svh,380px)]",
              "sm:min-h-35 sm:max-h-[min(52svh,440px)]",
              "md:flex-[1_1_300px] md:max-h-none md:min-h-70",
              "lg:min-h-[min(52vh,420px)] lg:flex-[1_1_340px]",
            ].join(" ")}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`Photo of ${drink.name}`}
                className="block h-full max-h-[inherit] min-h-0 w-full object-cover object-center"
                width={560}
                height={560}
                {...drinkPhotoImgProps}
                fetchPriority="high"
              />
            ) : null}
            {/* todo set fallback drink image here instead of null */}
          </div>
          <div
            className={[
              "relative box-border flex-[1_1_300px] text-smoke dark:text-sand",
              "border-t border-chalk dark:border-charcoal px-4 py-3",
              "text-sm leading-snug",
              "md:border-l md:border-t-0 md:px-5 md:py-4 md:text-[15px] md:leading-normal",
              "lg:px-6 lg:py-5 lg:text-base",
            ].join(" ")}
          >
            <button
              type="button"
              onClick={onClose}
              className={[
                "absolute right-2 top-2 z-10 flex h-9 w-9 cursor-pointer items-center justify-center",
                "rounded-md border border-transparent bg-transparent leading-none text-ink dark:text-cream",
                "transition-colors hover:bg-chalk dark:hover:bg-carbon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass/50",
              ].join(" ")}
              aria-label="Close dialog"
            >
              <SvgIcon icon="close" size={20} />
            </button>

            <header className="text-center">
              <h2
                id="drink-detail-title"
                className="mb-6 px-11 text-lg font-medium uppercase tracking-wide text-ink dark:text-cream sm:text-xl md:text-2xl"
              >
                {drink.name}
              </h2>
              <div
                className="mt-2 grid grid-cols-4 items-start gap-2 text-xs"
                role="group"
                aria-label="Preparation"
              >
                <MetaCell
                  label="Method"
                  textValue={methodStr}
                  iconName={methodIconName(drink.method)}
                />
                <MetaCell
                  label="Glass"
                  textValue={drink.glass ?? ""}
                  iconName={glassIconName(drink.glass)}
                />
                <MetaCell
                  label="Ice"
                  textValue={iceStr}
                  iconName={iceIconName(drink.ice)}
                />
                <MetaCell label="Garnish" textValue={garnishStr} />
              </div>
            </header>

            <div className="relative mt-4">
              <UnitToggle
                metric={metric}
                onChange={setMetric}
                className="absolute -top-10 -right-1"
              />
              <IngredientList
                ingredients={ingredients}
                metric={metric}
                onNavigateAway={onClose}
              />
            </div>

            {drink.description ? (
              <small className="mt-3 block text-xs leading-relaxed text-smoke dark:text-sand opacity-95 md:mt-4 md:text-sm">
                {drink.description}
              </small>
            ) : null}
          </div>
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
}
