export function formatDateShort(date) {
    if (!date) return "";

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    }).format(new Date(date));
}