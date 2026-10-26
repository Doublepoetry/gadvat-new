<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import LanguageToggle from '#lib/components/LanguageToggle.svelte';
	import { language } from '#lib/stores/language';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>Gadvat - Interactive Atlas of Maharashtra Forts</title>
</svelte:head>

<div class="app-container">
	<header class="app-header">
		<div class="header-content">
			<h1 class="site-title">🏰 Gadvat</h1>
			<p class="site-subtitle">
				{$language === 'en'
					? 'Interactive Atlas of Maharashtra Forts'
					: 'महाराष्ट्राच्या किल्ल्यांचा संवादात्मक अ‍ॅटलस'}
			</p>
		</div>
		<LanguageToggle />
	</header>

	<main class="app-main">
		{@render children()}
	</main>

	<footer class="app-footer">
		<p class="footer-text">
			{$language === 'en'
				? '© 2024 Gadvat. Built with privacy and community in mind.'
				: '© 2024 गडवाट. गोपनीयता आणि समुदायाच्या विचारातून बनवलेले.'}
		</p>
	</footer>
</div>

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
			'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
			sans-serif;
		background-color: #f9fafb;
		color: #1f2937;
	}

	:global(:root) {
		--color-primary: #4f46e5;
		--color-primary-hover: #4338ca;
		--color-text: #1f2937;
		--color-text-secondary: #6b7280;
		--color-border: #e5e7eb;
		--color-bg: #ffffff;
	}

	.app-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.app-header {
		background-color: var(--color-bg);
		border-bottom: 1px solid var(--color-border);
		padding: 1.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 2rem;
	}

	.header-content {
		flex: 1;
	}

	.site-title {
		margin: 0 0 0.25rem 0;
		font-size: 1.875rem;
		font-weight: 700;
		color: var(--color-primary);
	}

	.site-subtitle {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	.app-main {
		flex: 1;
		padding: 2rem 1.5rem;
		max-width: 1200px;
		width: 100%;
		margin: 0 auto;
	}

	.app-footer {
		background-color: var(--color-bg);
		border-top: 1px solid var(--color-border);
		padding: 2rem 1.5rem;
		text-align: center;
	}

	.footer-text {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	@media (max-width: 640px) {
		.app-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}

		.site-title {
			font-size: 1.5rem;
		}

		.app-main {
			padding: 1rem;
		}

		.app-footer {
			padding: 1.5rem;
		}
	}
</style>
