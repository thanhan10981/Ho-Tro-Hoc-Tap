import "../../../styles/Schedule/SchedulePage.css";
import ScheduleHeader from "./ScheduleHeader";
import ScheduleFilter from "./ScheduleFilter";
import ScheduleCalendar from "./ScheduleCalendar";
import ScheduleTodayEvents from "./ScheduleTodayEvents";

export default function SchedulePage() {
  return (
    <div className="schedule-page">
      {/* 1. HEADER TOP */}
      <ScheduleHeader />

      <div className="schedule-body">

        {/* 2. LEFT FILTER PANEL */}
        <ScheduleFilter />

        {/* 3. RIGHT SIDE (Calendar + Today Events) */}
        <div className="sc-wrapper">
          <ScheduleCalendar />
          <ScheduleTodayEvents />   {/* ⬅ đưa vào đây */}
        </div>

      </div>
    </div>
  );
}
