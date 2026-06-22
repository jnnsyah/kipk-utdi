import { fetchActivities } from '$lib/services/activityService.js';
import { fetchFaqs } from '$lib/services/faqService.js';

export async function load() {
	try {
		const [{ data: activities }, { data: faqs }] = await Promise.all([
			fetchActivities(1, 10, ''),
			fetchFaqs(1, 10, '')
		]);
		return { activities: activities || [], faqs: faqs || [] };
	} catch (e) {
		console.error('Error loading landing data:', e);
		return { activities: [], faqs: [] };
	}
}
