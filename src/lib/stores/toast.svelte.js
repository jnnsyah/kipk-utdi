export const toastState = $state({
	message: '',
	type: 'error', // 'error', 'success', 'info'
	visible: false
});

let toastTimeout;

export function showToast(message, type = 'error', duration = 5000) {
	toastState.message = message;
	toastState.type = type;
	toastState.visible = true;

	if (toastTimeout) clearTimeout(toastTimeout);
	
	toastTimeout = setTimeout(() => {
		toastState.visible = false;
	}, duration);
}
