import { useEffect, useState } from "react";
import type { CalendarEvent } from "../../shared/types/lichHoc";
import { mapToCalendarEvents } from "../../shared/utils/lichHocMapper";
import { searchLichHoc } from "../../shared/services/lichHocService";

interface SearchFilter {
  keyword?: string;
  maMonHoc?: number;
  loaiSuKien?: string[];
}

export function useSearchCalendarEvents(
  filters: SearchFilter,
  refreshKey: number
) {

  const [loading, setLoading] = useState(false);
const [events, setEvents] = useState<CalendarEvent[] | null>(null);

useEffect(() => {
  const hasFilter =
    filters.keyword ||
    filters.maMonHoc ||
    filters.loaiSuKien;

    if (!hasFilter) {
    setEvents(null);
    return;
    }


  const fetch = async () => {
    setLoading(true);

    try {
        const data = await searchLichHoc({
        ...(filters.keyword && { keyword: filters.keyword }),
        ...(filters.maMonHoc && { maMonHoc: filters.maMonHoc }),
        ...(filters.loaiSuKien?.length && {
            loaiSuKien: filters.loaiSuKien
        }),
        });


      setEvents(data.flatMap(mapToCalendarEvents));
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  fetch();
}, [filters.keyword, filters.maMonHoc, filters.loaiSuKien, refreshKey]);


  return { events, loading };
}
