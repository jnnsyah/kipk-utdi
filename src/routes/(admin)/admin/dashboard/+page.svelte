<script>
	import { enhance } from '$app/forms';

	/** @type {import('./$types').PageData} */
	let { data } = $props();

	const user = $derived(data.user);
	let avatarError = $state(false);
	const avatarUrl = $derived(!avatarError ? (user?.user_metadata?.avatar_url ?? null) : null);
	const displayName = $derived(user?.user_metadata?.full_name ?? user?.email ?? 'Admin');
	const email = $derived(user?.email ?? '');
</script>

<svelte:head>
	<title>Dashboard — KIP-K UTDI Admin</title>
	<link
		href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
		rel="stylesheet"
	/>
	<link
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="dashboard-page">
	<div class="grid-bg" aria-hidden="true"></div>

	<div class="dashboard-container">
		<!-- Header -->
		<header class="dash-header">
			<div class="dash-brand">
				<span class="material-symbols-outlined dash-brand-icon">shield_person</span>
				<div>
					<p class="dash-brand-sub">PANEL ADMIN</p>
					<p class="dash-brand-name">KIP-K UTDI</p>
				</div>
			</div>

			<div class="dash-user">
				{#if avatarUrl}
					<img src={avatarUrl} alt="Avatar {displayName}" class="user-avatar" onerror={() => avatarError = true} />
				{:else}
					<div class="user-avatar user-avatar-placeholder" title="Default Avatar">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px; color: #7a7583;">
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
							<circle cx="12" cy="7" r="4"></circle>
						</svg>
					</div>
				{/if}
				<div class="user-info">
					<p class="user-name">{displayName}</p>
					<p class="user-email">{email}</p>
				</div>
				<form method="POST" action="/admin/login?/logout" use:enhance>
					<button type="submit" class="logout-btn" id="btn-logout" title="Keluar">
						<span class="material-symbols-outlined">logout</span>
						<span class="logout-label">Keluar</span>
					</button>
				</form>
			</div>
		</header>

		<!-- Welcome Banner -->
		<div class="welcome-banner">
			<div class="welcome-text">
				<div class="welcome-tag">SELAMAT DATANG</div>
				<h1 class="welcome-title">Halo, {displayName.split(' ')[0]}! 👋</h1>
				<p class="welcome-desc">
					Dashboard admin KIP-K UTDI siap digunakan. Kelola kegiatan, FAQ, dan konten situs dari
					sini.
				</p>
			</div>
			<div class="welcome-deco" aria-hidden="true">
				<span class="material-symbols-outlined">admin_panel_settings</span>
			</div>
		</div>

		<!-- Quick Nav Cards -->
		<section class="nav-grid">
			<a href="/admin/kegiatan" class="nav-card nav-card--purple" id="link-nav-kegiatan">
				<div class="nav-card-icon">
					<span class="material-symbols-outlined">event</span>
				</div>
				<div>
					<p class="nav-card-label">Kegiatan</p>
					<p class="nav-card-desc">Tambah, edit, & hapus kegiatan</p>
				</div>
				<span class="material-symbols-outlined nav-card-arrow">arrow_forward</span>
			</a>

			<a href="/admin/konten" class="nav-card nav-card--blue" id="link-nav-konten">
				<div class="nav-card-icon">
					<span class="material-symbols-outlined">article</span>
				</div>
				<div>
					<p class="nav-card-label">Visi / Misi / Tujuan</p>
					<p class="nav-card-desc">Update konten halaman tentang</p>
				</div>
				<span class="material-symbols-outlined nav-card-arrow">arrow_forward</span>
			</a>

			<a href="/admin/faq" class="nav-card nav-card--gray" id="link-nav-faq">
				<div class="nav-card-icon">
					<span class="material-symbols-outlined">quiz</span>
				</div>
				<div>
					<p class="nav-card-label">FAQ</p>
					<p class="nav-card-desc">Kelola pertanyaan & jawaban</p>
				</div>
				<span class="material-symbols-outlined nav-card-arrow">arrow_forward</span>
			</a>

			<a href="/admin/whitelist" class="nav-card nav-card--black" id="link-nav-whitelist">
				<div class="nav-card-icon">
					<span class="material-symbols-outlined">manage_accounts</span>
				</div>
				<div>
					<p class="nav-card-label">Whitelist Admin</p>
					<p class="nav-card-desc">Kelola akses email admin</p>
				</div>
				<span class="material-symbols-outlined nav-card-arrow">arrow_forward</span>
			</a>
		</section>

		<!-- Status note -->
		<div class="status-note">
			<span class="material-symbols-outlined">check_circle</span>
			<span>Login sebagai <strong>{email}</strong> · Sesi aktif</span>
		</div>
	</div>
</div>

<style>
	:global(*, *::before, *::after) {
		box-sizing: border-box;
	}
	:global(body) {
		margin: 0;
		font-family: 'Space Grotesk', sans-serif;
		background: #faf9f4;
		color: #1b1c19;
	}

	.dashboard-page {
		min-height: 100vh;
		position: relative;
	}

	.grid-bg {
		position: fixed;
		inset: 0;
		z-index: 0;
		background-image:
			linear-gradient(to right, rgb(219, 218, 213) 1px, transparent 1px),
			linear-gradient(rgb(219, 218, 213) 1px, transparent 1px);
		background-size: 40px 40px;
		pointer-events: none;
	}

	.dashboard-container {
		position: relative;
		z-index: 1;
		max-width: 960px;
		margin: 0 auto;
		padding: 24px 16px 48px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	/* Header */
	.dash-header {
		background: #fff;
		border: 4px solid #1b1c19;
		box-shadow: 6px 6px 0px 0px #1b1c19;
		padding: 16px 24px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		flex-wrap: wrap;
	}

	.dash-brand {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.dash-brand-icon {
		font-size: 28px;
		color: #674bb5;
		font-variation-settings: 'FILL' 1;
	}

	.dash-brand-sub {
		margin: 0;
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.15em;
		color: #7a7583;
		text-transform: uppercase;
	}

	.dash-brand-name {
		margin: 0;
		font-size: 18px;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.dash-user {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.user-avatar {
		width: 40px;
		height: 40px;
		border: 3px solid #1b1c19;
		border-radius: 0;
		object-fit: cover;
	}

	.user-avatar-placeholder {
		background: #efeee9;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.user-avatar-placeholder .material-symbols-outlined {
		font-size: 22px;
		color: #7a7583;
	}

	.user-info {
		display: flex;
		flex-direction: column;
	}

	.user-name {
		margin: 0;
		font-size: 14px;
		font-weight: 600;
		line-height: 1.2;
	}

	.user-email {
		margin: 0;
		font-size: 11px;
		color: #7a7583;
	}

	.logout-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px 14px;
		background: #faf9f4;
		border: 2px solid #1b1c19;
		box-shadow: 3px 3px 0px 0px #1b1c19;
		font-family: 'Space Grotesk', sans-serif;
		font-size: 13px;
		font-weight: 600;
		cursor: pointer;
		transition: transform 0.15s, box-shadow 0.15s;
	}

	.logout-btn:hover {
		transform: translate(-1px, -1px);
		box-shadow: 5px 5px 0px 0px #1b1c19;
	}

	.logout-btn:active {
		transform: translate(2px, 2px);
		box-shadow: 0px 0px 0px 0px #1b1c19;
	}

	.logout-btn .material-symbols-outlined {
		font-size: 18px;
	}

	/* Welcome banner */
	.welcome-banner {
		background: #674bb5;
		border: 4px solid #1b1c19;
		box-shadow: 8px 8px 0px 0px #1b1c19;
		padding: 32px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		overflow: hidden;
	}

	.welcome-tag {
		display: inline-block;
		background: #1b1c19;
		color: #faf9f4;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.15em;
		padding: 4px 10px;
		margin-bottom: 12px;
	}

	.welcome-title {
		margin: 0 0 10px;
		font-size: 28px;
		font-weight: 700;
		color: #fff;
		letter-spacing: -0.02em;
	}

	.welcome-desc {
		margin: 0;
		font-size: 14px;
		color: #cebdff;
		max-width: 440px;
		line-height: 1.6;
	}

	.welcome-deco {
		flex-shrink: 0;
		width: 80px;
		height: 80px;
		background: rgba(255, 255, 255, 0.1);
		border: 3px solid rgba(255, 255, 255, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.welcome-deco .material-symbols-outlined {
		font-size: 48px;
		color: rgba(255, 255, 255, 0.6);
		font-variation-settings: 'FILL' 1;
	}

	/* Nav cards grid */
	.nav-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}

	.nav-card {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 20px;
		border: 4px solid #1b1c19;
		box-shadow: 5px 5px 0px 0px #1b1c19;
		text-decoration: none;
		color: #1b1c19;
		transition: transform 0.15s, box-shadow 0.15s;
	}

	.nav-card:hover {
		transform: translate(-2px, -2px);
		box-shadow: 9px 9px 0px 0px #1b1c19;
	}

	.nav-card:active {
		transform: translate(3px, 3px);
		box-shadow: 0px 0px 0px 0px #1b1c19;
	}

	.nav-card--purple { background: #e8ddff; }
	.nav-card--blue   { background: #d3e4ff; }
	.nav-card--gray   { background: #efeee9; }
	.nav-card--black  { background: #1b1c19; color: #faf9f4; }

	.nav-card-icon {
		width: 44px;
		height: 44px;
		background: rgba(0,0,0,0.1);
		border: 2px solid currentColor;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.nav-card-icon .material-symbols-outlined {
		font-size: 22px;
		font-variation-settings: 'FILL' 1;
	}

	.nav-card-label {
		margin: 0 0 3px;
		font-size: 15px;
		font-weight: 700;
	}

	.nav-card-desc {
		margin: 0;
		font-size: 12px;
		opacity: 0.7;
	}

	.nav-card-arrow {
		margin-left: auto;
		font-size: 20px;
		flex-shrink: 0;
	}

	/* Status note */
	.status-note {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 12px;
		color: #7a7583;
		padding: 12px 16px;
		background: #fff;
		border: 2px solid #cac4d4;
	}

	.status-note .material-symbols-outlined {
		font-size: 16px;
		color: #674bb5;
		font-variation-settings: 'FILL' 1;
	}

	.status-note strong {
		color: #1b1c19;
	}

	@media (max-width: 600px) {
		.nav-grid { grid-template-columns: 1fr; }
		.welcome-deco { display: none; }
		.logout-label { display: none; }
		.user-info { display: none; }
	}
</style>
