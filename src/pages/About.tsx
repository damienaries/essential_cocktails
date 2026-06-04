import { ContactForm } from '../components/ContactForm';

export function AboutPage() {
	return (
		<div className="mx-auto max-w-180 pb-15">
			<h1 className="mt-0 mb-8">About Swizzle</h1>

			<section className="mb-10">
				<h2 className="mb-4">Welcome to Swizzle!</h2>
				<p>
					A home for the cocktails worth knowing, references and recipes used by
					the best bars in the world, curated for anyone who wants to elevate
					their drink game at home or professionally.
				</p>
			</section>

			<section className="mb-10 space-y-4">
				<h2 className="mb-4">The story</h2>
				<p>
					For over a decade behind the bar, I was constantly putting together
					cocktail specs for staff training. They lived on printed sheets,
					scribbled notebooks, PDFs, and shared documents that inevitably got
					wet, torn, lost, or forgotten. The goal was always the same: get
					everyone on the same page about the classics, proper technique,
					garnishes, and ingredients.
				</p>
				<p>
					Very few places I worked had a complete recipe resource that combined
					recipes, visuals, ingredient information, and practical notes in one
					place. Looking back, I realize how useful that would have been, not
					just for me but for the many bartenders I trained over the years.
				</p>
				<p>
					Swizzle is my attempt to build the resource I always wished I had: a
					simple, reliable reference for the cocktails worth knowing, whether
					you’re working behind a bar, building a home setup, or just looking
					for your next drink to make.
				</p>
			</section>

			<section>
				<h2 className="mb-4">Get in touch</h2>
				<p className="mb-6 text-smoke dark:text-sand">
					Have a drink to suggest, a correction to a recipe, or want to
					collaborate? Drop a line below.
				</p>
				<ContactForm />
			</section>
		</div>
	);
}
