import { fail } from '@sveltejs/kit';
import * as z from 'zod';

import type { Actions } from './$types';
import { MISSIONS } from '$lib/utils/constants';
import { GetYoutubeVideoId } from '$lib/utils/formatting';
import { InsertContract } from '$lib/server/db/actions';

const ContractZ = z.object({
	mission: z.literal(MISSIONS),
	targets: z.array(z.coerce.number()).min(1, 'Must provide at least one target'),
	videoUrl: z.stringFormat(
		'youtube-url',
		(value) => {
			return GetYoutubeVideoId(value) !== null;
		},
		{ error: 'Invalid video URL' }
	),
	contractRunner: z.string().min(1),
	minutes: z.coerce.number().max(59).min(0),
	seconds: z.coerce.number().max(59).min(0),
	time: z.coerce.number(),
	dateUploaded: z.iso.date()
});

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const parsedForm = z.safeParse(ContractZ, {
			mission: formData.get('mission'),
			targets: formData.getAll('targets'),
			videoUrl: formData.get('video_url'),
			contractRunner: formData.get('contract-runner'),
			minutes: formData.get('minutes'),
			seconds: formData.get('seconds'),
			time: formData.get('time'),
			dateUploaded: formData.get('date_uploaded')
		});

		if (!parsedForm.success) {
			const errorTree = z.treeifyError(parsedForm.error);
			let errorMessage = '';
			if (errorTree.properties) {
				for (const prop of Object.entries(errorTree.properties)) {
					console.log(prop[0] + ':', prop[1].errors[0]);
					errorMessage += '🞴 ' + prop[1].errors[0] + '\n';
				}
			}
			if (errorMessage === '') {
				errorMessage = 'Unknown parsing error occured';
			}

			return fail(400, {
				success: false,
				errorMessage: errorMessage
			});
		}

		const time = parsedForm.data.minutes * 60 + parsedForm.data.seconds;

		const videoUrl = new URL(parsedForm.data.videoUrl);
		const timestampParam = videoUrl.searchParams.get('t');
		let timestamp = 0;
		if (timestampParam && parseInt(timestampParam)) {
			timestamp = parseInt(timestampParam);
		}

		const videoId = GetYoutubeVideoId(parsedForm.data.videoUrl);
		if (!videoId) {
			return fail(400, {
				success: false,
				errorMessage: 'Failed to read video url'
			});
		}

		const res = await InsertContract(
			{
				mission: parsedForm.data.mission,
				time: time,
				videoId: videoId,
				videoTimestamp: timestamp,
				contractRunner: parsedForm.data.contractRunner,
				dateUploaded: parsedForm.data.dateUploaded
			},
			parsedForm.data.targets
		);

		if (!res.success) {
			return fail(400, {
				success: false,
				errorMessage: res.errorMessage
			});
		}

		return {
			success: true
		};
	}
} satisfies Actions;
