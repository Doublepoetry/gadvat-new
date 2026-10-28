import { getAllForts, getDistrictNames } from '#lib/data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [forts, districtNames] = await Promise.all([getAllForts(), getDistrictNames()]);

	return {
		forts,
		districtNames
	};
};
