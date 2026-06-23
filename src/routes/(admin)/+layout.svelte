<script>
	import Toast from '$lib/components/ui/Toast.svelte';
	import LoadingOverlay from '$lib/components/ui/LoadingOverlay.svelte';
	import { navigating } from '$app/stores';
	import { showLoading, hideLoading } from '$lib/stores/loading.svelte.js';

	let { children } = $props();

	// Automatically show/hide the loading progress overlay during page transitions
	$effect(() => {
		if ($navigating) {
			showLoading('Memuat data halaman...');
		} else {
			hideLoading();
		}
	});
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<Toast />
<LoadingOverlay />
{@render children()}
