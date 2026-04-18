import { defineRelations } from 'drizzle-orm';
import { MISSIONS } from '../../utils/constants';
import { bigint, boolean, int, mysqlTable, serial, text } from 'drizzle-orm/mysql-core';

export const targetSchema = mysqlTable('targets', {
	id: serial().primaryKey(),
	// Silly workaround for type errors
	mission: text({ enum: [MISSIONS[0], ...MISSIONS.slice(1)] }).notNull(),
	repoId: text('repo_id').notNull(),
	name: text().notNull(),
	description: text(),
	imageId: text('image_id').notNull()
});

export const contractSchema = mysqlTable('contracts', {
	id: serial().primaryKey(),
	mission: text({
		// Silly workaround for type errors
		enum: [MISSIONS[0], ...MISSIONS.slice(1)]
	}).notNull(),
	time: int().notNull(),
	videoId: text('video_id').notNull(),
	videoTimestamp: int('video_timestamp').notNull().default(0),
	contractRunner: text('contract_runner').notNull(),
	dateUploaded: text('date_uploaded').notNull(),
	gameId: text('game_id'),
	platform: text({ enum: ['epic', 'steam', 'xbox', 'playstation', 'switch'] }),
	visible: boolean().notNull().default(true)
});

export const targetContractEntrySchema = mysqlTable('target_contract_entries', {
	id: serial().primaryKey(),
	targetId: bigint('target_id', { mode: 'number', unsigned: true })
		.notNull()
		.references(() => targetSchema.id),
	contractId: bigint('contract_id', { mode: 'number', unsigned: true })
		.notNull()
		.references(() => contractSchema.id)
});

export const relations = defineRelations(
	{ targetSchema, contractSchema, targetContractEntrySchema },
	(r) => ({
		targetSchema: {
			contracts: r.many.contractSchema({
				from: r.targetSchema.id.through(r.targetContractEntrySchema.targetId),
				to: r.contractSchema.id.through(r.targetContractEntrySchema.contractId)
			})
		},
		contractSchema: {
			targets: r.many.targetSchema({
				from: r.contractSchema.id.through(r.targetContractEntrySchema.contractId),
				to: r.targetSchema.id.through(r.targetContractEntrySchema.targetId)
			})
		}
	})
);
