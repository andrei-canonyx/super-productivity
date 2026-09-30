import { getWeekRange } from './get-week-range';

// All inputs are local dates (as produced by parseDbDateStr / new Date()),
// so these expectations must hold in every timezone (Berlin, Los Angeles, ...).
describe('getWeekRange', () => {
  it('returns correct range for a date in the middle of the week', () => {
    const inputDate = new Date(2025, 10, 26); // Wednesday
    const startOfWeekDay = 0; // Sunday
    const expectedStart = new Date(2025, 10, 23); // Start of the week (Sunday)
    const expectedEnd = new Date(2025, 10, 29, 23, 59, 59, 999); // End (Saturday)

    const result = getWeekRange(inputDate, startOfWeekDay);

    expect(result.start).toEqual(expectedStart);
    expect(result.end).toEqual(expectedEnd);
  });

  it('handles week starting on Monday', () => {
    const inputDate = new Date(2025, 10, 26); // Wednesday
    const startOfWeekDay = 1; // Monday
    const expectedStart = new Date(2025, 10, 24); // Start of week (Monday)
    const expectedEnd = new Date(2025, 10, 30, 23, 59, 59, 999); // End (Sunday)

    const result = getWeekRange(inputDate, startOfWeekDay);

    expect(result.start).toEqual(expectedStart);
    expect(result.end).toEqual(expectedEnd);
  });

  it('correctly calculates the range for a Sunday input', () => {
    const inputDate = new Date(2025, 10, 30); // Sunday
    const startOfWeekDay = 0; // Sunday
    const expectedStart = new Date(2025, 10, 30); // Start of week (Sunday)
    const expectedEnd = new Date(2025, 11, 6, 23, 59, 59, 999); // End (Saturday)

    const result = getWeekRange(inputDate, startOfWeekDay);

    expect(result.start).toEqual(expectedStart);
    expect(result.end).toEqual(expectedEnd);
  });

  it('correctly handles startOfWeekDay greater than current day', () => {
    const inputDate = new Date(2025, 10, 30); // Sunday
    const startOfWeekDay = 3; // Wednesday
    const expectedStart = new Date(2025, 10, 26); // Start of week (Wednesday)
    const expectedEnd = new Date(2025, 11, 2, 23, 59, 59, 999); // End (Tuesday)

    const result = getWeekRange(inputDate, startOfWeekDay);

    expect(result.start).toEqual(expectedStart);
    expect(result.end).toEqual(expectedEnd);
  });

  it('start and end date are the same when date is the first day of week', () => {
    const inputDate = new Date(2025, 10, 30); // Sunday
    const startOfWeekDay = 0; // Sunday
    const expectedStart = new Date(2025, 10, 30);
    const expectedEnd = new Date(2025, 11, 6, 23, 59, 59, 999); // End (Saturday)

    const result = getWeekRange(inputDate, startOfWeekDay);

    expect(result.start).toEqual(expectedStart);
    expect(result.end).toEqual(expectedEnd);
  });

  // Regression: parseDbDateStr() returns local midnight. Shifting by the
  // timezone offset moved it into the previous day east of UTC (Berlin).
  it('keeps a local-midnight Monday in its own week (Monday start)', () => {
    const result = getWeekRange(new Date(2025, 10, 24), 1);

    expect(result.start).toEqual(new Date(2025, 10, 24));
    expect(result.end).toEqual(new Date(2025, 10, 30, 23, 59, 59, 999));
  });

  it('keeps a local-midnight Sunday in its own week (Sunday start)', () => {
    const result = getWeekRange(new Date(2025, 10, 23), 0);

    expect(result.start).toEqual(new Date(2025, 10, 23));
    expect(result.end).toEqual(new Date(2025, 10, 29, 23, 59, 59, 999));
  });

  // Regression: new Date() in the evening was shifted into the next day west
  // of UTC (Los Angeles), jumping to the following week.
  it('keeps a Saturday evening in its own week (Sunday start)', () => {
    const result = getWeekRange(new Date(2025, 10, 29, 18), 0);

    expect(result.start).toEqual(new Date(2025, 10, 23));
    expect(result.end).toEqual(new Date(2025, 10, 29, 23, 59, 59, 999));
  });

  it('keeps a late Sunday evening in its own week (Monday start)', () => {
    const result = getWeekRange(new Date(2025, 10, 30, 23, 30), 1);

    expect(result.start).toEqual(new Date(2025, 10, 24));
    expect(result.end).toEqual(new Date(2025, 10, 30, 23, 59, 59, 999));
  });

  it('keeps an early Monday morning in its own week (Monday start)', () => {
    const result = getWeekRange(new Date(2025, 10, 24, 0, 30), 1);

    expect(result.start).toEqual(new Date(2025, 10, 24));
  });
});
