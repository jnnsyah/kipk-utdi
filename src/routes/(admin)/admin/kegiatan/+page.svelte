<script>
	import { onMount } from 'svelte';
	import Icon from '$lib/components/icons/Icon.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import ImageSlider from '$lib/components/ui/ImageSlider.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import BackLink from '$lib/components/ui/BackLink.svelte';
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import ActivityForm from '$lib/components/kegiatan/ActivityForm.svelte';
	import CustomSelect from '$lib/components/CustomSelect.svelte';
	import { fetchActivities, addActivity, updateActivity, deleteActivity } from '$lib/services/activityService.js';
	import { showToast } from '$lib/stores/toast.svelte.js';
	import { showLoading, hideLoading } from '$lib/stores/loading.svelte.js';

	/** @type {import('./$types').PageData} */
	let { data } = $props();

	let activities = $state(data.activities ?? []);
	
	let currentPage = $state(1);
	let totalItems = $state(data.totalItems ?? 0);
	const itemsPerPage = 10;
	let totalPages = $derived(Math.ceil(totalItems / itemsPerPage) || 1);

	// Search & Filter states
	let searchQuery = $state('');
	let selectedTag = $state('ALL');
	let searchTimeout;

	const filterOptions = [
		{ value: 'ALL', label: 'Semua Kategori' },
		{ value: 'SEMINAR', label: 'Seminar' },
		{ value: 'WORKSHOP', label: 'Workshop' },
		{ value: 'TRAINING', label: 'Training' },
		{ value: 'SOSIALISASI', label: 'Sosialisasi' },
		{ value: 'LAINNYA', label: 'Lainnya' }
	];

	// Drawer/Modal states
	let isAdding = $state(false);
	let isEditing = $state(false);
	let isViewing = $state(false);
	let isDeleting = $state(false);

	// Form states
	let currentActivityId = $state(null);
	let currentActivity = $state(null);
	let title = $state('');
	let tag = $state('SEMINAR');
	let date = $state('');
	let location = $state('');
	let academic_year = $state(new Date().getFullYear());
	let description = $state('');
	let files = $state([]);
	let existingPhotos = $state([]);
	let photosToDelete = $state([]);
	let isUploading = $state(false);
	let uploadProgress = $state(0);

	let isMounted = false;
	$effect(() => {
		const tag = selectedTag;
		if (isMounted) {
			currentPage = 1;
			loadActivities();
		} else {
			isMounted = true;
		}
	});

	async function loadActivities() {
		try {
			showLoading('Memuat data...');
			const { data: actData, count } = await fetchActivities(currentPage, itemsPerPage, searchQuery, selectedTag);
			activities = actData;
			totalItems = count || actData.length;
		} catch (error) {
			showToast('Gagal memuat data kegiatan', 'error');
		} finally {
			hideLoading();
		}
	}

	function resetForm() {
		title = '';
		tag = 'SEMINAR';
		date = '';
		location = '';
		academic_year = new Date().getFullYear();
		description = '';
		files = [];
		existingPhotos = [];
		photosToDelete = [];
		uploadProgress = 0;
		isUploading = false;
	}

	function openAddModal() {
		resetForm();
		isAdding = true;
		isEditing = false;
	}

	function openEditModal(activity) {
		resetForm();
		currentActivityId = activity.id;
		title = activity.title;
		tag = activity.tag;
		date = activity.date;
		location = activity.location;
		academic_year = activity.academic_year;
		description = activity.description || '';
		existingPhotos = activity.photos || [];
		isEditing = true;
		isAdding = false;
	}

	function openViewModal(activity) {
		currentActivity = activity;
		isViewing = true;
	}

	function openDeleteModal(activity) {
		currentActivity = activity;
		isDeleting = true;
	}

	async function handleSave() {
		try {
			showLoading('Menyimpan data kegiatan...');
			isUploading = true;
			const activityData = { title, tag, date, location, academic_year, description };
			
			if (isEditing) {
				await updateActivity(currentActivityId, activityData, files, existingPhotos, photosToDelete, p => uploadProgress = p);
				showToast('Kegiatan berhasil diperbarui', 'success');
				isEditing = false;
			} else {
				await addActivity(activityData, files, p => uploadProgress = p);
				showToast('Kegiatan berhasil ditambahkan', 'success');
				isAdding = false;
			}
			loadActivities();
		} catch (error) {
			console.error(error);
			showToast('Terjadi kesalahan saat menyimpan', 'error');
		} finally {
			isUploading = false;
			hideLoading();
		}
	}

	async function confirmDelete() {
		try {
			showLoading('Menghapus kegiatan...');
			await deleteActivity(currentActivity.id, currentActivity.photos);
			showToast('Kegiatan berhasil dihapus', 'success');
			isDeleting = false;
			loadActivities();
		} catch (error) {
			showToast('Gagal menghapus kegiatan', 'error');
		} finally {
			hideLoading();
		}
	}

	function formatDate(dateStr) {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleDateString('id-ID', {
			day: 'numeric', month: 'long', year: 'numeric'
		});
	}

	function prevPage() {
		if (currentPage > 1) {
			currentPage--;
			loadActivities();
		}
	}

	function nextPage() {
		if (currentPage < totalPages) {
			currentPage++;
			loadActivities();
		}
	}

	function handleSearchInput() {
		if (searchTimeout) clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			currentPage = 1;
			loadActivities();
		}, 300);
	}
</script>

<svelte:head>
	<title>Kelola Kegiatan — KIP-K UTDI</title>
</svelte:head>

<div class="kegiatan-page">
	<div class="grid-bg" aria-hidden="true"></div>
	
	<div class="kegiatan-layout">
		<!-- Main Content Area -->
		<div class="main-content-panel">
			<BackLink />
			<PageHeader 
				title="Daftar Kegiatan" 
				subtitle="Kelola dokumentasi dan informasi kegiatan mahasiswa KIP-K"
				buttonLabel="Tambah Kegiatan"
				buttonIcon="add"
				onaction={openAddModal}
			/>

			<!-- Search and Filter Controls -->
			<div class="filter-bar">
				<div class="search-input-wrapper">
					<Icon name="search" size={18} class="search-icon" />
					<input 
						type="text" 
						placeholder="Cari kegiatan atau lokasi..." 
						bind:value={searchQuery}
						oninput={handleSearchInput}
					/>
				</div>

				<div class="filter-select-wrapper">
					<CustomSelect options={filterOptions} bind:value={selectedTag} placeholder="Semua Kategori" />
				</div>
			</div>

			<DataTable headers={['Tanggal', 'Judul Kegiatan', 'Kategori', 'Lokasi', 'Aksi']}>
				{#each activities as activity}
					<tr>
						<td style="white-space: nowrap; font-size: 13px;">{formatDate(activity.date)}</td>
						<td style="font-weight: 600;">{activity.title}</td>
						<td><Badge type={activity.tag} /></td>
						<td style="font-size: 13px;">{activity.location}</td>
						<td>
							<div class="table-actions">
								<Button variant="icon" onclick={() => openViewModal(activity)} title="Lihat">
									<Icon name="visibility" size={18} />
								</Button>
								<Button variant="icon" onclick={() => openEditModal(activity)} title="Edit">
									<Icon name="edit" size={18} />
								</Button>
								<Button variant="icon" class="btn-icon-danger" onclick={() => openDeleteModal(activity)} title="Hapus">
									<Icon name="delete" size={18} color="#d32f2f" />
								</Button>
							</div>
						</td>
					</tr>
				{/each}
				{#if activities.length === 0}
					<tr>
						<td colspan="5">
							<div class="empty-state">Belum ada data kegiatan.</div>
						</td>
					</tr>
				{/if}

				{#snippet footer()}
					{#if totalPages > 1}
						<div class="pagination">
							<Button variant="secondary" disabled={currentPage === 1} onclick={prevPage}>Sebelumnya</Button>
							<span class="page-info">Halaman {currentPage} dari {totalPages}</span>
							<Button variant="secondary" disabled={currentPage === totalPages} onclick={nextPage}>Selanjutnya</Button>
						</div>
					{/if}
				{/snippet}
			</DataTable>
		</div>

		<!-- Drawer Panel for Add / Edit -->
		{#if isAdding || isEditing}
			<div class="drawer-panel">
				<div class="drawer-header">
					<h2 class="drawer-title">{isEditing ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}</h2>
					<Button variant="icon" onclick={() => { isAdding = false; isEditing = false; }} title="Tutup">
						<Icon name="close" size={20} />
					</Button>
				</div>
				<div class="drawer-body">
					{#if isAdding}
						<ActivityForm 
							bind:title bind:tag bind:date bind:location bind:academic_year bind:description bind:files
							{isUploading} {uploadProgress}
							onsubmit={handleSave} oncancel={() => isAdding = false}
						/>
					{:else if isEditing}
						<ActivityForm 
							isEditing={true}
							bind:title bind:tag bind:date bind:location bind:academic_year bind:description bind:files bind:existingPhotos bind:photosToDelete
							{isUploading} {uploadProgress}
							onsubmit={handleSave} oncancel={() => isEditing = false}
						/>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- View Modal -->
<Modal bind:show={isViewing} title="Detail Kegiatan" maxWidth="700px">
	{#if currentActivity}
		<div class="detail-view">
			<Badge type={currentActivity.tag} />
			<h2 class="detail-title">{currentActivity.title}</h2>
			<div class="detail-meta">
				<span class="meta-item"><Icon name="calendar_today" size={16}/> {formatDate(currentActivity.date)}</span>
				<span class="meta-item"><Icon name="location_on" size={16}/> {currentActivity.location}</span>
				<span class="meta-item"><Icon name="school" size={16}/> TA {currentActivity.academic_year}</span>
			</div>
			
			{#if currentActivity.photos && currentActivity.photos.length > 0}
				<div class="detail-photos">
					<ImageSlider photos={currentActivity.photos} />
				</div>
			{/if}

			{#if currentActivity.description}
				<div class="detail-desc">
					{currentActivity.description}
				</div>
			{/if}
		</div>
	{/if}
</Modal>

<!-- Delete Modal -->
<Modal bind:show={isDeleting} title="Konfirmasi Hapus" maxWidth="400px">
	{#if currentActivity}
		<p>Apakah Anda yakin ingin menghapus kegiatan <strong>{currentActivity.title}</strong>?</p>
		<p style="font-size: 12px; color: var(--danger-color); margin-top: 8px;">Tindakan ini tidak dapat dibatalkan dan akan menghapus semua foto terkait.</p>
	{/if}
	{#snippet footer()}
		<Button variant="secondary" onclick={() => isDeleting = false}>Batal</Button>
		<Button variant="danger" onclick={confirmDelete}>Hapus</Button>
	{/snippet}
</Modal>

<style>
	.kegiatan-page {
		min-height: 100vh;
		padding: 32px 24px;
		position: relative;
	}
	.kegiatan-layout {
		display: flex;
		gap: 24px;
		max-width: 1400px;
		margin: 0 auto;
		position: relative;
		z-index: 10;
		align-items: flex-start;
	}
	.main-content-panel {
		flex: 1;
		min-width: 0;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.drawer-panel {
		width: 580px;
		flex-shrink: 0;
		background: var(--surface-white, #fff);
		border: 4px solid var(--border-color, #1b1c19);
		box-shadow: 8px 8px 0px 0px var(--shadow-color, #1b1c19);
		display: flex;
		flex-direction: column;
		height: fit-content;
		position: sticky;
		top: 32px;
		animation: slideIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
	}
	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateX(40px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
	.drawer-header {
		padding: 16px 20px;
		border-bottom: 3px solid var(--border-color, #1b1c19);
		background: var(--primary-light, #e8ddff);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.drawer-title {
		margin: 0;
		font-size: 18px;
		font-weight: 700;
	}
	.drawer-body {
		padding: 20px;
		max-height: 80vh;
		overflow-y: auto;
	}
	.table-actions {
		display: flex;
		gap: 8px;
		justify-content: flex-end;
	}
	:global(.data-table th:last-child) {
		text-align: right;
	}
	.empty-state {
		padding: 32px;
		background: var(--primary-light);
		border: 3px dashed var(--primary-color);
		text-align: center;
		font-weight: 600;
		color: var(--primary-color);
		margin: 16px;
	}
	.pagination {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px;
		background: #faf9f4;
		border-top: 2px solid #1b1c19;
	}
	.page-info {
		font-weight: 700;
		font-size: 14px;
	}

	/* Detail view styles */
	.detail-title { margin: 12px 0 8px; font-size: 24px; }
	.detail-meta { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; font-size: 13px; color: #555; }
	.meta-item { display: flex; align-items: center; gap: 4px; }
	.detail-desc { line-height: 1.6; background: var(--surface); padding: 16px; border-left: 4px solid var(--primary-color); margin-bottom: 24px; white-space: pre-wrap; }
	.detail-photos { margin-top: 16px; }

	/* Filter Bar */
	.filter-bar {
		display: flex;
		gap: 16px;
		margin-bottom: 24px;
		align-items: center;
	}
	.search-input-wrapper {
		position: relative;
		flex: 1;
		min-width: 0;
	}
	.search-icon {
		position: absolute;
		left: 14px;
		top: 50%;
		transform: translateY(-50%);
		color: #7a7583;
		pointer-events: none;
		display: flex;
		align-items: center;
	}
	.search-input-wrapper input {
		width: 100%;
		padding: 12px 12px 12px 42px;
		background: #fff;
		border: 3px solid var(--border-color, #1b1c19);
		box-shadow: 4px 4px 0px 0px var(--shadow-color, #1b1c19);
		font-family: inherit;
		font-size: 14px;
		font-weight: 500;
		transition: all 0.2s ease;
	}
	.search-input-wrapper input:focus {
		outline: none;
		border-color: var(--primary-color);
		box-shadow: 4px 4px 0px 0px var(--primary-color);
	}
	.filter-select-wrapper {
		width: 240px;
		flex-shrink: 0;
	}

	/* Responsive styles */
	@media (max-width: 1024px) {
		.kegiatan-layout {
			flex-direction: column;
		}
		.drawer-panel {
			width: 100%;
			position: relative;
			top: 0;
			margin-top: 24px;
		}
	}
	@media (max-width: 600px) {
		.filter-bar {
			flex-direction: column;
			gap: 12px;
			align-items: stretch;
		}
		.filter-select-wrapper {
			width: 100%;
		}
	}
</style>
