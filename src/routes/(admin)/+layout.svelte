<script>
	import Toast from '$lib/components/ui/Toast.svelte';
	import LoadingOverlay from '$lib/components/ui/LoadingOverlay.svelte';
	let { children } = $props();
</script>

<Toast />
<LoadingOverlay />
{@render children()}
