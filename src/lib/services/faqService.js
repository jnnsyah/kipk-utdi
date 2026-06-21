import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';

let supabase;

export function getSupabase() {
	if (!supabase) {
		supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY);
	}
	return supabase;
}

export async function fetchFaqs(page = 1, itemsPerPage = 10, searchQuery = '') {
	const db = getSupabase();
	let query = db
		.from('faqs')
		.select('*', { count: 'exact' });

	if (searchQuery) {
		query = query.or(`question.ilike.%${searchQuery}%,answer.ilike.%${searchQuery}%`);
	}

	const { data, count, error } = await query
		.order('order', { ascending: true })
		.range((page - 1) * itemsPerPage, page * itemsPerPage - 1);
		
	if (error) throw error;
	return { data, count };
}

export async function addFaq(faqData) {
	const db = getSupabase();
	const { data, error } = await db
		.from('faqs')
		.insert([faqData])
		.select()
		.single();

	if (error) throw error;
	return data;
}

export async function updateFaq(id, faqData) {
	const db = getSupabase();
	const { data, error } = await db
		.from('faqs')
		.update(faqData)
		.eq('id', id)
		.select()
		.single();

	if (error) throw error;
	return data;
}

export async function deleteFaq(id) {
	const db = getSupabase();
	const { error } = await db
		.from('faqs')
		.delete()
		.eq('id', id);

	if (error) throw error;
}
