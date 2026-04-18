<script lang="ts">
	import { type Contract, type Target } from '$lib/types';
	import { MAIN_MISSIONS, SIDE_MISSIONS } from '$lib/utils/constants';
	import { FormatMission } from '$lib/utils/formatting';
	import ContractVideo from './components/ContractVideo.svelte';

	let missionInput = $state('');
	function OnChangeMission() {
		targetsAdded = [];
		contractVideosPromise = undefined;
	}

	let targetsAdded = $state<Target[]>([]);
	let targetSearchInput = $state<string>();
	let targetsDatalistPromise = $state<Promise<Target[]>>();
	let targetsListFetchIntervalRef: NodeJS.Timeout | null = null;

	function AddTarget(targetToAdd: Target) {
		if (targetsAdded.filter((target) => target.id === targetToAdd.id).length > 0) {
			console.error('Error: Target has already been added');
		} else {
			targetsAdded.push(targetToAdd);
		}
		targetSearchInput = '';
		targetsDatalistPromise = undefined;

		RefetchVideos();
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
		console.log(updatedTargetsAdded);

		RefetchVideos();
	}

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
			const excludedTargetIds: number[] = [];
			for (const target of targetsAdded) {
				excludedTargetIds.push(target.id);
			}
			const excludedTargetsParam = excludedTargetIds.join(',');
			targetsDatalistPromise = fetch(
				'/api/targets/' +
					missionInput +
					'/search?query=' +
					searchQuery +
					'&excluded=' +
					excludedTargetsParam
			).then((res) => res.json()) as Promise<Target[]>;
			console.log('fetching content with query:', searchQuery);
		}, 200);
	}

	let contractVideosPromise = $state<Promise<Contract[]>>();
	function RefetchVideos() {
		if (targetsAdded.length === 0 || missionInput === '') {
			contractVideosPromise = undefined;
			return;
		}
		let targetsParam = '';
		for (let i = 0; i < targetsAdded.length; i++) {
			targetsParam += targetsAdded[i].id;
			if (i < targetsAdded.length - 1) {
				targetsParam += '|';
			}
		}
		console.log(targetsParam);

		contractVideosPromise = fetch('/api/contracts/search?targets=' + targetsParam).then((res) => {
			const data = res.json();
			console.log(data);
			return data;
		});
		console.log('fetching contracts with targets:', targetsAdded);
	}
</script>

<svelte:head>
	<title>Target Practice</title>
	<meta name="description" content="Find videos for Hitman WoA targets" />
</svelte:head>

<main>
	<section class="filters">
		<div class="mission">
			<select name="mission" id="mission" bind:value={missionInput} onchange={OnChangeMission}>
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
		<div class="targets">
			<p>Add Targets</p>
			<div class="target-input-container">
				<input
					type="text"
					bind:value={targetSearchInput}
					oninput={OnTargetSearchInput}
					disabled={missionInput === ''}
					placeholder="Name..."
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
								{#if target.contractCount && target.contractCount > 0}
									<button type="button" class="add-target" onclick={() => AddTarget(target)}>
										<!--! Font Awesome Free 7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2026 Fonticons, Inc. -->
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
											<path
												d="M160 144C151.2 144 144 151.2 144 160L144 480C144 488.8 151.2 496 160 496L480 496C488.8 496 496 488.8 496 480L496 160C496 151.2 488.8 144 480 144L160 144zM96 160C96 124.7 124.7 96 160 96L480 96C515.3 96 544 124.7 544 160L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 160zM296 408L296 344L232 344C218.7 344 208 333.3 208 320C208 306.7 218.7 296 232 296L296 296L296 232C296 218.7 306.7 208 320 208C333.3 208 344 218.7 344 232L344 296L408 296C421.3 296 432 306.7 432 320C432 333.3 421.3 344 408 344L344 344L344 408C344 421.3 333.3 432 320 432C306.7 432 296 421.3 296 408z"
											/>
										</svg>
									</button>
								{:else}
									<button type="button" class="no-contracts">
										<!--! Font Awesome Free 7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2026 Fonticons, Inc. -->
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="-84 -84 680 680">
											<path
												d="M256 0c14.7 0 28.2 8.1 35.2 21l216 400c6.7 12.4 6.4 27.4-.8 39.5S486.1 480 472 480L40 480c-14.1 0-27.2-7.4-34.4-19.5s-7.5-27.1-.8-39.5l216-400c7-12.9 20.5-21 35.2-21zm0 352a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm0-192c-18.2 0-32.7 15.5-31.4 33.7l7.4 104c.9 12.5 11.4 22.3 23.9 22.3 12.6 0 23-9.7 23.9-22.3l7.4-104c1.3-18.2-13.1-33.7-31.4-33.7z"
											/>
										</svg>
									</button>
								{/if}
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
			</div>
			<ol class="targets-added-list">
				{#each targetsAdded as target (target.repoId)}
					<li class="targets-list-item" aria-describedby="removetargetdescription">
						<button type="button" onclick={() => RemoveTarget(target)}>
							<div class="info">
								<span class="name">{target.name}</span>
								<span class="description">{target.description}</span>
							</div>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
								<!--! Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2025 Fonticons, Inc. -->
								<path
									d="M262.2 48C248.9 48 236.9 56.3 232.2 68.8L216 112L120 112C106.7 112 96 122.7 96 136C96 149.3 106.7 160 120 160L520 160C533.3 160 544 149.3 544 136C544 122.7 533.3 112 520 112L424 112L407.8 68.8C403.1 56.3 391.2 48 377.8 48L262.2 48zM128 208L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 208L464 208L464 512C464 520.8 456.8 528 448 528L192 528C183.2 528 176 520.8 176 512L176 208L128 208zM288 280C288 266.7 277.3 256 264 256C250.7 256 240 266.7 240 280L240 456C240 469.3 250.7 480 264 480C277.3 480 288 469.3 288 456L288 280zM400 280C400 266.7 389.3 256 376 256C362.7 256 352 266.7 352 280L352 456C352 469.3 362.7 480 376 480C389.3 480 400 469.3 400 456L400 280z"
								/>
							</svg>
						</button>
					</li>
				{/each}
			</ol>
		</div>
	</section>
	<section class="videos">
		{#if contractVideosPromise === undefined}
			<p>Search for a target to find videos!</p>
		{/if}
		{#await contractVideosPromise}
			<p>Loading...</p>
		{:then contractVideos}
			{#each contractVideos as contract (contract.id)}
				<ContractVideo {contract} targetsSearched={targetsAdded} />
			{/each}
		{/await}
	</section>
</main>

<style>
	main {
		font-family: 'DM Sans', sans-serif;
		font-size: var(--step-0);

		display: grid;
		grid-template-columns: auto 1fr;
		@media (width <= 620px) {
			grid-template-columns: auto;
			grid-template-rows: auto 1fr;
		}
	}

	section {
		padding: 0.5rem;
	}

	.filters {
		width: 25ch;
		/*height: 100%;*/
		gap: 1rem;

		border-right: 4px solid var(--base-color-6);

		@media (width <= 620px) {
			width: 100%;
			border: none;
		}

		.mission {
			select {
				width: 100%;
			}
			.warning-text {
				font-size: var(--step--1);
				font-style: italic;
				color: var(--primary-color);
			}
		}
		.targets {
			margin-top: 1rem;
			display: grid;

			.target-input-container {
				display: grid;
				position: relative;
				> input {
					&:disabled:hover {
						cursor: not-allowed;
					}
					&:has(~ .target-options-list :not(.hide-list)) {
						border-radius: 5px 5px 0 0;
					}
					&:hover + .target-options-list {
						border-color: var(--base-color-10);
					}
					&:focus + .target-options-list {
						border-color: var(--base-color-12);
					}
				}
				.target-options-list {
					position: absolute;
					top: 100%;
					z-index: 5;
					width: 100%;
					border: 2px solid var(--base-color-8);
					border-top: none;
					border-radius: 0 0 5px 5px;
					list-style: none;

					&:has(> .hide-list) {
						display: none;
					}

					& > .target-option-list-item {
						display: grid;
						grid-template-columns: 1fr auto;
						align-items: center;
						padding: 0.25rem 0 0.25rem 0.2rem;
						border-top: 1px solid var(--base-color-8);
						background-color: var(--base-color-3);
						&:nth-child(even) {
							background-color: var(--base-color-4);
						}
						&:first-child {
							border: none;
						}
						&:last-child {
							border-radius: 0 0 3px 3px;
						}
						&.added .info {
							text-decoration: line-through;
						}
						& .info {
							& .name {
								display: block;
								font-size: var(--step-0);
								margin: 0;
								padding: 0;
							}

							& .description {
								font-size: var(--step--1);
								font-style: italic;
								display: block;
							}
						}
						&.added > button {
							display: none;
						}
						& .add-target {
							background: none;
							border: none;
							height: 2ch;
							aspect-ratio: 1/1;
							svg {
								fill: var(--text-color);
							}
							&:hover {
								cursor: pointer;
								svg {
									fill: var(--primary-color);
								}
							}
						}
						& .no-contracts {
							background: none;
							border: none;
							height: 2ch;
							aspect-ratio: 1/1;
							svg {
								fill: var(--error-color);
							}
						}
					}
				}
			}

			.targets-added-list {
				margin: 0.5rem 0;
				list-style: none;
				.targets-list-item {
					display: list-item;
					button {
						width: 100%;
						display: grid;
						grid-template-columns: 1fr auto;
						align-items: center;
						padding: 0.2rem 0;
						background-color: var(--base-color-3);
						border: none;
						border-top: 2px solid var(--base-color-6);

						&:nth-child(even) {
							background-color: var(--base-color-5);
						}
						&:first-child {
							border-radius: 3px 3px 0 0;
						}
						&:last-child {
							border-radius: 0 0 3px 3px;
						}
						.info {
							text-align: left;
							& .name {
								display: block;
								font-size: var(--step-0);
								margin: 0;
								padding: 0;
							}

							& .description {
								font-size: var(--step--2);
								font-style: italic;
								display: block;
							}
						}
						svg {
							width: 1.5ch;
							fill: var(--text-color);
						}
						&:hover {
							cursor: pointer;
							text-decoration: line-through;
							svg {
								fill: var(--error-color);
							}
						}
					}
				}
			}
		}
	}

	.videos {
		display: flex;
		flex-wrap: wrap;
		align-content: start;
		gap: 0.5rem;
	}
</style>
