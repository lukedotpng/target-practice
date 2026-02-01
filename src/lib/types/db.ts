import { contractSchema, targetContractEntrySchema, targetSchema } from '$lib/server/db/schema';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type Target = InferSelectModel<typeof targetSchema>;
export type Contract = InferSelectModel<typeof contractSchema>;

export type TargetInsert = InferInsertModel<typeof targetSchema>;
export type ContractInsert = InferInsertModel<typeof contractSchema>;
export type TargetContractEntryInsert = InferInsertModel<typeof targetContractEntrySchema>;
