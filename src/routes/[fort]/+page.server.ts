import { getAllForts } from '#lib/data';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';

// Prerender a page for every fort, not only the ones a crawl from / happens to link to.
export const entries: EntryGenerator = async () =>
	(await getAllForts()).map((fort) => ({ fort: fort.id }));

export const load: PageServerLoad = async ({ params }) => {
	// Only the id: the page reads the forts from the bundled data, like the home page
	const forts = await getAllForts();

	if (!forts.some((f) => f.id === params.fort)) {
		error(404, 'Fort not found');
	}

	return { id: params.fort };
};
