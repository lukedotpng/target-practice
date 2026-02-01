import { db } from '$lib/server/db';
import { targetSchema } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
	const targetData = await db
		.select()
		.from(targetSchema)
		.where(eq(targetSchema.mission, params.mission));

	return json(targetData);
}
