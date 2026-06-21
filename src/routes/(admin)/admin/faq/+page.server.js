export async function load({ locals }) {
	const { supabase } = locals;
	
	const { data, count, error } = await supabase
		.from('faqs')
		.select('*', { count: 'exact' })
		.order('order', { ascending: true })
		.range(0, 9);
		
	if (error) {
		console.error('Error fetching faqs:', error);
		return { faqs: [], totalItems: 0 };
	}

	return {
		faqs: data || [],
		totalItems: count || 0
	};
}
