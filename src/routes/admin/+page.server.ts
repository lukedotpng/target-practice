import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { GetYoutubeVideoId } from '$lib/utils/formatting';
import { MISSIONS } from '$lib/utils/constants';
import z from 'zod';
import { UpdateContract, UpdateTargetKillMethod } from '$lib/server/db/actions';
import { db } from '$lib/server/db';
import { contractSchema } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();

	if (!session?.user) {
		redirect(303, '/signin?redirect=admin');
	}

	if (!session.user.admin) {
		error(401, 'Not Authorized');
	}

	const contractData = await db.query.contractSchema.findMany({
		where: eq(contractSchema.verified, false),
		with: {
			targetContractEntries: {
				with: {
					target: true
				}
			}
		}
	});

	return { session, contractData };
};

const ContractZ = z.object({
	id: z.coerce.number(),
	mission: z.literal(MISSIONS),
	videoUrl: z.stringFormat(
		'youtube-url',
		(value) => {
			return GetYoutubeVideoId(value) !== null;
		},
		{ error: 'Invalid video URL' }
	),
	contractRunner: z.string().min(1),
	score: z.coerce.number(),
	verified: z.stringbool()
});

const TargetZ = z.object({
	targetEntryId: z.coerce.number(),
	killMethod: z.string().min(1)
});

export const actions = {
	updatecontract: async ({ locals, request }) => {
		const formData = await request.formData();

		const session = await locals.auth();
		if (!session?.user) {
			return fail(401, {
				success: false,
				errorMessage: 'Not Authorized'
			});
		}

		const parsedForm = z.safeParse(ContractZ, {
			id: formData.get('contract_id'),
			mission: formData.get('mission'),
			videoUrl: formData.get('video_url'),
			contractRunner: formData.get('contract-runner'),
			score: formData.get('score'),
			verified: formData.get('verified')
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
			id: parsedForm.data.id,
			mission: parsedForm.data.mission,
			score: parsedForm.data.score,
			videoId: videoId,
			videoTimestamp: timestamp,
			contractRunner: parsedForm.data.contractRunner,
			verified: parsedForm.data.verified
		};

		const res = await UpdateContract(contract);

		if (!res.success) {
			return fail(400, {
				success: false,
				errorMessage: res.errorMessage
			});
		}

		return {
			success: true
		};
	},
	updatetarget: async ({ locals, request }) => {
		const formData = await request.formData();

		const session = await locals.auth();
		if (!session?.user) {
			return fail(401, {
				success: false,
				errorMessage: 'Not Authorized'
			});
		}

		const parsedForm = z.safeParse(TargetZ, {
			targetEntryId: formData.get('targetEntryId'),
			killMethod: formData.get('killMethod')
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

		const res = await UpdateTargetKillMethod(
			parsedForm.data.targetEntryId,
			parsedForm.data.killMethod
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
