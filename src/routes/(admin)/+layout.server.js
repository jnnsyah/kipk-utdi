import { redirect } from '@sveltejs/kit';

/**
 * Layout server untuk semua route dalam grup (admin).
 * Double-check session dan whitelist di level layout
 * sebagai lapisan keamanan kedua (selain hooks.server.js).
 */
export async function load({ locals, url }) {
	const { session, supabase } = locals;
	const path = url.pathname;

	// Halaman login dikecualikan dari cek ini
	if (path === '/admin/login') {
		return { session: null };
	}

	// Jika tidak ada session → redirect ke login
	if (!session) {
		throw redirect(303, '/admin/login');
	}

	// Verifikasi ulang whitelist di setiap load (bukan hanya saat callback)
	const email = session.user?.email;
	const { data: whitelistEntry } = await supabase
		.from('admin_whitelist')
		.select('email')
		.eq('email', email)
		.maybeSingle();

	if (!whitelistEntry) {
		await supabase.auth.signOut();
		throw redirect(303, `/admin/login?error=not_authorized&email=${encodeURIComponent(email)}`);
	}

	return {
		session,
		user: session.user
	};
}
