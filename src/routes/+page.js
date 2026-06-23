import { fetchActivities } from '$lib/services/activityService.js';
import { fetchFaqs } from '$lib/services/faqService.js';
import { browser } from '$app/environment';

export async function load({ url }) {
	try {
		const [{ data: activities }, { data: faqs }] = await Promise.all([
			fetchActivities(1, 10, ''),
			fetchFaqs(1, 10, '')
		]);
		return { 
			url: url.href,
			activities: activities || [], 
			faqs: faqs || [] 
		};
	} catch (e) {
		console.error('Error loading landing data:', e);
		return { 
			url: url.href,
			activities: [], 
			faqs: [] 
		};
	}
}

