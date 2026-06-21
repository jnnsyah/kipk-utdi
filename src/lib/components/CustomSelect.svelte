<script>
	import { clickOutside } from '$lib/utils/clickOutside.js';
	import Icon from './icons/Icon.svelte';

	let { options = [], value = $bindable(), placeholder = "Pilih opsi" } = $props();

	let isOpen = $state(false);

	const selectedLabel = $derived(options.find(opt => opt.value === value)?.label || placeholder);

	function toggle() {
		isOpen = !isOpen;
	}

	function selectOption(optValue) {
		value = optValue;
		isOpen = false;
	}
</script>

<div class="custom-select" use:clickOutside={() => isOpen = false}>
	<button type="button" class="select-trigger {isOpen ? 'open' : ''}" onclick={toggle}>
		<span>{selectedLabel}</span>
		<Icon name="chevron_down" size={20} class="chevron" />
	</button>

	{#if isOpen}
		<ul class="select-dropdown">
			{#each options as option}
				<li>
					<button 
						type="button" 
						class="select-option {value === option.value ? 'selected' : ''}" 
						onclick={() => selectOption(option.value)}
					>
						{option.label}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.custom-select {
		position: relative;
		width: 100%;
		font-family: inherit;
	}

	.select-trigger {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 14px;
		border: 3px solid #1b1c19;
		background: #faf9f4;
		font-size: 15px;
		font-weight: 500;
		color: #1b1c19;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s;
	}

	.select-trigger:focus, .select-trigger.open {
		outline: none;
		background: #fff;
		box-shadow: 4px 4px 0px 0px #674bb5;
	}

	.chevron {
		transition: transform 0.2s;
	}

	.select-trigger.open .chevron {
		transform: rotate(180deg);
	}

	.select-dropdown {
		position: absolute;
		top: calc(100% + 4px);
		left: 0;
		width: 100%;
		margin: 0;
		padding: 0;
		list-style: none;
		background: #fff;
		border: 3px solid #1b1c19;
		box-shadow: 4px 4px 0px 0px #1b1c19;
		z-index: 10;
		max-height: 200px;
		overflow-y: auto;
	}

	.select-option {
		width: 100%;
		text-align: left;
		padding: 10px 14px;
		border: none;
		background: none;
		font-size: 15px;
		cursor: pointer;
		color: #1b1c19;
		border-bottom: 2px solid #efeee9;
	}

	.select-option:last-child {
		border-bottom: none;
	}

	.select-option:hover {
		background: #e8ddff;
		color: #674bb5;
	}

	.select-option.selected {
		background: #674bb5;
		color: #fff;
		font-weight: 700;
	}
</style>
