<script>
	import { clickOutside } from '$lib/utils/clickOutside.js';

	let { value = $bindable(), placeholder = "Pilih Tanggal" } = $props();

	let isOpen = $state(false);
	
	// Format the display date
	let displayDate = $derived(() => {
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

	// For the calendar grid
	let currentMonth = $state(new Date().getMonth());
	let currentYear = $state(new Date().getFullYear());

	// Initialize from value if exists
	$effect(() => {
		if (value && !isOpen) {
			const d = new Date(value);
			if (!isNaN(d.getTime())) {
				currentMonth = d.getMonth();
				currentYear = d.getFullYear();
			}
		}
	});

	const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
	
	const calendarDays = $derived(() => {
		const days = [];
		const firstDay = new Date(currentYear, currentMonth, 1).getDay();
		const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
		
		// Fill empty slots before 1st day (0 = Sunday, we'll keep Sunday as first column)
		for (let i = 0; i < firstDay; i++) {
			days.push(null);
		}
		
		// Fill days
		for (let i = 1; i <= daysInMonth; i++) {
			days.push(i);
		}
		return days;
	});

	function toggle() {
		isOpen = !isOpen;
	}

	function prevMonth() {
		if (currentMonth === 0) {
			currentMonth = 11;
			currentYear -= 1;
		} else {
			currentMonth -= 1;
		}
	}

	function nextMonth() {
		if (currentMonth === 11) {
			currentMonth = 0;
			currentYear += 1;
		} else {
			currentMonth += 1;
		}
	}

	function selectDate(day) {
		if (!day) return;
		const m = String(currentMonth + 1).padStart(2, '0');
		const d = String(day).padStart(2, '0');
		value = `${currentYear}-${m}-${d}`; // YYYY-MM-DD
		isOpen = false;
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
		<span class={!value ? 'placeholder' : ''}>{displayDate()}</span>
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
			<line x1="16" y1="2" x2="16" y2="6"></line>
			<line x1="8" y1="2" x2="8" y2="6"></line>
			<line x1="3" y1="10" x2="21" y2="10"></line>
		</svg>
	</button>

	{#if isOpen}
		<div class="calendar-popup">
			<div class="calendar-header">
				<button type="button" class="btn-nav" onclick={prevMonth} title="Bulan Sebelumnya">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="15 18 9 12 15 6"></polyline>
					</svg>
				</button>
				
				<div class="month-year-selectors">
					<select bind:value={currentMonth} class="header-select month-select">
						{#each monthNames as month, i}
							<option value={i}>{month}</option>
						{/each}
					</select>
					<select bind:value={currentYear} class="header-select year-select">
						{#each Array.from({length: 21}, (_, i) => new Date().getFullYear() - 10 + i) as year}
							<option value={year}>{year}</option>
						{/each}
					</select>
				</div>

				<button type="button" class="btn-nav" onclick={nextMonth} title="Bulan Selanjutnya">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="9 18 15 12 9 6"></polyline>
					</svg>
				</button>
			</div>
			
			<div class="calendar-grid">
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

	.month-year-selectors {
		display: flex;
		gap: 6px;
	}

	.header-select {
		appearance: none;
		-webkit-appearance: none;
		border: 2px solid transparent;
		background: #faf9f4;
		font-family: inherit;
		font-size: 14px;
		font-weight: 700;
		color: #1b1c19;
		padding: 4px 8px;
		cursor: pointer;
		border-radius: 4px;
		transition: all 0.15s;
		text-align: center;
	}

	.header-select:hover, .header-select:focus {
		border-color: #1b1c19;
		background: #fff;
		outline: none;
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
	}

	.btn-nav:hover {
		background: #e8ddff;
		color: #674bb5;
	}

	.calendar-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 4px;
		text-align: center;
	}

	.day-name {
		font-size: 11px;
		font-weight: 700;
		color: #7a7583;
		padding-bottom: 8px;
	}

	.day-btn {
		background: none;
		border: 2px solid transparent;
		padding: 8px 0;
		font-size: 13px;
		font-family: inherit;
		cursor: pointer;
		border-radius: 4px;
		transition: all 0.15s;
	}

	.day-btn:hover {
		background: #efeee9;
		border-color: #1b1c19;
	}

	.day-btn.today {
		border-bottom: 2px solid #674bb5;
		font-weight: 700;
	}

	.day-btn.selected {
		background: #674bb5;
		color: #fff;
		border-color: #1b1c19;
		font-weight: 700;
	}

	.empty-day {
		padding: 8px 0;
	}
</style>
