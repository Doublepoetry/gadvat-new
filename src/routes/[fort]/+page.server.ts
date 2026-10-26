import { getFort } from '#lib/data';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const fort = await getFort(params.fort);

	if (!fort) {
		error(404, 'Fort not found');
	}

	return {
		fort
	};
};
