import { createSupabaseServerClient } from '$lib/server/supabase';
import { redirect } from '@sveltejs/kit';

/**
 * Hook server utama:
 * 1. Refresh session Supabase di setiap request agar cookie selalu fresh.
 * 2. Proteksi semua route /admin/** kecuali /admin/login dan /auth/**.
 */
export async function handle({ event, resolve }) {
	const supabase = createSupabaseServerClient(event);

	// Refresh session — wajib dilakukan di setiap request agar token tidak kadaluarsa
	const {
		data: { session }
	} = await supabase.auth.getSession();

	// Inject helper ke event.locals agar bisa diakses dari +page.server.js
	event.locals.supabase = supabase;
	event.locals.session = session;

	const path = event.url.pathname;
	const isAdminRoute = path.startsWith('/admin');
	const isLoginPage = path === '/admin/login';
	const isAuthCallback = path.startsWith('/auth');

	// Jika akses ke route admin (bukan login) tanpa session → redirect ke login
	if (isAdminRoute && !isLoginPage && !isAuthCallback && !session) {
		throw redirect(303, '/admin/login');
	}

	// Jika sudah login dan buka halaman login → redirect ke dashboard
	if (isLoginPage && session) {
		throw redirect(303, '/admin/dashboard');
	}

	// Jika mengakses root /admin dan sudah login → redirect ke dashboard
	if ((path === '/admin' || path === '/admin/') && session) {
		throw redirect(303, '/admin/dashboard');
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			// Izinkan header content-range agar Supabase storage bisa digunakan
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
}
