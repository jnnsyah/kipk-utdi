import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';
import ws from 'ws';

/**
 * Buat Supabase client untuk server-side (hooks, +page.server.js, +layout.server.js)
 * Menggunakan cookies dari SvelteKit untuk session management.
 *
 * `ws` di-inject sebagai transport agar kompatibel dengan Node.js < 22
 * yang tidak memiliki native WebSocket global.
 */
export function createSupabaseServerClient(event) {
	return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
		realtime: { transport: ws },
		cookies: {
			getAll() {
				return event.cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});
}
