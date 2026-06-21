import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from "$env/static/public";
import ws from "ws";

/**
 * Browser-side Supabase client.
 * `ws` di-inject sebagai transport agar tidak error saat SSR di Node.js < 22.
 */
export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
	realtime: { transport: ws }
});
