import { useState } from "react";
import EventForm from "./EventForm";
import type { EventFormData } from "../../../shared/types/EventForm.types";
import "../../../styles/Schedule/ScheduleHeader.css";

export default function ScheduleHeader() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: EventFormData) => {
    console.log("Form data:", data);
    setOpen(false);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Lịch học của tôi</h2>
          <p>Quản lý lịch học, lịch thi và deadline bài tập một cách hiệu quả</p>
        </div>

        <div className="header-actions">
          <button className="primary-btn" onClick={() => setOpen(true)}>
            + Thêm sự kiện
          </button>

          <button className="success-btn">⟳ Đồng bộ</button>
          <button className="outline-btn">⤓ Xuất PDF</button>
        </div>
      </div>

      {open && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">Thêm sự kiện</h3>
            </div>

            <div className="modal-body">
              <EventForm
                onSubmit={handleSubmit}
                onCancel={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
