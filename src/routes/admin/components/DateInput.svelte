<script lang="ts">
	type DateInputProps = {
		dateInput: string | undefined;
	};

	let { dateInput = $bindable() }: DateInputProps = $props();

	const maxDateInput = new Date().toISOString().split('T')[0];
</script>

<div class="input-container date-uploaded">
	<div>
		<label for="date-uploaded">Date Uploaded</label>
	</div>
	<input
		bind:value={dateInput}
		type="date"
		name="date_uploaded"
		id="date-uploaded"
		placeholder="mm/dd/yyyy"
		max={maxDateInput}
		required
	/>
</div>

<style>
	.date-uploaded {
		margin: 0.5rem 0;
		& input {
			&::placeholder {
				font-style: italic;
			}
		}
	}
</style>
