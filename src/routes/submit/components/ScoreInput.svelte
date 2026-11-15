<script lang="ts">
	import { ScoreToTimeString } from '$lib/utils/formatting';
	import { PreventSubmissionOnEnter } from '$lib/utils/helpers';

	type ScoreInputProps = {
		scoreInput: number | undefined;
	};

	let { scoreInput = $bindable() }: ScoreInputProps = $props();
	let calculatedTimeString = $derived.by(() => ScoreToTimeString(scoreInput));

	function HandleScoreInput(
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		let restrictedString = e.currentTarget.value.slice(0, 6);
		if (isNaN(parseInt(restrictedString))) {
			return;
		}
		scoreInput = parseInt(restrictedString);
	}
</script>

<div class="input-container time">
	<fieldset>
		<legend>Score</legend>
		<input
			bind:value={scoreInput}
			oninput={HandleScoreInput}
			required
			type="number"
			name="score"
			id="score"
			max="210000"
			min="0"
			placeholder="score..."
			onkeydown={PreventSubmissionOnEnter}
		/>
		<span>{calculatedTimeString}</span>
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
			width: 5rem;
			text-align: center;
		}
	}
</style>
