<script>
	import Button from '$lib/components/ui/Button.svelte';

	let {
		isEditing = false,
		question = $bindable(''),
		answer = $bindable(''),
		order = $bindable(0),
		isSaving = false,
		onsubmit,
		oncancel
	} = $props();

	function handleSubmit(e) {
		e.preventDefault();
		if (onsubmit) onsubmit();
	}
</script>

<form class="faq-form" onsubmit={handleSubmit}>
	<div class="form-group">
		<label for="question">Pertanyaan</label>
		<textarea 
			id="question" 
			bind:value={question} 
			placeholder="Masukkan pertanyaan FAQ..." 
			required 
			rows="3"
			class="brutal-input"
		></textarea>
	</div>

	<div class="form-group">
		<label for="answer">Jawaban</label>
		<textarea 
			id="answer" 
			bind:value={answer} 
			rows="6" 
			placeholder="Masukkan jawaban FAQ..." 
			required 
			class="brutal-input"
		></textarea>
	</div>

	<div class="form-group">
		<label for="order">Urutan Tampilan (Order)</label>
		<div class="brutal-number-input">
			<button 
				type="button" 
				class="brutal-number-btn btn-left" 
				onclick={() => { if (order > 0) order--; }}
				disabled={isSaving}
			>
				-
			</button>
			<input 
				type="number" 
				id="order" 
				bind:value={order} 
				required 
				min="0"
				class="brutal-number-val"
				disabled={isSaving}
			/>
			<button 
				type="button" 
				class="brutal-number-btn btn-right" 
				onclick={() => order++}
				disabled={isSaving}
			>
				+
			</button>
		</div>
		<small class="help-text">Nilai urutan angka terkecil akan ditampilkan lebih dulu.</small>
	</div>

	<div class="form-actions">
		<Button variant="secondary" type="button" onclick={oncancel} disabled={isSaving}>Batal</Button>
		<Button variant="primary" type="submit" disabled={isSaving}>
			{isSaving ? 'Menyimpan...' : 'Simpan FAQ'}
		</Button>
	</div>
</form>

<style>
	.faq-form {
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

	/* Neo-brutalist number input spinner */
	.brutal-number-input {
		display: flex;
		width: fit-content;
		background: #fff;
		border: 3px solid var(--border-color, #1b1c19);
		box-shadow: 4px 4px 0px 0px var(--shadow-color, #1b1c19);
		align-items: center;
	}
	.brutal-number-btn {
		width: 44px;
		height: 44px;
		background: var(--primary-light, #e8ddff);
		border: none;
		font-family: inherit;
		font-size: 20px;
		font-weight: 800;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.15s ease;
		color: #1b1c19;
		user-select: none;
	}
	.brutal-number-btn:hover:not(:disabled) {
		background: var(--primary-color, #674bb5);
		color: #fff;
	}
	.brutal-number-btn:active:not(:disabled) {
		transform: scale(0.95);
	}
	.brutal-number-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.btn-left {
		border-right: 3px solid var(--border-color, #1b1c19);
	}
	.btn-right {
		border-left: 3px solid var(--border-color, #1b1c19);
	}
	.brutal-number-val {
		width: 70px;
		height: 44px;
		border: none;
		text-align: center;
		font-family: inherit;
		font-size: 16px;
		font-weight: 800;
		color: #1b1c19;
		outline: none;
		background: transparent;
		-moz-appearance: textfield;
	}
	.brutal-number-val::-webkit-outer-spin-button,
	.brutal-number-val::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
