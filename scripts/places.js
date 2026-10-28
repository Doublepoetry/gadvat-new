// Lookup tables and derived fields shared with the original site
// (Doublepoetry/Gadvat index.html), so the rewrite shows the same values.

export const TYPES = {
	'Hill Fort': 'गिरिदुर्ग',
	'Sea Fort': 'जलदुर्ग',
	'Coastal Fort': 'सागरी किनारा',
	'Land Fort': 'भुईकोट'
};

export const REGIONS = {
	Konkan: 'कोकण',
	'Western Maharashtra': 'पश्चिम महाराष्ट्र',
	'North Maharashtra': 'उत्तर महाराष्ट्र',
	Marathwada: 'मराठवाडा',
	Vidarbha: 'विदर्भ',
	'Outside Maharashtra': 'महाराष्ट्राबाहेर'
};

export const DISTRICTS = {
	Ahilyanagar: 'अहिल्यानगर',
	Akola: 'अकोला',
	Amravati: 'अमरावती',
	Beed: 'बीड',
	Bhandara: 'भंडारा',
	Buldhana: 'बुलढाणा',
	Chandrapur: 'चंद्रपूर',
	'Chhatrapati Sambhajinagar': 'छत्रपती संभाजीनगर',
	Dharashiv: 'धाराशिव',
	Dhule: 'धुळे',
	Gadchiroli: 'गडचिरोली',
	Gondia: 'गोंदिया',
	Hingoli: 'हिंगोली',
	Jalgaon: 'जळगाव',
	Jalna: 'जालना',
	Kolhapur: 'कोल्हापूर',
	Latur: 'लातूर',
	Mumbai: 'मुंबई',
	Nagpur: 'नागपूर',
	Nanded: 'नांदेड',
	Nandurbar: 'नंदुरबार',
	Nashik: 'नाशिक',
	Palghar: 'पालघर',
	Parbhani: 'परभणी',
	Pune: 'पुणे',
	Raigad: 'रायगड',
	Ratnagiri: 'रत्नागिरी',
	Sangli: 'सांगली',
	Satara: 'सातारा',
	Sindhudurg: 'सिंधुदुर्ग',
	Solapur: 'सोलापूर',
	Thane: 'ठाणे',
	Wardha: 'वर्धा',
	Washim: 'वाशिम',
	Yavatmal: 'यवतमाळ',
	'North Goa (Goa)': 'उत्तर गोवा'
};

// close: pin checked; approx: near the fort; rough: may be some way off; none: not on the map.
export const LOCATION_ACCURACY = ['close', 'approx', 'rough', 'none'];

/** Great-circle distance in km between two [lat, lon] pairs. */
export function km(a, b) {
	const r = (x) => (x * Math.PI) / 180;
	const dLat = r(b[0] - a[0]);
	const dLon = r(b[1] - a[1]);
	const s =
		Math.sin(dLat / 2) ** 2 + Math.cos(r(a[0])) * Math.cos(r(b[0])) * Math.sin(dLon / 2) ** 2;
	return 12742 * Math.asin(Math.sqrt(s));
}

/** The five closest located forts, nearest first. */
export function nearbyForts(fort, forts, count = 5) {
	if (!fort.coordinates) return [];
	return forts
		.filter((o) => o.id !== fort.id && o.coordinates)
		.map((o) => ({ id: o.id, km: Math.round(km(fort.coordinates, o.coordinates) * 10) / 10 }))
		.sort((a, b) => a.km - b.km)
		.slice(0, count);
}

/**
 * Base village and address line from an OpenStreetMap (Nominatim) address,
 * the same way the original site's formatAddr() does it.
 */
export function formatAddress(district, a) {
	if (!a) return null;
	const base =
		a.hamlet || a.village || a.isolated_dwelling || a.town || a.suburb || a.neighbourhood || a.city;
	if (!base) return null;
	const parent =
		a.hamlet && a.village && a.village !== base
			? a.village
			: (a.suburb || a.neighbourhood) === base
				? a.town || a.city
				: '';
	const taluka = a.county
		? a.county.replace(/\s*Subdistrict$/i, ' Taluka').replace(/\s*Tahsil$/i, ' Taluka')
		: '';
	const dist = (a.state_district || '').replace(/\s*District$/i, '') || district;
	const parts = [parent, taluka, dist ? dist + ' District' : '', 'Maharashtra'].filter(Boolean);
	return { base, line: parts.join(', ') + (a.postcode ? ' ' + a.postcode : '') };
}
