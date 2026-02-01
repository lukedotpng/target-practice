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
	videoUrl: text('video_url').notNull(),
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
