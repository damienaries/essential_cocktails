import { DrinkAdminTable } from '../components/admin/DrinkAdminTable';
import { DrinkForm } from '../components/admin/DrinkForm';

export function AdminPage() {
	return (
		<section className="w-full pt-8 pb-16 px-4 text-left box-border">
			<h1 className="text-[var(--text-h)] text-3xl mt-0 mb-2">Admin</h1>
			<p className="text-sm text-[var(--text)] mb-8 max-w-2xl">
				Create, edit, and delete drinks in Firestore. Auth for this area will be
				added before launch. Optional: set{' '}
				<code className="text-[15px]">VITE_DRINK_IMAGE_API_URL</code> to your
				local image server (e.g.{' '}
				<code className="text-[15px]">http://localhost:3000</code>) to auto-fill
				images like the legacy Vue app.
			</p>

			<DrinkForm mode="add" />

			<section className="text-center my-12">
				<h3 className="text-xl text-[var(--text-h)] mb-4">All drinks</h3>
				<DrinkAdminTable />
			</section>
		</section>
	);
}
