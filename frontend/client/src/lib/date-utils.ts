import { formatDistanceToNow } from "date-fns";

/**
 * Formats a date string or Date object to Indian Standard Time (IST).
 * Format: "03 Jan 2026, 04:30 PM"
 * Timezone: Asia/Kolkata
 */
export function formatToIST(date: string | Date | null | undefined): string {
    if (!date) return "—";

    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid Date";

    return new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    }).format(d);
}

/**
 * Returns the relative time string (e.g. "5 minutes ago")
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
    if (!date) return "";

    const d = new Date(date);
    if (isNaN(d.getTime())) return "";

    return formatDistanceToNow(d, { addSuffix: true });
}
