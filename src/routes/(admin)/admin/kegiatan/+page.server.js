export async function load({ locals }) {
	const { supabase } = locals;
	
	// Ambil semua kegiatan, diurutkan dari yang terbaru
	const { data: activities, error } = await supabase
		.from('activities')
		.select('*')
		.order('date', { ascending: false });
		
	if (error) {
		console.error('Error fetching activities:', error);
		return { activities: [] };
	}

	return {
		activities
	};
}
