<script>
	// Component for loading state on index page
</script>

<style>
	.loading-container {
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		inset: 0;
		z-index: 9999;
		background-color: var(--color-surface);
	}

	.word-slider-container {
		position: relative;
		display: inline-flex;
		align-items: center;
		overflow: hidden;
	}

	.word {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		opacity: 0;
		transform: translateY(-100%);
		filter: blur(10px);
		animation: slideBlur 3s infinite cubic-bezier(0.4, 0, 0.2, 1);
		white-space: nowrap;
	}

	.word:nth-child(2) {
		animation-delay: 0s;
	}
	.word:nth-child(3) {
		animation-delay: 1s;
	}
	.word:nth-child(4) {
		animation-delay: 2s;
	}

	@keyframes slideBlur {
		0% {
			transform: translateY(-100%);
			filter: blur(8px);
			opacity: 0;
		}
		10% {
			transform: translateY(0);
			filter: blur(0);
			opacity: 1;
		}
		33.33% {
			transform: translateY(0);
			filter: blur(0);
			opacity: 1;
		}
		43.33% {
			transform: translateY(100%);
			filter: blur(8px);
			opacity: 0;
		}
		100% {
			transform: translateY(100%);
			filter: blur(8px);
			opacity: 0;
		}
	}

	.grid-bg-header {
		background-image: linear-gradient(to right, rgb(219, 218, 213) 1px, transparent 1px),
			linear-gradient(rgb(219, 218, 213) 1px, transparent 1px);
		background-size: 40px 40px;
	}
</style>

<div class="loading-container grid-bg-header">
	<div class="flex items-center font-display text-[40px] md:text-[80px] font-black text-on-background transform -rotate-2">
		<span class="mr-3 md:mr-6">Ber</span>
		<div class="bg-primary text-on-primary border-4 md:border-8 border-on-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] px-4 md:px-8 py-2 md:py-4">
			<div class="word-slider-container">
				<!-- Invisible placeholder to dynamically set height and max width -->
				<span class="invisible whitespace-nowrap">kolaborasi</span>
				<span class="word">kolaborasi</span>
				<span class="word">inovasi</span>
				<span class="word">prestasi</span>
			</div>
		</div>
	</div>
</div>
