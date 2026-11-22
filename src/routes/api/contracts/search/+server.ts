import { GetDrizzleConnection } from '$lib/server/db/index.js';
import { contractSchema, targetContractEntrySchema } from '$lib/server/db/schema.js';
import { error, json } from '@sveltejs/kit';
import { and, countDistinct, eq, inArray, SQL } from 'drizzle-orm';

export async function GET({ url, platform }) {
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

	let showQuery = url.searchParams.get('show');
	const showQueryOptions = ['all', 'verified', 'unverified'];
	if (showQuery === null || !showQueryOptions.includes(showQuery.toLowerCase())) {
		showQuery = 'verified';
	} else {
		showQuery = showQuery.toLowerCase();
	}

	const exclusiveSearchQuery = url.searchParams.get('exclusive');
	let exclusiveSearch = false;
	if (exclusiveSearchQuery !== null && exclusiveSearchQuery === 'true') {
		exclusiveSearch = true;
	}

	if (targetIds.length === 0) {
		return error(400, 'Could not read list of targets');
	}

	if (platform === undefined) {
		return error(500, 'No platform context');
	}

	const db = await GetDrizzleConnection(platform);

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

	const filters: SQL[] = [];
	switch (showQuery) {
		case 'all':
			break;
		case 'verified':
			filters.push(eq(contractSchema.verified, true));
			break;
		case 'unverified':
			filters.push(eq(contractSchema.verified, false));
			break;
	}

	const contractData = await db.query.contractSchema.findMany({
		where: and(inArray(contractSchema.id, targetContractEntrySelect), ...filters),
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
