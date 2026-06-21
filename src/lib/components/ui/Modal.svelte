<script>
	import { fade, fly } from 'svelte/transition';
	import { clickOutside } from '$lib/utils/clickOutside.js';
	import Icon from '$lib/components/icons/Icon.svelte';

	let {
		show = $bindable(false),
		title = '',
		maxWidth = '600px',
		onclose = () => { show = false; },
		children,
		footer
	} = $props();
</script>

{#if show}
	<div class="modal-backdrop" transition:fade={{ duration: 200 }}>
		<div
			class="modal-content"
			style="max-width: {maxWidth};"
			transition:fly={{ y: 20, duration: 300, opacity: 0 }}
			use:clickOutside
			onclick_outside={onclose}
		>
			<div class="modal-header">
				<h2>{title}</h2>
				<button type="button" class="btn-icon" onclick={onclose} aria-label="Close">
					<Icon name="close" size={24} />
				</button>
			</div>
			
			<div class="modal-body">
				{@render children?.()}
			</div>

			{#if footer}
				<div class="modal-actions" style="padding: 0 24px 24px;">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
