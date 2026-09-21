<script lang="ts">
	import { signIn, signOut } from '@auth/sveltekit/client';

	const { data } = $props();
</script>

<main>
	{#if !data.session}
		<button onclick={() => signIn()}>Sign In</button>
	{:else}
		<h1>Hello, {data.session.user?.global_name}</h1>
		<button onclick={() => signOut()}>Sign Out</button>
	{/if}
</main>

<style>
	main {
		display: grid;
		place-content: center;

		font-family: 'DM Sans', sans-serif;
	}

	h1 {
		font-size: var(--step-5);
	}
</style>
