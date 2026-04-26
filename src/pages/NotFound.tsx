import { Link } from 'react-router-dom';
import notFoundIllustration from '../assets/images/404.png';

export function NotFoundPage() {
	return (
		<div
			style={{
				maxWidth: 560,
				margin: '0 auto',
				textAlign: 'center',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 20,
			}}
		>
			<img
				src={notFoundIllustration}
				alt=""
				style={{ maxWidth: 'min(100%, 480px)', height: 'auto' }}
			/>
			<div>
				<p>
					That URL doesn’t exist. Head back <Link to="/">home</Link>.
				</p>
			</div>
		</div>
	);
}
