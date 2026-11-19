<script lang="ts">
	import type { Contract } from '$lib/types';
	import { signOut } from '@auth/sveltekit/client';
	import ContractSubmission from './components/ContractSubmission.svelte';

	let { form, data } = $props();

	let contractVideos = $state<Contract[]>(data.contractData);
	let loading = $state(false);
	function FetchVideos() {
		loading = true;
		fetch('/api/contracts?show=unverified')
			.then((res) => res.json())
			.then((data) => {
				contractVideos = data;
				loading = false;
				return data;
			});
	}
</script>

<main>
	<div class="sub-header">
		<div>
			<button onclick={FetchVideos}>Fetch Videos</button>
		</div>
		<div class="account">
			<button onclick={() => signOut()}>Sign Out</button>
		</div>
	</div>

	{#if loading}
		<p>Loading...</p>
	{/if}
	<section class="submissions">
		{#if contractVideos === undefined}
			<p>Search for a target to find videos!</p>
		{:else if contractVideos.length > 0}
			{#each contractVideos as contract (contract.id)}
				<ContractSubmission {contract} {form} />
			{/each}
		{/if}
	</section>
</main>

<style>
	main {
		font-family: 'DM Sans', sans-serif;
	}

	.sub-header {
		display: flex;
		justify-content: space-between;
		margin: 0.25rem;

		button {
			padding: 0.25rem 0.5rem;
			&:hover {
				cursor: pointer;
				text-decoration: underline;
			}
		}
	}
</style>
