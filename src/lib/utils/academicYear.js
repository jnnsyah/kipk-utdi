/**
 * Mengambil tahun akademik berdasarkan tanggal tertentu.
 * Pergantian tahun akademik terjadi setiap bulan September.
 * Jika bulan >= September, tahun akademik adalah Tahun/Tahun+1
 * Jika bulan < September, tahun akademik adalah Tahun-1/Tahun
 *
 * @param {Date} [date] - Tanggal opsional, default ke tanggal sekarang
 * @returns {string} String representasi tahun akademik (contoh: "2025/2026")
 */
export function getCurrentAcademicYear(date = new Date()) {
	const year = date.getFullYear();
	const month = date.getMonth(); // 0 = Jan, 8 = Sep

	if (month >= 8) {
		// September atau setelahnya
		return `${year}/${year + 1}`;
	} else {
		// Sebelum September
		return `${year - 1}/${year}`;
	}
}

/**
 * Memanipulasi tahun akademik dengan menggeser n tahun (ke depan/belakang)
 * @param {string} currentAcaYear - Tahun akademik saat ini (contoh: "2025/2026")
 * @param {number} offset - Jumlah tahun untuk digeser (contoh: 1 atau -1)
 * @returns {string} Tahun akademik baru
 */
export function offsetAcademicYear(currentAcaYear, offset) {
	if (!currentAcaYear || typeof currentAcaYear !== 'string') return currentAcaYear;
	const parts = currentAcaYear.split('/');
	if (parts.length !== 2) return currentAcaYear;
	
	const startYear = parseInt(parts[0], 10);
	const endYear = parseInt(parts[1], 10);
	
	if (isNaN(startYear) || isNaN(endYear)) return currentAcaYear;

	return `${startYear + offset}/${endYear + offset}`;
}
