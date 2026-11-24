<script lang="ts">
	import type { Contract, Target } from '$lib/types';
	import { ScoreToTimeString } from '$lib/utils/formatting';

	type ContractVideoProps = {
		contract: Contract;
		targetsSearched: Target[];
		AddTarget: (targetToAdd: Target) => void;
		RemoveTarget: (targetToAdd: Target) => void;
	};
	let { contract, targetsSearched, AddTarget, RemoveTarget }: ContractVideoProps = $props();

	function TargetSearchedFor(target: Target) {
		return targetsSearched.some((targetSearched: Target) => {
			if (target.id === targetSearched.id) {
				return true;
			}
			return false;
		});
	}
</script>

<div class="contract">
	<div class="header">
		<p>{ScoreToTimeString(contract.score)}s by {contract.contractRunner}</p>
	</div>
	<iframe
		class="video"
		title="Contract"
		src={'https://www.youtube-nocookie.com/embed/' +
			contract.videoId +
			'?color=white&start=' +
			contract.videoTimestamp}
		frameborder="0"
		allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
	></iframe>
	<div class="targets" data-targetcount={contract.targetContractEntries.length}>
		{#each contract.targetContractEntries as targetContractEntry (targetContractEntry.id)}
			{#if TargetSearchedFor(targetContractEntry.target)}
				<div class="searched-for target">
					<button onclick={() => RemoveTarget(targetContractEntry.target)}>
						<p class="name">
							{targetContractEntry.target.name}
						</p>
					</button>
				</div>
			{:else}
				<div class="target">
					<button onclick={() => AddTarget(targetContractEntry.target)}>
						<p class="name">
							{targetContractEntry.target.name}
						</p>
					</button>
				</div>
			{/if}
		{/each}
		{#if contract.targetContractEntries.length > 4}
			{#each { length: contract.targetContractEntries.length % 2 }}
				<div class="target"></div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.contract {
		flex: 0 1 35rem;
		height: fit-content;
		max-width: 35rem;
		background-color: var(--base-color-7);
		border: 2px solid var(--base-color-9);

		.header {
			background-color: var(--base-color-5);
			padding: 0.5rem;
		}

		.video {
			display: block;
			position: relative;
			width: 100%;
			aspect-ratio: 16/9;
		}

		.targets {
			display: grid;
			gap: 2px;

			&[data-targetcount='1'] {
				grid-template-columns: repeat(1, minmax(0, 1fr));
			}
			&[data-targetcount='2'],
			&[data-targetcount='4'] {
				grid-template-columns: repeat(2, minmax(0, 1fr));
			}
			grid-template-columns: repeat(3, minmax(0, 1fr));

			.target {
				position: relative;
				display: grid;
				place-content: center;
				text-align: center;
				max-height: 3.25rem;

				& button {
					p {
						padding-inline: 0.5ch;
						padding-block: 0.35rem;
					}
				}

				&.searched-for {
					text-shadow: 0px 0px 2px var(--base-color-5);
					background-color: var(--primary-color);
					button {
						background: none;
						p {
							&:hover {
								text-decoration: line-through;
								cursor: pointer;
							}
						}
					}
				}
				&:not(.searched-for) {
					background-color: var(--base-color-5);
					button {
						background: none;
						p {
							color: var(--base-color-8);
							&:hover {
								text-decoration: underline;
								color: inherit;
								cursor: pointer;
							}
						}
					}
				}
			}
		}
	}
</style>
