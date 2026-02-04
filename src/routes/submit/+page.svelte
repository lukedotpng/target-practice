<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Target } from '$lib/types/db';
	import { MAIN_MISSIONS, SIDE_MISSIONS } from '$lib/utils/constants';
	import { FormatMission } from '$lib/utils/formatting';
	import { fade } from 'svelte/transition';

	let { form } = $props();

	let missionInput = $state<string>();
	function OnChangeMission() {
		targetsAdded = [];
	}

	let minutesInput = $state<number>();
	let secondsInput = $state<number>();
	function HandleTimeInput(
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		let restrictedString = e.currentTarget.value.slice(0, 2);
		if (parseInt(restrictedString) > 59) {
			restrictedString = '59';
		}
		if (parseInt(restrictedString) < 0) {
			restrictedString = '0';
		}
		e.currentTarget.value = restrictedString;
	}

	let targetsAdded = $state<Target[]>([]);
	function AddTarget(targetToAdd: Target) {
		if (targetsAdded.filter((target) => target.id === targetToAdd.id).length > 0) {
			console.error('Error: Target has already been added');
		} else {
			targetsAdded.push(targetToAdd);
		}
		targetSearchInput = '';
		targetsDatalistPromise = undefined;
	}
	function RemoveTarget(targetToRemove: Target) {
		const targetToRemoveIndex = targetsAdded.findIndex(
			(targetAdded) => targetAdded.id === targetToRemove.id
		);
		if (targetToRemoveIndex === -1) {
			console.error('Error: Could not find target to remove: ', targetToRemove);
			return;
		}
		let updatedTargetsAdded = [
			...targetsAdded.slice(0, targetToRemoveIndex),
			...targetsAdded.slice(targetToRemoveIndex + 1)
		];
		targetsAdded = updatedTargetsAdded;
	}
	let targetSearchInput = $state<string>();
	let targetsDatalistPromise = $state<Promise<Target[]>>();
	let targetsListFetchIntervalRef: NodeJS.Timeout | null = null;
	function OnTargetSearchInput(
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		if (targetsListFetchIntervalRef) {
			clearTimeout(targetsListFetchIntervalRef);
		}
		const searchQuery = e.currentTarget.value;
		targetsListFetchIntervalRef = setTimeout(() => {
			if (!missionInput || searchQuery === '') {
				targetsDatalistPromise = undefined;
				return;
			}
			targetsDatalistPromise = fetch(
				'/api/targets/' + missionInput + '/search?query=' + searchQuery
			).then((res) => res.json()) as Promise<Target[]>;
			console.log('fetching content with query:', searchQuery);
		}, 200);
	}

	function PreventFromSubmissionOnEnter(
		e: KeyboardEvent & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		if (e.key === 'Enter') e.preventDefault();
	}

	let formUpdatePopupActive = $state(false);

	let maxDateInput = new Date().toISOString().split('T')[0];
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
				console.log('ENHANCE');
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
			<div class="input-container mission">
				<div class="label-container">
					<label for="mission">Mission</label>
				</div>
				<select
					bind:value={missionInput}
					onchange={OnChangeMission}
					id="mission"
					name="mission"
					required
				>
					<option disabled selected value="">--Select Mission--</option>
					<optgroup label="Main Missions">
						{#each MAIN_MISSIONS as mission (mission)}
							<option value={mission}>{FormatMission(mission)}</option>
						{/each}
					</optgroup>
					<optgroup label="Side Missions">
						{#each SIDE_MISSIONS as mission (mission)}
							<option value={mission}>{FormatMission(mission)}</option>
						{/each}
					</optgroup>
				</select>
				{#if missionInput === ''}
					<p class="warning-text">Select a mission before adding targets</p>
				{/if}
			</div>
			<div class="input-container targets">
				<div class="label-container">
					<label for="target-search">Targets</label>
				</div>
				<input
					type="text"
					id="target-search"
					bind:value={targetSearchInput}
					oninput={OnTargetSearchInput}
					onkeydown={PreventFromSubmissionOnEnter}
					disabled={missionInput === ''}
					placeholder="Add target..."
				/>
				<ul class="target-options-list">
					{#await targetsDatalistPromise}
						<li class="target-option-list-item message">
							<div class="info">
								<p>Fetching targets...</p>
							</div>
						</li>
					{:then targetsDatalist}
						{#each targetsDatalist as target (target.id)}
							<li
								class={[
									'target-option-list-item',
									targetsAdded.filter((addedTarget) => target.id === addedTarget.id).length === 1
										? 'added'
										: ''
								]}
							>
								<div class="info">
									<span class="name">{target.name}</span>
									<span class="description">{target.description}</span>
								</div>
								<button type="button" class="add-target" onclick={() => AddTarget(target)}>
									Add
								</button>
							</li>
						{/each}
						{#if targetsDatalist === undefined || targetSearchInput === ''}
							<li class="target-option-list-item hide-list"></li>
						{:else if targetsDatalist && targetsDatalist.length === 0}
							<li class="target-option-list-item message">
								<div class="info">
									<p>Found no targets</p>
								</div>
							</li>
						{/if}
					{:catch}
						<li class="target-option-list-item message">
							<div class="info">
								<p>Error finding targets</p>
							</div>
						</li>
					{/await}
				</ul>
				{#if targetsAdded.length > 0}
					<div class="targets-container">
						<ul class="targets-list">
							{#each targetsAdded as target (target.repoId)}
								<li class="targets-list-item" aria-describedby="removetargetdescription">
									<button type="button" onclick={() => RemoveTarget(target)}>
										<p>{target.name}</p>
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
											<!--! Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2025 Fonticons, Inc. -->
											<path
												d="M262.2 48C248.9 48 236.9 56.3 232.2 68.8L216 112L120 112C106.7 112 96 122.7 96 136C96 149.3 106.7 160 120 160L520 160C533.3 160 544 149.3 544 136C544 122.7 533.3 112 520 112L424 112L407.8 68.8C403.1 56.3 391.2 48 377.8 48L262.2 48zM128 208L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 208L464 208L464 512C464 520.8 456.8 528 448 528L192 528C183.2 528 176 520.8 176 512L176 208L128 208zM288 280C288 266.7 277.3 256 264 256C250.7 256 240 266.7 240 280L240 456C240 469.3 250.7 480 264 480C277.3 480 288 469.3 288 456L288 280zM400 280C400 266.7 389.3 256 376 256C362.7 256 352 266.7 352 280L352 456C352 469.3 362.7 480 376 480C389.3 480 400 469.3 400 456L400 280z"
											/>
										</svg>
									</button>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
				{#each targetsAdded as target (target.id)}
					<input type="number" name="targets" value={target.id} hidden />
				{/each}
			</div>
			<div class="input-container video">
				<div class="label-container">
					<label for="video_url">
						Video URL
						<span class="video-url-warning">*Currently only supports YouTube</span>
					</label>
				</div>
				<input
					type="url"
					id="video_url"
					name="video_url"
					required
					placeholder="youtube.com/watch?v=L2KBq_nCRIc"
					onkeydown={PreventFromSubmissionOnEnter}
				/>
			</div>
			<div class="input-container contract-runner">
				<div class="label-container">
					<label for="contract-runner">Contract Runner</label>
				</div>
				<input
					type="text"
					id="contract-runner"
					name="contract-runner"
					required
					placeholder="Agent..."
					onkeydown={PreventFromSubmissionOnEnter}
				/>
			</div>
			<div class="input-container time">
				<fieldset>
					<legend>Time</legend>
					<input
						bind:value={minutesInput}
						oninput={HandleTimeInput}
						type="number"
						name="minutes"
						id="minutes"
						max="59"
						min="0"
						maxlength="2"
						placeholder="mm"
						onkeydown={PreventFromSubmissionOnEnter}
					/>
					<span>:</span>
					<input
						bind:value={secondsInput}
						oninput={HandleTimeInput}
						type="number"
						name="seconds"
						id="seconds"
						max="59"
						min="0"
						maxlength="2"
						placeholder="ss"
						onkeydown={PreventFromSubmissionOnEnter}
						required
					/>
				</fieldset>
			</div>
			<div class="input-container date-uploaded">
				<div>
					<label for="date-uploaded">Date Uploaded</label>
				</div>
				<input
					type="date"
					name="date_uploaded"
					id="date-uploaded"
					placeholder="mm/dd/yyyy"
					max={maxDateInput}
					required
				/>
			</div>
			<button class="submit" type="submit">Submit</button>

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

	input {
		padding: 0.1rem 0.1rem;
		&::placeholder {
			font-style: italic;
		}
	}

	input[type='number'] {
		&::-webkit-outer-spin-button,
		&::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}

		-moz-appearance: textfield;
		appearance: textfield;
	}

	.form-container {
		position: relative;
		max-width: 40rem;
		margin: auto;
		margin-top: 3rem;
		margin-bottom: 3rem;

		& > h2 {
			text-align: center;
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
		border: 2px solid var(--text-color);
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
		background-color: var(--base-color-2);
		border: 2px solid var(--text-color);
		border-radius: 5px;
		padding: 0 0.5rem;
	}

	.input-container {
		margin: 0.5rem 0;
	}

	.input-container.mission {
		& select {
			max-width: 100%;
		}
		& .warning-text {
			font-size: var(--step--1);
			font-style: italic;
			color: var(--error-color);
		}
	}

	.input-container.targets {
		width: 80%;
		@media (width < 400px) {
			width: 100%;
		}
		position: relative;
		padding: 0.2rem 0;

		& > input {
			width: 100%;
			position: relative;
			z-index: 10;
		}

		& > input:disabled {
			cursor: not-allowed;
		}

		& .target-options-list {
			position: absolute;
			width: calc(100% - 1rem);
			z-index: 5;
			margin: 0 0.5rem;
			padding: 0 0.5rem;
			background-color: var(--base-color-2);
			border: 2px solid var(--text-color);
			border-top: none;
			border-radius: 0 0 5px 5px;
			box-shadow: 0px 0px 8px var(--text-color);
			min-height: 2rem;
			list-style: none;

			&:has(> .hide-list) {
				display: none;
			}

			& > .target-option-list-item {
				display: flex;
				align-items: center;
				min-height: 3.25rem;
				&.message {
					min-height: 2rem;
					& p {
						text-align: center;
					}
				}
				border-top: 2px solid var(--text-color);
				&:first-child {
					border: none;
				}
				&.added .info {
					text-decoration: line-through;
				}
				& .info {
					flex: 1;

					& .name {
						display: block;
						font-size: var(--step-0);
						margin: 0;
						padding: 0;
					}

					& .description {
						font-size: var(--step--1);
						display: block;
					}
				}
				&.added > .add-target {
					display: none;
				}
				& .add-target {
					padding: 0.2rem 0.3rem;
					height: 100%;
					border: 1px solid var(--text-color);
					border-radius: 3px;
					background-color: var(--base-color-3);
					&:hover {
						background-color: var(--secondary-color);
					}
				}
			}
		}
	}

	.targets-container {
		margin-top: 0.25rem;

		& > .targets-list {
			padding-left: 1.5rem;

			& > .targets-list-item {
				height: 100%;
				&:first-child {
					margin-top: 0;
				}
				margin: 0.5rem 0;

				& > button {
					display: flex;
					align-items: center;
					gap: 0.5rem;
					background: none;
					border: none;

					&:hover > p {
						text-decoration: line-through;
					}

					& > svg {
						width: calc(var(--step-0) + 0.15rem);
						fill: var(--text-color);
					}
					&:hover > svg {
						fill: var(--secondary-color);
					}
				}
			}
		}
	}

	.input-container.video {
		width: 80%;
		@media (width < 400px) {
			width: 100%;
		}

		& > input {
			width: 100%;
		}

		& .video-url-warning {
			font-size: var(--step--1);
			font-style: italic;
		}
	}

	.input-container.contract-runner {
		width: 80%;
		@media (width < 400px) {
			width: 100%;
		}

		& > input {
			width: 100%;
		}
	}

	.input-container.time {
		display: flex;
		flex-direction: column;

		& fieldset {
			border: none;
		}

		& input {
			width: 3rem;
			text-align: center;
		}
	}

	.submit {
		display: block;
		margin: 0.5rem auto;
		margin-top: 1.5rem;
		padding: 0.1rem 2rem;
		border: 1px solid var(--text-color);
		border-radius: 3px;
		background-color: var(--base-color-3);
		&:hover {
			background-color: var(--secondary-color);
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
