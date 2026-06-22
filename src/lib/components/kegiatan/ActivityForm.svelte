<script>
	import Icon from '$lib/components/icons/Icon.svelte';
	import CustomSelect from '$lib/components/CustomSelect.svelte';
	import CustomDatePicker from '$lib/components/CustomDatePicker.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import 'cropperjs/dist/cropper.css';
	import { onMount } from 'svelte';
	let Cropper;

	onMount(async () => {
		const module = await import('cropperjs');
		Cropper = module.default;
	});
	let {
		isEditing = false,
		title = $bindable(''),
		tag = $bindable('SEMINAR'),
		date = $bindable(''),
		location = $bindable(''),
		description = $bindable(''),
		files = $bindable([]),
		existingPhotos = $bindable([]),
		photosToDelete = $bindable([]),
		isUploading = false,
		uploadProgress = 0,
		onsubmit,
		oncancel
	} = $props();

	const tagOptions = [
		{ value: 'SEMINAR', label: 'SEMINAR' },
		{ value: 'WORKSHOP', label: 'WORKSHOP' },
		{ value: 'TRAINING', label: 'TRAINING' },
		{ value: 'SOSIALISASI', label: 'SOSIALISASI' },
		{ value: 'EVALUASI', label: 'EVALUASI' },
		{ value: 'LAINNYA', label: 'LAINNYA' }
	];

	let dragOver = $state(false);
	let activeZoomPhoto = $state(null);

	// Crop States
	let filesToCrop = $state([]);
	let isCropping = $state(false);
	let currentCropFile = $state(null);
	let cropImageElement;
	let cropperInstance = null;

	function processNextCrop() {
		if (filesToCrop.length > 0) {
			currentCropFile = filesToCrop.shift();
			isCropping = true;
			setTimeout(() => {
				if (cropperInstance) cropperInstance.destroy();
				if (cropImageElement) {
					cropperInstance = new Cropper(cropImageElement, {
						aspectRatio: 16 / 9,
						viewMode: 1,
						background: false,
						autoCropArea: 1,
					});
				}
			}, 100);
		} else {
			isCropping = false;
			currentCropFile = null;
			if (cropperInstance) cropperInstance.destroy();
			cropperInstance = null;
		}
	}

	function cancelCrop() {
		processNextCrop();
	}

	function handleCropSave() {
		if (cropperInstance) {
			cropperInstance.getCroppedCanvas({
				width: 1280,
				height: 720,
			}).toBlob((blob) => {
				const newFile = new File([blob], currentCropFile.name, { type: currentCropFile.type });
				files = [...files, newFile];
				processNextCrop();
			}, currentCropFile.type, 0.85);
		}
	}

	function handleDrop(e) {
		e.preventDefault();
		dragOver = false;
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			const newFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
			filesToCrop = [...filesToCrop, ...newFiles];
			if (!isCropping) processNextCrop();
		}
	}

	function handleFileSelect(e) {
		if (e.target.files && e.target.files.length > 0) {
			const newFiles = Array.from(e.target.files);
			filesToCrop = [...filesToCrop, ...newFiles];
			if (!isCropping) processNextCrop();
			e.target.value = null; // reset input
		}
	}

	function removeFile(index) {
		files = files.filter((_, i) => i !== index);
	}

	function toggleDeletePhoto(url) {
		if (photosToDelete.includes(url)) {
			photosToDelete = photosToDelete.filter(p => p !== url);
		} else {
			photosToDelete = [...photosToDelete, url];
		}
	}

	function handleSubmit(e) {
		e.preventDefault();
		if (onsubmit) onsubmit();
	}
</script>

<form onsubmit={handleSubmit} class="kegiatan-form">
	<div class="form-row">
		<div class="form-group">
			<label for="title">Judul Kegiatan <span class="required">*</span></label>
			<input type="text" id="title" bind:value={title} required placeholder="Masukkan judul kegiatan..." />
		</div>
		<div class="form-group">
			<label for="tag">Kategori <span class="required">*</span></label>
			<CustomSelect options={tagOptions} bind:value={tag} id="tag" />
		</div>
	</div>

	<div class="form-row">
		<div class="form-group">
			<label for="date">Tanggal Kegiatan <span class="required">*</span></label>
			<CustomDatePicker bind:value={date} id="date" required={true} />
		</div>
		<div class="form-group">
			<label for="location">Lokasi <span class="required">*</span></label>
			<input type="text" id="location" bind:value={location} required placeholder="Contoh: Ruang Seminar Kampus" />
		</div>
	</div>

	<div class="form-group">
		<label for="description">Deskripsi</label>
		<textarea id="description" bind:value={description} rows="4" placeholder="Tuliskan deskripsi atau detail kegiatan di sini..."></textarea>
	</div>

	<!-- Area Upload Multi Gambar -->
	<div class="form-group">
		<label>Dokumentasi Kegiatan (Bisa pilih banyak gambar)</label>
		
		<div 
			class="upload-area {dragOver ? 'drag-over' : ''}" 
			ondragover={(e) => { e.preventDefault(); dragOver = true; }}
			ondragleave={() => { dragOver = false; }}
			ondrop={handleDrop}
			role="button"
			tabindex="0"
		>
			<Icon name="add_photo_alternate" size={32} color="#674bb5" />
			<p>Drag & drop gambar ke sini atau klik untuk memilih file</p>
			<input type="file" multiple accept="image/*" onchange={handleFileSelect} class="file-input-hidden" id="file-upload" />
			<label for="file-upload" class="btn-secondary" style="margin-top: 12px; cursor: pointer;">
				Pilih File Gambar
			</label>
		</div>

		{#if isEditing && existingPhotos && existingPhotos.length > 0}
			<div class="existing-photos-section">
				<p class="section-label">Foto Tersimpan (Klik tong sampah untuk menghapus):</p>
				<div class="photos-grid">
					{#each existingPhotos as url}
						<div class="photo-preview-item {photosToDelete.includes(url) ? 'marked-delete' : ''}">
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<img src={url} alt="Existing" onclick={() => activeZoomPhoto = url} style="cursor: zoom-in;" role="button" tabindex="0" />
							<button type="button" class="btn-remove-photo" onclick={() => toggleDeletePhoto(url)}>
								<Icon name={photosToDelete.includes(url) ? 'restore' : 'delete'} size={16} />
							</button>
							{#if photosToDelete.includes(url)}
								<div class="delete-overlay">Akan dihapus</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if files.length > 0}
			<div class="new-photos-section">
				<p class="section-label">Foto Baru yang akan diupload:</p>
				<div class="photos-grid">
					{#each files as file, index}
						<div class="photo-preview-item">
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<img src={URL.createObjectURL(file)} alt="Preview {index}" onclick={(e) => activeZoomPhoto = e.target.src} style="cursor: zoom-in;" role="button" tabindex="0" />
							<button type="button" class="btn-remove-photo" onclick={() => removeFile(index)}>
								<Icon name="close" size={16} />
							</button>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	{#if isUploading}
		<div class="progress-container">
			<div class="progress-bar" style="width: {uploadProgress}%"></div>
		</div>
		<p class="progress-text">Mengunggah... {uploadProgress}%</p>
	{/if}

	<div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
		<Button variant="secondary" onclick={oncancel} disabled={isUploading}>Batal</Button>
		<Button type="submit" variant="primary" disabled={isUploading}>
			<Icon name="save" size={18} />
			{isUploading ? 'Menyimpan...' : 'Simpan Kegiatan'}
		</Button>
	</div>
</form>

{#if activeZoomPhoto}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div 
		class="zoom-backdrop" 
		onclick={() => activeZoomPhoto = null}
		role="button"
		tabindex="0"
	>
		<div class="zoom-content" onclick={(e) => e.stopPropagation()}>
			<img src={activeZoomPhoto} alt="Zoomed preview" class="zoom-image" />
		</div>
	</div>
{/if}

<!-- Crop Modal -->
<Modal bind:show={isCropping} title="Potong Gambar (Rasio 16:9)" maxWidth="800px">
	<div class="crop-container bg-surface-variant p-4 border-4 border-on-background neo-shadow-sm">
		{#if currentCropFile}
			<img bind:this={cropImageElement} src={URL.createObjectURL(currentCropFile)} alt="Crop preview" class="max-w-full block">
		{/if}
	</div>
	{#snippet footer()}
		<Button variant="secondary" onclick={cancelCrop}>Lewati & Jangan Simpan File Ini</Button>
		<Button variant="primary" onclick={handleCropSave}>
			<Icon name="crop" size={18} />
			Potong & Simpan
		</Button>
	{/snippet}
</Modal>

<style>
	.form-group { margin-bottom: 20px; }
	.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
	label { display: block; font-weight: 700; margin-bottom: 8px; font-size: 14px; }
	.required { color: var(--danger-color); }
	input[type="text"], input[type="number"], textarea {
		width: 100%;
		padding: 12px;
		background: #fff;
		border: 3px solid var(--border-color);
		box-shadow: 4px 4px 0px 0px var(--shadow-color);
		font-family: inherit;
		font-size: 15px;
		transition: all 0.2s;
	}
	input:focus, textarea:focus {
		outline: none;
		border-color: var(--primary-color);
		box-shadow: 4px 4px 0px 0px var(--primary-color);
	}
	.upload-area {
		border: 3px dashed var(--primary-color);
		background: var(--primary-light);
		padding: 32px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: background 0.2s;
	}
	.upload-area.drag-over { background: #d1bfff; }
	.file-input-hidden { display: none; }
	
	.section-label { font-weight: 600; font-size: 13px; margin: 16px 0 8px; }
	.photos-grid { display: flex; flex-wrap: wrap; gap: 12px; }
	.photo-preview-item {
		position: relative;
		width: 80px;
		height: 80px;
		border: 2px solid var(--border-color);
		box-shadow: 2px 2px 0px 0px var(--shadow-color);
	}
	.photo-preview-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.btn-remove-photo {
		position: absolute;
		top: -8px;
		right: -8px;
		width: 24px;
		height: 24px;
		background: var(--danger-color);
		color: #fff;
		border: 2px solid var(--border-color);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		padding: 0;
	}
	.marked-delete { border-color: var(--danger-color); opacity: 0.7; }
	.delete-overlay {
		position: absolute;
		inset: 0;
		background: rgba(211, 47, 47, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 10px;
		font-weight: bold;
		color: #d32f2f;
		background: rgba(255, 255, 255, 0.8);
	}
	.progress-container { width: 100%; height: 8px; background: #efeee9; border: 2px solid var(--border-color); margin-top: 16px; }
	.progress-bar { height: 100%; background: var(--primary-color); transition: width 0.3s; }
	.progress-text { font-size: 12px; font-weight: 700; margin-top: 4px; text-align: right; }

	/* Zoom / Lightbox Preview */
	.zoom-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.85);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2000;
		padding: 24px;
		cursor: zoom-out;
	}
	.zoom-content {
		position: relative;
		background: #fff;
		border: 4px solid var(--border-color);
		box-shadow: 8px 8px 0px 0px var(--shadow-color);
		max-width: 90vw;
		max-height: 90vh;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		cursor: default;
	}
	.zoom-image {
		max-width: 100%;
		max-height: 80vh;
		object-fit: contain;
		display: block;
	}
	.zoom-close {
		position: absolute;
		top: 12px;
		right: 12px;
		width: 40px;
		height: 40px;
		background: var(--surface-white);
		border: 3px solid var(--border-color);
		box-shadow: 2px 2px 0px 0px var(--shadow-color);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.1s;
	}
	.zoom-close:hover {
		background: var(--danger-color);
		color: #fff;
		transform: translate(-1px, -1px);
		box-shadow: 3px 3px 0px 0px var(--shadow-color);
	}
</style>
