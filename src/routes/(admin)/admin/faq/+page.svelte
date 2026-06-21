<script>
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import BackLink from '$lib/components/ui/BackLink.svelte';
	import DataTable from '$lib/components/ui/DataTable.svelte';

	/** @type {import('./$types').PageData} */
	let { data } = $props();

	let faqs = $derived(data.faqs ?? []);
</script>

<svelte:head>
	<title>Kelola FAQ — Admin KIP-K UTDI</title>
</svelte:head>

<div class="page-container">
	<BackLink />
	<PageHeader 
		title="Kelola FAQ" 
		buttonLabel="Tambah FAQ"
		buttonIcon="add"
		onaction={() => alert('Fitur belum diimplementasi sepenuhnya')}
	/>

	<section class="data-section">
		{#if faqs.length === 0}
			<p class="empty-state">Belum ada FAQ yang ditambahkan.</p>
		{:else}
			<DataTable headers={['Order', 'Pertanyaan', 'Jawaban', 'Aksi']}>
				{#each faqs as faq}
					<tr>
						<td>{faq.order}</td>
						<td><strong>{faq.question}</strong></td>
						<td>{faq.answer.substring(0, 50)}...</td>
						<td>
							<Button variant="icon" title="Edit"><Icon name="edit" size={20} /></Button>
							<Button variant="icon" class="btn-icon-danger" title="Hapus"><Icon name="delete" size={20} color="#d32f2f" /></Button>
						</td>
					</tr>
				{/each}
			</DataTable>
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

	.data-section {
		background: #fff;
		border: 4px solid #1b1c19;
		box-shadow: 6px 6px 0px 0px #1b1c19;
	}

	.empty-state {
		padding: 48px;
		text-align: center;
		color: #7a7583;
		background: #efeee9;
		border: 4px solid #1b1c19;
	}

</style>
