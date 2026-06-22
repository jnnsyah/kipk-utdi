<script>
	let { headers = [], children, footer } = $props();
</script>

<div class="table-container">
	<div class="table-scroll">
		<table class="data-table">
			<thead>
				<tr>
					{#each headers as header}
						<th>{header}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#if children}
					{@render children()}
				{/if}
			</tbody>
		</table>
	</div>
	{#if footer}
		{@render footer()}
	{/if}
</div>

<style>
	.table-container {
		background: #fff;
		border: 4px solid #1b1c19;
		box-shadow: 6px 6px 0px 0px #1b1c19;
	}

	.table-scroll {
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
		min-width: 480px;
	}

	.data-table :global(th),
	.data-table :global(td) {
		padding: 10px 12px;
		border-bottom: 2px solid #1b1c19;
		font-size: 13px;
	}
	@media (min-width: 768px) {
		.data-table :global(th),
		.data-table :global(td) {
			padding: 14px 16px;
			font-size: 14px;
		}
	}

	.data-table :global(th) {
		background: #efeee9;
		font-weight: 700;
		white-space: nowrap;
	}
</style>
