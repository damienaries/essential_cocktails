export function AboutPage() {
	return (
		<div className="mx-auto max-w-[720px] pb-[60px]">
			<h1 className="mt-0 mb-8">About Swizzle</h1>

			<section className="mb-10">
				<h2 className="mb-4">What this is</h2>
				<p>
					{/* TODO: short intro — what Swizzle is, who it's for, what problem it solves. */}
					A curated home for the cocktails worth knowing — built by bar people,
					for anyone who wants to make better drinks.
				</p>
			</section>

			<section className="mb-10">
				<h2 className="mb-4">The story</h2>
				<p>
					{/* TODO: how the idea came about — your background, what frustrated you
					    about existing cocktail apps, what you wanted to build instead. */}
					Replace this paragraph with the origin story.
				</p>
			</section>

			<section className="mb-10">
				<h2 className="mb-4">Who's behind it</h2>
				<p>
					{/* TODO: a paragraph or two about you — bar credentials, where you've
					    worked, why you're qualified to curate this. */}
					Replace this paragraph with a short bio.
				</p>
			</section>

			<section>
				<h2 className="mb-4">Get in touch</h2>
				<p>
					{/* TODO: email link, social handle, "submit a recipe" intent, etc. */}
					Have a drink to suggest, a correction, or want to collaborate? Replace
					this with a real contact path.
				</p>
			</section>
		</div>
	);
}
