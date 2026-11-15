import { db } from '$lib/server/db';
import { contractSchema, targetContractEntrySchema } from '$lib/server/db/schema.js';
import { error, json } from '@sveltejs/kit';
import { countDistinct, eq, inArray } from 'drizzle-orm';

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

	const exclusiveSearchQuery = url.searchParams.get('exclusive');
	let exclusiveSearch = false;
	if (exclusiveSearchQuery !== null && exclusiveSearchQuery === 'true') {
		exclusiveSearch = true;
	}

	if (targetIds.length === 0) {
		return error(400, 'Could not read list of targets');
	}

	const targetContractEntrySelect = exclusiveSearch
		? db
				.select({ contractId: targetContractEntrySchema.contractId })
				.from(targetContractEntrySchema)
				.where(inArray(targetContractEntrySchema.targetId, targetIds))
				.groupBy(targetContractEntrySchema.contractId)
				.having(eq(countDistinct(targetContractEntrySchema.targetId), targetIds.length))
		: db
				.select({ contractId: targetContractEntrySchema.contractId })
				.from(targetContractEntrySchema)
				.where(inArray(targetContractEntrySchema.targetId, targetIds));

	const contractData = await db.query.contractSchema.findMany({
		where: inArray(contractSchema.id, targetContractEntrySelect),
		with: {
			targetContractEntries: {
				with: {
					target: true
				}
			}
		}
	});

	return json(contractData);
}
