import { db } from '$lib/server/db';
import { targetSchema, targetContractEntrySchema } from '$lib/server/db/schema.js';
import { error, json } from '@sveltejs/kit';
import { and, count, eq, like, notInArray } from 'drizzle-orm';

export async function GET({ params, url }) {
	const filterQuery = url.searchParams.get('query');
	if (!filterQuery) {
		return error(400, 'Must provide a search query');
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

	const targetData = await db
		.select({
			id: targetSchema.id,
			mission: targetSchema.mission,
			repoId: targetSchema.repoId,
			name: targetSchema.name,
			description: targetSchema.description,
			imageId: targetSchema.imageId,
			contractCount: count(targetContractEntrySchema.id)
		})
		.from(targetSchema)
		.leftJoin(targetContractEntrySchema, eq(targetContractEntrySchema.targetId, targetSchema.id))
		.where(
			and(
				eq(targetSchema.mission, params.mission),
				like(targetSchema.name, `%${filterQuery}%`),
				notInArray(targetSchema.id, excludedTargets)
			)
		)
		.groupBy(targetSchema.id)
		.limit(10);

	return json(targetData);
}
