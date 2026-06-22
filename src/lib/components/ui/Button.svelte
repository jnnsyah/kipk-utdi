<script>
	let {
		type = 'button',
		variant = 'primary', // primary, secondary, danger, icon
		href = null,
		title = '',
		disabled = false,
		class: className = '',
		onclick = null,
		children
	} = $props();

	let baseClass = $derived(variant === 'icon' ? 'btn-icon' : `btn-${variant}`);
</script>

{#if href}
	<a {href} class="{baseClass} {className}" {title} {onclick}>
		{@render children?.()}
	</a>
{:else}
	<button {type} class="{baseClass} {className}" {title} {disabled} {onclick}>
		{@render children?.()}
	</button>
{/if}
