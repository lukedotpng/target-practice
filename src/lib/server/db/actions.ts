import type { ContractInsert, TargetContractEntryInsert } from '$lib/types/db';
import { db } from '.';
import { contractSchema, targetContractEntrySchema } from './schema';

type InsertContractResponse =
	| {
			success: true;
	  }
	| { success: false; errorMessage: string };

export async function InsertContract(
	contractData: ContractInsert,
	targetIds: number[]
): Promise<InsertContractResponse> {
	console.log('contractData:', contractData);
	console.log('targets:', targetIds);

	let contractInsertRes: {
		id: number;
	}[];
	try {
		contractInsertRes = await db
			.insert(contractSchema)
			.values({
				mission: contractData.mission,
				time: contractData.time,
				videoUrl: contractData.videoUrl,
				dateUploaded: contractData.dateUploaded
			})
			.$returningId();
	} catch (e) {
		if (e && typeof e === 'object' && 'message' in e) {
			console.error('INSERT CONTRACT:', e.message);
		} else {
			console.error('INSERT CONTRACT:', e);
		}
		return { success: false, errorMessage: 'Failed to insert contract data' };
	}

	if (contractInsertRes.length === 0) {
		return { success: false, errorMessage: 'Failed to insert contract data' };
	}

	const targetContractEntries: TargetContractEntryInsert[] = [];
	for (const id of targetIds) {
		targetContractEntries.push({
			targetId: id,
			contractId: contractInsertRes[0].id
		});
	}
	try {
		await db.insert(targetContractEntrySchema).values(targetContractEntries);
	} catch (e) {
		if (e && typeof e === 'object' && 'message' in e) {
			console.error('INSERT CONTRACT:', e.message);
		} else {
			console.error('INSERT CONTRACT:', e);
		}
		return { success: false, errorMessage: 'Failed to insert target data' };
	}

	return { success: true };
}
