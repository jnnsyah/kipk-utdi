<script>
	import Toast from '$lib/components/ui/Toast.svelte';
	let { children } = $props();
</script>

<Toast />
{@render children()}
