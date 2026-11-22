import { drizzle } from 'drizzle-orm/mysql2';
import { createConnection } from 'mysql2/promise';
import * as schema from './schema';

export async function GetDrizzleConnection(platform: App.Platform) {
	const connection = await createConnection({
		host: platform.env.HYPERDRIVE.host,
		user: platform.env.HYPERDRIVE.user,
		password: platform.env.HYPERDRIVE.password,
		database: platform.env.HYPERDRIVE.database,
		port: platform.env.HYPERDRIVE.port,

		// Required to enable mysql2 compatibility for Workers
		disableEval: true
	});

	// Create the Drizzle client with the mysql2 driver connection
	const db = drizzle(connection, { schema, mode: 'default' });
	return db;
}
