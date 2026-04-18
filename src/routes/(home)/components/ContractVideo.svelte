<script lang="ts">
	import type { Contract, Target } from '$lib/types';

	type ContractVideoProps = {
		contract: Contract;
		targetsSearched: Target[];
	};
	let { contract, targetsSearched }: ContractVideoProps = $props();

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
	<iframe
		class="video"
		title="Contract"
		src={'https://www.youtube-nocookie.com/embed/' +
			contract.videoId +
			'?t=' +
			contract.videoTimestamp}
		frameborder="0"
		allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
	></iframe>
	<div class="targets">
		{#each contract.targets as target (target.id)}
			<div class={TargetSearchedFor(target) ? 'searched-for' : ''}>
				<p>
					{target.name}
				</p>
			</div>
		{/each}
	</div>
</div>

<style>
	@property --gradient-position-x {
		syntax: '<percentage>';
		inherits: true;
		initial-value: 50%;
	}

	.contract {
		flex: 0 1 30rem;
		height: fit-content;
		max-width: 30rem;
		/*background-position: 50% 50%;
		background:
			radial-gradient(var(--base-color-4)) padding-box,
			radial-gradient(circle at 0% 0%, var(--primary-color), transparent) border-box,
			radial-gradient(circle at 50% 50%, orange, transparent) border-box,
			radial-gradient(circle at 70% 70%, var(--secondary-color), transparent) border-box,
			radial-gradient(circle at 30% 70%, yellow, transparent) border-box;*/

		.video {
			display: block;
			width: 100%;
			aspect-ratio: 16/9;
			border: 2px solid var(--base-color-4);
			border-bottom: none;
			/*opacity: 0;*/
		}

		.targets {
			display: flex;
			flex-wrap: wrap;
			margin: 1px 0 0 1px;
			div {
				flex: 1;
				margin: -1px 0 0 -1px;
				text-align: center;
				padding-inline: 0.5ch;
				text-wrap: nowrap;
				border: 1px solid var(--base-color-12);
				&.searched-for {
					text-shadow: 0px 0px 2px var(--base-color-5);
					background-color: var(--primary-color);
				}
				&:not(.searched-for) {
					p {
						opacity: 30%;
					}
				}
			}
		}
	}
</style>
