<script>
	let { type = 'default', text = '' } = $props();

	const typeClasses = {
		'SEMINAR': 'badge-seminar',
		'WORKSHOP': 'badge-workshop',
		'TRAINING': 'badge-training',
		'SOSIALISASI': 'badge-sosialisasi',
		'LAINNYA': ''
	};
	
	const classType = typeClasses[type] || '';
</script>

<span class="badge {classType}">{text || type}</span>
