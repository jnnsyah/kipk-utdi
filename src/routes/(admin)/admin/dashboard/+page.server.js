/**
 * Dashboard server — route: /admin/dashboard
 *
 * Proteksi sudah ditangani di +layout.server.js dan hooks.server.js.
 * Di sini cukup pass data user ke halaman.
 */
export async function load({ locals }) {
	return {
		user: locals.session?.user ?? null
	};
}
