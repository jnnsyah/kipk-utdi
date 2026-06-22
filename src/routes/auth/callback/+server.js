import { redirect } from '@sveltejs/kit';

/**
 * Auth Callback Handler — route: /auth/callback
 *
 * Supabase Google OAuth mengarahkan kembali ke sini setelah user login.
 * Di sini kita:
 *   1. Tukar `code` dari URL menjadi session (server-side code exchange).
 *   2. Verifikasi email ada di tabel admin_whitelist.
 *   3. Jika tidak ada → logout dan redirect ke login dengan pesan error.
 *   4. Jika ada → redirect ke dashboard.
 */
export async function GET(event) {
	const { url, locals, cookies } = event;
	const code = url.searchParams.get('code');

	if (!code) {
		// Tidak ada code → kembali ke login dengan error
		throw redirect(303, '/admin/login?error=oauth_failed');
	}

	const { data, error } = await locals.supabase.auth.exchangeCodeForSession(code);

	if (error || !data.session) {
		throw redirect(303, '/admin/login?error=oauth_failed');
	}

	// Ambil email dari user yang baru login
	const email = data.session.user?.email;

	if (!email) {
		await locals.supabase.auth.signOut();
		throw redirect(303, '/admin/login?error=no_email');
	}

	// Cek apakah email terdaftar di whitelist admin
	const { data: whitelistEntry, error: whitelistError } = await locals.supabase
		.from('admin_whitelist')
		.select('email')
		.eq('email', email)
		.maybeSingle();

	if (whitelistError || !whitelistEntry) {
		// Email tidak terdaftar → hapus session dan redirect dengan error
		await locals.supabase.auth.signOut();
		throw redirect(
			303,
			`/admin/login?error=not_authorized&email=${encodeURIComponent(email)}`
		);
	}

	// Berhasil → selalu redirect ke dashboard
	throw redirect(303, '/admin/dashboard');
}
