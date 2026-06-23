export const prerender = true;

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const domain = 'https://kipk.utdi.ac.id'; // default production domain
	const origin = url.origin && url.origin !== 'http://sveltekit-prerender' ? url.origin : domain;

	const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>${origin}/</loc>
		<changefreq>daily</changefreq>
		<priority>1.0</priority>
	</url>
</urlset>`;

	return new Response(sitemapXml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
