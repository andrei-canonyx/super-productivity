/** Represents a range of a week, including start and end dates */
export interface WeekRange {
  /** Start date of the week */
  start: Date;
  /** End date of the week */
  end: Date;
}

/**
 * Calculates the start and end dates of a week based on a given date and a specified starting day of the week.
 *
 * @param relativeDate - The date relative to which the weekly range is calculated.
 * @param firstDayOfWeek - The day of the week that defines the start of the week (0 = Sunday, 1 = Monday, etc.).
 * @returns An object containing the start and end dates of the week.
 */
export const getWeekRange = (relativeDate: Date, firstDayOfWeek: number): WeekRange => {
  // Work purely from local date parts: callers pass local dates (e.g. from
  // parseDbDateStr or new Date()), so shifting by the timezone offset would
  // move local midnight/evening times into the neighbouring day.
  const dayOfWeek = relativeDate.getDay();

  // Calculate the shift to determine the start of the week
  const shift =
    dayOfWeek >= firstDayOfWeek
      ? dayOfWeek - firstDayOfWeek
      : 7 - (firstDayOfWeek - dayOfWeek);

  // Start of the week at local midnight
  const startOfWeek = new Date(
    relativeDate.getFullYear(),
    relativeDate.getMonth(),
    relativeDate.getDate() - shift,
  );

  // End of the week (6 days later) at the end of the local day
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return {
    start: startOfWeek,
    end: endOfWeek,
  };
};
