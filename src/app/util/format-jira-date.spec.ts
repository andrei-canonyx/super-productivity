import { formatJiraDate } from './format-jira-date';

describe('formatJiraDate', () => {
  it('should format date in Jira format', () => {
    const testDate = '2024-01-15T10:30:00.000Z';
    const result = formatJiraDate(testDate);

    // Should match YYYY-MM-DDTHH:mm:ss.SSZZ format
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{2}[+-]\d{4}$/);
  });

  it('should format various dates consistently', () => {
    const testDates = [
      '2024-01-15T10:30:00.000Z',
      '2024-06-01T00:00:00.000Z',
      '2024-12-31T23:59:59.999Z',
      new Date().toISOString(),
    ];

    testDates.forEach((date) => {
      const result = formatJiraDate(date);
      // Should match the Jira datetime format
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{2}[+-]\d{4}$/);
    });
  });

  it('should handle Date objects', () => {
    const date = new Date(2024, 0, 15, 10, 30, 0);
    const result = formatJiraDate(date);
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{2}[+-]\d{4}$/);
  });

  it('should handle timestamps', () => {
    const timestamp = new Date(2024, 0, 15, 10, 30, 0).getTime();
    const result = formatJiraDate(timestamp);
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{2}[+-]\d{4}$/);
  });

  it('should correctly format timezone offset without colon', () => {
    const date = new Date(2024, 0, 15, 10, 30, 0);
    const result = formatJiraDate(date);

    // Extract timezone part
    const timezonePart = result.substring(result.length - 5);
    expect(timezonePart).toMatch(/^[+-]\d{4}$/); // e.g., +0100 or -0500
  });

  describe('non-whole-hour timezone offsets', () => {
    const offsetSuffix = (tzOffsetMinutes: number): string => {
      spyOn(Date.prototype, 'getTimezoneOffset').and.returnValue(tzOffsetMinutes);
      const result = formatJiraDate(new Date(2024, 0, 15, 10, 30, 0));
      return result.substring(result.length - 5);
    };

    it('should format Asia/Kolkata (UTC+5:30) as +0530', () => {
      expect(offsetSuffix(-330)).toBe('+0530');
    });

    it('should format Asia/Kathmandu (UTC+5:45) as +0545', () => {
      expect(offsetSuffix(-345)).toBe('+0545');
    });

    it('should format America/St_Johns (UTC-3:30) as -0330', () => {
      expect(offsetSuffix(210)).toBe('-0330');
    });

    it('should format UTC as +0000', () => {
      expect(offsetSuffix(0)).toBe('+0000');
    });

    it('should format whole-hour offsets unchanged', () => {
      expect(offsetSuffix(-60)).toBe('+0100');
    });
  });
});
