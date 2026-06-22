<script>
	import Icon from '$lib/components/icons/Icon.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import BackLink from '$lib/components/ui/BackLink.svelte';
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import ContentForm from '$lib/components/konten/ContentForm.svelte';
	import { fetchContents, updateContent } from '$lib/services/contentService.js';
	import { showToast } from '$lib/stores/toast.svelte.js';
	import { showLoading, hideLoading } from '$lib/stores/loading.svelte.js';

	/** @type {import('./$types').PageData} */
	let { data } = $props();

	let contents = $state(data.contents ?? []);
	
	let currentPage = $state(1);
	let totalItems = $state(data.totalItems ?? 0);
	const itemsPerPage = 10;
	let totalPages = $derived(Math.ceil(totalItems / itemsPerPage) || 1);



	// Drawer/Modal states
	let isEditing = $state(false);
	let isViewing = $state(false);

	// Form states
	let currentId = $state(null);
	let currentContent = $state(null);
	let section_name = $state('');
	let content_text = $state('');
	let icon_name = $state('');
	let isSaving = $state(false);

	async function loadContents() {
		try {
			showLoading('Memuat data...');
			const { data: cData, count } = await fetchContents(currentPage, itemsPerPage);
			contents = cData;
			totalItems = count || cData.length;
		} catch (error) {
			showToast('Gagal memuat data konten', 'error');
		} finally {
			hideLoading();
		}
	}

	function resetForm() {
		section_name = '';
		content_text = '';
		icon_name = '';
		isSaving = false;
	}

	function openEditDrawer(content) {
		resetForm();
		currentId = content.id;
		section_name = content.section_name || '';
		content_text = content.content_text || '';
		icon_name = content.icon_name || '';
		isEditing = true;
	}

	function openViewModal(content) {
		currentContent = content;
		isViewing = true;
	}

	async function handleSave() {
		try {
			showLoading('Menyimpan data...');
			isSaving = true;
			const contentData = { section_name, content_text, icon_name };
			
			await updateContent(currentId, contentData);
			showToast('Konten berhasil diperbarui', 'success');
			isEditing = false;
			
			loadContents();
		} catch (error) {
			console.error("Save Error:", error);
			showToast('Gagal menyimpan: ' + (error.message || 'Terjadi kesalahan'), 'error');
		} finally {
			isSaving = false;
			hideLoading();
		}
	}

	function formatDate(dateStr) {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleDateString('id-ID', {
			day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit'
		});
	}

	function truncate(str, n){
		return (str.length > n) ? str.substr(0, n-1) + '...' : str;
	}

	function prevPage() {
		if (currentPage > 1) {
			currentPage--;
			loadContents();
		}
	}

	function nextPage() {
		if (currentPage < totalPages) {
			currentPage++;
			loadContents();
		}
	}


</script>

<svelte:head>
	<title>Kelola Konten — KIP-K UTDI</title>
</svelte:head>

<AdminPageLayout
	title="Manajemen Konten Situs"
	subtitle="Kelola teks, ikon, dan bagian dari situs web"
	showDrawer={isEditing}
	drawerTitle="Edit Konten"
	ondrawerclose={() => isEditing = false}
>
	<DataTable headers={['Nama Bagian', 'Ikon', 'Isi Teks', 'Diperbarui', 'Aksi']}>
		{#each contents as content}
			<tr>
				<td style="font-weight: 600; text-transform: capitalize;">{content.section_name}</td>
				<td>
					{#if content.icon_name}
						<div class="icon-preview" title={content.icon_name}>
							<Icon name={content.icon_name} size={20} />
						</div>
					{:else}
						-
					{/if}
				</td>
				<td style="font-size: 13px; max-width: 300px;">{truncate(content.content_text, 60)}</td>
				<td style="white-space: nowrap; font-size: 13px;">{formatDate(content.updated_at)}</td>
				<td>
					<div class="table-actions">
						<Button variant="icon" onclick={() => openViewModal(content)} title="Lihat">
							<Icon name="visibility" size={18} />
						</Button>
						<Button variant="icon" onclick={() => openEditDrawer(content)} title="Edit">
							<Icon name="edit" size={18} />
						</Button>
					</div>
				</td>
			</tr>
		{/each}
		{#if contents.length === 0}
			<tr>
				<td colspan="5">
					<div class="empty-state">Belum ada data konten.</div>
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
		<ContentForm 
			{isEditing}
			bind:section_name bind:content_text bind:icon_name
			{isSaving}
			onsubmit={handleSave} oncancel={() => isEditing = false}
		/>
	{/snippet}
</AdminPageLayout>

<!-- View Modal -->
<Modal bind:show={isViewing} title="Detail Konten" maxWidth="600px">
	{#if currentContent}
		<div class="detail-view">
			<h2 class="detail-title" style="text-transform: capitalize;">Bagian: {currentContent.section_name}</h2>
			<div class="detail-meta">
				<span class="meta-item"><Icon name="calendar_today" size={16}/> Diperbarui: {formatDate(currentContent.updated_at)}</span>
				{#if currentContent.icon_name}
					<span class="meta-item"><Icon name={currentContent.icon_name} size={16}/> Ikon: {currentContent.icon_name}</span>
				{/if}
			</div>
			
			<div class="detail-desc">
				{currentContent.content_text}
			</div>
		</div>
	{/if}
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

	.icon-preview {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 8px;
		background: var(--primary-light);
		border: 2px solid var(--border-color);
		border-radius: 4px;
	}

	/* Detail view styles */
	.detail-title { margin: 12px 0 8px; font-size: 24px; }
	.detail-meta { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; font-size: 13px; color: #555; }
	.meta-item { display: flex; align-items: center; gap: 4px; }
	.detail-desc { line-height: 1.6; background: var(--surface); padding: 16px; border-left: 4px solid var(--primary-color); margin-bottom: 24px; white-space: pre-wrap; font-size: 15px; }
</style>
