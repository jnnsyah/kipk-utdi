<script>
	import Icon from '$lib/components/icons/Icon.svelte';
	import { toastState } from '$lib/stores/toast.svelte.js';
	import { fly } from 'svelte/transition';

	const iconName = $derived(() => {
		if (toastState.type === 'success') return 'check_circle';
		if (toastState.type === 'error') return 'error';
		return 'info';
	});
</script>

{#if toastState.visible}
	<div 
		class="toast-notification toast-{toastState.type}"
		transition:fly={{ y: -60, duration: 250 }}
	>
		<Icon name={iconName()} size={22} color="var(--border-color)" />
		<span class="toast-message">{toastState.message}</span>
	</div>
{/if}

<style>
	.toast-notification {
		position: fixed;
		top: 24px;
		left: 50%;
		margin-left: -200px;
		width: 400px;
		max-width: 90vw;
		display: inline-flex;
		align-items: center;
		gap: 12px;
		padding: 14px 20px;
		border: 3px solid var(--border-color, #1b1c19);
		box-shadow: 4px 4px 0px 0px var(--shadow-color, #1b1c19);
		z-index: 9999;
		font-family: 'Space Grotesk', sans-serif;
		font-weight: 700;
		font-size: 14px;
		transition: all 0.15s ease;
	}

	.toast-notification:hover {
		transform: translate(-2px, -2px);
		box-shadow: 6px 6px 0px 0px var(--shadow-color, #1b1c19);
	}

	.toast-message {
		flex: 1;
		line-height: 1.4;
	}

	.toast-success {
		background: #e6ffed;
		color: #1b1c19;
	}

	.toast-error {
		background: #ffdde1;
		color: #1b1c19;
	}

	.toast-info {
		background: var(--primary-light, #e8ddff);
		color: #1b1c19;
	}

	@media (max-width: 480px) {
		.toast-notification {
			margin-left: 0;
			left: 16px;
			right: 16px;
			width: auto;
			max-width: none;
		}
	}
</style>
