import { useState, useEffect } from "react";
import type { EventFormData, EventFormProps } from "../../../shared/types/lichHoc";
import "../../../styles/Schedule/ScheduleHeader.css";
import { getMyMonHoc } from "../../../shared/services/monHocService";
import type { MonHocResponse } from "../../../shared/types/monHoc";

export default function EventForm({ onSubmit, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    type: "class",
    subject: "",
    location: "",
    priority: "binh_thuong",
    reminder: "60",
    repeat: false,
    repeatMonths: 1,
  });
  const [subjects, setSubjects] = useState<MonHocResponse[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoadingSubjects(true);
        const data = await getMyMonHoc();
        setSubjects(data);
      } catch (err) {
        console.error("Không tải được môn học", err);
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, []);


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();        // ⬅️ chặn submit mặc định
    onSubmit(formData);        // ⬅️ emit data ra ngoài
  };

  
  return (
    <form className="event-form mt-[5px]" onSubmit={handleSubmit}>
      {/* Tên sự kiện */}
      <div className="form-row">
        <label className="form-label">Tên sự kiện</label>
        <input
          type="text"
          name="title"
          className="input"
          value={formData.title}
          onChange={handleChange}
        />
      </div>

      {/* Mô tả */}
      <div className="form-row">
        <label className="form-label">Mô tả</label>
        <textarea
          name="description"
          className="textarea"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
      </div>

      {/* Ngày bắt đầu – giờ bắt đầu */}
      <div className="grid-2">
        <div className="form-row">
          <label className="form-label">Ngày bắt đầu</label>
          <input
            type="date"
            name="startDate"
            className="input"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label">Giờ bắt đầu</label>
          <input
            type="time"
            name="startTime"
            className="input"
            value={formData.startTime}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Ngày kết thúc – giờ kết thúc */}
      <div className="grid-2">
        <div className="form-row">
          <label className="form-label">Ngày kết thúc</label>
          <input
            type="date"
            name="endDate"
            className="input"
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label className="form-label">Giờ kết thúc</label>
          <input
            type="time"
            name="endTime"
            className="input"
            value={formData.endTime}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Loại sự kiện */}
      <div className="form-row">
        <label className="form-label">Loại sự kiện</label>
        <select
          name="type"
          className="select"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="class">Lớp học</option>
          <option value="exam">Thi cử</option>
          <option value="deadline">Deadline bài tập</option>
          <option value="study">Ôn tập</option>
        </select>
      </div>

      {/* Môn học */}
      <div className="form-row">
        <label className="form-label">Môn học</label>

        <select
          className="select"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          disabled={loadingSubjects}
        >
          <option value="">
            {loadingSubjects ? "Đang tải môn học..." : "-- Chọn môn học --"}
          </option>

          {subjects.map((subj) => (
            <option key={subj.maMonHoc} value={subj.maMonHoc}>
              {subj.tenMonHoc}
            </option>
          ))}
        </select>
      </div>


      {/* Địa điểm */}
      <div className="form-row">
        <label className="form-label">Địa điểm</label>
        <input
          type="text"
          name="location"
          className="input"
          value={formData.location}
          onChange={handleChange}
        />
      </div>

      {/* Mức độ ưu tiên */}
      <div className="form-row">
        <label className="form-label">Mức độ ưu tiên</label>
        <select
        className="select"  
      name="priority"
      value={formData.priority}
      onChange={handleChange}
    >
      <option value="binh_thuong">Bình thường</option>
      <option value="quan_trong">Quan trọng</option>
    </select>

      </div>

      {/* Nhắc nhở */}
      <div className="form-row">
        <label className="form-label">Nhắc nhở trước</label>
        <select
          name="reminder"
          className="select"
          value={formData.reminder}
          onChange={handleChange}
        >
          <option value="15">15 phút</option>
          <option value="30">30 phút</option>
          <option value="60">1 giờ</option>
          <option value="1440">1 ngày</option>
        </select>
      </div>

      {/* Lặp lại */}
      <div className="form-row flex items-center gap-4">
        {/* Checkbox lặp lại */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="repeat"
            checked={formData.repeat}
            onChange={handleChange}
          />
          <label className="form-label mb-0">Lặp lại hàng tuần</label>
        </div>

        {/* Trong vòng X tháng */}
        <div className="flex items-center space-x-2">
          <span>trong vòng</span>
          <input
            type="number"
            min={1}
            className="input w-[80px]"
            name="repeatMonths"
            value={formData.repeatMonths}
            onChange={handleChange}
          />

          <span>tháng</span>
        </div>
      </div>


      {/* Actions */}
      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Hủy
        </button>
        <button type="submit" className="btn-save">
          Lưu sự kiện
        </button>
      </div>
    </form>
  );
}
