import { getAllForts } from '#lib/data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const forts = await getAllForts();

	return {
		forts
	};
};
