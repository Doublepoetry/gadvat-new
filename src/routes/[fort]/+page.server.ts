import { getAllForts, getDistrictNames } from '#lib/data';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';

// Prerender a page for every fort, not only the ones a crawl from / happens to link to.
export const entries: EntryGenerator = async () =>
	(await getAllForts()).map((fort) => ({ fort: fort.id }));

export const load: PageServerLoad = async ({ params }) => {
	const [forts, districtNames] = await Promise.all([getAllForts(), getDistrictNames()]);
	const fort = forts.find((f) => f.id === params.fort);

	if (!fort) {
		error(404, 'Fort not found');
	}

	return {
		fort,
		forts,
		districtNames
	};
};
