// ScheduleCalendar.tsx
import React from "react";
import { useScheduleCalendar } from "../../../features/Schedule/useScheduleCalendar";
import "../../../styles/Schedule/ScheduleCalendar.css";

export default function ScheduleCalendar(): React.JSX.Element {
  const events = [
    { date: "2025-12-05", title: "Deadline Web", time: "23:59", color: "#fecaca" },
    { date: "2025-12-12", title: "Thi CTDL", time: "13:00 - B203", color: "#fef3c7" },
    { date: "2025-12-06", title: "AI", time: "13:00 - C201", color: "#bfdbfe" },
    { date: "2025-12-02", title: "Cấu trúc DL", time: "8:00 - B201", color: "#bfdbfe" },
    { date: "2025-12-22", title: "Toán cao cấp", time: "8:00 - A205", color: "#bfdbfe" },
  ];

  const {
    currentDate,
    setCurrentDate,
    viewMode,
    setViewMode,
    renderMonthCells,
    renderWeekCells,
    gotoPrev,
    gotoNext,
  } = useScheduleCalendar(events);

  return (
    <div className="sc-container">
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

          <button className="nav" onClick={gotoPrev}>
            &lt;
          </button>
          <button className="nav" onClick={gotoNext}>
            &gt;
          </button>
        </div>

        <div className="right">
          {viewMode === "month" && (
            <>
              <select
                className="select"
                value={currentDate.getMonth() + 1}
                onChange={(e) => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(Number(e.target.value) - 1);
                  setCurrentDate(newDate);
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
                  const newDate = new Date(currentDate);
                  newDate.setFullYear(Number(e.target.value));
                  setCurrentDate(newDate);
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

          <button className="today-btn" onClick={() => setCurrentDate(new Date())}>
            Hôm nay
          </button>
        </div>
      </div>

      <div className="sc-week-header">
        <div>Thứ 2</div>
        <div>Thứ 3</div>
        <div>Thứ 4</div>
        <div>Thứ 5</div>
        <div>Thứ 6</div>
        <div>Thứ 7</div>
        <div className="sun">Chủ nhật</div>
      </div>

      <div className="sc-body">
        {viewMode === "month" ? renderMonthCells() : renderWeekCells()}
      </div>

    </div>
  );
}
