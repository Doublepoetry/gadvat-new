import type { GalleryImage } from './types';

// Dev-only stand-in until `npm run commons:sync` writes real gallery data.
// Real Commons files and metadata for Torna (fort 244), fetched by hand.
export const mockGalleries: Record<string, GalleryImage[]> = {
	'244': [
		{
			file: 'A view of fort torna in monsoon.jpg',
			src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/A_view_of_fort_torna_in_monsoon.jpg/1280px-A_view_of_fort_torna_in_monsoon.jpg',
			width: 1280,
			height: 720,
			alt: 'Torna fort wrapped in monsoon cloud and green slopes',
			caption: 'Torna in the monsoon',
			captionMarathi: 'पावसाळ्यातील तोरणा',
			credit: 'Pushpak14795',
			license: 'CC BY-SA 4.0',
			licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:A_view_of_fort_torna_in_monsoon.jpg'
		},
		{
			file: 'Battlements of torna fort.jpg',
			src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Battlements_of_torna_fort.jpg/1280px-Battlements_of_torna_fort.jpg',
			width: 1280,
			height: 960,
			alt: 'Stone battlements along the edge of Torna fort',
			caption: 'Battlements on the main ridge',
			captionMarathi: 'मुख्य धारेवरील तटबंदी',
			credit: 'Dheelar khan',
			license: 'CC BY-SA 4.0',
			licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Battlements_of_torna_fort.jpg'
		},
		{
			file: 'Budhla Machi.jpg',
			src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Budhla_Machi.jpg/1280px-Budhla_Machi.jpg',
			width: 1280,
			height: 720,
			alt: 'Budhla Machi, a long spur of Torna, seen from above',
			credit: 'Sopan Patil',
			license: 'CC BY-SA 4.0',
			licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
			sourceUrl: 'https://commons.wikimedia.org/wiki/File:Budhla_Machi.jpg'
		},
		{
			file: 'A view of torna fort from Zunjar machi.jpg',
			src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/A_view_of_torna_fort_from_Zunjar_machi.jpg/1280px-A_view_of_torna_fort_from_Zunjar_machi.jpg',
			width: 1280,
			height: 720,
			alt: 'Torna summit seen across the valley from Zunjar Machi',
			caption: 'Torna from Zunjar Machi',
			captionMarathi: 'झुंजार माचीवरून तोरणा',
			credit: 'Pushpak14795',
			license: 'CC BY-SA 4.0',
			licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
			sourceUrl:
				'https://commons.wikimedia.org/wiki/File:A_view_of_torna_fort_from_Zunjar_machi.jpg'
		},
		{
			file: 'A view of Zunjar machi from torna fort.jpg',
			src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/A_view_of_Zunjar_machi_from_torna_fort.jpg/1280px-A_view_of_Zunjar_machi_from_torna_fort.jpg',
			width: 1280,
			height: 2276,
			alt: 'Zunjar Machi and its walls dropping away below the fort',
			caption: 'Looking down on Zunjar Machi',
			credit: 'Pushpak14795',
			license: 'CC BY-SA 4.0',
			licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
			sourceUrl:
				'https://commons.wikimedia.org/wiki/File:A_view_of_Zunjar_machi_from_torna_fort.jpg'
		}
	]
};
