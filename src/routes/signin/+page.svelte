<script lang="ts">
	import { asset } from '$app/paths';
	import { page } from '$app/state';
	import { SignIn } from '@auth/sveltekit/components';

	const url = new URL(page.url);

	let redirectUrl = '/';
	const searchParam = url.searchParams.get('redirect');
	if (searchParam !== null) {
		redirectUrl = searchParam;
	}
</script>

<main>
	<div>
		<SignIn provider="discord" signInPage="signin" options={{ redirectTo: '/' + redirectUrl }}>
			<div id="signin-div" slot="submitButton">
				<img src={asset('/images/discord_logo.svg')} alt="Discord logo" />
				<span>Sign in with Discord</span>
			</div>
		</SignIn>
	</div>
</main>

<style>
	main {
		display: grid;
		place-content: center;

		font-family: 'DM Sans', sans-serif;
		font-size: var(--step-2);
	}

	* > #signin-div {
		border: none;
	}

	#signin-div {
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 20rem;
		padding: 0.5rem 0.5rem;
		background-color: var(--base-color-6);
		border: 2px solid var(--base-color-8);

		img {
			height: 2rem;
			/*width: 2rem;*/
		}

		span {
			/*flex: 1;*/
			/*text-align: center;*/
		}

		:hover {
			text-decoration: underline;
		}
	}
</style>
