<script>
	import Icon from '$lib/components/icons/Icon.svelte';
	let { href = "/admin/dashboard", label = "Kembali ke Dashboard" } = $props();
</script>

<div class="back-container">
	<a {href} class="back-link">
		<Icon name="arrow_back" size={18} />
		{label}
	</a>
</div>

<style>
	.back-container {
		margin-bottom: 16px;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 14px;
		color: #1b1c19;
		background: #efeee9;
		text-decoration: none;
		font-weight: 700;
		padding: 6px 16px;
		border: 2px solid #1b1c19;
		box-shadow: 3px 3px 0px 0px #1b1c19;
		transition: all 0.15s;
	}

	.back-link:hover {
		transform: translate(-2px, -2px);
		box-shadow: 5px 5px 0px 0px #1b1c19;
		background: #e8ddff;
		color: #674bb5;
	}

	.back-link:active {
		transform: translate(2px, 2px);
		box-shadow: 0px 0px 0px 0px #1b1c19;
	}
</style>
