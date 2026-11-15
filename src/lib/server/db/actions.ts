import type { ContractInsert, TargetContractEntryInsert } from '$lib/types';
import { db } from '.';
import { contractSchema, targetContractEntrySchema } from './schema';

type InsertContractResponse =
	| {
			success: true;
	  }
	| { success: false; errorMessage: string };

export async function InsertContract(
	contractData: ContractInsert,
	targetIds: number[],
	targetKills: string[]
): Promise<InsertContractResponse> {
	let contractInsertRes: {
		id: number;
	}[];

	console.log('contractData:', contractData);
	let errorMessage = 'Failed to add contract';

	try {
		contractInsertRes = await db
			.insert(contractSchema)
			.values({
				mission: contractData.mission,
				score: contractData.score,
				videoId: contractData.videoId,
				videoTimestamp: contractData.videoTimestamp,
				contractRunner: contractData.contractRunner,
				dateUploaded: contractData.dateUploaded,
				userSubmitted: contractData.userSubmitted,
				dateAdded: contractData.dateAdded
			})
			.$returningId();
	} catch (e) {
		if (e && typeof e === 'object' && 'message' in e) {
			console.error('INSERT CONTRACT:', e.message);
			if ('cause' in e && e.cause && typeof e.cause === 'object' && 'code' in e.cause) {
				switch (e.cause.code) {
					case 'ER_DUP_ENTRY':
						errorMessage = 'Contract run has already been submitted';
						break;
					default:
						errorMessage = e.cause.code + ': Failed to add contract';
				}
			}
		} else {
			console.error('INSERT CONTRACT:', e);
		}
		return { success: false, errorMessage: errorMessage };
	}

	if (contractInsertRes.length === 0) {
		return { success: false, errorMessage: errorMessage };
	}

	const targetContractEntries: TargetContractEntryInsert[] = [];
	for (let i = 0; i < targetIds.length; i++) {
		targetContractEntries.push({
			targetId: targetIds[i],
			contractId: contractInsertRes[0].id,
			killMethod: targetKills[i]
		});
	}
	try {
		await db.insert(targetContractEntrySchema).values(targetContractEntries);
	} catch (e) {
		if (e && typeof e === 'object' && 'message' in e) {
			console.error('INSERT TARGETS:', e.message);
			if ('cause' in e && e.cause && typeof e.cause === 'object' && 'code' in e.cause) {
				switch (e.cause.code) {
					default:
						errorMessage = e.cause.code + ': Failed to add targets';
				}
			}
		} else {
			console.error('INSERT CONTRACT:', e);
		}
	}

	return { success: true };
}
