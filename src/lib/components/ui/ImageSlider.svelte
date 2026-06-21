<script>
	import Icon from '$lib/components/icons/Icon.svelte';
	import { fly } from 'svelte/transition';

	let { photos = [] } = $props();

	let activePhotoIndex = $state(0);
	let pauseAutoSlide = $state(false);
	let slideTimeout = null;

	function slidePhoto(dir, isAuto = false) {
		if (photos.length === 0) return;
		activePhotoIndex = (activePhotoIndex + dir + photos.length) % photos.length;

		if (!isAuto) {
			pauseAutoSlide = true;
			if (slideTimeout) clearTimeout(slideTimeout);
			slideTimeout = setTimeout(() => {
				pauseAutoSlide = false;
			}, 5000);
		}
	}

	$effect(() => {
		let interval;
		if (photos.length > 1 && !pauseAutoSlide) {
			interval = setInterval(() => {
				slidePhoto(1, true);
			}, 3000);
		}
		return () => {
			if (interval) clearInterval(interval);
		};
	});
</script>

{#if photos.length > 0}
	<div class="photo-slider-wrapper">
		{#if photos.length > 1}
			<button class="slider-btn" onclick={() => slidePhoto(-1)}>
				<Icon name="arrow_back" size={20} />
			</button>
		{/if}
		
		<div class="photo-frame">
			{#key activePhotoIndex}
				<div 
					class="slider-img-wrapper"
					in:fly={{x: 400, duration: 400}}
					out:fly={{x: -400, duration: 400}}
				>
					<img 
						src={photos[activePhotoIndex]} 
						alt="Dokumentasi {activePhotoIndex + 1}" 
						class="slider-img" 
					/>
				</div>
			{/key}
			
			{#if photos.length > 1}
				<div class="slider-counter">
					{activePhotoIndex + 1} / {photos.length}
				</div>
			{/if}
		</div>
		
		{#if photos.length > 1}
			<button class="slider-btn" onclick={() => slidePhoto(1)}>
				<Icon name="arrow_forward" size={20} />
			</button>
		{/if}
	</div>
{/if}

<style>
	.photo-slider-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
		margin-bottom: 24px;
	}

	.photo-frame {
		position: relative;
		flex: 1;
		aspect-ratio: 16 / 9;
		display: grid;
	}

	.slider-img-wrapper {
		grid-area: 1 / 1;
		width: 100%;
		height: 100%;
		background: #efeee9;
		border: 4px solid #1b1c19;
		box-shadow: 6px 6px 0px 0px #1b1c19;
		display: flex;
	}

	.slider-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.slider-btn {
		width: 44px;
		height: 44px;
		flex-shrink: 0;
		background: #faf9f4;
		border: 3px solid #1b1c19;
		box-shadow: 2px 2px 0px 0px #1b1c19;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.15s;
		z-index: 10;
	}

	.slider-btn:hover {
		background: #674bb5;
		color: #fff;
		transform: translate(-2px, -2px);
		box-shadow: 4px 4px 0px 0px #1b1c19;
	}

	.slider-btn:active {
		transform: translate(2px, 2px);
		box-shadow: 0px 0px 0px 0px #1b1c19;
	}

	.slider-counter {
		position: absolute;
		bottom: 12px;
		right: 12px;
		background: #1b1c19;
		color: #fff;
		padding: 4px 12px;
		font-weight: 700;
		font-size: 12px;
		border: 2px solid #faf9f4;
		grid-area: 1 / 1;
		align-self: end;
		justify-self: end;
		z-index: 10;
	}
</style>
