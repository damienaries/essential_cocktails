import { SvgIcon } from "./SvgIcon";

type Props = {
  label: string;
  textValue: string;
  iconName?: string | null;
};

/** A single labelled preparation stat (method, glass, ice, garnish). */
export function MetaCell({ label, textValue, iconName }: Props) {
  const display = textValue.trim() === "" ? "—" : textValue;
  return (
    <div
      className="flex flex-col items-center gap-1 text-center text-smoke dark:text-sand"
      title={display}
    >
      <span className="sr-only">
        {label}: {display}
      </span>
      {iconName ? (
        <SvgIcon icon={iconName} size={40} />
      ) : (
        <span className="capitalize">{display}</span>
      )}
    </div>
  );
}
