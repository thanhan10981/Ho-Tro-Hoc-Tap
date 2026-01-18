import React from "react";
import { format } from "date-fns";
import { useScheduleCalendar } from "../../../features/Schedule/useScheduleCalendar";
import { useCalendarEvents } from "../../../features/Schedule/useCalendarEvents";
import "../../../styles/Schedule/ScheduleCalendar.css";
import DayEventsPopup from "./DayEventsPopup";

import type { CalendarEvent } from "../../../features/Schedule/useScheduleCalendar";
import { useSearchCalendarEvents } from "../../../features/Schedule/useSearchCalendarEvents";

interface Props {
  filters: {
    keyword?: string;
    maMonHoc?: number;
    loaiSuKien?: string[];

  };

  refreshKey: number;

  onRefresh?: () => void;

}



export default function ScheduleCalendar({ filters, refreshKey, onRefresh, }: Props): React.JSX.Element {
 /* ================== 1. popup state ================== */
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [popupEvents, setPopupEvents] = React.useState<CalendarEvent[]>([]);
  
  /* ================== 2. click day handler (PHẢI Ở TRÊN) ================== */
  const onDayClick = React.useCallback(
    (date: Date) => {
      setSelectedDate(date);

      setPopupEvents((prev) => {
        // sẽ set lại sau khi events update
        return prev;
      });
    },
    []
  );

  /* ================== 3. calendar core state ================== */
  const {
    currentDate,
    setCurrentDate,
    viewMode,
    setViewMode,
    renderMonthCells,
    renderWeekCells,
    gotoPrev,
    gotoNext,
  } = useScheduleCalendar(onDayClick);

  /* ================== 4. fetch events ================== */



  const hasFilter =
    !!filters.keyword ||
    !!filters.maMonHoc ||
    !!filters.loaiSuKien;

  const calendarData = useCalendarEvents(
    currentDate,
    viewMode,
    refreshKey
  );

  const searchData = useSearchCalendarEvents(
    filters,
    refreshKey
  );

  const rawEvents = hasFilter
  ? searchData.events
  : calendarData.events;

 const events: CalendarEvent[] = rawEvents ?? [];



  const loading = hasFilter
    ? searchData.loading
    : calendarData.loading;



  /* ================== 5. sync popup events when events change ================== */
  React.useEffect(() => {
    if (!selectedDate) return;

    const dayEvents = events.filter(
      (e) =>
        format(new Date(e.date), "yyyy-MM-dd") ===
        format(selectedDate, "yyyy-MM-dd")
    );

    setPopupEvents(dayEvents);
  }, [events, selectedDate]);

  return (
    <>
      <div className="sc-container">
        {/* ===== ACTION BAR ===== */}
        <div className="sc-actions">
          <div className="left">
            <div className="view-switch">
              <button
                className={`view-btn ${viewMode === "week" ? "active" : ""}`}
                onClick={() => setViewMode("week")}
              >
                Tuần
              </button>

              <button
                className={`view-btn ${viewMode === "month" ? "active" : ""}`}
                onClick={() => setViewMode("month")}
              >
                Tháng
              </button>
            </div>

            <button className="nav" onClick={gotoPrev}>&lt;</button>
            <button className="nav" onClick={gotoNext}>&gt;</button>
          </div>

          <div className="center">
            <h2 className="sc-title">
              {format(currentDate, "MMMM yyyy")}
            </h2>
          </div>

          <div className="right">
            {viewMode === "month" && (
              <>
                <select
                  className="select"
                  value={currentDate.getMonth() + 1}
                  onChange={(e) => {
                    const d = new Date(currentDate);
                    d.setMonth(+e.target.value - 1);
                    setCurrentDate(d);
                  }}
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <option key={i} value={i + 1}>
                      Tháng {i + 1}
                    </option>
                  ))}
                </select>

                <select
                  className="select"
                  value={currentDate.getFullYear()}
                  onChange={(e) => {
                    const d = new Date(currentDate);
                    d.setFullYear(+e.target.value);
                    setCurrentDate(d);
                  }}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <option key={i} value={2024 + i}>
                      {2024 + i}
                    </option>
                  ))}
                </select>
              </>
            )}

            <button
              className="today-btn"
              onClick={() => setCurrentDate(new Date())}
            >
              Hôm nay
            </button>
          </div>
        </div>

        {/* ===== WEEK HEADER ===== */}
        <div className="sc-week-header">
          <div>Thứ 2</div>
          <div>Thứ 3</div>
          <div>Thứ 4</div>
          <div>Thứ 5</div>
          <div>Thứ 6</div>
          <div>Thứ 7</div>
          <div className="sun">Chủ nhật</div>
        </div>

        {loading && <div className="loading">Đang tải...</div>}

        {/* ===== CALENDAR BODY ===== */}
        <div className="sc-body">
          {viewMode === "month"
            ? renderMonthCells(events)
            : renderWeekCells(events)}
        </div>
      </div>

      {/* ===== DAY POPUP ===== */}
      {selectedDate && (
        <DayEventsPopup
          date={selectedDate}
          events={popupEvents}
          onClose={() => setSelectedDate(null)}
          onChanged={onRefresh ?? (() => {})}
        />
      )}
    </>
  );
}
