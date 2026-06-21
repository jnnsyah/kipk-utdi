<script>
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { compressImageToWebP } from '$lib/utils/imageCompressor.js';
	import { getCurrentAcademicYear, offsetAcademicYear } from '$lib/utils/academicYear.js';
	import { createBrowserClient } from '@supabase/ssr';
	import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';
	import CustomSelect from '$lib/components/CustomSelect.svelte';
	import CustomDatePicker from '$lib/components/CustomDatePicker.svelte';

	/** @type {import('./$types').PageData} */
	let { data } = $props();

	let supabase;
	onMount(() => {
		supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY);
	});

	let activities = $derived(data.activities ?? []);
	
	let toastMessage = $state('');
	let toastType = $state('error');

	function showToast(message, type = 'error') {
		toastMessage = message;
		toastType = type;
		setTimeout(() => {
			toastMessage = '';
		}, 5000);
	}

	let isAdding = $state(false);
	let title = $state('');
	let tag = $state('SEMINAR');
	let date = $state('');
	let location = $state('');
	let academic_year = $state(getCurrentAcademicYear());
	let description = $state('');
	let files = $state([]);
	let isUploading = $state(false);

	// Tag Options
	const tagOptions = [
		{ value: 'SEMINAR', label: 'SEMINAR' },
		{ value: 'WORKSHOP', label: 'WORKSHOP' },
		{ value: 'TRAINING', label: 'TRAINING' },
		{ value: 'SOSIALISASI', label: 'SOSIALISASI' },
		{ value: 'LAINNYA', label: 'LAINNYA' }
	];

	// Multi upload helpers
	let dragOver = $state(false);

	function handleDrop(e) {
		e.preventDefault();
		dragOver = false;
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			const newFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
			files = [...files, ...newFiles];
		}
	}

	function handleFileSelect(e) {
		if (e.target.files && e.target.files.length > 0) {
			const newFiles = Array.from(e.target.files);
			files = [...files, ...newFiles];
		}
	}

	function removeFile(index) {
		files = files.filter((_, i) => i !== index);
	}

	async function handleUploadAndSubmit(event) {
		event.preventDefault();
		
		if (!title.trim()) {
			showToast('Judul kegiatan tidak boleh kosong.', 'error');
			return;
		}
		if (!date) {
			showToast('Tanggal kegiatan belum dipilih.', 'error');
			return;
		}
		if (!supabase) {
			showToast('Klien database belum siap. Coba muat ulang halaman.', 'error');
			return;
		}

		isUploading = true;

		try {
			const { data: activityData, error: activityError } = await supabase
				.from('activities')
				.insert([{
					title,
					tag,
					date,
					location,
					academic_year,
					description
				}])
				.select()
				.single();

			if (activityError) throw activityError;

			const activity_id = activityData.id;

			// Handle photos
			for (let i = 0; i < files.length; i++) {
				const originalFile = files[i];
				const webpFile = await compressImageToWebP(originalFile);
				const filePath = `${activity_id}/${Date.now()}_${i}.webp`;
				
				const { error: uploadError } = await supabase.storage
					.from('dokumentasi-kegiatan')
					.upload(filePath, webpFile);

				if (uploadError) throw uploadError;

				const { error: photoDbError } = await supabase
					.from('activity_photos')
					.insert([{
						activity_id,
						storage_path: filePath,
						order: i
					}]);

				if (photoDbError) throw photoDbError;
			}

			showToast('Kegiatan berhasil ditambahkan!', 'success');
			setTimeout(() => {
				window.location.reload();
			}, 1500);

		} catch (e) {
			console.error('Submit error:', e);
			showToast(`Gagal menyimpan: ${e.message || 'Kesalahan tidak diketahui'}`, 'error');
		} finally {
			isUploading = false;
		}
	}
</script>

<svelte:head>
	<title>Kelola Kegiatan — Admin KIP-K UTDI</title>
</svelte:head>

<div class="page-container">
	{#if toastMessage}
		<div class="toast toast-{toastType}">
			{#if toastType === 'success'}
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
			{/if}
			<span>{toastMessage}</span>
		</div>
	{/if}

	<header class="page-header">
		<div>
			<a href="/admin/dashboard" class="back-link">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="19" y1="12" x2="5" y2="12"></line>
					<polyline points="12 19 5 12 12 5"></polyline>
				</svg>
				Kembali ke Dashboard
			</a>
			<h1 class="page-title">Kelola Kegiatan</h1>
		</div>
		<button class="btn-primary" onclick={() => isAdding = !isAdding}>
			{#if isAdding}
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
				Batal
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
				Tambah Kegiatan
			{/if}
		</button>
	</header>

	{#if isAdding}
		<section class="form-section">
			<h2>Tambah Kegiatan Baru</h2>
			<form onsubmit={handleUploadAndSubmit} class="crud-form">
				<div class="form-group">
					<label for="title">Judul Kegiatan</label>
					<input type="text" id="title" bind:value={title} required />
				</div>

				<div class="form-row">
					<div class="form-group" style="position: relative; z-index: 20;">
						<label for="tag">Kategori (Tag)</label>
						<CustomSelect bind:value={tag} options={tagOptions} placeholder="Pilih Kategori" />
					</div>

					<div class="form-group" style="position: relative; z-index: 10;">
						<label for="date">Tanggal</label>
						<CustomDatePicker bind:value={date} placeholder="Pilih Tanggal Kegiatan" />
					</div>
				</div>

				<div class="form-row">
					<div class="form-group">
						<label for="location">Lokasi</label>
						<input type="text" id="location" bind:value={location} />
					</div>

					<div class="form-group">
						<label for="academic_year">Tahun Akademik</label>
						<div class="year-stepper">
							<button type="button" class="btn-stepper" onclick={() => academic_year = offsetAcademicYear(academic_year, -1)} title="Kurangi Tahun">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
							</button>
							<input type="text" id="academic_year" bind:value={academic_year} readonly required />
							<button type="button" class="btn-stepper" onclick={() => academic_year = offsetAcademicYear(academic_year, 1)} title="Tambah Tahun">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
							</button>
						</div>
					</div>
				</div>

				<div class="form-group">
					<label for="description">Deskripsi (Mendukung HTML)</label>
					<textarea id="description" bind:value={description} rows="4"></textarea>
				</div>

				<div class="form-group">
					<label>Upload Foto (Multi-upload & Otomatis kompres .webp)</label>
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div 
						class="file-upload-zone {dragOver ? 'drag-over' : ''}"
						ondragover={(e) => { e.preventDefault(); dragOver = true; }}
						ondragleave={() => dragOver = false}
						ondrop={handleDrop}
					>
						<label for="photos" class="file-upload-label">
							<svg class="upload-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
								<circle cx="8.5" cy="8.5" r="1.5"></circle>
								<polyline points="21 15 16 10 5 21"></polyline>
							</svg>
							<span class="upload-text">Pilih foto atau tarik ke kotak ini</span>
						</label>
						<input 
							type="file" 
							id="photos" 
							accept="image/*" 
							multiple 
							class="hidden-file-input"
							onchange={handleFileSelect}
						/>
					</div>
					
					{#if files.length > 0}
						<div class="file-preview-list">
							{#each files as file, index}
								<div class="file-preview-item">
									<div class="file-info">
										<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #7a7583">
											<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
											<circle cx="8.5" cy="8.5" r="1.5"></circle>
											<polyline points="21 15 16 10 5 21"></polyline>
										</svg>
										<span class="file-name">{file.name}</span>
									</div>
									<button type="button" class="btn-remove-file" onclick={() => removeFile(index)} title="Hapus">
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
									</button>
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<div class="form-actions">
					<button type="submit" class="btn-submit" disabled={isUploading}>
						{isUploading ? 'Menyimpan...' : 'Simpan Kegiatan'}
					</button>
				</div>
			</form>
		</section>
	{/if}

	<section class="data-section">
		<h2>Daftar Kegiatan</h2>
		{#if activities.length === 0}
			<p class="empty-state">Belum ada kegiatan yang ditambahkan.</p>
		{:else}
			<div class="table-container">
				<table class="data-table">
					<thead>
						<tr>
							<th>Judul</th>
							<th>Kategori</th>
							<th>Tanggal</th>
							<th>Tahun Akademik</th>
							<th>Aksi</th>
						</tr>
					</thead>
					<tbody>
						{#each activities as act}
							<tr>
								<td><strong>{act.title}</strong></td>
								<td><span class="badge badge-{act.tag.toLowerCase()}">{act.tag}</span></td>
								<td>{act.date}</td>
								<td>{act.academic_year}</td>
								<td>
									<button class="btn-icon" title="Edit (Belum diimplementasi)">
										<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
									</button>
									<button class="btn-icon btn-icon-danger" title="Hapus (Belum diimplementasi)">
										<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>
</div>

<style>
	.page-container {
		max-width: 960px;
		margin: 0 auto;
		padding: 24px 16px 48px;
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 16px;
		flex-wrap: wrap;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 14px;
		color: #674bb5;
		text-decoration: none;
		font-weight: 600;
		margin-bottom: 12px;
	}

	.back-link:hover {
		text-decoration: underline;
	}

	.page-title {
		margin: 0;
		font-size: 32px;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.btn-primary {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: #674bb5;
		color: #fff;
		border: 3px solid #1b1c19;
		box-shadow: 4px 4px 0px 0px #1b1c19;
		padding: 10px 20px;
		font-family: inherit;
		font-weight: 700;
		font-size: 15px;
		cursor: pointer;
		transition: transform 0.15s, box-shadow 0.15s;
	}

	.btn-primary:hover {
		transform: translate(-2px, -2px);
		box-shadow: 6px 6px 0px 0px #1b1c19;
	}

	.btn-primary:active {
		transform: translate(2px, 2px);
		box-shadow: 0px 0px 0px 0px #1b1c19;
	}

	.form-section {
		background: #fff;
		border: 4px solid #1b1c19;
		box-shadow: 6px 6px 0px 0px #1b1c19;
		padding: 24px;
	}

	.form-section h2 {
		margin: 0 0 20px;
		font-size: 20px;
	}

	.crud-form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.form-group label {
		font-weight: 700;
		font-size: 14px;
		color: #1b1c19;
	}

	.form-group input:not([type="file"]):not([type="date"]), .form-group textarea {
		padding: 12px 14px;
		border: 3px solid #1b1c19;
		background: #faf9f4;
		font-family: inherit;
		font-size: 15px;
		transition: all 0.2s;
	}

	.form-group input:focus, .form-group textarea:focus {
		outline: none;
		background: #fff;
		box-shadow: 4px 4px 0px 0px #674bb5;
	}

	/* Year Stepper */
	.year-stepper {
		display: flex;
		border: 3px solid #1b1c19;
		background: #faf9f4;
		transition: all 0.2s;
	}

	.year-stepper:focus-within {
		background: #fff;
		box-shadow: 4px 4px 0px 0px #674bb5;
	}

	.year-stepper input {
		flex: 1;
		border: none !important;
		text-align: center;
		padding: 12px !important;
		background: transparent !important;
		font-weight: 700;
		color: #1b1c19;
	}

	.year-stepper input:focus {
		box-shadow: none !important;
	}

	.btn-stepper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		background: #e8ddff;
		border: none;
		cursor: pointer;
		color: #674bb5;
		transition: background 0.15s, color 0.15s;
	}

	.btn-stepper:first-child {
		border-right: 3px solid #1b1c19;
	}

	.btn-stepper:last-child {
		border-left: 3px solid #1b1c19;
	}

	.btn-stepper:hover {
		background: #674bb5;
		color: #fff;
	}

	.btn-stepper:active {
		background: #4a3486;
	}

	/* Multi Upload Zone */
	.file-upload-zone {
		border: 3px dashed #1b1c19;
		background: #faf9f4;
		padding: 24px;
		text-align: center;
		transition: all 0.2s;
		position: relative;
	}

	.file-upload-zone.drag-over {
		background: #e8ddff;
		border-color: #674bb5;
	}

	.file-upload-label {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		cursor: pointer;
	}

	.upload-icon {
		color: #674bb5;
	}

	.upload-text {
		font-weight: 600;
		font-size: 15px;
	}

	.hidden-file-input {
		position: absolute;
		width: 0;
		height: 0;
		opacity: 0;
	}

	.file-preview-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-top: 12px;
	}

	.file-preview-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #fff;
		border: 2px solid #1b1c19;
		padding: 8px 12px;
	}

	.file-info {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		font-weight: 500;
	}

	.btn-remove-file {
		background: #ffdde1;
		color: #d32f2f;
		border: 2px solid #1b1c19;
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: transform 0.1s;
	}

	.btn-remove-file:hover {
		transform: scale(1.05);
		background: #ffc4c9;
	}

	/* Submit Button */
	.btn-submit {
		background: #1b1c19;
		color: #fff;
		border: 3px solid #1b1c19;
		box-shadow: 4px 4px 0px 0px #674bb5;
		padding: 14px 24px;
		font-weight: 700;
		font-family: inherit;
		font-size: 16px;
		cursor: pointer;
		margin-top: 8px;
		width: 100%;
		transition: transform 0.15s, box-shadow 0.15s;
	}

	.btn-submit:hover:not(:disabled) {
		transform: translate(-2px, -2px);
		box-shadow: 6px 6px 0px 0px #674bb5;
	}

	.btn-submit:active:not(:disabled) {
		transform: translate(2px, 2px);
		box-shadow: 0px 0px 0px 0px #674bb5;
	}

	.btn-submit:disabled {
		opacity: 0.7;
		cursor: not-allowed;
		box-shadow: 2px 2px 0px 0px #674bb5;
	}

	/* Data Section */
	.data-section h2 {
		margin: 0 0 16px;
	}

	.empty-state {
		padding: 32px;
		background: #e8ddff;
		border: 3px dashed #674bb5;
		text-align: center;
		font-weight: 600;
		color: #674bb5;
	}

	.table-container {
		background: #fff;
		border: 4px solid #1b1c19;
		box-shadow: 6px 6px 0px 0px #1b1c19;
		overflow-x: auto;
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
	}

	.data-table th, .data-table td {
		padding: 14px 16px;
		border-bottom: 2px solid #1b1c19;
	}

	.data-table th {
		background: #efeee9;
		font-weight: 700;
	}

	.badge {
		font-size: 11px;
		font-weight: 700;
		padding: 4px 8px;
		background: #1b1c19;
		color: #fff;
		letter-spacing: 0.05em;
	}

	.btn-icon {
		background: none;
		border: none;
		cursor: pointer;
		color: #1b1c19;
		padding: 4px;
	}

	.btn-icon:hover {
		color: #674bb5;
	}

	.btn-icon-danger:hover {
		color: #d32f2f;
	}

	@media (max-width: 600px) {
		.form-row { grid-template-columns: 1fr; }
	}

	/* Toast Notification */
	.toast {
		position: fixed;
		top: 24px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 14px 24px;
		border: 3px solid #1b1c19;
		box-shadow: 4px 4px 0px 0px #1b1c19;
		z-index: 1000;
		font-weight: 700;
		font-size: 15px;
		animation: slideDown 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	.toast-error {
		background: #ffdde1;
		color: #d32f2f;
	}

	.toast-success {
		background: #e6ffed;
		color: #22863a;
	}

	@keyframes slideDown {
		from {
			transform: translate(-50%, -100%);
			opacity: 0;
		}
		to {
			transform: translate(-50%, 0);
			opacity: 1;
		}
	}
</style>
