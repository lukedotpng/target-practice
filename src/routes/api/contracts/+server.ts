import { db } from '$lib/server/db';
import { contractSchema } from '$lib/server/db/schema.js';
import { json } from '@sveltejs/kit';
import { and, eq, SQL } from 'drizzle-orm';

export async function GET({ url }) {
	let showQuery = url.searchParams.get('show');
	const showQueryOptions = ['all', 'verified', 'unverified'];
	if (showQuery === null || !showQueryOptions.includes(showQuery.toLowerCase())) {
		showQuery = 'verified';
	} else {
		showQuery = showQuery.toLowerCase();
	}

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
		where: and(...filters),
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
