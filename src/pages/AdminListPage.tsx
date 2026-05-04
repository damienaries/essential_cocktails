import { DrinkAdminTable } from '../components/admin/DrinkAdminTable';

export function AdminListPage() {
	return (
		<>
			<h2 className="text-xl text-[var(--text-h)] mb-4 text-center m-0">
				All drinks
			</h2>
			<DrinkAdminTable />
		</>
	);
}
