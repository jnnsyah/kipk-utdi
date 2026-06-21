<script>
	import { loadingState } from '$lib/stores/loading.svelte.js';
</script>

{#if loadingState.visible}
	<div class="loading-overlay" aria-live="polite">
		<div class="loading-card">
			<div class="spinner"></div>
			<span>{loadingState.message}</span>
		</div>
	</div>
{/if}

<style>
	.loading-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(27, 28, 25, 0.4);
		backdrop-filter: blur(2px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}
	.loading-card {
		background: #fff;
		border: 4px solid #1b1c19;
		box-shadow: 8px 8px 0px 0px #1b1c19;
		padding: 24px 32px;
		display: flex;
		align-items: center;
		gap: 16px;
		font-weight: 700;
		font-size: 16px;
	}
	.spinner {
		width: 24px;
		height: 24px;
		border: 4px solid #1b1c19;
		border-top-color: var(--primary-color, #674bb5);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}
	@keyframes spin {
		to { transform: rotate(360deg); }
	}
</style>
