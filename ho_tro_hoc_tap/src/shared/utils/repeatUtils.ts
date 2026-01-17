import {
  addDays,
  addWeeks,
  addMonths,
  isAfter,
} from "date-fns";

import type { EventFormData } from "../types/lichHoc";

export function generateRepeatedEvents(
  base: EventFormData
): EventFormData[] {

  if (!base.repeat || !base.repeatRule) {
    return [base];
  }

  const { freq, interval, count, until } = base.repeatRule;

  const events: EventFormData[] = [];

  let currentStart = new Date(`${base.startDate}T${base.startTime}`);
  let currentEnd = new Date(`${base.endDate}T${base.endTime}`);

  const formatDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const formatTime = (d: Date) =>
    `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

  const maxLoop = count ?? 999;

  for (let i = 0; i < maxLoop; i++) {

    if (until && isAfter(currentStart, new Date(until))) {
      break;
    }

    events.push({
      ...base,
      startDate: formatDate(currentStart),
      startTime: formatTime(currentStart),
      endDate: formatDate(currentEnd),
      endTime: formatTime(currentEnd),
    });

    switch (freq) {
      case "DAILY":
        currentStart = addDays(currentStart, interval);
        currentEnd = addDays(currentEnd, interval);
        break;

      case "WEEKLY":
        currentStart = addWeeks(currentStart, interval);
        currentEnd = addWeeks(currentEnd, interval);
        break;

      case "MONTHLY":
        currentStart = addMonths(currentStart, interval);
        currentEnd = addMonths(currentEnd, interval);
        break;
    }
  }

  return events;
}
