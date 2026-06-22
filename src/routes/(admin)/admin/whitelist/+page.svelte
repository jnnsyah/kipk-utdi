<script>
	import Icon from '$lib/components/icons/Icon.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import BackLink from '$lib/components/ui/BackLink.svelte';
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import AdminPageLayout from '$lib/components/ui/AdminPageLayout.svelte';
	import WhitelistForm from '$lib/components/whitelist/WhitelistForm.svelte';
	import { fetchWhitelist, addWhitelist, deleteWhitelist } from '$lib/services/whitelistService.js';
	import { showToast } from '$lib/stores/toast.svelte.js';
	import { showLoading, hideLoading } from '$lib/stores/loading.svelte.js';

	/** @type {import('./$types').PageData} */
	let { data } = $props();

	let whitelist = $state(data.whitelist ?? []);
	
	let currentPage = $state(1);
	let totalItems = $state(data.totalItems ?? 0);

	$effect(() => {
		whitelist = data.whitelist ?? [];
		totalItems = data.totalItems ?? 0;
	});
	const itemsPerPage = 10;
	let totalPages = $derived(Math.ceil(totalItems / itemsPerPage) || 1);

	// Search state
	let searchQuery = $state('');
	let searchTimeout;

	// Drawer/Modal states
	let isAdding = $state(false);
	let isViewing = $state(false);
	let isDeleting = $state(false);
	let isSaving = $state(false);

	// Form states
	let email = $state('');
	let selectedEntry = $state(null);

	async function loadWhitelist() {
		try {
			showLoading('Memuat data...');
			const { data: wlData, count } = await fetchWhitelist(currentPage, itemsPerPage, searchQuery);
			whitelist = wlData;
			totalItems = count || wlData.length;
		} catch (error) {
			console.error("Load Whitelist Error:", error);
			showToast('Gagal memuat data whitelist: ' + (error.message || 'Terjadi kesalahan'), 'error');
		} finally {
			hideLoading();
		}
	}

	function resetForm() {
		email = '';
		isSaving = false;
	}

	function openAddDrawer() {
		resetForm();
		isAdding = true;
	}

	function openViewModal(entry) {
		selectedEntry = entry;
		isViewing = true;
	}

	function openDeleteModal(entry) {
		selectedEntry = entry;
		isDeleting = true;
	}

	async function handleSave() {
		try {
			showLoading('Menyimpan email...');
			isSaving = true;
			await addWhitelist({ email });
			showToast('Email berhasil ditambahkan ke whitelist', 'success');
			isAdding = false;
			loadWhitelist();
		} catch (error) {
			console.error("Save Error:", error);
			showToast('Gagal menyimpan: ' + (error.message || 'Terjadi kesalahan'), 'error');
		} finally {
			isSaving = false;
			hideLoading();
		}
	}

	async function confirmDelete() {
		try {
			showLoading('Menghapus email...');
			await deleteWhitelist(selectedEntry.email);
			showToast('Email berhasil dihapus dari whitelist', 'success');
			isDeleting = false;
			loadWhitelist();
		} catch (error) {
			console.error("Delete Error:", error);
			showToast('Gagal menghapus: ' + (error.message || 'Terjadi kesalahan'), 'error');
		} finally {
			hideLoading();
		}
	}

	function formatDate(dateStr) {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleDateString('id-ID', {
			day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit'
		});
	}

	function prevPage() {
		if (currentPage > 1) {
			currentPage--;
			loadWhitelist();
		}
	}

	function nextPage() {
		if (currentPage < totalPages) {
			currentPage++;
			loadWhitelist();
		}
	}

	function handleSearchInput() {
		if (searchTimeout) clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			currentPage = 1;
			loadWhitelist();
		}, 300);
	}
</script>

<svelte:head>
	<title>Whitelist Admin — KIP-K UTDI</title>
</svelte:head>

<AdminPageLayout
	title="Whitelist Admin"
	subtitle="Kelola alamat email Google yang diizinkan untuk mengakses dashboard admin"
	buttonLabel="Tambah Email"
	buttonIcon="add"
	onaction={openAddDrawer}
	showDrawer={isAdding}
	drawerTitle="Tambah Email Whitelist"
	ondrawerclose={() => isAdding = false}
>
	<!-- Search Bar -->
	<div class="filter-bar">
		<div class="search-input-wrapper">
			<Icon name="search" size={18} class="search-icon" />
			<input 
				type="text" 
				placeholder="Cari email admin..." 
				bind:value={searchQuery}
				oninput={handleSearchInput}
			/>
		</div>
	</div>

	<DataTable headers={['Tanggal Ditambahkan', 'Alamat Email', 'Aksi']}>
		{#each whitelist as entry}
			<tr>
				<td style="font-size: 13px; width: 220px;">{formatDate(entry.created_at)}</td>
				<td style="font-weight: 600;">{entry.email}</td>
				<td>
					<div class="table-actions">
						<Button variant="icon" onclick={() => openViewModal(entry)} title="Lihat">
							<Icon name="visibility" size={18} />
						</Button>
						<Button variant="icon" class="btn-icon-danger" onclick={() => openDeleteModal(entry)} title="Hapus">
							<Icon name="delete" size={18} color="#d32f2f" />
						</Button>
					</div>
				</td>
			</tr>
		{/each}
		{#if whitelist.length === 0}
			<tr>
				<td colspan="3">
					<div class="empty-state">Belum ada email terdaftar di whitelist.</div>
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

	{#snippet drawerContent()}
		<WhitelistForm 
			bind:email
			isSaving={isSaving}
			onsubmit={handleSave} oncancel={() => isAdding = false}
		/>
	{/snippet}
</AdminPageLayout>

<!-- View Modal -->
<Modal bind:show={isViewing} title="Detail Whitelist" maxWidth="500px">
	{#if selectedEntry}
		<div class="detail-view">
			<h2 class="detail-title">{selectedEntry.email}</h2>
			<div class="detail-desc">
				<div class="detail-item">
					<span class="detail-label">Status Akses:</span>
					<span class="status-badge">DISETUJUI</span>
				</div>
				<div class="detail-item">
					<span class="detail-label">Tanggal Ditambahkan:</span>
					<span>{formatDate(selectedEntry.created_at)}</span>
				</div>
			</div>
		</div>
	{/if}
</Modal>

<!-- Delete Modal -->
<Modal bind:show={isDeleting} title="Konfirmasi Hapus" maxWidth="400px">
	{#if selectedEntry}
		<p>Apakah Anda yakin ingin menghapus <strong>{selectedEntry.email}</strong> dari whitelist?</p>
		<p style="font-size: 12px; color: var(--danger-color, #d32f2f); margin-top: 8px;">
			Pengguna dengan email ini tidak akan dapat login lagi ke dashboard setelah dihapus.
		</p>
	{/if}
	{#snippet footer()}
		<Button variant="secondary" onclick={() => isDeleting = false}>Batal</Button>
		<Button variant="danger" onclick={confirmDelete}>Hapus</Button>
	{/snippet}
</Modal>

<style>
	.table-actions {
		display: flex;
		gap: 8px;
		justify-content: flex-end;
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
		flex-wrap: wrap;
		gap: 12px;
	}
	.page-info {
		font-weight: 700;
		font-size: 14px;
	}

	/* Detail view styles */
	.detail-title { margin: 0 0 16px; font-size: 20px; font-weight: 700; }
	.detail-desc { display: flex; flex-direction: column; gap: 12px; font-size: 14px; }
	.detail-item { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #ccc; padding-bottom: 8px; }
	.detail-label { font-weight: 600; color: #555; }
	.status-badge {
		background: #e1f5fe;
		color: #0288d1;
		border: 2px solid #1b1c19;
		padding: 2px 8px;
		font-size: 11px;
		font-weight: 800;
	}

	/* Search Bar */
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
	:global(.search-icon) {
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

	@media (max-width: 600px) {
		.filter-bar {
			flex-direction: column;
			align-items: stretch;
		}
	}
</style>
