export interface DeadlineStatus {
  isUrgent48h: boolean;
  isOverdue: boolean;
  hoursRemaining: number;
  label: string | null;
}

/**
 * Calculates whether a goal target date falls within the critical 48-hour window
 * or is overdue, returning structured urgency metadata.
 */
export function checkDeadline48h(targetDateStr: string, isCompleted: boolean): DeadlineStatus {
  if (isCompleted) {
    return { isUrgent48h: false, isOverdue: false, hoursRemaining: 9999, label: null };
  }

  // Parse target date (assumes 23:59:59 end-of-day for calendar dates YYYY-MM-DD)
  const target = new Date(targetDateStr);
  if (targetDateStr.length === 10) {
    target.setHours(23, 59, 59, 999);
  }
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  const hoursRemaining = Math.round(diffMs / (1000 * 60 * 60));

  if (diffMs < 0) {
    const overdueHours = Math.abs(hoursRemaining);
    const overdueDays = Math.max(1, Math.round(overdueHours / 24));
    return {
      isUrgent48h: true,
      isOverdue: true,
      hoursRemaining,
      label: `Overdue by ${overdueDays}d (${overdueHours}h past target deadline)`,
    };
  }

  if (hoursRemaining <= 48) {
    return {
      isUrgent48h: true,
      isOverdue: false,
      hoursRemaining,
      label: hoursRemaining <= 24
        ? `Critical deadline in ${hoursRemaining}h (within 24-hour window)`
        : `Deadline in ~${Math.round(hoursRemaining / 24)}d (${hoursRemaining}h remaining, within 48h)`,
    };
  }

  return { isUrgent48h: false, isOverdue: false, hoursRemaining, label: null };
}
