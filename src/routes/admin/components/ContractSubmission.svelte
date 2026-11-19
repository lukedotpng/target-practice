<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Contract, TargetContractEntryWithTarget } from '$lib/types';
	import { fade } from 'svelte/transition';

	import Targets from './Targets.svelte';
	import VideoInput from './VideoInput.svelte';
	import ContractRunnerInput from './ContractRunnerInput.svelte';
	import ScoreInput from './ScoreInput.svelte';
	import DateInput from './DateInput.svelte';
	import { FormatMission, GetYoutubeVideoId, ScoreToTimeString } from '$lib/utils/formatting.js';
	import type { ActionData } from '../$types';

	type ContractSubmissionProps = {
		form: ActionData;
		contract: Contract;
	};
	let { form, contract }: ContractSubmissionProps = $props();

	let targets = $state<TargetContractEntryWithTarget[]>(contract.targetContractEntries);
	let videoInput = $state<string>(
		`https://youtube.com/watch?v=${contract.videoId}${contract.videoTimestamp > 0 ? `&t=${contract.videoTimestamp}` : ''}`
	);
	let contractRunnerInput = $state<string>(contract.contractRunner);
	let scoreInput = $state<number>(contract.score);

	let dateInput = $state<string>(new Date(contract.dateUploaded).toISOString().split('T')[0]);

	let verifiedInput = $state(contract.verified);

	let formUpdatePopupActive = $state(false);

	let disableButton = $derived.by(() => {
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

<div class="form-container">
	{#if formUpdatePopupActive}
		<div class="form-update-popup" out:fade={{ duration: 300 }}>
			<p>Contract Added!</p>
		</div>
	{/if}
	{#if form && !form.success}
		<p class="form-error-title">ERROR</p>
		<pre class="form-error-message">{form.errorMessage}</pre>
	{/if}
	<p class="mission">{FormatMission(contract.mission)}</p>
	<Targets {targets} />
	<form
		class="contract-form"
		method="POST"
		action="?/updatecontract"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success') {
					formUpdatePopupActive = true;
					setTimeout(() => {
						formUpdatePopupActive = false;
					}, 2000);
				}
			};
		}}
	>
		<VideoInput bind:videoInput />
		<ContractRunnerInput bind:contractRunnerInput />
		<ScoreInput bind:scoreInput />
		<DateInput bind:dateInput />
		<div>
			<input type="text" name="verified" id="verified" value={verifiedInput} hidden />
			<input
				type="checkbox"
				bind:checked={verifiedInput}
				name="verified-check"
				id="verified-check"
			/>
			<label for="verified-check">Verified</label>
		</div>
		<input type="text" value={contract.id} name="contract_id" id="contract_id" hidden />
		<input type="text" value={contract.mission} name="mission" id="mission" hidden />

		<button class="submit" type="submit" disabled={disableButton}>Update</button>

		<!-- TODO SEPERATE FORM IF CONTRACT ID IS HAD -->
		<!-- CONTRACT ID -->
		<!-- PLATFORM -->
	</form>
</div>

<style>
	.form-container {
		position: relative;
		max-width: 30rem;
		margin: auto;

		background-color: var(--base-color-4);
		border: 2px solid var(--base-color-12);
		border-radius: 5px;
		padding: 0 0.5rem;

		.mission {
			margin-top: 0.5rem;
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
