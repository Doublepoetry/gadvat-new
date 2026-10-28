<script lang="ts">
	import Atlas from '#lib/components/Atlas.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Atlas initialId={data.id} />
