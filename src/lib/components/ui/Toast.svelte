<script>
	import Icon from '$lib/components/icons/Icon.svelte';
	import { toastState } from '$lib/stores/toast.svelte.js';
</script>

{#if toastState.visible}
	<div class="toast toast-{toastState.type}">
		<Icon name={toastState.type === 'error' ? 'error' : 'check_circle'} size={24} />
		<span>{toastState.message}</span>
	</div>
{/if}
