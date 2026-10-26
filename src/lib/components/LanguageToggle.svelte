<script lang="ts">
	import { language, translations } from '../stores/language';
	import type { Language } from '../types';

	function toggleLanguage() {
		language.update((lang) => (lang === 'en' ? 'mr' : 'en'));
	}
</script>

<button
	onclick={toggleLanguage}
	class="language-toggle"
	title={$language === 'en' ? 'मराठीमध्ये बदला' : 'Switch to English'}
>
	<span class="lang-label">
		{$language === 'en' ? translations.en.marathi : translations.mr.english}
	</span>
</button>

<style>
	.language-toggle {
		padding: 0.5rem 1rem;
		background-color: var(--color-primary, #4f46e5);
		color: white;
		border: none;
		border-radius: 0.375rem;
		cursor: pointer;
		font-weight: 500;
		transition: background-color 0.2s ease;
		font-size: 0.875rem;
	}

	.language-toggle:hover {
		background-color: var(--color-primary-hover, #4338ca);
	}

	.language-toggle:active {
		transform: scale(0.98);
	}

	.lang-label {
		display: inline-block;
	}

	@media (max-width: 640px) {
		.language-toggle {
			padding: 0.5rem 0.75rem;
			font-size: 0.75rem;
		}
	}
</style>
