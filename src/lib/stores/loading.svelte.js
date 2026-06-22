let intervalId;

export const loadingState = $state({
	message: 'Memproses data...',
	visible: false,
	progress: 0
});

export function showLoading(message = 'Memproses data...') {
	loadingState.message = message;
	loadingState.visible = true;
	loadingState.progress = 0;
	
	if (intervalId) clearInterval(intervalId);
	
	// Increment progress over time to simulate active processing
	intervalId = setInterval(() => {
		if (loadingState.progress < 30) {
			loadingState.progress += Math.floor(Math.random() * 8) + 4; // fast start
		} else if (loadingState.progress < 70) {
			loadingState.progress += Math.floor(Math.random() * 4) + 2; // medium speed
		} else if (loadingState.progress < 95) {
			loadingState.progress += Math.floor(Math.random() * 2) + 1; // slow down near end
		}
		
		if (loadingState.progress > 95) {
			loadingState.progress = 95;
			clearInterval(intervalId);
		}
	}, 100);
}

export function hideLoading() {
	if (intervalId) clearInterval(intervalId);
	loadingState.progress = 100;
	// Small delay so the user can see the progress bar hit 100%
	setTimeout(() => {
		loadingState.visible = false;
	}, 300);
}
