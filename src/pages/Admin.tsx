import { DrinkAdminTable } from '../components/admin/DrinkAdminTable';
import { DrinkForm } from '../components/admin/DrinkForm';

export function AdminPage() {
	return (
		<section className="w-full pt-8 pb-16 px-4 text-left box-border">
			<h1 className="text-[var(--text-h)] text-3xl mt-0 mb-2">Admin</h1>
			<p className="text-sm text-[var(--text)] mb-8 max-w-2xl">
				Create, edit, and delete drinks in Firestore. Auth for this area will be
				added before launch. Image prompts use ChatGPT (or similar) manually; uploads
				go to Firebase Storage (<code className="text-[15px]">cocktail_images/</code>
				) when Storage rules allow it.
			</p>

			<DrinkForm mode="add" />

			<section className="text-center my-12">
				<h3 className="text-xl text-[var(--text-h)] mb-4">All drinks</h3>
				<DrinkAdminTable />
			</section>
		</section>
	);
}
