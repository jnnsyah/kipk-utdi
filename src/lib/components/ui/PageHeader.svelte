<script>
	import Icon from '$lib/components/icons/Icon.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let { title, subtitle, buttonIcon, buttonLabel, onaction } = $props();
</script>

<div class="page-header">
	<div>
		<h1 class="page-title">{title}</h1>
		{#if subtitle}
			<p class="page-subtitle">{subtitle}</p>
		{/if}
	</div>
	{#if buttonLabel && onaction}
		<Button variant="primary" onclick={onaction}>
			{#if buttonIcon}
				<Icon name={buttonIcon} size={20} />
			{/if}
			<span>{buttonLabel}</span>
		</Button>
	{/if}
</div>

<style>
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: 16px;
		background: #fff;
		border: 4px solid var(--border-color);
		box-shadow: 6px 6px 0px 0px var(--shadow-color);
		padding: 16px;
		flex-wrap: wrap;
		gap: 12px;
	}
	@media (min-width: 768px) {
		.page-header {
			padding: 24px;
			margin-bottom: 24px;
			gap: 16px;
		}
	}
	.page-title {
		margin: 0 0 4px;
		font-size: 20px;
	}
	@media (min-width: 768px) {
		.page-title {
			font-size: 28px;
			margin-bottom: 8px;
		}
	}
	.page-subtitle {
		margin: 0;
		font-size: 13px;
		color: #7a7583;
		line-height: 1.4;
	}
</style>
