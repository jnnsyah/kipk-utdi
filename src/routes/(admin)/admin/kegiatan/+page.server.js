export async function load({ locals }) {
	const { supabase } = locals;
	
	// Ambil kegiatan halaman pertama (10 item), diurutkan dari yang terbaru
	const { data: activities, count, error } = await supabase
		.from('activities')
		.select('*', { count: 'exact' })
		.order('date', { ascending: false })
		.range(0, 9);
		
	if (error) {
		console.error('Error fetching activities:', error);
		return { activities: [], totalItems: 0 };
	}

	return {
		activities,
		totalItems: count
	};
}
