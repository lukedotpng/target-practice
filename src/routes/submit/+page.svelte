<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ContractTarget } from '$lib/types';
	import { fade } from 'svelte/transition';

	import MissionInput from './components/MissionInput.svelte';
	import TargetsInput from './components/TargetsInput.svelte';
	import VideoInput from './components/VideoInput.svelte';
	import ContractRunnerInput from './components/ContractRunnerInput.svelte';
	import ScoreInput from './components/ScoreInput.svelte';
	import DateInput from './components/DateInput.svelte';
	import { GetYoutubeVideoId, ScoreToTimeString } from '$lib/utils/formatting.js';

	let { form } = $props();

	let missionInput = $state<string>('');
	function OnChangeMission() {
		targetsAdded = [];
	}

	let targetsAdded = $state<ContractTarget[]>([]);
	let videoInput = $state<string>();
	let contractRunnerInput = $state<string>();
	let scoreInput = $state<number>();
	let dateInput = $state<string>();

	let formUpdatePopupActive = $state(false);

	let disableButton = $derived.by(() => {
		if (missionInput === '') {
			return true;
		}
		if (targetsAdded.length === 0) {
			return true;
		}
		if (videoInput === undefined || GetYoutubeVideoId(videoInput) === null) {
			return true;
		}
		if (contractRunnerInput === undefined) {
			return true;
		}
		if (dateInput === undefined || dateInput === '') {
			return true;
		}
		if (ScoreToTimeString(scoreInput) === 'Error No Time') {
			return true;
		}

		return false;
	});
</script>

<main>
	<div class="form-container">
		{#if formUpdatePopupActive}
			<div class="form-update-popup" out:fade={{ duration: 300 }}>
				<p>Contract Added!</p>
			</div>
		{/if}
		<h2>Contract Video Submission</h2>
		<form
			class="contract-form"
			method="POST"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === 'success') {
						targetsAdded = [];
						formUpdatePopupActive = true;
						setTimeout(() => {
							formUpdatePopupActive = false;
						}, 2000);
					}
					update();
				};
			}}
		>
			{#if form && !form.success}
				<p class="form-error-title">ERROR</p>
				<pre class="form-error-message">{form.errorMessage}</pre>
			{/if}
			<MissionInput bind:missionInput {OnChangeMission} />
			{#key missionInput}
				<TargetsInput bind:targetsAdded {missionInput} />
			{/key}
			<VideoInput bind:videoInput />
			<ContractRunnerInput bind:contractRunnerInput />
			<ScoreInput bind:scoreInput />
			<DateInput bind:dateInput />

			<button class="submit" type="submit" disabled={disableButton}>Submit</button>

			<!-- TODO SEPERATE FORM IF CONTRACT ID IS HAD -->
			<!-- CONTRACT ID -->
			<!-- PLATFORM -->
		</form>
	</div>
</main>

<style>
	main {
		font-family: 'DM Sans', sans-serif;
		font-size: var(--step-0);
		padding: 0.5rem;
	}

	.form-container {
		position: relative;
		max-width: 30rem;
		margin: auto;

		& > h2 {
			text-align: center;
			font-weight: bold;
			font-size: var(--step-1);
		}
	}

	@keyframes popup-enter {
		0% {
			transform: translateX(-50%) translateY(-100%) scale(0);
			transform-origin: center;
		}
		100% {
			transform: translateX(-50%) translateY(-100%) scale(100%);
			transform-origin: center;
		}
	}
	.form-update-popup {
		position: absolute;
		z-index: 100;
		background: var(--success-color);
		padding: 0.25rem 1rem;
		border: 2px solid var(--base-color-12);
		border-radius: 10px;
		top: 0;
		left: 50%;
		transform: translateX(-50%) translateY(-100%);

		animation: 750ms
			linear(
				0,
				0.402 7.4%,
				0.711 15.3%,
				0.929 23.7%,
				1.008 28.2%,
				1.067 33%,
				1.099 36.9%,
				1.12 41%,
				1.13 45.4%,
				1.13 50.1%,
				1.111 58.5%,
				1.019 83.2%,
				1.004 91.3%,
				1
			)
			popup-enter;
	}

	.contract-form {
		background-color: var(--base-color-4);
		border: 2px solid var(--base-color-12);
		border-radius: 5px;
		padding: 0 0.5rem;
	}

	.submit {
		display: block;
		margin: 0.5rem auto;
		margin-top: 1.5rem;
		padding: 0.1rem 2rem;
		border: 2px solid var(--base-color-8);
		border-radius: 5px;
		background-color: var(--base-color-5);
		&:hover:not(:disabled) {
			background-color: var(--primary-color);
			border-color: var(--base-color-12);
			text-shadow: 0 0 2px var(--base-color-1);
		}
		&:disabled {
			cursor: not-allowed;
			opacity: 50%;
		}
	}

	.form-error-title {
		margin-top: 0.5rem;
		text-align: center;
		color: var(--error-color);
		font-weight: bold;
	}

	.form-error-message {
		font-size: var(--step-0);
		text-align: center;
		color: var();
	}
</style>
