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

export async function fetchActivities(page = 1, itemsPerPage = 10) {
	const db = getSupabase();
	const { data, count, error } = await db
		.from('activities')
		.select('*', { count: 'exact' })
		.order('date', { ascending: false })
		.range((page - 1) * itemsPerPage, page * itemsPerPage - 1);
		
	if (error) throw error;
	return { data, count };
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
		const uploadedUrls = [];
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			if (onProgress) {
				onProgress(Math.round(((i) / files.length) * 100));
			}

			const compressedFile = await compressImageToWebP(file);
			const fileName = `${actData.id}/${Date.now()}-${i}.webp`;

			const { error: uploadError } = await db.storage
				.from('activities')
				.upload(fileName, compressedFile, { contentType: 'image/webp' });

			if (uploadError) {
				console.error("Gagal mengupload gambar:", uploadError);
				continue;
			}

			const { data: urlData } = db.storage
				.from('activities')
				.getPublicUrl(fileName);

			uploadedUrls.push(urlData.publicUrl);
		}

		if (uploadedUrls.length > 0) {
			await db
				.from('activities')
				.update({ photos: uploadedUrls })
				.eq('id', actData.id);
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
				const filePath = url.split('/activities/')[1];
				if (filePath) {
					await db.storage.from('activities').remove([filePath]);
				}
			} catch (e) {
				console.error("Error saat menghapus foto lama:", e);
			}
		}
	}

	let currentPhotos = existingPhotos ? [...existingPhotos] : [];
	
	// Upload foto baru
	if (newFiles && newFiles.length > 0) {
		for (let i = 0; i < newFiles.length; i++) {
			const file = newFiles[i];
			if (onProgress) {
				onProgress(Math.round(((i) / newFiles.length) * 100));
			}

			const compressedFile = await compressImageToWebP(file);
			const fileName = `${id}/${Date.now()}-${i}.webp`;

			const { error: uploadError } = await db.storage
				.from('activities')
				.upload(fileName, compressedFile, { contentType: 'image/webp' });

			if (!uploadError) {
				const { data: urlData } = db.storage
					.from('activities')
					.getPublicUrl(fileName);
				currentPhotos.push(urlData.publicUrl);
			}
		}
		if (onProgress) onProgress(100);
	}

	const updatedData = { ...activityData, photos: currentPhotos };

	const { error } = await db
		.from('activities')
		.update(updatedData)
		.eq('id', id);

	if (error) throw error;
	return updatedData;
}

export async function deleteActivity(id, existingPhotos) {
	const db = getSupabase();
	
	// Hapus folder/foto dari storage
	if (existingPhotos && existingPhotos.length > 0) {
		const filesToRemove = existingPhotos.map(url => {
			try {
				return url.split('/activities/')[1];
			} catch(e) { return null; }
		}).filter(Boolean);

		if (filesToRemove.length > 0) {
			await db.storage.from('activities').remove(filesToRemove);
		}
	}

	const { error } = await db
		.from('activities')
		.delete()
		.eq('id', id);

	if (error) throw error;
}
