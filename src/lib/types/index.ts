import { contractSchema, targetContractEntrySchema, targetSchema } from '$lib/server/db/schema';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type TargetInsert = InferInsertModel<typeof targetSchema>;
export type ContractInsert = InferInsertModel<typeof contractSchema>;
export type TargetContractEntryInsert = InferInsertModel<typeof targetContractEntrySchema>;

export type TargetSelect = InferSelectModel<typeof targetSchema>;
export type ContractSelect = InferSelectModel<typeof contractSchema>;

export type Target = TargetSelect & { contractCount?: number };
export type Contract = ContractSelect & { targets: Target[] };
