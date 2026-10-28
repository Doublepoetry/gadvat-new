<script lang="ts">
	import Atlas from '#lib/components/Atlas.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.fort.name} · Gadvat</title>
</svelte:head>

<Atlas forts={data.forts} districtNames={data.districtNames} initialId={data.fort.id} />
