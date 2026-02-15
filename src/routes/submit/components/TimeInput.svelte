<script lang="ts">
	import { PreventFromSubmissionOnEnter } from '$lib/utils/helpers';

	type TimeInputProps = {
		minutesInput: number | undefined;
		secondsInput: number | undefined;
	};

	let { minutesInput = $bindable(), secondsInput = $bindable() }: TimeInputProps = $props();

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
</script>

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

<style>
	input[type='number'] {
		&::-webkit-outer-spin-button,
		&::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}

		-moz-appearance: textfield;
		appearance: textfield;
	}

	.input-container.time {
		display: flex;
		flex-direction: column;
		margin: 0.5rem 0;

		& fieldset {
			border: none;
		}

		& input {
			width: 3rem;
			text-align: center;
		}
	}
</style>
