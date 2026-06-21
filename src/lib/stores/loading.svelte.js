export const loadingState = $state({
	message: 'Memproses data...',
	visible: false
});

export function showLoading(message = 'Memproses data...') {
	loadingState.message = message;
	loadingState.visible = true;
}

export function hideLoading() {
	loadingState.visible = false;
}
