import { TranslateService } from '@ngx-translate/core';
import { T } from '../t.const';

/**
 * Convert a timestamp to a human-readable relative time string
 * Similar to moment's fromNow() function
 */
export const humanizeTimestamp = (
  value: Date | number | string,
  translateService: TranslateService,
): string => {
  if (!value) {
    return '';
  }

  const date = typeof value === 'object' ? value : new Date(value);
  if (isNaN(date.getTime())) {
    return '';
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  // Floor on the absolute diff so future and past round the same way (towards
  // zero). Flooring a negative diff would overstate the remaining time.
  const absDiffMs = Math.abs(diffMs);
  const diffSeconds = Math.floor(absDiffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  const keys = diffMs < 0 ? T.GLOBAL_RELATIVE_TIME.FUTURE : T.GLOBAL_RELATIVE_TIME.PAST;

  if (diffSeconds < 45) {
    return translateService.instant(keys.FEW_SECONDS);
  } else if (diffSeconds < 90) {
    return translateService.instant(keys.A_MINUTE);
  } else if (diffMinutes < 45) {
    return translateService.instant(keys.MINUTES, {
      count: diffMinutes,
    });
  } else if (diffMinutes < 90) {
    return translateService.instant(keys.AN_HOUR);
  } else if (diffHours < 22) {
    return translateService.instant(keys.HOURS, {
      count: diffHours,
    });
  } else if (diffHours < 36) {
    return translateService.instant(keys.A_DAY);
  } else if (diffDays < 25) {
    return translateService.instant(keys.DAYS, {
      count: diffDays,
    });
  } else if (diffDays < 45) {
    return translateService.instant(keys.A_MONTH);
  } else if (diffMonths < 11) {
    return translateService.instant(keys.MONTHS, {
      count: diffMonths,
    });
  } else if (diffYears <= 1) {
    return translateService.instant(keys.A_YEAR);
  } else {
    return translateService.instant(keys.YEARS, {
      count: diffYears,
    });
  }
};
