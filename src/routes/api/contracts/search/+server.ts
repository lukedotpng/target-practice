import { db } from '$lib/server/db';
import { error, json } from '@sveltejs/kit';

export async function GET({ url }) {
	const targetsParam = url.searchParams.get('targets');
	if (!targetsParam) {
		return error(400, 'Must provide a list of target ids');
	}

	const targetParamSplit = targetsParam.split('|');
	const targetIds: number[] = [];

	for (const targetParam of targetParamSplit) {
		const id = parseInt(targetParam);
		if (!isNaN(id)) {
			targetIds.push(id);
		}
	}

	if (targetIds.length === 0) {
		return error(400, 'Could not read list of targets');
	}

	const contractData = await db.query.contractSchema.findMany({
		where: {
			targets: {
				id: {
					in: targetIds
				}
			}
		},
		with: {
			targets: true
		}
	});

	return json(contractData);
}
