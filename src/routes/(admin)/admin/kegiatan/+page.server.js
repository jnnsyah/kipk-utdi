export async function load({ locals }) {
	const { supabase } = locals;
	
	const { data, count, error } = await supabase
		.from('activities')
		.select('*, photos:activity_photos(*)', { count: 'exact' })
		.order('date', { ascending: false })
		.range(0, 9);
		
	if (error) {
		console.error('Error fetching activities:', error);
		return { activities: [], totalItems: 0 };
	}

	const mappedActivities = data.map(act => {
		const photos = act.photos
			? act.photos
				.sort((a, b) => a.order - b.order)
				.map(p => {
					const { data: urlData } = supabase.storage
						.from('dokumentasi-kegiatan')
						.getPublicUrl(p.storage_path);
					return urlData.publicUrl;
				})
			: [];
		return {
			...act,
			photos
		};
	});

	return {
		activities: mappedActivities,
		totalItems: count
	};
}
