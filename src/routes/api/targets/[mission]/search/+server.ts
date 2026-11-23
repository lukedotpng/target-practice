import { GetDrizzleConnection } from '$lib/server/db';
import { targetSchema, targetContractEntrySchema, contractSchema } from '$lib/server/db/schema.js';
import { error, json } from '@sveltejs/kit';
import { and, count, eq, like, max, min, notInArray, sql } from 'drizzle-orm';

export async function GET({ params, url, platform }) {
	const filterQuery = url.searchParams.get('query');
	if (!filterQuery) {
		return error(400, 'Must provide a search query');
	}

	const ignoreContractsQuery = url.searchParams.get('ignorecontracts');
	let ignoreContracts = false;
	if (ignoreContractsQuery !== null && ignoreContractsQuery === 'true') {
		ignoreContracts = true;
	}

	const excludedTargetsParam = url.searchParams.get('excluded');
	const excludedTargets: number[] = [];
	if (excludedTargetsParam) {
		const excludedTargetsSplit = excludedTargetsParam.split(',');
		for (const targetIdAsString of excludedTargetsSplit) {
			const targetId = parseInt(targetIdAsString);
			if (!isNaN(targetId)) {
				excludedTargets.push(targetId);
			}
		}
	}

	if (platform === undefined) {
		return error(500, 'No platform context');
	}

	const db = await GetDrizzleConnection(platform);

	const orderBySql = ignoreContracts
		? sql`locate(${filterQuery},${targetSchema.name}), ${targetSchema.name}`
		: sql`CASE WHEN max(${contractSchema.verified}) = 1 THEN count(${targetContractEntrySchema.id}) ELSE 0 END desc, locate(${filterQuery},${targetSchema.name}), ${targetSchema.name}`;

	const targetData = await db
		.select({
			id: targetSchema.id,
			mission: targetSchema.mission,
			repoId: targetSchema.repoId,
			name: targetSchema.name,
			description: targetSchema.description,
			imageId: targetSchema.imageId,
			contractCount: count(targetContractEntrySchema.id),
			contractVerified: max(contractSchema.verified)
		})
		.from(targetSchema)
		.leftJoin(targetContractEntrySchema, eq(targetContractEntrySchema.targetId, targetSchema.id))
		.where(
			and(
				eq(targetSchema.mission, params.mission),
				notInArray(targetSchema.id, excludedTargets),
				like(targetSchema.name, `%${filterQuery}%`)
			)
		)
		.groupBy(targetSchema.id)
		.orderBy(orderBySql)
		.limit(10)
		.leftJoin(contractSchema, eq(targetContractEntrySchema.contractId, contractSchema.id));

	return json(targetData);
}
