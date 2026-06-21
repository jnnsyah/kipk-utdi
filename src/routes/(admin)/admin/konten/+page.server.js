export async function load({ locals }) {
	const { supabase } = locals;
	
	const { data, count, error } = await supabase
		.from('site_content')
		.select('*', { count: 'exact' })
		.order('updated_at', { ascending: false })
		.range(0, 9);
		
	if (error) {
		console.error('Error fetching contents:', error);
		return { contents: [], totalItems: 0 };
	}

	return {
		contents: data || [],
		totalItems: count || 0
	};
}
