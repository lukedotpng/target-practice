import { targetSchema } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error, json } from '@sveltejs/kit';
import { GetDrizzleConnection } from '$lib/server/db';

export async function GET({ params, platform }) {
	if (platform === undefined) {
		return error(500, 'No platform context');
	}

	const db = await GetDrizzleConnection(platform);

	const targetData = await db
		.select()
		.from(targetSchema)
		.where(eq(targetSchema.mission, params.mission));

	return json(targetData);
}
