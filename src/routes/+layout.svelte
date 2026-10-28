<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import SiteHeader from '#lib/components/SiteHeader.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Gadvat - Interactive Atlas of Maharashtra Forts</title>
</svelte:head>

<div class="shell">
	<SiteHeader />

	<main class="shell-main">
		{@render children()}
	</main>
</div>

<style>
	/* Full-bleed shell: the header floats over the content, as it floats over the map */
	.shell {
		position: relative;
		height: 100vh;
		height: 100dvh;
		overflow: hidden;
		background: var(--bg);
	}

	.shell-main {
		position: absolute;
		inset: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
	}
</style>
