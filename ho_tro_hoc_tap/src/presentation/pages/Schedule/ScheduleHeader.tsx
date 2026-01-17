import { useState } from "react";
import EventForm from "./EventForm";
import type { EventFormData } from "../../../shared/types/lichHoc";
import "../../../styles/Schedule/ScheduleHeader.css";
import { createEvent } from "../../../shared/services/lichHocService";
import { mapFormToCreateEventRequest  } from "../../../shared/utils/lichHocMapper";
import SubjectForm from "./SubjectForm";
import { createMonHoc } from "../../../shared/services/monHocService";
import type { CreateMonHocPayload } from "../../../shared/types/monHoc";

import axios from "axios";
import ImportScheduleModal from "./ImportScheduleModal";
import { generateRepeatedEvents } from "../../../shared/utils/repeatUtils";

interface ScheduleHeaderProps {
  onAddedEvent?: () => void; // callback để refresh calendar
}

export default function ScheduleHeader({ onAddedEvent }: ScheduleHeaderProps){
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openSubject, setOpenSubject] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openImport, setOpenImport] = useState(false);

  const handleSubmit = async (data: EventFormData) => {
  try {
    setLoading(true);

    const events = generateRepeatedEvents(data);

    for (const ev of events) {
      // 🔒 Guard cứng
      if (!ev.startDate || !ev.startTime || !ev.endDate || !ev.endTime) {
        throw new Error("Dữ liệu lặp thiếu ngày/giờ");
      }

      const payload = mapFormToCreateEventRequest(ev);
      await createEvent(payload);
    }

    alert(`Đã tạo ${events.length} sự kiện`);
    setOpen(false);
    onAddedEvent?.();

  } catch (err) {
    console.error(err);
    alert(err instanceof Error ? err.message : "Không tạo được sự kiện");
  } finally {
    setLoading(false);
  }
};


  const handleCreateSubject = async (data: CreateMonHocPayload) => {
    try {
      setLoading(true);
      setError(null);

      await createMonHoc(data);

      alert("Đã thêm môn học");
      setOpenSubject(false);

    } catch (err) {
      if (axios.isAxiosError(err)) {
        const resData = err.response?.data;

        if (typeof resData === "string") {
          setError(resData);
        } else if (resData?.message) {
          setError(resData.message);
        } else {
          setError("Không tạo được môn học");
        }
      } else {
        setError("Có lỗi xảy ra");
      }
    } finally {
      setLoading(false);
    }
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

          <button className="success-btn"  onClick={() => setOpenSubject(true)}>
            + Thêm môn học
          </button>

          <button className="success-btn" onClick={() => setOpenImport(true)}>
            📷 Import từ ảnh
          </button>

        </div>
      </div>  

      

      {open && (
        <div className="modal-overlay"
        onClick={() => setOpen(false)}>
          <div className="modal-container"
          onClick={(e) => e.stopPropagation()} >
            <div className="modal-header">
              <h3>Thêm sự kiện</h3>
            </div>

            <div className="modal-body">
              <EventForm
                onSubmit={handleSubmit}
                onCancel={() => setOpen(false)}
              />

              {loading && <p>Đang tạo sự kiện...</p>}
            </div>
          </div>
        </div>
      )}

      {openSubject && (
        <div className="modal-overlay"
        onClick={() => setOpenSubject(false)}>
          <div className="modal-container"
          onClick={(e) => e.stopPropagation()} >
            <div className="modal-header">
              <h3>Thêm môn học</h3>
            </div>

            <div className="modal-body">
              <SubjectForm
                onSubmit={handleCreateSubject}
                onCancel={() => setOpenSubject(false)}
                loading={loading}
                error={error}
              />
            </div>
          </div>
        </div>
      )}

      {openImport && (
        <ImportScheduleModal
          onClose={() => setOpenImport(false)}
          onSuccess={onAddedEvent}
        />
      )}
  

    </>
  );
}