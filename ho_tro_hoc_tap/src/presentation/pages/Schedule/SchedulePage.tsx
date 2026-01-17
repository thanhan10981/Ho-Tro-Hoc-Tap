import "../../../styles/Schedule/SchedulePage.css";
import ScheduleHeader from "./ScheduleHeader";
import ScheduleFilter from "./ScheduleFilter";
import ScheduleCalendar from "./ScheduleCalendar";
import ScheduleTodayEvents from "./ScheduleTodayEvents";
import { useState } from "react";

export default function SchedulePage() {

  const [filters, setFilters] = useState<{
    keyword?: string;
    maMonHoc?: number;
    loaiSuKien?: string[];
  }>({});


  const [refreshKey, setRefreshKey] = useState(0);

  const refreshCalendar = () => setRefreshKey(k => k + 1);
  return (
    <div className="schedule-page">
      {/* 1. HEADER TOP */}
      <ScheduleHeader onAddedEvent={refreshCalendar} />

      <div className="schedule-body">

        {/* 2. LEFT FILTER PANEL */}
      <ScheduleFilter
        onFilterChange={(f) => setFilters(f)}
        refreshKey={refreshKey}
      />


        {/* 3. RIGHT SIDE (Calendar + Today Events) */}
        <div className="sc-wrapper">
          <ScheduleCalendar filters={filters}
          refreshKey={refreshKey}
          onRefresh={refreshCalendar} />

          <ScheduleTodayEvents refreshKey={refreshKey} />
  {/* ⬅ đưa vào đây */}
        </div>

      </div>
    </div>
  );
}
