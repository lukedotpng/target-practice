import type { ContractInsert, ContractUpdate, TargetContractEntryInsert } from '$lib/types';
import { eq } from 'drizzle-orm';
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

export async function UpdateContract(contractData: ContractUpdate) {
	let errorMessage = 'Failed to update contract';

	if (contractData.id === undefined) {
		return { success: false, errorMessage: 'Contract data missing id' };
	}

	try {
		await db
			.update(contractSchema)
			.set({
				score: contractData.score,
				videoId: contractData.videoId,
				videoTimestamp: contractData.videoTimestamp,
				contractRunner: contractData.contractRunner,
				verified: contractData.verified
			})
			.where(eq(contractSchema.id, contractData.id));
	} catch (e) {
		if (e && typeof e === 'object' && 'message' in e) {
			console.error('UPDATED CONTRACT:', e.message);
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
			console.error('UPDATE CONTRACT:', e);
		}
		return { success: false, errorMessage: errorMessage };
	}

	return { success: true };
}

export async function UpdateTargetKillMethod(targetEntryId: number, killMethod: string) {
	let errorMessage = 'Failed to update target kill';
	try {
		await db
			.update(targetContractEntrySchema)
			.set({
				killMethod: killMethod
			})
			.where(eq(targetContractEntrySchema.id, targetEntryId));
	} catch (e) {
		if (e && typeof e === 'object' && 'message' in e) {
			console.error('UPDATED TARGET ENTRY:', e.message);
			if ('cause' in e && e.cause && typeof e.cause === 'object' && 'code' in e.cause) {
				errorMessage = e.cause.code + ': Failed to update kill method';
			}
		} else {
			console.error('UPDATE TARGET ENTRY:', e);
		}
		return { success: false, errorMessage: errorMessage };
	}

	return { success: true };
}
