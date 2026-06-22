<script>
	import BackLink from '$lib/components/ui/BackLink.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';

	let { 
		title, 
		subtitle, 
		buttonIcon, 
		buttonLabel, 
		onaction, 
		showDrawer = false,
		drawerTitle = '',
		ondrawerclose,
		drawerContent, 
		children 
	} = $props();
</script>

<div class="admin-page">
	<div class="grid-bg" aria-hidden="true"></div>
	
	<div class="admin-layout" class:has-drawer={showDrawer}>
		<div class="main-panel">
			<BackLink href="/admin/dashboard" label="Kembali ke Dashboard" />
			<PageHeader {title} {subtitle} {buttonIcon} {buttonLabel} {onaction} />
			<div class="data-section">
				{#if children}
					{@render children()}
				{/if}
			</div>
		</div>

		{#if showDrawer}
			<div class="drawer-panel">
				<div class="drawer-header">
					<h2 class="drawer-title">{drawerTitle}</h2>
					<button class="btn-close" onclick={ondrawerclose} title="Tutup">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</button>
				</div>
				<div class="drawer-body">
					{#if drawerContent}
						{@render drawerContent()}
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.admin-page {
		min-height: 100vh;
		position: relative;
		overflow-x: hidden;
	}
	.admin-layout {
		position: relative;
		z-index: 1;
		max-width: 1200px;
		margin: 0 auto;
		padding: 16px;
		display: flex;
		gap: 24px;
		align-items: flex-start;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}
	@media (min-width: 768px) {
		.admin-layout {
			padding: 24px 16px 48px;
		}
	}
	.main-panel {
		flex: 1;
		min-width: 0;
		transition: all 0.3s;
	}
	.data-section {
		margin-top: 16px;
	}
	.drawer-panel {
		width: 400px;
		flex-shrink: 0;
		background: var(--surface-white, #fff);
		border: 4px solid var(--border-color, #1b1c19);
		box-shadow: 8px 8px 0px 0px var(--shadow-color, #1b1c19);
		position: sticky;
		top: 24px;
		animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		max-height: calc(100vh - 48px);
		display: flex;
		flex-direction: column;
	}
	@keyframes slideInRight {
		from { opacity: 0; transform: translateX(40px); }
		to { opacity: 1; transform: translateX(0); }
	}
	.drawer-header {
		padding: 16px 20px;
		border-bottom: 3px solid var(--border-color, #1b1c19);
		background: var(--primary-light, #e8ddff);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.drawer-title {
		margin: 0;
		font-size: 18px;
		font-weight: 700;
	}
	.btn-close {
		background: var(--surface-white, #fff);
		border: 3px solid var(--border-color, #1b1c19);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 6px;
		transition: background 0.2s;
	}
	.btn-close:hover {
		background: var(--surface, #efeee9);
	}
	.drawer-body {
		padding: 20px;
		overflow-y: auto;
		flex: 1;
	}

	@media (max-width: 1024px) {
		.admin-layout {
			flex-direction: column;
		}
		.drawer-panel {
			width: 100%;
			position: relative;
			top: 0;
			margin-top: 24px;
			max-height: none;
		}
	}
</style>
