import { Link } from 'react-router-dom';
import notFoundIllustration from '../assets/images/404.png';

export function NotFoundPage() {
	return (
		<div className="mx-auto flex max-w-[560px] flex-col items-center gap-5 text-center">
			<img
				src={notFoundIllustration}
				alt="Page not found"
				width={1536}
				height={1024}
				className="h-auto max-w-[min(100%,480px)]"
			/>
			<div>
				<p>
					That URL doesn’t exist. Head back <Link to="/">home</Link>.
				</p>
			</div>
		</div>
	);
}
