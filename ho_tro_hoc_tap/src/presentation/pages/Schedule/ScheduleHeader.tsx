import { useState } from "react";
import EventForm from "./EventForm";
import type { EventFormData } from "../../../shared/types/lichHoc";
import "../../../styles/Schedule/ScheduleHeader.css";
import { createEvent } from "../../../shared/services/lichHocService";
import { generateWeeklyEvents } from "../../../shared/utils/lichHocMapper";
import SubjectForm from "./SubjectForm";
import { createMonHoc } from "../../../shared/services/monHocService";
import type { CreateMonHocPayload } from "../../../shared/types/monHoc";
import axios from "axios";

export default function ScheduleHeader() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openSubject, setOpenSubject] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: EventFormData) => {
    try {
      setLoading(true);

      // 🔥 TẠO DANH SÁCH EVENT (1 hoặc nhiều)
      const events = generateWeeklyEvents(data);

      // 🔥 GỌI API TẠO TỪNG EVENT
      for (const ev of events) {
        await createEvent(ev);
      }

      alert(`Đã tạo ${events.length} sự kiện`);
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Không tạo được sự kiện");
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
          <button className="outline-btn">⤓ Xuất PDF</button>
        </div>
      </div>  

      

      {open && (
        <div className="modal-overlay">
          <div className="modal-container">
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
        <div className="modal-overlay">
          <div className="modal-container">
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

    </>
  );
}