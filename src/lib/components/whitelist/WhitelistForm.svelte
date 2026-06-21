<script>
	import Button from '$lib/components/ui/Button.svelte';

	let {
		email = $bindable(''),
		isSaving = false,
		onsubmit,
		oncancel
	} = $props();

	function handleSubmit(e) {
		e.preventDefault();
		if (onsubmit) onsubmit();
	}
</script>

<form class="whitelist-form" onsubmit={handleSubmit}>
	<div class="form-group">
		<label for="email">Alamat Email Google Admin</label>
		<input 
			type="email" 
			id="email" 
			bind:value={email} 
			placeholder="Contoh: admin.utama@gmail.com" 
			required 
			class="brutal-input"
			disabled={isSaving}
		/>
		<small class="help-text">Hanya email Google terdaftar di whitelist ini yang diizinkan untuk login ke dashboard admin.</small>
	</div>

	<div class="form-actions">
		<Button variant="secondary" type="button" onclick={oncancel} disabled={isSaving}>Batal</Button>
		<Button variant="primary" type="submit" disabled={isSaving}>
			{isSaving ? 'Menyimpan...' : 'Tambah Email'}
		</Button>
	</div>
</form>

<style>
	.whitelist-form {
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
