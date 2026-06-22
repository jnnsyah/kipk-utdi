<script>
	import { page } from '$app/stores';
	import Icon from '$lib/components/icons/Icon.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const status = $derived($page.status);
	const message = $derived($page.error?.message);

	const errorDetails = $derived(() => {
		const code = $page.status;
		if (code === 404) {
			return {
				title: 'Halaman Tidak Ditemukan',
				description: message || 'Waduh! Halaman yang Anda cari tidak ditemukan atau telah dipindahkan ke alamat lain.',
				icon: 'quiz',
				color: '#674bb5', // purple
				bgLight: '#e8ddff'
			};
		} else if (code === 403 || code === 401) {
			return {
				title: 'Akses Ditolak',
				description: message || 'Ups! Anda tidak memiliki izin/akses untuk membuka halaman ini.',
				icon: 'lock',
				color: '#e64a19', // orange/red
				bgLight: '#ffebee'
			};
		} else {
			return {
				title: 'Terjadi Kesalahan',
				description: message || 'Maaf, terjadi kesalahan internal di sistem kami. Silakan coba lagi nanti.',
				icon: 'error',
				color: '#d32f2f', // red
				bgLight: '#ffebee'
			};
		}
	});

	const details = $derived(errorDetails());
</script>

<svelte:head>
	<title>{status} — {details.title}</title>
	<link
		href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="error-page">
	<div class="grid-bg" aria-hidden="true"></div>

	<div class="error-container">
		<div class="error-card" style="--accent-color: {details.color}; --accent-bg: {details.bgLight}">
			<!-- Card Header Accent -->
			<div class="card-accent-bar"></div>

			<!-- Large Error Status Code -->
			<h1 class="error-code">{status}</h1>

			<!-- Icon in container with soft neo-brutalist style -->
			<div class="icon-wrapper">
				<Icon name={details.icon} size={40} color="var(--border-color)" />
			</div>

			<!-- Title and description -->
			<div class="error-text">
				<h2 class="error-title">{details.title}</h2>
				<p class="error-desc">{details.description}</p>
			</div>

			<!-- Action Buttons -->
			<div class="error-actions">
				<Button href="/" variant="primary" id="btn-error-home">
					<Icon name="arrow_back" size={18} />
					<span>Kembali ke Beranda</span>
				</Button>
			</div>
		</div>
	</div>
</div>

<style>
	.error-page {
		min-height: 100vh;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		overflow: hidden;
		background-color: var(--bg-color, #faf9f4);
		font-family: 'Space Grotesk', sans-serif;
	}

	.error-container {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: 520px;
		display: flex;
		justify-content: center;
	}

	.error-card {
		background: var(--surface-white, #fff);
		border: 4px solid var(--border-color, #1b1c19);
		box-shadow: 8px 8px 0px 0px var(--shadow-color, #1b1c19);
		padding: 3rem 2rem 2.5rem;
		width: 100%;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 24px;
		position: relative;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.error-card:hover {
		transform: translate(-2px, -2px);
		box-shadow: 10px 10px 0px 0px var(--shadow-color, #1b1c19);
	}

	/* Card top colored accent bar */
	.card-accent-bar {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 8px;
		background: var(--accent-color);
		border-bottom: 3px solid var(--border-color, #1b1c19);
	}

	/* Giant Error Code with text outline & shadow */
	.error-code {
		font-size: 7.5rem;
		font-weight: 800;
		line-height: 1;
		margin: 0;
		font-family: 'Space Grotesk', sans-serif;
		color: var(--accent-bg);
		-webkit-text-stroke: 3px var(--border-color);
		text-shadow: 6px 6px 0px var(--border-color);
		user-select: none;
		position: relative;
		transition: transform 0.2s ease, text-shadow 0.2s ease;
	}

	.error-card:hover .error-code {
		transform: scale(1.03) rotate(-2deg);
		text-shadow: 8px 8px 0px var(--border-color);
	}

	/* Icon Wrapper styling */
	.icon-wrapper {
		width: 72px;
		height: 72px;
		background: var(--accent-bg);
		border: 3px solid var(--border-color);
		box-shadow: 4px 4px 0px 0px var(--border-color);
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0;
		animation: float 4s ease-in-out infinite;
	}

	/* Floating animation for the icon */
	@keyframes float {
		0%, 100% {
			transform: translateY(0) rotate(0deg);
		}
		50% {
			transform: translateY(-6px) rotate(3deg);
		}
	}

	/* Message elements */
	.error-text {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.error-title {
		font-size: 24px;
		font-weight: 700;
		margin: 0;
		color: var(--text-color, #1b1c19);
		letter-spacing: -0.02em;
	}

	.error-desc {
		font-size: 14px;
		color: #555;
		line-height: 1.6;
		margin: 0;
		max-width: 380px;
	}

	/* Action Buttons Container */
	.error-actions {
		display: flex;
		gap: 16px;
		width: 100%;
		justify-content: center;
		margin-top: 8px;
		flex-wrap: wrap;
	}

	/* Responsive tweaks */
	@media (max-width: 480px) {
		.error-card {
			padding: 2.5rem 1.5rem 2rem;
		}
		.error-code {
			font-size: 5.5rem;
			text-shadow: 4px 4px 0px var(--border-color);
		}
		.error-actions {
			flex-direction: column;
		}
		:global(.error-actions > *) {
			width: 100%;
		}
	}
</style>
