<script>
	import { PreventSubmissionOnEnter } from '$lib/utils/helpers';
</script>

<div class="input-container video">
	<div class="label-container">
		<label for="video_url">
			Video URL
			<span class="video-url-warning">*Currently only supports YouTube</span>
		</label>
	</div>
	<input
		type="url"
		id="video_url"
		name="video_url"
		required
		placeholder="youtube.com/watch?v=L2KBq_nCRIc"
		onkeydown={PreventSubmissionOnEnter}
	/>
</div>

<style>
	.input-container.video {
		margin: 0.5rem 0;
		width: 80%;
		@media (width < 400px) {
			width: 100%;
		}

		& > input {
			width: 100%;
		}

		& .video-url-warning {
			font-size: var(--step--1);
			font-style: italic;
		}
	}
</style>
