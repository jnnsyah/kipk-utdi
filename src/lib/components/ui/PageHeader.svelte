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
		margin-bottom: 24px;
		background: #fff;
		border: 4px solid var(--border-color);
		box-shadow: 6px 6px 0px 0px var(--shadow-color);
		padding: 24px;
		flex-wrap: wrap;
		gap: 16px;
	}
	.page-title {
		margin: 0 0 8px;
		font-size: 28px;
	}
	.page-subtitle {
		margin: 0;
		color: #7a7583;
	}
</style>
