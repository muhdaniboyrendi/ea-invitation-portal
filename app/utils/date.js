// utils/date.ts

/**
 * Mengubah format tanggal ISO ke format Indonesia
 * @param isoDate - Tanggal dalam format ISO (contoh: "2025-09-09T06:43:02.000000Z")
 * @returns String tanggal dalam format "9 September 2025"
 */
export const formatDateToIndonesian = (isoDate) => {
  const date = new Date(isoDate);

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

/**
 * Mengubah format waktu ISO ke format jam Indonesia
 * @param isoDate - Tanggal dalam format ISO (contoh: "2025-09-09T06:43:02.000000Z")
 * @returns String waktu dalam format "06:43"
 */
export const formatTimeToIndonesian = (isoDate) => {
  const date = new Date(isoDate);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

/**
 * Mengubah format tanggal dan waktu ISO ke format Indonesia lengkap
 * @param isoDate - Tanggal dalam format ISO (contoh: "2025-09-09T06:43:02.000000Z")
 * @returns String tanggal dan waktu dalam format "9 September 2025, 06:43"
 */
export const formatDateTimeToIndonesian = (isoDate) => {
  const dateStr = formatDateToIndonesian(isoDate);
  const timeStr = formatTimeToIndonesian(isoDate);

  return `${dateStr}, ${timeStr}`;
};

/**
 * Mengubah format tanggal dan waktu ISO ke format Indonesia dengan zona waktu
 * @param isoDate - Tanggal dalam format ISO (contoh: "2025-09-09T06:43:02.000000Z")
 * @param timezone - Zona waktu (default: 'Asia/Jakarta')
 * @returns String tanggal dan waktu dengan zona waktu
 */
export const formatDateTimeWithTimezone = (
  isoDate,
  timezone = "Asia/Jakarta"
) => {
  const date = new Date(isoDate);

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  // Konversi ke zona waktu yang diinginkan
  const localDate = new Date(
    date.toLocaleString("en-US", { timeZone: timezone })
  );

  const day = localDate.getDate();
  const month = months[localDate.getMonth()];
  const year = localDate.getFullYear();
  const hours = localDate.getHours().toString().padStart(2, "0");
  const minutes = localDate.getMinutes().toString().padStart(2, "0");

  return `${day} ${month} ${year}, ${hours}:${minutes}`;
};

/**
 * Mengubah format tanggal ISO ke format singkat Indonesia
 * @param isoDate - Tanggal dalam format ISO (contoh: "2025-09-09T06:43:02.000000Z")
 * @returns String tanggal dalam format "09/09/2025"
 */
export const formatDateToShort = (isoDate) => {
  const date = new Date(isoDate);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Mengecek apakah tanggal adalah hari ini
 * @param isoDate - Tanggal dalam format ISO
 * @returns Boolean true jika hari ini
 */
export const isToday = (isoDate) => {
  const date = new Date(isoDate);
  const today = new Date();

  return date.toDateString() === today.toDateString();
};

/**
 * Mengecek apakah tanggal adalah kemarin
 * @param isoDate - Tanggal dalam format ISO
 * @returns Boolean true jika kemarin
 */
export const isYesterday = (isoDate) => {
  const date = new Date(isoDate);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return date.toDateString() === yesterday.toDateString();
};

/**
 * Format tanggal dengan logika relatif (hari ini, kemarin, atau tanggal lengkap)
 * @param isoDate - Tanggal dalam format ISO
 * @returns Object dengan date dan time terpisah
 */
export const formatRelativeDate = (isoDate) => {
  if (isToday(isoDate)) {
    return "Hari ini";
  } else if (isYesterday(isoDate)) {
    return "Kemarin";
  } else {
    return formatDateToIndonesian(isoDate);
  }
};
