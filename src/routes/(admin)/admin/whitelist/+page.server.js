export async function load({ locals }) {
	const { supabase } = locals;
	
	const { data, count, error } = await supabase
		.from('admin_whitelist')
		.select('*', { count: 'exact' })
		.order('created_at', { ascending: false })
		.range(0, 9);
		
	if (error) {
		console.error('Error fetching admin_whitelist:', error);
		return { whitelist: [], totalItems: 0 };
	}

	return {
		whitelist: data || [],
		totalItems: count || 0
	};
}
