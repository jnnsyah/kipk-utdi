<script>
	import { onMount } from 'svelte';
	import favicon from '$lib/assets/favicon.png';
	import IndexLoading from '$lib/components/ui/IndexLoading.svelte';
	let { data } = $props();
	let { activities = [], faqs = [] } = data;

	let isLoading = $state(true);


	// Drawer state
	let isDrawerOpen = $state(false);
	let selectedActivity = $state(null);
	let activePhotoIndex = $state(0);
	let drawerOpenScrollY = 0;

	// FAQ state
	let activeFaq = $state(null);

	// Slider logic
	let drawerInterval;
	let freezeTimeout;

	function startDrawerAutoSlide() {
		stopDrawerAutoSlide();
		if (!selectedActivity || !selectedActivity.photos || selectedActivity.photos.length <= 1) return;
		drawerInterval = setInterval(() => {
			slidePhoto(1, false);
		}, 3000);
	}

	function stopDrawerAutoSlide() {
		if (drawerInterval) clearInterval(drawerInterval);
	}

	function openDetailDrawer(activity) {
		selectedActivity = activity;
		activePhotoIndex = 0;
		isDrawerOpen = true;
		drawerOpenScrollY = window.scrollY;
		if (window.innerWidth < 768) {
			document.body.style.overflow = 'hidden';
		}
		startDrawerAutoSlide();
	}

	function closeDetailDrawer() {
		isDrawerOpen = false;
		if (window.innerWidth < 768) {
			document.body.style.overflow = '';
		}
		stopDrawerAutoSlide();
		setTimeout(() => {
			if (!isDrawerOpen) {
				selectedActivity = null;
			}
		}, 500);
	}

	function slidePhoto(dir, manual = true) {
		if (!selectedActivity || !selectedActivity.photos || selectedActivity.photos.length === 0) return;
		const total = selectedActivity.photos.length;
		activePhotoIndex = (activePhotoIndex + dir + total) % total;
		
		if (manual) {
			stopDrawerAutoSlide();
			if (freezeTimeout) clearTimeout(freezeTimeout);
			freezeTimeout = setTimeout(() => {
				startDrawerAutoSlide();
			}, 5000);
		}
	}

	function toggleFaq(id) {
		activeFaq = activeFaq === id ? null : id;
	}

	onMount(() => {
		// Simulate data fetching delay for the custom loading page
		setTimeout(() => {
			isLoading = false;
		}, 3000);

		const handleScroll = () => {
			if (isDrawerOpen) {
				if (Math.abs(window.scrollY - drawerOpenScrollY) > 50) {
					closeDetailDrawer();
				}
			}
		};
		window.addEventListener('scroll', handleScroll);

		startActivitiesAutoScroll();

		// Observer for footer
		const footerObserver = new IntersectionObserver((entries) => {
			isFooterVisible = entries[0].isIntersecting;
		}, { rootMargin: '50px' });

		if (footerElement) {
			footerObserver.observe(footerElement);
		}

		return () => {
			window.removeEventListener('scroll', handleScroll);
			stopActivitiesAutoScroll();
			stopDrawerAutoSlide();
			if (footerElement) footerObserver.disconnect();
		};
	});

	// Activities Container Auto Scroll
	let activitiesContainer;
	let activitiesScrollInterval;

	// Footer visibility state for navbar
	let isFooterVisible = $state(false);
	let footerElement;

	function startActivitiesAutoScroll() {
		stopActivitiesAutoScroll();
		activitiesScrollInterval = setInterval(() => {
			if (activitiesContainer) {
				const maxScroll = activitiesContainer.scrollWidth - activitiesContainer.clientWidth;
				if (activitiesContainer.scrollLeft >= maxScroll - 10) {
					activitiesContainer.scrollTo({ left: 0, behavior: 'smooth' });
				} else {
					let scrollAmount = window.innerWidth >= 768 ? 474 : 344;
					activitiesContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
				}
			}
		}, 4000);
	}

	function stopActivitiesAutoScroll() {
		if (activitiesScrollInterval) clearInterval(activitiesScrollInterval);
	}

	// Helper to get formatted date
	function formatDate(dateString) {
		if (!dateString) return '';
		return new Date(dateString).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	let mobileMenuOpen = $state(false);
</script>

<svelte:head>
	<title>KIP-K UTDI - Komunitas Mahasiswa</title>
</svelte:head>

<!-- Global overrides and custom styles from ui.html that are not purely tailwind variables -->
<style>
	.custom-scrollbar::-webkit-scrollbar {
		height: 12px;
		width: 8px;
	}

	.custom-scrollbar::-webkit-scrollbar-track {
		background: var(--color-surface-container);
		border: 2px solid var(--color-on-background);
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: var(--color-primary);
		border: 2px solid var(--color-on-background);
	}

	.accordion-content {
		max-height: 0;
		overflow: hidden;
		transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		opacity: 0;
		transform: translateY(-10px) rotate(0deg);
	}

	.accordion-open .accordion-content {
		max-height: 500px;
		opacity: 1;
		transform: translateY(16px) rotate(-1deg);
		margin-bottom: 24px;
	}

	.accordion-open .arrow-icon {
		transform: rotate(180deg);
	}

	.grid-bg-header {
		background-image: linear-gradient(to right, rgb(219, 218, 213) 1px, transparent 1px),
			linear-gradient(rgb(219, 218, 213) 1px, transparent 1px);
		background-size: 40px 40px;
	}
	
	.hero-radial {
		background: radial-gradient(circle, rgba(250, 249, 244, 0.9) 0%, rgba(250, 249, 244, 0.6) 50%, transparent 100%);
	}
</style>

{#if isLoading}
	<IndexLoading />
{/if}

<div class="bg-background font-body-md text-on-background selection:bg-primary-container relative overflow-x-hidden min-h-screen">
	<div id="main-wrapper" class="transition-[padding] duration-500 ease-in-out w-full box-border" class:md:pr-[504px]={isDrawerOpen}>
		
		<div class="relative w-full">
			<div class="absolute inset-0 z-0 grid-bg-header"></div>
			
			<nav class="fixed left-1/2 w-[90%] md:w-max z-50 bg-surface border-4 border-on-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] {mobileMenuOpen ? 'rounded-[32px]' : 'rounded-full'} px-8 transition-all duration-500 {isFooterVisible ? '-top-32' : 'top-6'} {isDrawerOpen ? 'max-md:-translate-x-1/2 md:-translate-x-[calc(50%+252px)]' : '-translate-x-1/2'}">
				<div class="flex justify-between items-center gap-12 py-3">
					<div class="flex items-center gap-3 pr-4">
						<img src={favicon} alt="Logo KIP-K UTDI" class="h-10 w-auto" />
						<span class="font-display text-headline-md text-on-background tracking-tighter">KIP-K UTDI</span>
					</div>
					<div class="hidden md:flex gap-4 lg:gap-8 items-center">
						<a class="font-label-bold text-label-bold px-3 py-2 rounded-lg border-2 border-transparent hover:border-on-background hover:bg-primary-fixed hover:-translate-y-1 transition-all" href="#home">Beranda</a>
						<a class="font-label-bold text-label-bold text-on-background px-3 py-2 rounded-lg border-2 border-transparent hover:border-on-background hover:bg-secondary-container hover:-translate-y-1 transition-all" href="#tentang">Tentang</a>
						<a class="font-label-bold text-label-bold text-on-background px-3 py-2 rounded-lg border-2 border-transparent hover:border-on-background hover:bg-tertiary-fixed hover:-translate-y-1 transition-all" href="#kegiatan">Kegiatan</a>
						<a class="font-label-bold text-label-bold text-on-background px-3 py-2 rounded-lg border-2 border-transparent hover:border-on-background hover:bg-primary-fixed hover:-translate-y-1 transition-all" href="#faq">FAQ</a>
					</div>
					<button class="md:hidden p-2 border-2 border-on-background bg-surface-container hover:bg-primary-container hover:text-on-primary-container transition-all duration-300 rounded-lg {mobileMenuOpen ? 'rotate-90' : ''}" onclick={() => mobileMenuOpen = !mobileMenuOpen}>
						<span class="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
					</button>
				</div>
				{#if mobileMenuOpen}
				<div class="md:hidden flex flex-col gap-2 mt-2 pb-6 px-2">
					<a class="font-label-bold text-primary px-4 py-3 border-2 border-transparent hover:border-on-background hover:bg-primary-fixed rounded-xl transition-all" href="#home" onclick={() => mobileMenuOpen = false}>Beranda</a>
					<a class="font-label-bold text-on-background px-4 py-3 border-2 border-transparent hover:border-on-background hover:bg-secondary-container rounded-xl transition-all" href="#tentang" onclick={() => mobileMenuOpen = false}>Tentang</a>
					<a class="font-label-bold text-on-background px-4 py-3 border-2 border-transparent hover:border-on-background hover:bg-tertiary-fixed rounded-xl transition-all" href="#kegiatan" onclick={() => mobileMenuOpen = false}>Kegiatan</a>
					<a class="font-label-bold text-on-background px-4 py-3 border-2 border-transparent hover:border-on-background hover:bg-primary-fixed rounded-xl transition-all" href="#faq" onclick={() => mobileMenuOpen = false}>FAQ</a>
				</div>
				{/if}
			</nav>

			<header id="home" class="relative overflow-hidden pt-36 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto transition-all duration-500 z-10">
				<div class="grid grid-cols-1 gap-12 items-center">
					<div class="z-10 text-center mx-auto flex flex-col items-center rounded-full hero-radial p-8">
						<h1 class="font-display mb-12 leading-tight">
							<span class="text-[24px] md:text-[32px] block mb-6 font-label-bold bg-secondary-container text-on-secondary-container px-6 py-2 border-4 border-on-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block rotate-2 transform hover:rotate-0 hover:scale-105 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all cursor-default">Komunitas</span><br>
							<span class="bg-[#3b82f6] text-white px-8 py-3 border-4 border-on-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block -rotate-2 transform -skew-x-6 my-4 text-[48px] md:text-[72px] leading-none font-label-bold font-bold hover:rotate-0 hover:skew-x-0 hover:scale-110 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:bg-primary transition-all duration-300 cursor-default">KIP-Kuliah</span><br>
							<span class="text-primary text-[24px] md:text-[40px] block mt-6 font-label-bold hover:tracking-wide transition-all duration-300 cursor-default">Universitas Teknologi Digital Indonesia</span>
						</h1>
						<p class="font-body-lg text-body-lg mb-10 max-w-xl text-on-surface-variant hover:text-on-background transition-colors cursor-default">
							Wadah inspirasi, kolaborasi, dan pemberdayaan bagi mahasiswa penerima KIP Kuliah untuk berkarya nyata.
						</p>
						<div class="flex flex-wrap gap-4 justify-center">
							<a href="https://utdi.id/kip-kuliah" target="_blank" rel="noopener noreferrer" class="bg-primary text-on-primary px-8 py-4 border-4 border-on-background neo-shadow font-headline-md neo-hover neo-active transition-all block text-center">
								Informasi Pendaftaran
							</a>
						</div>
					</div>
				</div>
			</header>
		</div>

		<section id="tentang" class="bg-surface-container py-24 px-margin-mobile md:px-margin-desktop transition-all duration-500">
			<div class="max-w-container-max mx-auto">
				<div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
					<div>
						<h2 class="font-display text-display text-4xl mb-4 font-bold">Tentang Kami</h2>
						<p class="font-body-lg text-body-lg text-on-surface-variant">Mengenal lebih dekat visi dan misi kami di UTDI.</p>
					</div>
					<div class="hidden md:block w-32 h-4 bg-on-background"></div>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
					<div class="bg-surface p-8 border-4 border-on-background neo-shadow neo-hover transition-all group hover:bg-primary-fixed">
						<div class="w-16 h-16 bg-primary-container border-2 border-on-background flex items-center justify-center mb-6 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300">
							<span class="material-symbols-outlined text-[40px]" style="font-variation-settings: 'FILL' 1">lightbulb</span>
						</div>
						<h3 class="font-headline-lg text-2xl font-bold mb-4 group-hover:text-primary transition-colors">Visi</h3>
						<p class="font-body-md text-body-md text-on-surface-variant group-hover:text-on-background transition-colors">
							Menjadi komunitas mahasiswa yang unggul dalam akademik dan kolaboratif.
						</p>
					</div>
					<div class="bg-surface p-8 border-4 border-on-background neo-shadow neo-hover transition-all group hover:bg-secondary-fixed">
						<div class="w-16 h-16 bg-secondary-container border-2 border-on-background flex items-center justify-center mb-6 group-hover:-rotate-12 group-hover:scale-110 transition-transform duration-300">
							<span class="material-symbols-outlined text-[40px]" style="font-variation-settings: 'FILL' 1">rocket_launch</span>
						</div>
						<h3 class="font-headline-lg text-2xl font-bold mb-4 group-hover:text-secondary transition-colors">Misi</h3>
						<p class="font-body-md text-body-md text-on-surface-variant group-hover:text-on-background transition-colors">
							Mengembangkan potensi kepemimpinan dan soft skills mahasiswa melalui berbagai program pelatihan.
						</p>
					</div>
					<div class="bg-surface p-8 border-4 border-on-background neo-shadow neo-hover transition-all group hover:bg-tertiary-fixed">
						<div class="w-16 h-16 bg-surface border-2 border-on-background flex items-center justify-center mb-6 group-hover:rotate-180 group-hover:bg-primary-container transition-all duration-500">
							<span class="material-symbols-outlined text-[40px]" style="font-variation-settings: 'FILL' 1">ads_click</span>
						</div>
						<h3 class="font-headline-lg text-2xl font-bold mb-4">Tujuan</h3>
						<p class="font-body-md text-body-md text-on-surface-variant group-hover:text-on-background transition-colors">
							Membangun jejaring yang kuat antar penerima KIP-K serta menciptakan ekosistem belajar yang suportif dan inklusif.
						</p>
					</div>
				</div>
			</div>
		</section>

		<section id="kegiatan" class="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto overflow-hidden transition-all duration-500">
			<div class="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
				<h2 class="font-display text-display text-4xl font-bold">Kegiatan Kami</h2>
				<div class="flex items-center gap-4 bg-surface p-2 border-4 border-on-background neo-shadow-sm">
					<span class="font-label-bold px-4">Tahun:</span>
					<button class="bg-primary text-on-primary px-6 py-2 border-2 border-on-background font-label-bold">Terbaru</button>
				</div>
			</div>
			
			{#if activities.length > 0}
			<div class="flex overflow-x-auto gap-gutter pb-12 custom-scrollbar snap-x scroll-smooth" bind:this={activitiesContainer} onmouseenter={stopActivitiesAutoScroll} onmouseleave={startActivitiesAutoScroll} ontouchstart={stopActivitiesAutoScroll} ontouchend={startActivitiesAutoScroll}>
				{#each activities as activity}
				<div class="min-w-[320px] md:min-w-[450px] bg-surface border-4 border-on-background neo-shadow snap-start flex flex-col group hover:bg-surface-container-low transition-colors duration-300">
					<div class="h-64 overflow-hidden border-b-4 border-on-background relative">
						{#if activity.photos && activity.photos.length > 0}
						<img src={activity.photos[0]} alt={activity.title} class="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105" loading="lazy">
						{:else}
						<div class="w-full h-full bg-surface-variant flex items-center justify-center group-hover:bg-primary-fixed transition-colors duration-300">
							<span class="material-symbols-outlined text-6xl text-on-surface-variant group-hover:scale-110 transition-transform duration-300">image</span>
						</div>
						{/if}
						<div class="absolute top-4 left-4 bg-on-background text-background px-4 py-1 font-label-bold uppercase group-hover:bg-primary transition-colors">
							{activity.tag || 'KEGIATAN'}
						</div>
						<div class="absolute top-4 right-4 bg-surface text-on-surface border-2 border-on-background px-3 py-[2px] font-label-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
							{new Date(activity.date).getFullYear()}
						</div>
					</div>
					<div class="p-8 flex flex-col flex-1 justify-between">
						<div>
							<div class="flex items-center gap-2 text-primary font-label-bold mb-3 group-hover:translate-x-1 transition-transform">
								<span class="material-symbols-outlined text-[18px]">calendar_today</span>
								{formatDate(activity.date)}
							</div>
							<h3 class="font-headline-md text-xl font-bold mb-6 h-14 line-clamp-2 group-hover:text-primary transition-colors">{activity.title}</h3>
						</div>
						<button onclick={() => openDetailDrawer(activity)} class="w-full bg-primary-fixed text-on-primary-fixed px-6 py-3 border-4 border-on-background neo-shadow-sm font-label-bold neo-hover neo-active transition-all flex justify-between items-center mt-auto group-hover:bg-primary group-hover:text-on-primary">
							Lihat Detail
							<span class="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
						</button>
					</div>
				</div>
				{/each}
			</div>
			{:else}
			<div class="bg-surface-variant p-8 text-center border-4 border-on-background neo-shadow">
				<p class="font-body-lg">Belum ada kegiatan yang dipublikasikan.</p>
			</div>
			{/if}
		</section>

		<section id="faq" class="bg-surface-container py-24 px-margin-mobile md:px-margin-desktop transition-all duration-500">
			<div class="max-w-3xl mx-auto">
				<h2 class="font-display text-display text-4xl font-bold mb-12 text-center">Tanya Jawab (FAQ)</h2>
				{#if faqs.length > 0}
				<div class="space-y-8">
					{#each faqs as faq, index}
					<div class="faq-item group" class:accordion-open={activeFaq === faq.id}>
						<button class="relative z-10 w-full flex justify-between items-center p-6 text-left focus:outline-none bg-surface hover:bg-primary-fixed border-4 border-on-background neo-shadow-sm transition-all neo-hover {index % 2 === 0 ? 'rotate-1 hover:rotate-0' : '-rotate-1 hover:rotate-0'} {activeFaq === faq.id ? 'neo-shadow bg-primary-fixed' : ''}" onclick={() => toggleFaq(faq.id)}>
							<span class="font-headline-md text-xl font-bold group-hover:translate-x-2 transition-transform">{faq.question}</span>
							<span class="material-symbols-outlined arrow-icon transition-transform duration-300 group-hover:scale-125">keyboard_arrow_down</span>
						</button>
						<div class="accordion-content" style="transform: translateY(16px) rotate(0deg) !important;">
							<div class="p-8 border-4 border-on-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-body-md font-bold rotate-0 
								{index % 3 === 0 ? 'bg-primary-container text-on-primary-container' : index % 3 === 1 ? 'bg-secondary-container text-on-secondary-container' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'}">
								{@html faq.answer}
							</div>
						</div>
					</div>
					{/each}
				</div>
				{:else}
				<div class="bg-surface p-8 text-center border-4 border-on-background neo-shadow">
					<p class="font-body-lg">Belum ada FAQ yang ditambahkan.</p>
				</div>
				{/if}
			</div>
		</section>

		<footer bind:this={footerElement} class="bg-surface-container-high border-t-4 border-on-background py-16 px-margin-mobile md:px-margin-desktop transition-all duration-500">
			<div class="max-w-container-max mx-auto">
				<div class="flex flex-col md:flex-row justify-between gap-12 mb-16">
					<div class="max-w-md">
						<div class="flex items-center gap-4 mb-6">
							<div>
								<p class="font-display text-headline-md text-2xl font-bold leading-tight">KIP-K UTDI</p>
								<p class="font-body-md text-on-surface-variant">Universitas Teknologi Digital Indonesia</p>
							</div>
						</div>
						<p class="font-body-md text-on-surface-variant mb-8">
							Membangun generasi emas digital yang berprestasi dan berkarakter melalui kolaborasi.
						</p>
						<div class="flex gap-4">
							<a class="w-12 h-12 bg-on-background text-background flex items-center justify-center neo-shadow-sm neo-hover hover:-translate-y-2 hover:-rotate-12 transition-all" href="#">
								<span class="material-symbols-outlined">share</span>
							</a>
							<a class="w-12 h-12 bg-primary text-on-primary flex items-center justify-center border-4 border-on-background neo-shadow-sm neo-hover hover:-translate-y-2 hover:rotate-12 hover:bg-primary-container hover:text-on-primary-container transition-all" href="#">
								<span class="material-symbols-outlined">group</span>
							</a>
							<a class="w-12 h-12 bg-secondary text-on-secondary flex items-center justify-center border-4 border-on-background neo-shadow-sm neo-hover hover:-translate-y-2 hover:rotate-12 hover:bg-secondary-container hover:text-on-secondary-container transition-all" href="#">
								<span class="material-symbols-outlined">mail</span>
							</a>
						</div>
					</div>
					<div class="grid grid-cols-2 gap-12">
						<div>
							<h4 class="font-label-bold text-label-bold uppercase tracking-widest mb-6">Navigasi</h4>
							<ul class="space-y-4">
								<li><a class="font-body-md hover:text-primary hover:translate-x-2 inline-block transition-all" href="#home">Beranda</a></li>
								<li><a class="font-body-md hover:text-primary hover:translate-x-2 inline-block transition-all" href="#tentang">Tentang</a></li>
								<li><a class="font-body-md hover:text-primary hover:translate-x-2 inline-block transition-all" href="#kegiatan">Kegiatan</a></li>
								<li><a class="font-body-md hover:text-primary hover:translate-x-2 inline-block transition-all" href="#faq">FAQ</a></li>
							</ul>
						</div>
					</div>
				</div>
				<div class="pt-12 border-t-2 border-on-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
					<p class="font-body-md text-on-surface-variant">© KIP-K UTDI. All Rights Reserved.</p>
				</div>
			</div>
		</footer>
	</div>

	<!-- Activity Drawer -->
	<div id="activity-drawer" class="fixed inset-0 z-[100] flex justify-end md:items-center md:pr-6 {isDrawerOpen ? '' : 'pointer-events-none'}">
		<!-- Backdrop -->
		<div class="absolute inset-0 bg-on-background/40 backdrop-blur-xs transition-opacity duration-500 md:hidden pointer-events-auto {isDrawerOpen ? 'opacity-100' : 'opacity-0'}" onclick={closeDetailDrawer} role="button" tabindex="0" onkeypress={(e) => e.key === 'Enter' && closeDetailDrawer()}></div>

		<!-- Panel -->
		<div class="pointer-events-auto w-full md:w-[480px] h-[88vh] md:h-[85vh] bg-surface border-4 md:border-2 border-on-background fixed bottom-0 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto rounded-t-[32px] md:rounded-[24px] overflow-hidden shadow-[0px_-12px_0px_0px_rgba(0,0,0,1)] md:shadow-[-8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col z-10 transition-transform duration-500 ease-out {isDrawerOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-[120%]'}">
			
			<div class="md:hidden w-16 h-2 bg-on-background rounded-full mx-auto mt-4 mb-2 cursor-grab"></div>

			{#if selectedActivity}
			<div class="p-6 border-b-4 md:border-b-2 border-on-background flex justify-between items-center bg-surface-container-low">
				<div class="flex items-center gap-3">
					<span class="bg-primary text-on-primary px-4 py-1 border-2 border-on-background font-label-bold text-[12px] uppercase tracking-wider">{selectedActivity.tag || 'KEGIATAN'}</span>
					<span class="font-label-bold text-on-surface-variant">Tahun: {new Date(selectedActivity.date).getFullYear()}</span>
				</div>
				<button onclick={closeDetailDrawer} class="w-10 h-10 bg-error text-on-error border-2 border-on-background neo-shadow-sm neo-hover neo-active flex items-center justify-center font-bold text-headline-md">
					<span class="material-symbols-outlined">close</span>
				</button>
			</div>

			<div class="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
				<div class="space-y-4">
					<div class="relative h-64 md:h-[280px] w-full border-4 border-on-background neo-shadow-sm overflow-hidden bg-surface-variant group">
						{#if selectedActivity.photos && selectedActivity.photos.length > 0}
						<div class="flex h-full w-full transition-transform duration-300 ease-out" style="transform: translateX(-{activePhotoIndex * 100}%)">
							{#each selectedActivity.photos as photo}
							<div class="w-full h-full flex-shrink-0 relative bg-surface-variant">
								<img src={photo} class="w-full h-full object-cover object-center" alt="Dokumentasi" loading="lazy">
								<div class="absolute inset-0 flex items-center justify-center -z-10 bg-surface-variant">
									<span class="material-symbols-outlined text-4xl animate-pulse text-on-surface-variant">image</span>
								</div>
							</div>
							{/each}
						</div>
						
						{#if selectedActivity.photos.length > 1}
						<button onclick={() => slidePhoto(-1)} class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-surface border-2 border-on-background neo-shadow-sm flex items-center justify-center hover:bg-primary hover:text-on-primary active:translate-x-1 transition-all z-10">
							<span class="material-symbols-outlined font-bold">arrow_back</span>
						</button>
						<button onclick={() => slidePhoto(1)} class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-surface border-2 border-on-background neo-shadow-sm flex items-center justify-center hover:bg-primary hover:text-on-primary active:-translate-x-1 transition-all z-10">
							<span class="material-symbols-outlined font-bold">arrow_forward</span>
						</button>
						<div class="absolute bottom-3 right-3 bg-on-background text-background font-label-bold px-3 py-1 text-xs border-2 border-background z-10">
							<span>{activePhotoIndex + 1} / {selectedActivity.photos.length}</span>
						</div>
						{/if}
						{:else}
						<div class="w-full h-full flex items-center justify-center">
							<span class="material-symbols-outlined text-6xl text-on-surface-variant">image_not_supported</span>
						</div>
						{/if}
					</div>
				</div>

				<div>
					<div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-primary font-label-bold mb-3 text-sm">
						<span class="flex items-center gap-1"><span class="material-symbols-outlined text-[18px]">calendar_month</span><span>{formatDate(selectedActivity.date)}</span></span>
						<span class="text-on-background">•</span>
						<span class="flex items-center gap-1"><span class="material-symbols-outlined text-[18px]">location_on</span><span>{selectedActivity.location}</span></span>
					</div>

					<h2 class="font-display text-headline-md text-2xl font-bold mb-6 leading-tight">{selectedActivity.title}</h2>

					<div class="prose font-body-md space-y-4 text-on-surface-variant leading-relaxed">
						{@html (selectedActivity.description || 'Tidak ada deskripsi tersedia.').replace(/\n/g, '<br>')}
					</div>
				</div>
			</div>
			{/if}

			<div class="p-4 md:p-6 border-t-4 md:border-t-2 border-on-background bg-surface flex justify-end mt-auto">
				<button onclick={closeDetailDrawer} class="w-full md:w-auto bg-surface-container-high text-on-background px-8 py-3 border-2 border-on-background font-label-bold hover:bg-primary-fixed transition-colors">
					Tutup Panel
				</button>
			</div>
		</div>
	</div>

</div>
