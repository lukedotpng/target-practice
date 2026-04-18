<script lang="ts">
	import { MAIN_MISSIONS, SIDE_MISSIONS } from '$lib/utils/constants';
	import { FormatMission } from '$lib/utils/formatting';

	type MissionInputProps = {
		missionInput: string;
		OnChangeMission: () => void;
	};

	let { missionInput = $bindable(''), OnChangeMission }: MissionInputProps = $props();
</script>

<div class="input-container mission">
	<div class="label-container">
		<label for="mission">Mission</label>
	</div>
	<select bind:value={missionInput} onchange={OnChangeMission} id="mission" name="mission" required>
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

<style>
	.input-container {
		margin: 0.5rem 0;
		& select {
			max-width: 100%;
		}
		& .warning-text {
			font-size: var(--step--1);
			font-style: italic;
			color: var(--primary-color);
		}
	}
</style>
