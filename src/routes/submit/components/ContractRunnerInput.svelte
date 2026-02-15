<script>
	import { PreventFromSubmissionOnEnter } from '$lib/utils/helpers';
</script>

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

<style>
	.input-container.contract-runner {
		width: 80%;
		margin: 0.5rem 0;
		@media (width < 400px) {
			width: 100%;
		}

		& > input {
			width: 100%;
		}
	}
</style>
