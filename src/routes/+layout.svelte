<script lang="ts">
	import { asset, resolve } from '$app/paths';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={asset('/images/targetpractice_logo_100x100.png')} />
</svelte:head>

<header>
	<div class="header-contents">
		<h1>
			<a href={resolve('/')}>
				<img src={asset('/images/targetpractice_logo_300x300_white.png')} alt="Target Practice" />
				<span>Target Practice</span>
			</a>
		</h1>
		<nav>
			<a href={resolve('/submit')}>Submit Contract</a>
		</nav>
	</div>
</header>
{@render children()}

<style>
	header {
		display: flex;
		justify-content: center;
		padding-left: 0.5rem;
		padding-right: 1rem;
		height: var(--step-4);
		background-color: var(--primary-color);
	}

	.header-contents {
		flex: 1;
		display: flex;
		max-width: 2000px;
		height: 100%;
		align-items: center;
		color: var(--text-light);
	}

	.header-contents > h1 {
		height: 100%;
		font-size: var(--step-3);
		font-family: 'The Bold Font', sans-serif;

		& > a {
			display: flex;
			align-items: center;
			height: 100%;
			text-decoration: none;

			& > span {
				margin-top: 0.5rem;
				@media (width <= 600px) {
					display: none;
				}
			}
			& > img {
				padding-top: 0.1rem;
				padding-bottom: 0.1rem;
				height: 100%;
				font-family: 'DM Sans', sans-serif;
				font-size: var(--step--2);
				max-width: 80px;
			}
		}
	}

	.header-contents > nav {
		flex: 1;
		text-align: right;

		& > a {
			font-family: 'DM Sans', sans-serif;
			font-size: var(--step-1);
			font-weight: bold;

			text-decoration: none;
			&:hover {
				text-decoration: underline;
			}
		}
	}

	:global {
		* {
			margin: 0;
			padding: 0;
			font: inherit;
			color: inherit;
		}

		*,
		*::before,
		*::after {
			box-sizing: border-box;
		}

		html {
			height: 100%;
		}

		body {
			display: grid;
			grid-template-rows: auto 1fr auto;
			min-height: 100%;
			background-color: var(--base-color-3);
			color: var(--text-color);
		}

		input {
			padding-inline: 0.15rem;
			background-color: var(--base-color-5);
			border-color: var(--base-color-8);
			border-style: solid;
			border-radius: 5px;
			outline: none;

			&:focus {
				border-color: var(--base-color-12);
			}
			&:hover:not(:disabled):not(:focus) {
				border-color: var(--base-color-10);
			}
			&::placeholder {
				font-style: italic;
			}
		}

		select {
			background-color: var(--base-color-5);
			border-width: 2px;
			border-color: var(--base-color-8);
			border-style: solid;
			border-radius: 5px;
			&:open {
				border-radius: 5px 5px 0 0;
			}
			transition: border-radius 0.1s;

			&:focus {
				border-color: var(--base-color-12);
			}
			&:hover:not(:disabled):not(:focus) {
				border-color: var(--base-color-10);
			}
		}

		:root {
			color-scheme: light dark;
			--primary-color: oklch(0.6391 0.1623 22.82);
			--secondary-color: oklch(0.7 0.12 249.59);
			--success-color: oklch(0.7 0.18029 155.021);
			--error-color: oklch(0.55 0.21 30);

			--text-color: white;

			--base-color-1: oklch(0.162 0 0);
			--base-color-2: oklch(0.195 0 0);
			--base-color-3: oklch(0.254 0 0);
			--base-color-4: oklch(0.302 0 0);
			--base-color-5: oklch(0.348 0 0);
			--base-color-6: oklch(0.396 0 0);
			--base-color-7: oklch(0.459 0 0);
			--base-color-8: oklch(0.549 0 0);
			--base-color-9: oklch(0.649 0 0);
			--base-color-10: oklch(0.72 0 0);
			--base-color-11: oklch(0.863 0 0);
			--base-color-12: oklch(0.933 0 0);

			/* @link https://utopia.fyi/type/calculator?c=375,16,1.2,1280,18,1.2,5,2,&s=0.75|0.5|0.25,1.5|2|3|4|6,s-l&g=s,l,xl,12 */
			--step--2: clamp(0.6944rem, 0.6585rem + 0.1535vw, 0.7813rem);
			--step--1: clamp(0.8333rem, 0.7902rem + 0.1842vw, 0.9375rem);
			--step-0: clamp(1rem, 0.9482rem + 0.221vw, 1.125rem);
			--step-1: clamp(1.2rem, 1.1378rem + 0.2652vw, 1.35rem);
			--step-2: clamp(1.44rem, 1.3654rem + 0.3182vw, 1.62rem);
			--step-3: clamp(1.728rem, 1.6385rem + 0.3819vw, 1.944rem);
			--step-4: clamp(2.0736rem, 1.9662rem + 0.4583vw, 2.3328rem);
			--step-5: clamp(2.4883rem, 2.3594rem + 0.5499vw, 2.7994rem);
		}
	}

	@font-face {
		font-family: 'The Bold Font';
		src: url('/fonts/TheBoldFont.woff') format('woff');
		font-weight: bold;
		font-style: normal;
		font-display: swap;
	}

	@font-face {
		font-family: 'DM Sans';
		src: url('/fonts/DMSans-ExtraLightItalic.woff') format('woff');
		font-weight: 200;
		font-style: italic;
		font-display: swap;
	}

	@font-face {
		font-family: 'DM Sans';
		src: url('/fonts/DMSans-Regular.woff') format('woff');
		font-weight: normal;
		font-style: normal;
		font-display: swap;
	}

	@font-face {
		font-family: 'DM Sans';
		src: url('/fonts/DMSans-Bold.woff') format('woff');
		font-weight: bold;
		font-style: normal;
		font-display: swap;
	}

	@font-face {
		font-family: 'DM Sans';
		src: url('/fonts/DMSans-ExtraLight.woff') format('woff');
		font-weight: 200;
		font-style: normal;
		font-display: swap;
	}

	@font-face {
		font-family: 'DM Sans';
		src: url('/fonts/DMSans-Italic.woff') format('woff');
		font-weight: normal;
		font-style: italic;
		font-display: swap;
	}

	@font-face {
		font-family: 'DM Sans';
		src: url('/fonts/DMSans-BoldItalic.woff') format('woff');
		font-weight: bold;
		font-style: italic;
		font-display: swap;
	}
</style>
