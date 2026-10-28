<script lang="ts">
	import { showMr, theme } from '../stores/preferences';

	function toggleTheme() {
		theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
	}

	function toggleMr() {
		showMr.update((on) => !on);
	}
</script>

<header class="site-header">
	<a class="wordmark" href="/">
		<span class="wordmark-en">Gadvat</span>
		{#if $showMr}
			<span class="wordmark-mr" lang="mr">गडवाट</span>
		{/if}
	</a>

	<div class="controls">
		<button
			class="icon-button"
			onclick={toggleTheme}
			title="Light / dark"
			aria-label="Toggle light and dark"
		>
			{#if $theme === 'dark'}
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.6"
					stroke-linecap="round"
					aria-hidden="true"
					><circle cx="12" cy="12" r="4"></circle><path
						d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
					></path></svg
				>
			{:else}
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.6"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"></path></svg
				>
			{/if}
		</button>

		<button
			class="mr-switch"
			onclick={toggleMr}
			role="switch"
			aria-checked={$showMr}
			title="Show Marathi"
		>
			<span lang="mr">मराठी</span>
			<span class="track" class:on={$showMr} aria-hidden="true"><span class="knob"></span></span>
		</button>

		<a class="forts-pill" href="/#forts">Forts</a>
	</div>
</header>

<style>
	.site-header {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 30;
		height: 64px;
		padding: 0 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		pointer-events: none;
	}

	.wordmark,
	.controls {
		pointer-events: auto;
	}

	.wordmark {
		display: flex;
		align-items: baseline;
		gap: 10px;
		padding: 6px 4px;
		text-decoration: none;
	}

	.wordmark-en {
		font-size: 18px;
		font-weight: 400;
		letter-spacing: -0.01em;
		color: var(--ink);
	}

	.wordmark-mr {
		font-family: var(--font-mr);
		font-size: 16.5px;
		color: var(--acc);
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.icon-button,
	.mr-switch {
		display: flex;
		align-items: center;
		height: 40px;
		border: 0;
		border-radius: var(--radius-pill);
		background: transparent;
		color: var(--ink2);
		cursor: pointer;
	}

	.icon-button:hover,
	.mr-switch:hover {
		background: rgba(var(--lr), 0.08);
	}

	.icon-button {
		justify-content: center;
		width: 40px;
	}

	.mr-switch {
		gap: 10px;
		padding: 0 12px;
		font-family: var(--font-mr);
		font-size: 15px;
	}

	.track {
		position: relative;
		display: block;
		width: 30px;
		height: 18px;
		border-radius: var(--radius-pill);
		background: rgba(var(--lr), 0.18);
		transition: background 0.2s;
	}

	.knob {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: var(--mut);
		transition:
			left 0.2s,
			background 0.2s;
	}

	.track.on {
		background: var(--acc);
	}

	.track.on .knob {
		left: 14px;
		background: var(--bg);
	}

	.forts-pill {
		display: flex;
		align-items: center;
		height: 40px;
		padding: 0 14px;
		border-radius: var(--radius-pill);
		background: rgba(var(--lr), 0.08);
		color: var(--ink);
		font-size: 14px;
		font-weight: 400;
		text-decoration: none;
		transition: background 0.2s;
	}

	.forts-pill:hover {
		background: rgba(var(--lr), 0.14);
	}
</style>
