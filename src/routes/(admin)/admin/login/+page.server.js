import { redirect } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';

/**
 * Server logic untuk halaman login admin.
 *
 * GET: Render halaman login (tidak perlu load data apapun).
 * POST (action 'login'): Inisiasi Google OAuth flow.
 * POST (action 'logout'): Sign out user yang sedang login.
 */
export const actions = {
	/**
	 * Action: Login via Google OAuth
	 * Dibuat sebagai form action agar bekerja tanpa JavaScript (progressive enhancement).
	 */
	login: async ({ locals, url }) => {
		const redirectTo = `${url.origin}/auth/callback`;

		const { data, error } = await locals.supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo,
				queryParams: {
					// Paksa Google menampilkan halaman pemilihan akun setiap kali login
					prompt: 'select_account'
				}
			}
		});

		if (error) {
			return { success: false, error: error.message };
		}

		// Redirect user ke halaman OAuth Google
		throw redirect(303, data.url);
	},

	/**
	 * Action: Logout
	 */
	logout: async ({ locals }) => {
		await locals.supabase.auth.signOut();
		throw redirect(303, '/admin/login');
	}
};
