<script lang="ts">
	import type { TargetContractEntryWithTarget } from '$lib/types';
	import { KILL_METHODS } from '$lib/utils/constants';

	type TargetsInputProps = {
		targets: TargetContractEntryWithTarget[];
	};

	let { targets }: TargetsInputProps = $props();

	function CheckIfChanged(
		event: Event & {
			currentTarget: EventTarget & HTMLSelectElement;
		},
		targetId: number = 0,
		originalKillMethod: string
	) {
		const submitButton = document.getElementById('submit' + targetId) as HTMLButtonElement;
		submitButton.disabled = event.currentTarget.value === originalKillMethod;
	}
</script>

<div class="input-container targets">
	<div class="label-container">
		<label for="target-search">Targets</label>
	</div>
	{#if targets.length > 0}
		<div class="targets-container">
			<ul class="targets-list">
				{#each targets as targetEntry (targetEntry.id)}
					<li class="targets-list-item" aria-describedby="removetargetdescription">
						<p>{targetEntry.target.name}</p>
						<form action="?/updatetarget" method="POST">
							<input type="text" name="targetEntryId" value={targetEntry.id} hidden />
							<select
								name="killMethod"
								value={targetEntry.killMethod}
								onchange={(e) => CheckIfChanged(e, targetEntry.id, targetEntry.killMethod ?? '')}
							>
								<option>{KILL_METHODS[0]}</option>
								<optgroup label="Weapons">
									{#each KILL_METHODS.slice(1, 12) as method (method)}
										<option>{method}</option>
									{/each}
								</optgroup>
								<optgroup label="Unique Kills">
									{#each KILL_METHODS.slice(12, 20) as method (method)}
										<option>{method}</option>
									{/each}
								</optgroup>
								<optgroup label="Melee Weapons">
									{#each KILL_METHODS.slice(20) as method (method)}
										<option>{method}</option>
									{/each}
								</optgroup>
							</select>
							<button type="submit" id={'submit' + targetEntry.id} disabled>Save</button>
						</form>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
	.input-container.targets {
		margin: 0.5rem 0;
		width: 80%;
		@media (width < 400px) {
			width: 100%;
		}
		position: relative;

		.targets-container {
			margin-top: 0.25rem;

			& > .targets-list {
				padding-left: 1.5rem;

				& > .targets-list-item {
					position: relative;
					display: grid;
					gap: 0.2rem;
					height: 100%;
					&:first-child {
						margin-top: 0;
					}
					margin: 0.5rem 0;

					&::before {
						content: '';
						position: absolute;
						inset: 0;
						top: 0.2lh;
						left: -0.75rem;

						margin-block: auto;
						width: 2px;
						background-color: white;
					}

					button[type='submit'] {
						height: 100%;
						padding-inline: 0.5rem;
						&:hover {
							text-decoration: underline;
							cursor: pointer;
						}

						&:disabled {
							display: none;
						}
					}
				}
			}
		}
	}
</style>
