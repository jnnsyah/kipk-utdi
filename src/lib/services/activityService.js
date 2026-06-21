import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';
import { compressImageToWebP } from '$lib/utils/imageCompressor.js';

let supabase;

export function getSupabase() {
	if (!supabase) {
		supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY);
	}
	return supabase;
}

export async function fetchActivities(page = 1, itemsPerPage = 10, searchQuery = '', tagFilter = '') {
	const db = getSupabase();
	let query = db
		.from('activities')
		.select('*, photos:activity_photos(*)', { count: 'exact' });

	if (searchQuery) {
		query = query.or(`title.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
	}

	if (tagFilter && tagFilter !== 'ALL') {
		query = query.eq('tag', tagFilter);
	}

	const { data, count, error } = await query
		.order('date', { ascending: false })
		.range((page - 1) * itemsPerPage, page * itemsPerPage - 1);
		
	if (error) throw error;

	const mappedData = data.map(act => {
		const photos = act.photos
			? act.photos
				.sort((a, b) => a.order - b.order)
				.map(p => {
					const { data: urlData } = db.storage
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

	return { data: mappedData, count };
}

export async function addActivity(activityData, files, onProgress) {
	const db = getSupabase();
	
	const { data: actData, error: actError } = await db
		.from('activities')
		.insert([activityData])
		.select()
		.single();

	if (actError) throw actError;

	if (files && files.length > 0) {
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			if (onProgress) {
				onProgress(Math.round((i / files.length) * 100));
			}

			const compressedFile = await compressImageToWebP(file);
			const fileName = `${actData.id}/${Date.now()}-${i}.webp`;

			const { error: uploadError } = await db.storage
				.from('dokumentasi-kegiatan')
				.upload(fileName, compressedFile, { contentType: 'image/webp' });

			if (uploadError) {
				console.error("Gagal mengupload gambar:", uploadError);
				continue;
			}

			const { error: photoDbError } = await db
				.from('activity_photos')
				.insert([{
					activity_id: actData.id,
					storage_path: fileName,
					order: i
				}]);

			if (photoDbError) {
				console.error("Gagal menyimpan data foto ke database:", photoDbError);
			}
		}
		if (onProgress) onProgress(100);
	}
	return actData;
}

export async function updateActivity(id, activityData, newFiles, existingPhotos, photosToDelete, onProgress) {
	const db = getSupabase();

	// Hapus foto yang dipilih
	if (photosToDelete && photosToDelete.length > 0) {
		for (const url of photosToDelete) {
			try {
				const filePath = url.split('/dokumentasi-kegiatan/')[1];
				if (filePath) {
					await db.storage.from('dokumentasi-kegiatan').remove([filePath]);
					await db.from('activity_photos').delete().eq('storage_path', filePath);
				}
			} catch (e) {
				console.error("Error saat menghapus foto lama:", e);
			}
		}
	}

	let startOrder = 0;
	try {
		const { data: currentPhotosData } = await db
			.from('activity_photos')
			.select('order')
			.eq('activity_id', id)
			.order('order', { ascending: false })
			.limit(1);
		if (currentPhotosData && currentPhotosData.length > 0) {
			startOrder = currentPhotosData[0].order + 1;
		}
	} catch (e) {
		console.error("Error get start order:", e);
	}

	// Upload foto baru
	if (newFiles && newFiles.length > 0) {
		for (let i = 0; i < newFiles.length; i++) {
			const file = newFiles[i];
			if (onProgress) {
				onProgress(Math.round((i / newFiles.length) * 100));
			}

			const compressedFile = await compressImageToWebP(file);
			const fileName = `${id}/${Date.now()}-${i}.webp`;

			const { error: uploadError } = await db.storage
				.from('dokumentasi-kegiatan')
				.upload(fileName, compressedFile, { contentType: 'image/webp' });

			if (!uploadError) {
				await db
					.from('activity_photos')
					.insert([{
						activity_id: id,
						storage_path: fileName,
						order: startOrder + i
					}]);
			} else {
				console.error("Error upload new file:", uploadError);
			}
		}
		if (onProgress) onProgress(100);
	}

	// Update data utama activity
	const { error } = await db
		.from('activities')
		.update(activityData)
		.eq('id', id);

	if (error) throw error;
	return activityData;
}

export async function deleteActivity(id, existingPhotos) {
	const db = getSupabase();
	
	if (existingPhotos && existingPhotos.length > 0) {
		const filesToRemove = existingPhotos.map(url => {
			try {
				return url.split('/dokumentasi-kegiatan/')[1];
			} catch(e) { return null; }
		}).filter(Boolean);

		if (filesToRemove.length > 0) {
			await db.storage.from('dokumentasi-kegiatan').remove(filesToRemove);
		}
	}

	await db.from('activity_photos').delete().eq('activity_id', id);

	const { error } = await db
		.from('activities')
		.delete()
		.eq('id', id);

	if (error) throw error;
}
