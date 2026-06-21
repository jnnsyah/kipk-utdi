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
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
	}

	.data-table :global(th), .data-table :global(td) {
		padding: 14px 16px;
		border-bottom: 2px solid #1b1c19;
	}

	.data-table :global(th) {
		background: #efeee9;
		font-weight: 700;
	}
</style>
