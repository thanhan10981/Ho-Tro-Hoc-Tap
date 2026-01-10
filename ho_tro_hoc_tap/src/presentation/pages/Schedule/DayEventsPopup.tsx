import React from "react";
import type { CalendarEvent } from "../../../shared/types/lichHoc";
import { format } from "date-fns";
import "../../../styles/Schedule/DayEventsPopup.css";

interface Props {
  date: Date;
  events: CalendarEvent[];
  onClose: () => void;
}

export default function DayEventsPopup({ date, events, onClose }: Props) {
  return (
    <div className="popup-backdrop" onClick={onClose}>
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>Sự kiện ngày {format(date, "dd/MM/yyyy")}</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {events.length === 0 ? (
          <div className="popup-empty">Không có sự kiện</div>
        ) : (
          <div className="popup-list">
            {events.map((ev, idx) => (
              <div
                key={idx}
                className="popup-event"
                style={{ borderLeftColor: ev.color }}
              >
                <div className="popup-title">{ev.title}</div>
                <div className="popup-time">{ev.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
