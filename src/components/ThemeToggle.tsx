import { SvgIcon } from './atoms/SvgIcon';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
	const { theme, toggle } = useTheme();
	const label =
		theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
	return (
		<button
			type="button"
			onClick={toggle}
			aria-label={label}
			title={label}
			className="link inline-flex items-center cursor-pointer">
			<SvgIcon icon={theme === 'dark' ? 'theme-sun' : 'theme-moon'} size={20} />
		</button>
	);
}
