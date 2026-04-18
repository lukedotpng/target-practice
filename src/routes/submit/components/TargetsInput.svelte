<script lang="ts">
	import type { Target } from '$lib/types';
	import { PreventSubmissionOnEnter } from '$lib/utils/helpers';

	type TargetsInputProps = {
		targetsAdded: Target[];
		missionInput: string;
	};

	let { targetsAdded = $bindable([]), missionInput }: TargetsInputProps = $props();

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
</script>

<div class="input-container targets">
	<div class="label-container">
		<label for="target-search">Targets</label>
	</div>
	<input
		type="text"
		id="target-search"
		bind:value={targetSearchInput}
		oninput={OnTargetSearchInput}
		onkeydown={PreventSubmissionOnEnter}
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
				<li class="target-option-list-item">
					<div class="info">
						<span class="name">{target.name}</span>
						<span class="description">{target.description}</span>
					</div>
					<button type="button" class="add-target" onclick={() => AddTarget(target)}> Add </button>
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

<style>
	.input-container.targets {
		margin: 0.5rem 0;
		width: 80%;
		@media (width < 400px) {
			width: 100%;
		}
		position: relative;
		/*padding: 0.2rem 0;*/

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
						fill: var(--error-color);
					}
				}
			}
		}
	}
</style>
