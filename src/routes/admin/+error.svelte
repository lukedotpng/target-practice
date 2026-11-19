<script lang="ts">
	import { page } from '$app/state';
	import { signOut } from '@auth/sveltekit/client';
</script>

<div>
	<h1>{page.error?.message ?? 'Unknown Error Occurred'}</h1>
	<button onclick={() => signOut({ redirectTo: '/' })}>Sign Out</button>
</div>

<style>
	div {
		display: grid;
		place-content: center;
		gap: 1rem;

		font-family: 'DM Sans', sans-serif;

		h1 {
			font-size: 2rem;
		}
		button {
			margin-inline: auto;
			width: 10rem;
			padding: 0.5rem;
			font-size: 1.2rem;
			&:hover {
				cursor: pointer;
				text-decoration: underline;
			}
		}
	}
</style>
