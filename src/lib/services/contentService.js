import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';

let supabase;

export function getSupabase() {
	if (!supabase) {
		supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY);
	}
	return supabase;
}

export async function fetchContents(page = 1, itemsPerPage = 10) {
	const db = getSupabase();
	const { data, count, error } = await db
		.from('site_content')
		.select('*', { count: 'exact' })
		.order('updated_at', { ascending: false })
		.range((page - 1) * itemsPerPage, page * itemsPerPage - 1);
		
	if (error) throw error;
	return { data, count };
}

export async function updateContent(id, contentData) {
	const db = getSupabase();
	
	const payload = {
		updated_at: new Date().toISOString(),
		...contentData
	};

	const { data, error } = await db
		.from('site_content')
		.update(payload)
		.eq('id', id)
		.select()
		.single();

	if (error) throw error;
	return data;
}
