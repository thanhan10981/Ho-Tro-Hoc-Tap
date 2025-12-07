// useScheduleCalendar.tsx
import React from "react"; // needed so TSX/JSX types are available
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  format,
  isSameDay,
  isSameMonth,
} from "date-fns";

export interface CalendarEvent {
  date: string;
  title: string;
  time: string;
  color: string;
}

export function useScheduleCalendar(events: CalendarEvent[]) {
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date());
  const [viewMode, setViewMode] = React.useState<"week" | "month">("month");

  // ============== MONTH VIEW ==============
  const renderMonthCells = (): React.ReactNode => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const firstDay = startOfWeek(monthStart, { weekStartsOn: 1 });
    const lastDay = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows: React.ReactNode[] = [];
    let day = firstDay;

    while (day <= lastDay) {
      const daysInRow: React.ReactNode[] = [];
      const rowKey = day.toISOString();

      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day);

        const todayEvents = events.filter((e) =>
          isSameDay(new Date(e.date), cloneDay)
        );

        daysInRow.push(
          <div
            key={cloneDay.toISOString()}
            className={`sc-cell ${
              !isSameMonth(cloneDay, monthStart) ? "sc-faded" : ""
            }`}
          >
            <div className="sc-date">{format(cloneDay, "d")}</div>

            {todayEvents.map((ev, idx) => (
              <div key={idx} className="sc-event" style={{ background: ev.color }}>
                <div className="ev-title">{ev.title}</div>
                <div className="ev-time">{ev.time}</div>
              </div>
            ))}
          </div>
        );

        day = addDays(cloneDay, 1);
      }

      rows.push(
        <div className="sc-row" key={rowKey}>
          {daysInRow}
        </div>
      );
    }

    return <div className="sc-body">{rows}</div>;
  };

  // ============== WEEK VIEW ==============
  const renderWeekCells = (): React.ReactNode => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });

    const days: React.ReactNode[] = [];
    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);

      const todayEvents = events.filter((e) => isSameDay(new Date(e.date), day));

      days.push(
        <div key={day.toISOString()} className="sc-cell">
          <div className="sc-date">
            {format(day, "d")} / {format(day, "MM")}
          </div>

          {todayEvents.map((ev, idx) => (
            <div key={idx} className="sc-event" style={{ background: ev.color }}>
              <div className="ev-title">{ev.title}</div>
              <div className="ev-time">{ev.time}</div>
            </div>
          ))}
        </div>
      );
    }

    return <div className="sc-row">{days}</div>;
  };

  // ============== NAVIGATION ==============
  const gotoPrev = () => {
    if (viewMode === "month") setCurrentDate((d) => subMonths(d, 1));
    else setCurrentDate((d) => subWeeks(d, 1));
  };

  const gotoNext = () => {
    if (viewMode === "month") setCurrentDate((d) => addMonths(d, 1));
    else setCurrentDate((d) => addWeeks(d, 1));
  };

  return {
    currentDate,
    setCurrentDate,
    viewMode,
    setViewMode,
    renderMonthCells,
    renderWeekCells,
    gotoPrev,
    gotoNext,
  };
}
