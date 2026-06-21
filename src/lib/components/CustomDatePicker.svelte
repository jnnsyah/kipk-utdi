<script>
	import { clickOutside } from '$lib/utils/clickOutside.js';
	import Icon from './icons/Icon.svelte';

	let { value = $bindable(), placeholder = "Pilih Tanggal" } = $props();

	let isOpen = $state(false);
	let viewMode = $state('days'); // 'days' | 'months' | 'years'
	
	// Format the display date
	let displayDate = $derived.by(() => {
		if (!value) return placeholder;
		try {
			const d = new Date(value);
			if (isNaN(d.getTime())) return placeholder;
			const day = String(d.getDate()).padStart(2, '0');
			const month = String(d.getMonth() + 1).padStart(2, '0');
			const year = d.getFullYear();
			return `${day}/${month}/${year}`;
		} catch {
			return placeholder;
		}
	});

	let currentMonth = $state(new Date().getMonth());
	let currentYear = $state(new Date().getFullYear());
	let yearRangeStart = $derived(Math.floor(currentYear / 12) * 12);

	$effect(() => {
		if (value && !isOpen) {
			const d = new Date(value);
			if (!isNaN(d.getTime())) {
				currentMonth = d.getMonth();
				currentYear = d.getFullYear();
			}
			viewMode = 'days';
		}
	});

	const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
	const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
	
	const calendarDays = $derived(() => {
		const days = [];
		const firstDay = new Date(currentYear, currentMonth, 1).getDay();
		const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
		
		for (let i = 0; i < firstDay; i++) {
			days.push(null);
		}
		for (let i = 1; i <= daysInMonth; i++) {
			days.push(i);
		}
		return days;
	});

	function toggle() {
		isOpen = !isOpen;
		if (isOpen) viewMode = 'days';
	}

	function prevPage() {
		if (viewMode === 'days') {
			if (currentMonth === 0) {
				currentMonth = 11;
				currentYear -= 1;
			} else {
				currentMonth -= 1;
			}
		} else if (viewMode === 'months') {
			currentYear -= 1;
		} else if (viewMode === 'years') {
			currentYear -= 12;
		}
	}

	function nextPage() {
		if (viewMode === 'days') {
			if (currentMonth === 11) {
				currentMonth = 0;
				currentYear += 1;
			} else {
				currentMonth += 1;
			}
		} else if (viewMode === 'months') {
			currentYear += 1;
		} else if (viewMode === 'years') {
			currentYear += 12;
		}
	}

	function selectDate(day) {
		if (!day) return;
		const m = String(currentMonth + 1).padStart(2, '0');
		const d = String(day).padStart(2, '0');
		value = `${currentYear}-${m}-${d}`;
		isOpen = false;
	}

	function selectMonth(idx) {
		currentMonth = idx;
		viewMode = 'days';
	}

	function selectYear(yr) {
		currentYear = yr;
		viewMode = 'months';
	}

	function isSelected(day) {
		if (!day || !value) return false;
		const d = new Date(value);
		return d.getDate() === day && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
	}
	
	function isToday(day) {
		if (!day) return false;
		const today = new Date();
		return today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
	}
</script>

<div class="custom-datepicker" use:clickOutside={() => isOpen = false}>
	<button type="button" class="date-trigger {isOpen ? 'open' : ''}" onclick={toggle}>
		<span class={!value ? 'placeholder' : ''}>{displayDate}</span>
		<Icon name="event" size={20} />
	</button>

	{#if isOpen}
		<div class="calendar-popup">
			<div class="calendar-header">
				<button type="button" class="btn-nav" onclick={prevPage}>
					<Icon name="chevron_left" size={18} />
				</button>
				
				<div class="header-title">
					{#if viewMode === 'days'}
						<button type="button" class="title-btn" onclick={() => viewMode = 'months'}>
							{monthNames[currentMonth]} {currentYear}
						</button>
					{:else if viewMode === 'months'}
						<button type="button" class="title-btn" onclick={() => viewMode = 'years'}>
							{currentYear}
						</button>
					{:else}
						<button type="button" class="title-btn">
							{yearRangeStart} - {yearRangeStart + 11}
						</button>
					{/if}
				</div>

				<button type="button" class="btn-nav" onclick={nextPage}>
					<Icon name="chevron_right" size={18} />
				</button>
			</div>
			
			{#if viewMode === 'days'}
				<div class="calendar-grid days-grid">
					<div class="day-name">Min</div>
					<div class="day-name">Sen</div>
					<div class="day-name">Sel</div>
					<div class="day-name">Rab</div>
					<div class="day-name">Kam</div>
					<div class="day-name">Jum</div>
					<div class="day-name">Sab</div>
					
					{#each calendarDays() as day}
						{#if day === null}
							<div class="empty-day"></div>
						{:else}
							<button 
								type="button" 
								class="day-btn {isSelected(day) ? 'selected' : ''} {isToday(day) && !isSelected(day) ? 'today' : ''}" 
								onclick={() => selectDate(day)}
							>
								{day}
							</button>
						{/if}
					{/each}
				</div>
			{:else if viewMode === 'months'}
				<div class="calendar-grid months-grid">
					{#each shortMonthNames as month, idx}
						<button 
							type="button" 
							class="grid-btn {currentMonth === idx ? 'selected' : ''}" 
							onclick={() => selectMonth(idx)}
						>
							{month}
						</button>
					{/each}
				</div>
			{:else if viewMode === 'years'}
				<div class="calendar-grid years-grid">
					{#each Array.from({length: 12}, (_, i) => yearRangeStart + i) as yr}
						<button 
							type="button" 
							class="grid-btn {currentYear === yr ? 'selected' : ''}" 
							onclick={() => selectYear(yr)}
						>
							{yr}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.custom-datepicker {
		position: relative;
		width: 100%;
		font-family: inherit;
	}

	.date-trigger {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 14px;
		border: 3px solid #1b1c19;
		background: #faf9f4;
		font-size: 15px;
		font-weight: 500;
		color: #1b1c19;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s;
	}

	.date-trigger .placeholder {
		color: #7a7583;
		font-weight: 400;
	}

	.date-trigger:focus, .date-trigger.open {
		outline: none;
		background: #fff;
		box-shadow: 4px 4px 0px 0px #674bb5;
	}

	.calendar-popup {
		position: absolute;
		top: calc(100% + 4px);
		left: 0;
		width: 100%;
		min-width: 280px;
		padding: 16px;
		background: #fff;
		border: 3px solid #1b1c19;
		box-shadow: 4px 4px 0px 0px #1b1c19;
		z-index: 10;
	}

	.calendar-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
	}

	.header-title {
		flex: 1;
		display: flex;
		justify-content: center;
	}

	.title-btn {
		background: none;
		border: 2px solid transparent;
		font-family: inherit;
		font-size: 14px;
		font-weight: 700;
		color: #1b1c19;
		padding: 6px 12px;
		cursor: pointer;
		border-radius: 4px;
		transition: all 0.15s;
	}

	.title-btn:hover {
		background: #efeee9;
		border-color: #1b1c19;
	}

	.btn-nav {
		background: #efeee9;
		border: 2px solid #1b1c19;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: background 0.15s;
		flex-shrink: 0;
	}

	.btn-nav:hover {
		background: #e8ddff;
		color: #674bb5;
	}

	.calendar-grid {
		display: grid;
		gap: 4px;
		text-align: center;
	}

	.days-grid {
		grid-template-columns: repeat(7, 1fr);
	}

	.months-grid, .years-grid {
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
	}

	.day-name {
		font-size: 11px;
		font-weight: 700;
		color: #7a7583;
		padding-bottom: 8px;
	}

	.day-btn, .grid-btn {
		background: none;
		border: 2px solid transparent;
		font-family: inherit;
		cursor: pointer;
		border-radius: 4px;
		transition: all 0.15s;
	}

	.day-btn {
		padding: 8px 0;
		font-size: 13px;
	}

	.grid-btn {
		padding: 16px 0;
		font-size: 14px;
		font-weight: 600;
	}

	.day-btn:hover, .grid-btn:hover {
		background: #efeee9;
		border-color: #1b1c19;
	}

	.day-btn.today {
		border-bottom: 2px solid #674bb5;
		font-weight: 700;
	}

	.day-btn.selected, .grid-btn.selected {
		background: #674bb5;
		color: #fff;
		border-color: #1b1c19;
		font-weight: 700;
	}

	.empty-day {
		padding: 8px 0;
	}
</style>
