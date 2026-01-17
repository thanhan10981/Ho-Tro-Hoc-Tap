import { useEffect, useState } from "react";
import { getCalendarEvents } from "../../shared/services/lichHocService";
import type { CalendarEvent } from "../../shared/types/lichHoc";
import { mapToCalendarEvents } from "../../shared/utils/lichHocMapper";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  format,
} from "date-fns";

export function useCalendarEvents(
  currentDate: Date,
  viewMode: "month" | "week",
  refreshKey: number
) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const from =
        viewMode === "month"
          ? startOfMonth(currentDate)
          : startOfWeek(currentDate, { weekStartsOn: 1 });

      const to =
        viewMode === "month"
          ? endOfMonth(currentDate)
          : endOfWeek(currentDate, { weekStartsOn: 1 });

      try {
        const data = await getCalendarEvents(
          format(from, "yyyy-MM-dd"),
          format(to, "yyyy-MM-dd")
        );

        const expandedEvents = data.flatMap(mapToCalendarEvents);
        setEvents(expandedEvents);

      } catch (err) {
        console.error(err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentDate, viewMode, refreshKey]);

  return { events, loading };
}
