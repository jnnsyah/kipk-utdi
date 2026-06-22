<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { getSupabase } from '$lib/services/activityService.js';
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';

	let { children } = $props();

	onMount(async () => {
		if (!browser) return;

		// Detect if we have auth fragment in the URL (which means we were redirected from OAuth)
		const hash = window.location.hash;
		const searchParams = new URLSearchParams(window.location.search);
		const hasAuthHash = hash.includes('access_token=') || hash.includes('id_token=') || hash.includes('error=');
		const hasAuthCode = searchParams.has('code');

		if (hasAuthHash || hasAuthCode) {
			try {
				const supabase = getSupabase();
				
				// Let Supabase process the session from hash/parameters
				const { data: { session } } = await supabase.auth.getSession();
				
				if (session) {
					const email = session.user?.email;
					if (email) {
						// Check if email is whitelisted
						const { data: whitelist } = await supabase
							.from('admin_whitelist')
							.select('email')
							.eq('email', email)
							.maybeSingle();
							
						if (whitelist) {
							// User is whitelisted, redirect to dashboard
							window.location.href = '/admin/dashboard';
						} else {
							// Not in whitelist, sign out and show authorization error
							await supabase.auth.signOut();
							window.location.href = `/admin/login?error=not_authorized&email=${encodeURIComponent(email)}`;
						}
					}
				}
			} catch (err) {
				console.error('Auth redirect handling failed:', err);
			}
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
