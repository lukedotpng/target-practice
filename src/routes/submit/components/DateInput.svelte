<script>
	const maxDateInput = new Date().toISOString().split('T')[0];
</script>

<div class="input-container date-uploaded">
	<div>
		<label for="date-uploaded">Date Uploaded</label>
	</div>
	<input
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
			padding: 0.1rem 0.1rem;
			&::placeholder {
				font-style: italic;
			}
		}
	}
</style>
