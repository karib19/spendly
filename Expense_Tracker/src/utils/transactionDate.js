
export function parseTransactionDate(value) {
  if (!value) return null;

  // Parse date-only values as local dates to avoid timezone shifts.
  if (typeof value === "string") {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (match) {
      const year = Number(match[1]);
      const month = Number(match[2]) - 1;
      const day = Number(match[3]);
      const date = new Date(year, month, day);

      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month ||
        date.getDate() !== day
      ) {
        return null;
      }

      return date;
    }
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}
