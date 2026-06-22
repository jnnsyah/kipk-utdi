<script>
	import { loadingState } from '$lib/stores/loading.svelte.js';
</script>

{#if loadingState.visible}
	<div class="loading-overlay" aria-live="polite">
		<div class="loading-card">
			<div class="loading-header">
				<span class="loading-title">MEMPROSES DATA</span>
			</div>
			<div class="loading-body">
				<p class="loading-message">{loadingState.message}</p>
				<div class="progress-container">
					<div 
						class="progress-fill" 
						style="width: {loadingState.progress}%; border-right-width: {loadingState.progress > 0 ? '4px' : '0px'};"
					></div>
					<span class="progress-text">{loadingState.progress}%</span>
				</div>
			</div>
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
		padding: 16px;
	}

	.loading-card {
		background: var(--color-surface, #faf9f4);
		border: 4px solid var(--color-on-background, #1b1c19);
		box-shadow: 8px 8px 0px 0px var(--color-on-background, #1b1c19);
		width: 100%;
		max-width: 400px;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.loading-header {
		padding: 12px 16px;
		border-bottom: 4px solid var(--color-on-background, #1b1c19);
		background: var(--color-primary-fixed, #e8ddff);
		display: flex;
		align-items: center;
	}

	.loading-title {
		font-family: 'Space Grotesk', sans-serif;
		font-weight: 700;
		font-size: 13px;
		letter-spacing: 0.1em;
		color: var(--color-on-primary-fixed, #21005e);
	}

	.loading-body {
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.loading-message {
		margin: 0;
		font-family: 'Space Grotesk', sans-serif;
		font-weight: 600;
		font-size: 15px;
		color: var(--color-on-background, #1b1c19);
	}

	.progress-container {
		position: relative;
		height: 36px;
		background: var(--color-surface-container, #efeee9);
		border: 4px solid var(--color-on-background, #1b1c19);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.progress-fill {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		background: var(--color-primary-container, #a78bfa);
		border-right: 4px solid var(--color-on-background, #1b1c19);
		transition: width 0.15s ease-out;
	}

	.progress-text {
		position: relative;
		z-index: 10;
		font-family: 'Space Grotesk', sans-serif;
		font-weight: 800;
		font-size: 15px;
		color: var(--color-on-background, #1b1c19);
	}
</style>
