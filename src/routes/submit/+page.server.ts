import { fail, redirect } from '@sveltejs/kit';
import * as z from 'zod';

import type { Actions, PageServerLoad } from './$types';
import { MISSIONS } from '$lib/utils/constants';
import { GetYoutubeVideoId } from '$lib/utils/formatting';
import { InsertContract } from '$lib/server/db/actions';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();

	if (!session?.user) {
		redirect(303, '/signin?redirect=submit');
	}

	return { session };
};

const ContractZ = z.object({
	mission: z.literal(MISSIONS),
	targets: z.array(z.coerce.number()).min(1, 'Must provide at least one target'),
	targetKills: z.array(z.string()).min(1, 'Must provide target kill methods'),
	videoUrl: z.stringFormat(
		'youtube-url',
		(value) => {
			return GetYoutubeVideoId(value) !== null;
		},
		{ error: 'Invalid video URL' }
	),
	contractRunner: z.string().min(1),
	score: z.coerce.number(),
	userSubmitted: z.string().min(1),
	dateUploaded: z.iso.date()
});

export const actions = {
	default: async ({ locals, request }) => {
		const formData = await request.formData();

		const session = await locals.auth();
		if (!session?.user) {
			return fail(401, {
				success: false,
				errorMessage: 'Not Authorized'
			});
		}

		const parsedForm = z.safeParse(ContractZ, {
			mission: formData.get('mission'),
			targets: formData.getAll('targets'),
			targetKills: formData.getAll('target_kills'),
			videoUrl: formData.get('video_url'),
			contractRunner: formData.get('contract-runner'),
			score: formData.get('score'),
			userSubmitted: session.user.id,
			dateUploaded: formData.get('date_uploaded')
		});

		if (!parsedForm.success) {
			const errorTree = z.treeifyError(parsedForm.error);
			let errorMessage = '';
			if (errorTree.properties) {
				for (const prop of Object.entries(errorTree.properties)) {
					console.error(prop[0] + ':', prop[1].errors[0]);
					errorMessage += '> ' + prop[1].errors[0] + '\n';
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

		const contract = {
			mission: parsedForm.data.mission,
			score: parsedForm.data.score,
			videoId: videoId,
			videoTimestamp: timestamp,
			contractRunner: parsedForm.data.contractRunner,
			dateUploaded: new Date(parsedForm.data.dateUploaded),
			userSubmitted: session.user.id
		};

		const res = await InsertContract(
			contract,
			parsedForm.data.targets,
			parsedForm.data.targetKills
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
