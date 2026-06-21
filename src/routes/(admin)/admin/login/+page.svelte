<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Icon from '$lib/components/icons/Icon.svelte';

	/** @type {import('./$types').ActionData} */
	let { form } = $props();

	// Ambil error dari URL search params (dikirim dari auth callback)
	const errorParam = $derived($page.url.searchParams.get('error'));

	// errorMessage di dalam $derived agar semua searchParams dibaca reaktif
	const errorMessage = $derived(() => {
		const email = $page.url.searchParams.get('email');
		const err = $page.url.searchParams.get('error');
		const messages = {
			oauth_failed: 'Proses autentikasi Google gagal. Silakan coba lagi.',
			not_authorized: email
				? `Email <strong>${email}</strong> tidak terdaftar sebagai admin. Hubungi administrator untuk mendapatkan akses.`
				: 'Akun Google Anda tidak terdaftar sebagai admin.',
			no_email: 'Gagal mengambil informasi email dari akun Google Anda.'
		};
		return err ? (messages[err] ?? null) : null;
	});

	let isLoading = $state(false);
</script>

<svelte:head>
	<title>Login Admin — KIP-K UTDI</title>
	<meta name="description" content="Halaman login khusus admin KIP-K UTDI." />
	<meta name="robots" content="noindex, nofollow" />
	<link
		href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<!-- Grid background pattern -->
<div class="login-page">
	<!-- Decorative grid background -->
	<div class="grid-bg" aria-hidden="true"></div>

	<!-- Floating decorative shapes -->
	<div class="deco-shape deco-1" aria-hidden="true">ADMIN</div>
	<div class="deco-shape deco-2" aria-hidden="true">KIP-K</div>
	<div class="deco-shape deco-3" aria-hidden="true">UTDI</div>

	<main class="login-main">
		<!-- Logo / Brand area -->
		<div class="brand-area">
			<div class="brand-badge">
				<Icon name="shield_person" size={28} color="#fff" />
			</div>
			<div class="brand-text">
				<p class="brand-subtitle">PANEL ADMIN</p>
				<h1 class="brand-title">KIP-K UTDI</h1>
			</div>
		</div>

		<!-- Login Card -->
		<div class="login-card">
			<!-- Card header stripe -->
			<div class="card-header">
				<Icon name="lock" size={18} />
				<span>Akses Terbatas</span>
			</div>

			<!-- Card body -->
			<div class="card-body">
				<h2 class="card-title">Masuk ke Dashboard</h2>
				<p class="card-desc">
					Gunakan akun Google yang telah terdaftar sebagai admin untuk mengakses panel pengelolaan.
				</p>

				<!-- Error alert -->
				{#if errorMessage()}
					<div class="error-alert" role="alert">
						<Icon name="error" size={20} color="#ba1a1a" class="error-icon" />
						<p>{@html errorMessage()}</p>
					</div>
				{/if}


				<!-- Google OAuth Login Form -->
				<form
					method="POST"
					action="?/login"
					use:enhance={() => {
						isLoading = true;
						return async ({ update }) => {
							await update();
							isLoading = false;
						};
					}}
				>
					<button type="submit" class="google-btn" disabled={isLoading} id="btn-google-login">
						{#if isLoading}
							<span class="spinner"></span>
							<span>Mengarahkan...</span>
						{:else}
							<!-- Google Icon (inline SVG) -->
							<svg
								class="google-icon"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
							>
								<path
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									fill="#4285F4"
								/>
								<path
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									fill="#34A853"
								/>
								<path
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									fill="#FBBC05"
								/>
								<path
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									fill="#EA4335"
								/>
							</svg>
							<span>Masuk dengan Google</span>
						{/if}
					</button>
				</form>

				<!-- Info note -->
				<div class="info-note">
					<Icon name="info" size={18} color="var(--primary-color)" class="info-icon" />
					<p>
						Hanya email yang terdaftar di <strong>whitelist admin</strong> yang dapat mengakses
						dashboard. Hubungi Superadmin jika perlu ditambahkan.
					</p>
				</div>
			</div>
		</div>

		<!-- Back to public site link -->
		<a href="/" class="back-link" id="link-back-to-site">
			<Icon name="arrow_back" size={16} />
			Kembali ke Halaman Utama
		</a>
	</main>
</div>

<style>
	/* ─────────────────────────────────────────
	   LAYOUT
	───────────────────────────────────────── */
	.login-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px 16px;
		position: relative;
		overflow: hidden;
	}

	.login-main {
		position: relative;
		z-index: 10;
		width: 100%;
		max-width: 440px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 28px;
	}

	/* ─────────────────────────────────────────
	   DECORATIVE FLOATING SHAPES
	───────────────────────────────────────── */
	.deco-shape {
		position: fixed;
		font-family: 'Space Grotesk', sans-serif;
		font-weight: 700;
		border: 4px solid var(--border-color);
		pointer-events: none;
		z-index: 1;
		user-select: none;
	}

	.deco-1 {
		top: 8%;
		left: 4%;
		font-size: 14px;
		padding: 6px 12px;
		background: #a78bfa;
		color: var(--text-color);
		transform: rotate(-8deg);
		box-shadow: 4px 4px 0px 0px var(--shadow-color);
		animation: float1 6s ease-in-out infinite;
	}

	.deco-2 {
		bottom: 12%;
		left: 6%;
		font-size: 12px;
		padding: 5px 10px;
		background: #6aaeff;
		color: #fff;
		transform: rotate(5deg);
		box-shadow: 4px 4px 0px 0px var(--shadow-color);
		animation: float2 7s ease-in-out infinite;
	}

	.deco-3 {
		top: 10%;
		right: 5%;
		font-size: 13px;
		padding: 6px 12px;
		background: var(--bg-color);
		color: var(--text-color);
		transform: rotate(10deg);
		box-shadow: 4px 4px 0px 0px var(--shadow-color);
		animation: float3 8s ease-in-out infinite;
	}

	@keyframes float1 {
		0%, 100% { transform: rotate(-8deg) translateY(0); }
		50% { transform: rotate(-8deg) translateY(-12px); }
	}
	@keyframes float2 {
		0%, 100% { transform: rotate(5deg) translateY(0); }
		50% { transform: rotate(5deg) translateY(-10px); }
	}
	@keyframes float3 {
		0%, 100% { transform: rotate(10deg) translateY(0); }
		50% { transform: rotate(10deg) translateY(-14px); }
	}

	/* ─────────────────────────────────────────
	   BRAND AREA
	───────────────────────────────────────── */
	.brand-area {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.brand-badge {
		width: 56px;
		height: 56px;
		background: var(--primary-color);
		border: 4px solid var(--border-color);
		box-shadow: 5px 5px 0px 0px var(--shadow-color);
		display: flex;
		align-items: center;
		justify-content: center;
		transform: rotate(-3deg);
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.brand-badge:hover {
		transform: rotate(-3deg) translate(-2px, -2px);
		box-shadow: 7px 7px 0px 0px var(--shadow-color);
	}

	.brand-text {
		display: flex;
		flex-direction: column;
	}

	.brand-subtitle {
		margin: 0;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.2em;
		color: #7a7583;
		text-transform: uppercase;
	}

	.brand-title {
		margin: 0;
		font-size: 28px;
		font-weight: 700;
		line-height: 1;
		color: var(--text-color);
		letter-spacing: -0.02em;
	}

	/* ─────────────────────────────────────────
	   LOGIN CARD
	───────────────────────────────────────── */
	.login-card {
		width: 100%;
		background: #fff;
		border: 4px solid var(--border-color);
		box-shadow: 8px 8px 0px 0px var(--shadow-color);
		transition: box-shadow 0.2s, transform 0.2s;
	}

	.card-header {
		background: var(--border-color);
		color: var(--bg-color);
		padding: 12px 24px;
		display: flex;
		align-items: center;
		gap: 8px;
		font-weight: 700;
		font-size: 13px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.card-body {
		padding: 32px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.card-title {
		margin: 0;
		font-size: 24px;
		font-weight: 700;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	.card-desc {
		margin: 0;
		font-size: 14px;
		line-height: 1.6;
		color: #494552;
	}

	/* ─────────────────────────────────────────
	   ERROR ALERT
	───────────────────────────────────────── */
	.error-alert {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 16px;
		background: #ffdad6;
		border: 3px solid #ba1a1a;
		box-shadow: 4px 4px 0px 0px #ba1a1a;
	}

	.error-icon {
		flex-shrink: 0;
		margin-top: 1px;
	}

	.error-alert p {
		margin: 0;
		font-size: 13px;
		line-height: 1.5;
		color: #93000a;
		font-weight: 500;
	}

	/* ─────────────────────────────────────────
	   GOOGLE LOGIN BUTTON
	───────────────────────────────────────── */
	.google-btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		padding: 16px 24px;
		background: var(--bg-color);
		border: 4px solid var(--border-color);
		box-shadow: 6px 6px 0px 0px var(--shadow-color);
		font-family: 'Space Grotesk', sans-serif;
		font-size: 16px;
		font-weight: 700;
		color: var(--text-color);
		cursor: pointer;
		transition:
			transform 0.15s,
			box-shadow 0.15s,
			background 0.15s;
		position: relative;
	}

	.google-btn:hover:not(:disabled) {
		transform: translate(-2px, -2px);
		box-shadow: 10px 10px 0px 0px var(--shadow-color);
		background: var(--primary-light);
	}

	.google-btn:active:not(:disabled) {
		transform: translate(4px, 4px);
		box-shadow: 0px 0px 0px 0px var(--shadow-color);
	}

	.google-btn:disabled {
		cursor: not-allowed;
		opacity: 0.7;
	}

	.google-icon {
		width: 22px;
		height: 22px;
		flex-shrink: 0;
	}

	/* Spinner animation */
	.spinner {
		width: 20px;
		height: 20px;
		border: 3px solid var(--border-color);
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
		flex-shrink: 0;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	/* ─────────────────────────────────────────
	   INFO NOTE
	───────────────────────────────────────── */
	.info-note {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		padding: 14px;
		background: var(--surface);
		border: 2px solid #cac4d4;
	}

	.info-icon {
		flex-shrink: 0;
		margin-top: 1px;
	}

	.info-note p {
		margin: 0;
		font-size: 12px;
		line-height: 1.6;
		color: #494552;
	}

	.info-note p strong {
		color: var(--text-color);
	}

	/* ─────────────────────────────────────────
	   BACK LINK
	───────────────────────────────────────── */
	.back-link {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		font-weight: 600;
		color: #7a7583;
		text-decoration: none;
		padding: 8px 12px;
		border: 2px solid transparent;
		transition:
			color 0.15s,
			border-color 0.15s,
			transform 0.15s;
	}

	.back-link:hover {
		color: var(--primary-color);
		border-color: var(--primary-color);
		transform: translateX(-3px);
	}

	/* ─────────────────────────────────────────
	   RESPONSIVE
	───────────────────────────────────────── */
	@media (max-width: 480px) {
		.card-body {
			padding: 24px 20px;
		}

		.deco-1, .deco-2, .deco-3 {
			display: none;
		}

		.brand-title {
			font-size: 24px;
		}
	}
</style>
