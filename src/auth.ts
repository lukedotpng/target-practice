import { db } from '$lib/server/db';
import { accountSchema, sessionSchema, userSchema } from '$lib/server/db/schema';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { SvelteKitAuth, type DefaultSession } from '@auth/sveltekit';
import Discord from '@auth/sveltekit/providers/discord';

declare module '@auth/sveltekit' {
	interface Session {
		user: {
			username: string;
			global_name: string;
			admin: boolean;
		} & DefaultSession['user'];
	}
	interface User {
		username: string;
		global_name: string;
		admin: boolean;
	}
}

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [
		Discord({
			authorization: { params: { scope: 'identify' } },
			issuer: 'https://discord.com',
			async profile(profile) {
				return {
					...profile,
					admin: false
				};
			}
		})
	],
	adapter: DrizzleAdapter(db, {
		usersTable: userSchema,
		accountsTable: accountSchema,
		sessionsTable: sessionSchema
	}),
	callbacks: {
		session({ session }) {
			return session;
		}
	},
	trustHost: true
});
