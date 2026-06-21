import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';

let supabase;

export function getSupabase() {
	if (!supabase) {
		supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY);
	}
	return supabase;
}

export async function fetchWhitelist(page = 1, itemsPerPage = 10, searchQuery = '') {
	const db = getSupabase();
	let query = db
		.from('admin_whitelist')
		.select('*', { count: 'exact' });

	if (searchQuery) {
		query = query.ilike('email', `%${searchQuery}%`);
	}

	const { data, count, error } = await query
		.order('created_at', { ascending: false })
		.range((page - 1) * itemsPerPage, page * itemsPerPage - 1);
		
	if (error) throw error;
	return { data, count };
}

export async function addWhitelist(emailData) {
	const db = getSupabase();
	const { data, error } = await db
		.from('admin_whitelist')
		.insert([emailData])
		.select()
		.single();

	if (error) throw error;
	return data;
}

export async function deleteWhitelist(email) {
	const db = getSupabase();
	const { error } = await db
		.from('admin_whitelist')
		.delete()
		.eq('email', email);

	if (error) throw error;
}
