<script>
	import { enhance } from '$app/forms';
	import Icon from '$lib/components/icons/Icon.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import NavCard from '$lib/components/ui/NavCard.svelte';
	import { showLoading, hideLoading } from '$lib/stores/loading.svelte.js';
	import { getSupabase } from '$lib/services/activityService.js';

	/** @type {import('./$types').PageData} */
	let { data } = $props();

	const user = $derived(data.user);
	let avatarError = $state(false);
	const avatarUrl = $derived(!avatarError ? (user?.user_metadata?.avatar_url ?? null) : null);
	const displayName = $derived(user?.user_metadata?.full_name ?? user?.email ?? 'Admin');
	const email = $derived(user?.email ?? '');

	function handleLogout() {
		showLoading('Mengeluarkan akun...');
		return async ({ update }) => {
			try {
				const supabase = getSupabase();
				await supabase.auth.signOut();
			} catch (err) {
				console.error('Client signout error:', err);
			}
			await update();
			hideLoading();
		};
	}
</script>

<svelte:head>
	<title>Dashboard — KIP-K UTDI Admin</title>
	<link
		href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="dashboard-page">
	<div class="grid-bg" aria-hidden="true"></div>

	<div class="dashboard-container">
		<!-- Header -->
		<header class="dash-header">
			<div class="dash-brand">
				<div class="brand-icon-wrap">
					<Icon name="shield_person" size={24} color="var(--primary-color)" />
				</div>
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
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px; color: #7a7583;">
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
							<circle cx="12" cy="7" r="4"></circle>
						</svg>
					</div>
				{/if}
				<div class="user-info">
					<p class="user-name">{displayName}</p>
					<p class="user-email">{email}</p>
				</div>
				<form method="POST" action="/admin/login?/logout" use:enhance={handleLogout}>
					<Button type="submit" variant="secondary" id="btn-logout" title="Keluar">
						<Icon name="logout" size={18} />
						<span class="logout-label">Keluar</span>
					</Button>
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
				<Icon name="admin_panel_settings" size={44} color="rgba(255, 255, 255, 0.6)" />
			</div>
		</div>

		<!-- Quick Nav Cards -->
		<section class="nav-grid">
			<NavCard 
				href="/admin/kegiatan" 
				id="link-nav-kegiatan"
				variant="purple"
				iconName="event"
				label="Kegiatan"
				desc="Tambah, edit, & hapus kegiatan"
			/>
			<NavCard 
				href="/admin/konten" 
				id="link-nav-konten"
				variant="blue"
				iconName="article"
				label="Visi / Misi / Tujuan"
				desc="Update konten halaman tentang"
			/>
			<NavCard 
				href="/admin/faq" 
				id="link-nav-faq"
				variant="green"
				iconName="quiz"
				label="FAQ"
				desc="Kelola pertanyaan & jawaban"
			/>
			<NavCard 
				href="/admin/whitelist" 
				id="link-nav-whitelist"
				variant="red"
				iconName="manage_accounts"
				label="Whitelist Admin"
				desc="Kelola akses email admin"
			/>
		</section>

		<!-- Status note -->
		<div class="status-note">
			<Icon name="check_circle" size={16} color="var(--primary-color)" />
			<span>Login sebagai <strong>{email}</strong> · Sesi aktif</span>
		</div>
	</div>
</div>

<style>
	.dashboard-page {
		min-height: 100vh;
		position: relative;
	}

	.dashboard-container {
		position: relative;
		z-index: 1;
		max-width: 960px;
		margin: 0 auto;
		padding: 12px 12px 48px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	@media (min-width: 768px) {
		.dashboard-container {
			padding: 24px 16px 48px;
			gap: 24px;
		}
	}

	/* Header */
	.dash-header {
		background: var(--surface-white);
		border: 4px solid var(--border-color);
		box-shadow: 6px 6px 0px 0px var(--shadow-color);
		padding: 12px 16px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		flex-wrap: wrap;
	}
	@media (min-width: 768px) {
		.dash-header {
			padding: 16px 24px;
		}
	}

	.dash-brand {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.brand-icon-wrap {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--primary-light, #e8ddff);
		border: 2px solid var(--border-color);
		flex-shrink: 0;
	}
	@media (min-width: 768px) {
		.brand-icon-wrap {
			width: 48px;
			height: 48px;
		}
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
		font-size: 16px;
		font-weight: 700;
		letter-spacing: -0.02em;
	}
	@media (min-width: 768px) {
		.dash-brand-name {
			font-size: 18px;
		}
	}

	.dash-user {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.user-avatar {
		width: 36px;
		height: 36px;
		border: 3px solid var(--border-color);
		border-radius: 0;
		object-fit: cover;
		flex-shrink: 0;
	}
	@media (min-width: 768px) {
		.user-avatar {
			width: 40px;
			height: 40px;
		}
	}

	.user-avatar-placeholder {
		background: var(--surface);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.user-info {
		display: none;
		flex-direction: column;
	}
	@media (min-width: 640px) {
		.user-info {
			display: flex;
		}
	}

	.user-name {
		margin: 0;
		font-size: 13px;
		font-weight: 600;
		line-height: 1.2;
		max-width: 160px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.user-email {
		margin: 0;
		font-size: 11px;
		color: #7a7583;
		max-width: 160px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* Welcome banner */
	.welcome-banner {
		background: var(--primary-color);
		border: 4px solid var(--border-color);
		box-shadow: 6px 6px 0px 0px var(--shadow-color);
		padding: 20px 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		overflow: hidden;
	}
	@media (min-width: 768px) {
		.welcome-banner {
			padding: 32px;
			box-shadow: 8px 8px 0px 0px var(--shadow-color);
		}
	}

	.welcome-tag {
		display: inline-block;
		background: var(--text-color);
		color: var(--surface-white);
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.15em;
		padding: 3px 8px;
		margin-bottom: 8px;
	}
	@media (min-width: 768px) {
		.welcome-tag {
			font-size: 11px;
			padding: 4px 10px;
			margin-bottom: 12px;
		}
	}

	.welcome-title {
		margin: 0 0 8px;
		font-size: 22px;
		font-weight: 700;
		color: #fff;
		letter-spacing: -0.02em;
	}
	@media (min-width: 768px) {
		.welcome-title {
			font-size: 28px;
			margin-bottom: 10px;
		}
	}

	.welcome-desc {
		margin: 0;
		font-size: 13px;
		color: #cebdff;
		max-width: 440px;
		line-height: 1.6;
	}
	@media (min-width: 768px) {
		.welcome-desc {
			font-size: 14px;
		}
	}

	.welcome-deco {
		display: none;
		flex-shrink: 0;
		width: 72px;
		height: 72px;
		background: rgba(255, 255, 255, 0.1);
		border: 3px solid rgba(255, 255, 255, 0.3);
		align-items: center;
		justify-content: center;
	}
	@media (min-width: 560px) {
		.welcome-deco {
			display: flex;
		}
	}
	@media (min-width: 768px) {
		.welcome-deco {
			width: 80px;
			height: 80px;
		}
	}

	/* Nav cards grid */
	.nav-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;
	}
	@media (min-width: 480px) {
		.nav-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (min-width: 768px) {
		.nav-grid {
			gap: 16px;
		}
	}

	.status-note {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		background: #faf9f4;
		border: 3px solid #1b1c19;
		padding: 10px 16px;
		width: 100%;
		font-size: 12px;
		text-align: center;
		flex-wrap: wrap;
		box-sizing: border-box;
	}
	@media (min-width: 640px) {
		.status-note {
			font-size: 13px;
			padding: 12px 24px;
			width: max-content;
			margin: 0 auto;
		}
	}

	.status-note strong {
		color: var(--text-color);
		word-break: break-all;
	}

	.logout-label {
		display: none;
	}
	@media (min-width: 480px) {
		.logout-label {
			display: inline;
		}
	}
</style>
