<script>
	import Button from '$lib/components/ui/Button.svelte';

	let {
		isEditing = false,
		section_name = $bindable(''),
		content_text = $bindable(''),
		icon_name = $bindable(''),
		isSaving = false,
		onsubmit,
		oncancel
	} = $props();

	function handleSubmit(e) {
		e.preventDefault();
		if (onsubmit) onsubmit();
	}
</script>

<form class="content-form" onsubmit={handleSubmit}>
	<div class="form-group">
		<label for="section_name">Nama Bagian / Seksi (Opsional/Bebas)</label>
		<input 
			type="text" 
			id="section_name" 
			bind:value={section_name} 
			placeholder="Contoh: visi, misi, pengumuman..." 
			required 
			class="brutal-input"
			disabled={isEditing}
		/>
	</div>

	<div class="form-group">
		<label for="icon_name">Nama Ikon (Opsional)</label>
		<input 
			type="text" 
			id="icon_name" 
			bind:value={icon_name} 
			placeholder="Contoh: lightbulb, rocket_launch, article..." 
			class="brutal-input"
		/>
		<small class="help-text">Gunakan nama ikon SVG yang didukung oleh sistem.</small>
	</div>

	<div class="form-group">
		<label for="content_text">Konten Teks</label>
		<textarea 
			id="content_text" 
			bind:value={content_text} 
			rows="8" 
			placeholder="Masukkan konten teks di sini..." 
			required 
			class="brutal-input"
		></textarea>
	</div>

	<div class="form-actions">
		<Button variant="secondary" type="button" onclick={oncancel} disabled={isSaving}>Batal</Button>
		<Button variant="primary" type="submit" disabled={isSaving}>
			{isSaving ? 'Menyimpan...' : 'Simpan Konten'}
		</Button>
	</div>
</form>

<style>
	.content-form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.form-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	label {
		font-weight: 600;
		font-size: 14px;
		color: #1b1c19;
	}
	.brutal-input {
		width: 100%;
		padding: 12px;
		background: #fff;
		border: 3px solid var(--border-color, #1b1c19);
		box-shadow: 4px 4px 0px 0px var(--shadow-color, #1b1c19);
		font-family: inherit;
		font-size: 14px;
		transition: all 0.2s ease;
		border-radius: 0;
	}
	.brutal-input:focus {
		outline: none;
		border-color: var(--primary-color);
		box-shadow: 4px 4px 0px 0px var(--primary-color);
	}
	textarea.brutal-input {
		resize: vertical;
		min-height: 120px;
	}
	.help-text {
		font-size: 12px;
		color: #666;
		margin-top: 4px;
	}
	.form-actions {
		display: flex;
		gap: 12px;
		justify-content: flex-end;
		margin-top: 16px;
		padding-top: 16px;
		border-top: 2px dashed #ccc;
	}
</style>
