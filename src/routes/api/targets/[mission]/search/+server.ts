import { db } from '$lib/server/db';
import { targetSchema } from '$lib/server/db/schema';
import { and, eq, like } from 'drizzle-orm';
import { error, json } from '@sveltejs/kit';

export async function GET({ params, url }) {
	const filterQuery = url.searchParams.get('query');
	if (!filterQuery) {
		return error(400, 'Must provide a search query');
	}

	const delay = () => new Promise((resolve) => setTimeout(resolve, 100));
	await delay();

	const targetData = await db.query.targetSchema.findMany({
		limit: 5,
		where: and(
			eq(targetSchema.mission, params.mission),
			like(targetSchema.name, `%${filterQuery}%`)
		)
	});

	return json(targetData);
}
