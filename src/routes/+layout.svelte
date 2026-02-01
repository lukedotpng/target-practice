<script lang="ts">
	import { asset, resolve } from '$app/paths';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={asset('/images/targetpractice_logo_100x100.png')} />
</svelte:head>

<header class="header">
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
	.header {
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
			color: inherit;
			text-decoration: none;

			& > span {
				height: fit-content;
				margin-top: 0.8rem;
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
			color: var(--text-white);

			text-decoration: none;
			&:hover {
				text-decoration: underline;
			}
		}
	}

	:global {
		:root {
			color-scheme: light dark;
			--secondary-base-color: oklch(0.78 0.12 249.59);
			--success-base-color: oklch(75.603% 0.18029 155.021);
			--error-base-color: oklch(0.58 0.2 25.75);
			--neutral-color-1: oklch(0.23 0.003 240);
			--neutral-color-2: oklch(0.3 0.004 240);
			--neutral-color-3: oklch(0.4 0.005 240);
			--neutral-color-4: oklch(0.54 0.006 240);
			--neutral-color-5: oklch(0.75 0.005 240);
			--neutral-color-6: oklch(0.85 0.004 240);
			--neutral-color-7: oklch(0.9 0.003 240);
			--neutral-color-8: oklch(0.94 0.002 240);
			--neutral-color-9: oklch(0.98 0.001 240);

			--primary-color: oklch(0.6391 0.1623 22.82);

			--secondary-color: light-dark(
				var(--secondary-base-color),
				oklch(from var(--secondary-base-color) calc(l - 0.15) c h)
			);
			--success-color: light-dark(
				var(--success-base-color),
				oklch(from var(--success-base-color) calc(l - 0.04) c h)
			);
			--error-color: light-dark(
				var(--error-base-color),
				oklch(from var(--error-base-color) calc(l + 0.08) c h)
			);

			--text-light: var(--neutral-color-9);
			--text-dark: var(--neutral-color-1);
			--text-color: light-dark(var(--text-dark), var(--text-light));

			--base-color-1: light-dark(var(--neutral-color-8), var(--neutral-color-1));
			--base-color-2: light-dark(var(--neutral-color-7), var(--neutral-color-2));
			--base-color-3: light-dark(var(--neutral-color-6), var(--neutral-color-3));

			/* @link https://utopia.fyi/type/calculator?c=320,16,1.2,1280,20,1.333,5,2,&s=0.75|0.5|0.25,1.5|2|3|4|6,s-l&g=s,l,xl,12 */
			--step--2: clamp(0.6944rem, 0.6914rem + 0.0151vw, 0.7035rem);
			--step--1: clamp(0.8333rem, 0.7985rem + 0.174vw, 0.9377rem);
			--step-0: clamp(1rem, 0.9167rem + 0.4167vw, 1.25rem);
			--step-1: clamp(1.2rem, 1.0446rem + 0.7771vw, 1.6663rem);
			--step-2: clamp(1.44rem, 1.1796rem + 1.3019vw, 2.2211rem);
			--step-3: clamp(1.728rem, 1.3171rem + 2.0546vw, 2.9607rem);
			--step-4: clamp(2.0736rem, 1.4492rem + 3.1218vw, 3.9467rem);
			--step-5: clamp(2.4883rem, 1.5641rem + 4.621vw, 5.2609rem);
		}

		* {
			margin: 0;
			padding: 0;
			font: inherit;
		}

		*,
		*::before,
		*::after {
			box-sizing: border-box;
		}

		body {
			background-color: var(--base-color-1);
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
