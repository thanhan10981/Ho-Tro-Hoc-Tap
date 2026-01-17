import React from "react";
import type { CalendarEvent, LichHocCalendarDTO } from "../../../shared/types/lichHoc";
import { format } from "date-fns";
import "../../../styles/Schedule/DayEventsPopup.css";
import EditEventPopup from "./EditEventPopup";
import { deleteEvent } from "../../../shared/services/lichHocService";

interface Props {
  date: Date;
  events: CalendarEvent[];
  onClose: () => void;
  onChanged: () => void;
}

export default function DayEventsPopup({
  date,
  events,
  onClose,
  onChanged,
}: Props) {
  const [editingEvent, setEditingEvent] =
    React.useState<LichHocCalendarDTO | null>(null);


  return (
    <>
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

                  {ev.type && (
                    <div className="popup-type">
                      Loại: <strong>{ev.type}</strong>
                    </div>
                  )}

                  {ev.location && (
                    <div className="popup-location">📍 {ev.location}</div>
                  )}

                  {ev.description && (
                    <div className="popup-desc">{ev.description}</div>
                  )}

                  <div className="popup-actions">
                    {/* ✏️ SỬA */}
                    <button
                      className="popup-btn edit"
                      title="Sửa sự kiện"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!ev.rawDto) {
                          console.warn("Event chưa có rawDto", ev);
                          return;
                        }
                        setEditingEvent(ev.rawDto);
                      }}
                    >

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 640"
                        className="popup-icon"
                      >
                        <path d="M416.9 85.2L372 130.1L509.9 268L554.8 223.1C568.4 209.6 576 191.2 576 172C576 152.8 568.4 134.4 554.8 120.9L519.1 85.2C505.6 71.6 487.2 64 468 64C448.8 64 430.4 71.6 416.9 85.2zM338.1 164L122.9 379.1C112.2 389.8 104.4 403.2 100.3 417.8L64.9 545.6C62.6 553.9 64.9 562.9 71.1 569C77.3 575.1 86.2 577.5 94.5 575.2L222.3 539.7C236.9 535.6 250.2 527.9 261 517.1L476 301.9L338.1 164z" />
                      </svg>
                    </button>
                


                    {/* 🗑️ XÓA */}
                    <button
                      className="popup-btn delete"
                      title="Xóa sự kiện"
                      onClick={async (e) => {
                        e.stopPropagation();

                        if (!ev.rawDto) return;

                        const ok = window.confirm(
                          `Bạn có chắc muốn xóa sự kiện "${ev.rawDto.tieuDe}" không?`
                        );

                        if (!ok) return;

                        try {
                          await deleteEvent(ev.rawDto.maSuKien);
                          onChanged();
                          onClose(); // 🔥 đóng popup → reload calendar
                        } catch (err) {
                          console.error(err);
                          alert("Xóa sự kiện thất bại");
                        }
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 640"
                        className="popup-icon"
                      >
                        <path d="M232.7 69.9C237.1 56.8 249.3 48 263.1 48L377 48C390.8 48 403 56.8 407.4 69.9L416 96L512 96C529.7 96 544 110.3 544 128C544 145.7 529.7 160 512 160L128 160C110.3 160 96 145.7 96 128C96 110.3 110.3 96 128 96L224 96L232.7 69.9zM128 208L512 208L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 208zM216 272C202.7 272 192 282.7 192 296L192 488C192 501.3 202.7 512 216 512C229.3 512 240 501.3 240 488L240 296C240 282.7 229.3 272 216 272zM320 272C306.7 272 296 282.7 296 296L296 488C296 501.3 306.7 512 320 512C333.3 512 344 501.3 344 488L344 296C344 282.7 333.3 272 320 272zM424 272C410.7 272 400 282.7 400 296L400 488C400 501.3 410.7 512 424 512C437.3 512 448 501.3 448 488L448 296C448 282.7 437.3 272 424 272z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== POPUP SỬA (TÁCH RIÊNG) ===== */}
      {editingEvent && (
        <EditEventPopup
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSuccess={() => {
            onChanged();
            setEditingEvent(null);
            onClose(); // reload calendar
          }}
        />
      )}
    </>
  );
}
