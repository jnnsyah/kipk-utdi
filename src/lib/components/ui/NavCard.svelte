<script>
	import Icon from '$lib/components/icons/Icon.svelte';
	let { href, variant = 'purple', id, iconName, label, desc } = $props();
</script>

<a {href} {id} class="nav-card nav-card--{variant}">
	<div class="nav-card-icon">
		<Icon name={iconName} size={22} />
	</div>
	<div>
		<p class="nav-card-label">{label}</p>
		<p class="nav-card-desc">{desc}</p>
	</div>
	<Icon name="arrow_forward" size={20} class="nav-card-arrow" />
</a>

<style>
	.nav-card {
		display: flex;
		align-items: center;
		gap: 16px;
		background: #faf9f4;
		border: 4px solid #1b1c19;
		box-shadow: 6px 6px 0px 0px #1b1c19;
		padding: 24px;
		text-decoration: none;
		color: #1b1c19;
		transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		position: relative;
		overflow: hidden;
	}

	.nav-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 4px;
	}

	.nav-card--purple::before { background: #674bb5; }
	.nav-card--blue::before { background: #4ba2b5; }
	.nav-card--green::before { background: #4bb567; }
	.nav-card--red::before { background: #b54b4b; }

	.nav-card:hover {
		transform: translate(-4px, -4px);
		box-shadow: 10px 10px 0px 0px #1b1c19;
	}
	.nav-card:active {
		transform: translate(2px, 2px);
		box-shadow: 2px 2px 0px 0px #1b1c19;
	}

	.nav-card-icon {
		width: 48px;
		height: 48px;
		background: #1b1c19;
		color: #faf9f4;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		transition: transform 0.2s;
	}

	.nav-card:hover .nav-card-icon {
		transform: scale(1.1) rotate(-5deg);
	}

	.nav-card-label {
		margin: 0 0 4px;
		font-weight: 700;
		font-size: 18px;
		letter-spacing: -0.01em;
	}

	.nav-card-desc {
		margin: 0;
		font-size: 13px;
		color: #555;
		line-height: 1.4;
	}

	.nav-card :global(.nav-card-arrow) {
		margin-left: auto;
		transition: transform 0.2s;
		opacity: 0.5;
	}

	.nav-card:hover :global(.nav-card-arrow) {
		transform: translateX(6px);
		opacity: 1;
	}
</style>
