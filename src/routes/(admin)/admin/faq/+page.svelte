<script>
	import Icon from '$lib/components/icons/Icon.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import BackLink from '$lib/components/ui/BackLink.svelte';
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import FaqForm from '$lib/components/faq/FaqForm.svelte';
	import { fetchFaqs, addFaq, updateFaq, deleteFaq } from '$lib/services/faqService.js';
	import { showToast } from '$lib/stores/toast.svelte.js';
	import { showLoading, hideLoading } from '$lib/stores/loading.svelte.js';

	/** @type {import('./$types').PageData} */
	let { data } = $props();

	let faqs = $state(data.faqs ?? []);
	
	let currentPage = $state(1);
	let totalItems = $state(data.totalItems ?? 0);
	const itemsPerPage = 10;
	let totalPages = $derived(Math.ceil(totalItems / itemsPerPage) || 1);

	// Search state
	let searchQuery = $state('');
	let searchTimeout;

	// Drawer/Modal states
	let isAdding = $state(false);
	let isEditing = $state(false);
	let isViewing = $state(false);
	let isDeleting = $state(false);
	let isLoading = $state(false); // Process loading state

	// Form states
	let currentId = $state(null);
	let currentFaq = $state(null);
	let question = $state('');
	let answer = $state('');
	let order = $state(0);

	async function loadFaqs() {
		try {
			showLoading('Memuat data...');
			const { data: faqData, count } = await fetchFaqs(currentPage, itemsPerPage, searchQuery);
			faqs = faqData;
			totalItems = count || faqData.length;
		} catch (error) {
			console.error("Load Faqs Error:", error);
			showToast('Gagal memuat data FAQ: ' + (error.message || 'Terjadi kesalahan'), 'error');
		} finally {
			hideLoading();
		}
	}

	function resetForm() {
		question = '';
		answer = '';
		order = 0;
	}

	function openAddDrawer() {
		resetForm();
		isAdding = true;
		isEditing = false;
	}

	function openEditDrawer(faq) {
		resetForm();
		currentId = faq.id;
		question = faq.question;
		answer = faq.answer;
		order = faq.order ?? 0;
		isEditing = true;
		isAdding = false;
	}

	function openViewModal(faq) {
		currentFaq = faq;
		isViewing = true;
	}

	function openDeleteModal(faq) {
		currentFaq = faq;
		isDeleting = true;
	}

	async function handleSave() {
		try {
			showLoading('Menyimpan data...');
			isLoading = true;
			const faqData = { question, answer, order };
			
			if (isEditing) {
				await updateFaq(currentId, faqData);
				showToast('FAQ berhasil diperbarui', 'success');
				isEditing = false;
			} else {
				await addFaq(faqData);
				showToast('FAQ berhasil ditambahkan', 'success');
				isAdding = false;
			}
			loadFaqs();
		} catch (error) {
			console.error("Save Error:", error);
			showToast('Gagal menyimpan: ' + (error.message || 'Terjadi kesalahan'), 'error');
		} finally {
			isLoading = false;
			hideLoading();
		}
	}

	async function confirmDelete() {
		try {
			showLoading('Menghapus data...');
			await deleteFaq(currentFaq.id);
			showToast('FAQ berhasil dihapus', 'success');
			isDeleting = false;
			loadFaqs();
		} catch (error) {
			console.error("Delete Error:", error);
			showToast('Gagal menghapus: ' + (error.message || 'Terjadi kesalahan'), 'error');
		} finally {
			hideLoading();
		}
	}

	function truncate(str, n){
		return (str.length > n) ? str.substr(0, n-1) + '...' : str;
	}

	function prevPage() {
		if (currentPage > 1) {
			currentPage--;
			loadFaqs();
		}
	}

	// Next page trigger
	function nextPage() {
		if (currentPage < totalPages) {
			currentPage++;
			loadFaqs();
		}
	}

	function handleSearchInput() {
		if (searchTimeout) clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			currentPage = 1;
			loadFaqs();
		}, 300);
	}
</script>

<svelte:head>
	<title>Kelola FAQ — KIP-K UTDI</title>
</svelte:head>

<AdminPageLayout
	title="Kelola FAQ"
	subtitle="Kelola daftar pertanyaan yang sering diajukan seputar KIP-K"
	buttonLabel="Tambah FAQ"
	buttonIcon="add"
	onaction={openAddDrawer}
	showDrawer={isAdding || isEditing}
	drawerTitle={isEditing ? 'Edit FAQ' : 'Tambah FAQ Baru'}
	ondrawerclose={() => { isAdding = false; isEditing = false; }}
>
	<!-- Search Bar -->
	<div class="filter-bar">
		<div class="search-input-wrapper">
			<Icon name="search" size={18} class="search-icon" />
			<input 
				type="text" 
				placeholder="Cari pertanyaan atau jawaban..." 
				bind:value={searchQuery}
				oninput={handleSearchInput}
			/>
		</div>
	</div>

	<DataTable headers={['Order', 'Pertanyaan', 'Jawaban', 'Aksi']}>
		{#each faqs as faq}
			<tr>
				<td style="font-weight: 700; width: 80px;">{faq.order}</td>
				<td style="font-weight: 600; max-width: 250px;">{faq.question}</td>
				<td style="font-size: 13px; max-width: 350px;">{truncate(faq.answer, 80)}</td>
				<td>
					<div class="table-actions">
						<Button variant="icon" onclick={() => openViewModal(faq)} title="Lihat">
							<Icon name="visibility" size={18} />
						</Button>
						<Button variant="icon" onclick={() => openEditDrawer(faq)} title="Edit">
							<Icon name="edit" size={18} />
						</Button>
						<Button variant="icon" class="btn-icon-danger" onclick={() => openDeleteModal(faq)} title="Hapus">
							<Icon name="delete" size={18} color="#d32f2f" />
						</Button>
					</div>
				</td>
			</tr>
		{/each}
		{#if faqs.length === 0}
			<tr>
				<td colspan="4">
					<div class="empty-state">Belum ada data FAQ.</div>
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
		{#if isAdding}
			<FaqForm 
				bind:question bind:answer bind:order
				isSaving={isLoading}
				onsubmit={handleSave} oncancel={() => isAdding = false}
			/>
		{:else if isEditing}
			<FaqForm 
				isEditing={true}
				bind:question bind:answer bind:order
				isSaving={isLoading}
				onsubmit={handleSave} oncancel={() => isEditing = false}
			/>
		{/if}
	{/snippet}
</AdminPageLayout>

{#if isViewing && currentFaq}
	<Modal title="Detail FAQ" onclose={() => isViewing = false}>
		<div class="detail-title">{currentFaq.question}</div>
		<div class="detail-meta">
			<span class="meta-item"><Icon name="sort" size={16}/> Order: {currentFaq.order}</span>
			<span class="meta-item"><Icon name="schedule" size={16}/> Ditambahkan: {new Date(currentFaq.created_at).toLocaleDateString('id-ID')}</span>
		</div>
		<div class="detail-desc">{currentFaq.answer}</div>
		
		{#snippet actions()}
			<Button variant="secondary" onclick={() => isViewing = false}>Tutup</Button>
		{/snippet}
	</Modal>
{/if}

{#if isDeleting && currentFaq}
	<Modal title="Konfirmasi Hapus" onclose={() => isDeleting = false}>
		<p>Apakah Anda yakin ingin menghapus FAQ <strong>"{currentFaq.question}"</strong>?</p>
		<p style="color: var(--danger-color); font-size: 13px; margin-top: 8px;">Tindakan ini tidak dapat dibatalkan.</p>
		{#snippet actions()}
			<Button variant="secondary" onclick={() => isDeleting = false}>Batal</Button>
			<Button variant="primary" style="background: var(--danger-color);" onclick={confirmDelete}>Hapus</Button>
		{/snippet}
	</Modal>
{/if}

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
	.detail-title { margin: 12px 0 8px; font-size: 20px; font-weight: 700; }
	.detail-meta { display: flex; gap: 16px; flex-wrap: wrap; font-size: 13px; color: #555; }
	.meta-item { display: flex; align-items: center; gap: 4px; }
	.detail-desc { line-height: 1.6; background: var(--surface); padding: 16px; border-left: 4px solid var(--primary-color); margin-top: 16px; white-space: pre-wrap; font-size: 15px; }

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
