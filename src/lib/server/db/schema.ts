import { MISSIONS } from '../../utils/constants';
import {
	bigint,
	boolean,
	date,
	int,
	mysqlTable,
	primaryKey,
	serial,
	text,
	timestamp,
	unique,
	varchar
} from 'drizzle-orm/mysql-core';
import type { AdapterAccountType } from '@auth/sveltekit/adapters';
import { relations } from 'drizzle-orm/relations';

export const targetSchema = mysqlTable('targets', {
	id: serial().primaryKey(),
	// Silly workaround for type errors
	mission: text({ enum: [MISSIONS[0], ...MISSIONS.slice(1)] }).notNull(),
	repoId: text('repo_id').notNull(),
	name: text().notNull(),
	description: text(),
	imageId: text('image_id').notNull()
});

export const contractSchema = mysqlTable(
	'contracts',
	{
		id: serial().primaryKey(),
		mission: varchar({
			length: 30,
			// Silly workaround for type errors
			enum: [MISSIONS[0], ...MISSIONS.slice(1)]
		}).notNull(),
		time: int(),
		score: int().notNull().default(-1),
		videoId: varchar('video_id', { length: 11 }).notNull(),
		videoTimestamp: int('video_timestamp').notNull().default(0),
		contractRunner: text('contract_runner').notNull(),
		dateUploaded: date('date_uploaded').notNull(),
		gameId: text('game_id'),
		platform: text({ enum: ['epic', 'steam', 'xbox', 'playstation', 'switch'] }),
		userSubmitted: varchar('user_submitted', { length: 255 }).references(() => userSchema.id),
		dateAdded: timestamp('date_added').defaultNow(),
		verified: boolean().notNull().default(true)
	},
	(table) => [unique('unique_contract_id').on(table.mission, table.score, table.videoId)]
);

export const targetContractEntrySchema = mysqlTable('target_contract_entries', {
	id: serial().primaryKey(),
	targetId: bigint('target_id', { mode: 'number', unsigned: true })
		.notNull()
		.references(() => targetSchema.id),
	contractId: bigint('contract_id', { mode: 'number', unsigned: true })
		.notNull()
		.references(() => contractSchema.id, { onDelete: 'cascade' }),
	killMethod: text('kill_method')
});

// AUTH SCHEMAS
export const userSchema = mysqlTable('user', {
	id: varchar('id', { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: varchar('name', { length: 255 }),
	global_name: varchar('global_name', { length: 255 }),
	username: varchar('username', { length: 255 }),
	admin: boolean().default(false),
	email: varchar('email', { length: 255 }).unique(),
	emailVerified: timestamp('emailVerified', {
		mode: 'date',
		fsp: 3
	}),
	image: varchar('image', { length: 255 })
});

export const accountSchema = mysqlTable(
	'account',
	{
		userId: varchar('userId', { length: 255 })
			.notNull()
			.references(() => userSchema.id, { onDelete: 'cascade' }),
		type: varchar('type', { length: 255 }).$type<AdapterAccountType>().notNull(),
		provider: varchar('provider', { length: 255 }).notNull(),
		providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
		refresh_token: varchar('refresh_token', { length: 255 }),
		access_token: varchar('access_token', { length: 255 }),
		expires_at: int('expires_at'),
		token_type: varchar('token_type', { length: 255 }),
		scope: varchar('scope', { length: 255 }),
		id_token: varchar('id_token', { length: 2048 }),
		session_state: varchar('session_state', { length: 255 })
	},
	(account) => [
		primaryKey({
			columns: [account.provider, account.providerAccountId]
		})
	]
);

export const sessionSchema = mysqlTable('session', {
	sessionToken: varchar('sessionToken', { length: 255 }).primaryKey(),
	userId: varchar('userId', { length: 255 })
		.notNull()
		.references(() => userSchema.id, { onDelete: 'cascade' }),
	expires: timestamp('expires', { mode: 'date' }).notNull()
});

// RELATIONS Mostly generated from drizzle-kit pull

export const accountRelations = relations(accountSchema, ({ one }) => ({
	user: one(userSchema, {
		fields: [accountSchema.userId],
		references: [userSchema.id]
	})
}));

export const userRelations = relations(userSchema, ({ many }) => ({
	accounts: many(accountSchema),
	sessions: many(sessionSchema)
}));

export const sessionRelations = relations(sessionSchema, ({ one }) => ({
	user: one(userSchema, {
		fields: [sessionSchema.userId],
		references: [userSchema.id]
	})
}));

export const targetContractEntryRelations = relations(targetContractEntrySchema, ({ one }) => ({
	contract: one(contractSchema, {
		fields: [targetContractEntrySchema.contractId],
		references: [contractSchema.id]
	}),
	target: one(targetSchema, {
		fields: [targetContractEntrySchema.targetId],
		references: [targetSchema.id]
	})
}));

export const contractRelations = relations(contractSchema, ({ many }) => ({
	targetContractEntries: many(targetContractEntrySchema)
}));

export const targetRelations = relations(targetSchema, ({ many }) => ({
	targetContractEntries: many(targetContractEntrySchema)
}));
