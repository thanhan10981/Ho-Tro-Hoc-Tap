import { useEffect, useState } from "react";
import type { EventFormData, EventFormProps, ReminderUnit, RepeatFreq, RepeatRule } from "../../../shared/types/lichHoc";
import "../../../styles/Schedule/ScheduleHeader.css";
import { getMyMonHoc } from "../../../shared/services/monHocService";
import type { MonHocResponse } from "../../../shared/types/monHoc";





export default function EventForm({ onSubmit, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    startDate: "",
    startTime: "00:00",
    endDate: "",
    endTime: "00:00",
    type: "hoc",
    subject: "",
    location: "",
    priority: "binh_thuong",

    repeat: false,
    repeatRule: {
      freq: "DAILY",
      interval: 1,
    },

    remindBeforeStart: false,
    remindStartValue: 15,
    remindStartUnit: "minutes",

    remindBeforeEnd: false,
    remindEndValue: 15,
    remindEndUnit: "minutes",
  });

  const [repeatEndType, setRepeatEndType] = useState<"never" | "count" | "date">("never");

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
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name } = e.target;
  if (!name) return;

  let finalValue: string | number | boolean;

  if (e.target instanceof HTMLInputElement) {
    const { type, value, checked } = e.target;

    if (type === "checkbox") {
      finalValue = checked;
    } else if (type === "number") {
      finalValue = value === "" ? 0 : Number(value);
    } else {
        if (
          (name === "startDate" || name === "endDate") &&
          !value
        ) {
          finalValue = ""; // 🔒 KHÔNG CHO undefined
        } else if (
          (name === "startTime" || name === "endTime") &&
          !value
        ) {
          finalValue = "00:00";
        } else {
          finalValue = value;
        }

    }

  } else {
    // select / textarea
    finalValue = e.target.value ?? "";
  }

  if (name === "subject") {
    finalValue = finalValue === "" ? "" : Number(finalValue);
  }

  setFormData(prev => ({
    ...prev,
    [name]: finalValue,
  }));
};




  const handleRepeatRuleChange = <K extends keyof RepeatRule>(
    field: K,
    value: RepeatRule[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      repeatRule: {
        ...prev.repeatRule!,
        [field]: value,
      },
    }));
  };

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const normalized: EventFormData = {
      ...formData,
      startTime: formData.startTime || "00:00",
      endTime: formData.endTime || "00:00",
    };

    if (!normalized.startDate || !normalized.endDate) {
      alert("Vui lòng chọn ngày bắt đầu và kết thúc");
      return;
    }

    const finalForm: EventFormData = { ...normalized };

    if (!finalForm.repeat) {
      delete finalForm.repeatRule;
    } else if (finalForm.repeatRule) {
      const rule = { ...finalForm.repeatRule };

      switch (repeatEndType) {
        case "never":
          delete rule.count;
          delete rule.until;
          break;
        case "count":
          delete rule.until;
          if (!rule.count || rule.count < 1) {
            alert("Số lần lặp không hợp lệ");
            return;
          }
          break;
        case "date":
          delete rule.count;
          if (!rule.until) {
            alert("Chưa chọn ngày kết thúc lặp");
            return;
          }
          break;
      }

      finalForm.repeatRule = rule;
    }

    // ✅ CHỈ GỬI EventFormData
    onSubmit(finalForm);

  } catch (err) {
    console.error("SUBMIT FAILED:", err);
    alert(err instanceof Error ? err.message : "Lỗi không xác định");
  }
};


 

  return (
    <form className="event-form mt-[5px]" onSubmit={handleSubmit}>

      {/* ===== TÊN SỰ KIỆN ===== */}
      <div className="form-row">
        <label className="form-label">Tên sự kiện</label>
        <input name="title" className="input" value={formData.title} onChange={handleChange} />
      </div>

      {/* ===== MÔ TẢ ===== */}
      <div className="form-row">
        <label className="form-label">Mô tả</label>
        <textarea name="description" className="textarea" value={formData.description} onChange={handleChange} />
      </div>

      {/* ===== THỜI GIAN ===== */}
      <div className="grid-2">
        <div className="form-row">
          <label className="form-label">Ngày bắt đầu</label>
          <input type="date" name="startDate" className="input" value={formData.startDate} onChange={handleChange} />
        </div>
        <div className="form-row">
          <label className="form-label">Giờ bắt đầu</label>
          <input type="time" name="startTime" className="input" value={formData.startTime || "00:00"} onChange={handleChange} />
        </div>
      </div>

      <div className="grid-2">
        <div className="form-row">
          <label className="form-label">Ngày kết thúc</label>
          <input type="date" name="endDate" className="input" value={formData.endDate} onChange={handleChange} />
        </div>
        <div className="form-row">
          <label className="form-label">Giờ kết thúc</label>
          <input type="time" name="endTime" className="input" value={formData.endTime || "00:00"} onChange={handleChange} />
        </div>
      </div>

      {/* ===== LOẠI + MÔN ===== */}
      <div className="form-row">
        <label className="form-label">Loại sự kiện</label>
        <select name="type" className="select" value={formData.type} onChange={handleChange}>
          <option value="hoc">Lớp học</option>
          <option value="thi">Thi cử</option>
          <option value="deadline">Deadline</option>
          <option value="on_tap">Ôn tập</option>
        </select>
      </div>

      <div className="form-row">
        <label className="form-label">Môn học</label>
        <select
          name="subject"
          className="select"
          value={formData.subject}
          onChange={handleChange}
          disabled={loadingSubjects}
        >
          <option value="">
            {loadingSubjects ? "Đang tải..." : "-- Chọn môn học --"}
          </option>
          {subjects.map(s => (
            <option key={s.maMonHoc} value={s.maMonHoc}>{s.tenMonHoc}</option>
          ))}
        </select>
      </div>

      {/* ===== ĐỊA ĐIỂM + ƯU TIÊN ===== */}
      <div className="form-row">
        <label className="form-label">Địa điểm</label>
        <input name="location" className="input" value={formData.location} onChange={handleChange} />
      </div>

      <div className="form-row">
        <label className="form-label">Mức độ ưu tiên</label>
        <select name="priority" className="select" value={formData.priority} onChange={handleChange}>
          <option value="binh_thuong">Bình thường</option>
          <option value="quan_trong">Quan trọng</option>
          <option value="khan_cap">Khẩn cấp</option>
        </select>
      </div>

      {/* ===== LẶP LẠI ===== */}
    <div className="form-row">
      <label className="form-label flex items-center gap-2">
        <input
          type="checkbox"
          name="repeat"
          checked={formData.repeat}
          onChange={handleChange}
        />
        Lặp lại sự kiện
      </label>

      {formData.repeat && (
        <div className="mt-3 space-y-4 border rounded-lg p-3 bg-gray-50">

          {/* Tần suất lặp */}
          <div className="flex items-center gap-2">
            <span>Lặp mỗi</span>

            <input
              type="number"
              min={1}
              className="input w-[70px]"
              value={formData.repeatRule?.interval}
              onChange={e =>
                handleRepeatRuleChange("interval", Number(e.target.value))
              }
            />

            <select
              className="select w-[150px]"
              value={formData.repeatRule?.freq}
              onChange={e =>
                handleRepeatRuleChange("freq", e.target.value as RepeatFreq)
              }
            >
              <option value="DAILY">Ngày</option>
              <option value="WEEKLY">Tuần</option>
              <option value="MONTHLY">Tháng</option>
            </select>
          </div>

          {/* Kiểu kết thúc */}
          <div className="space-y-2">
            <div className="font-medium">Kết thúc lặp</div>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={repeatEndType === "never"}
                onChange={() => setRepeatEndType("never")}
              />
              Không kết thúc
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={repeatEndType === "count"}
                onChange={() => setRepeatEndType("count")}
              />
              Sau

              <input
                type="number"
                min={1}
                className="input w-[70px]"
                disabled={repeatEndType !== "count"}
                onChange={e =>
                  handleRepeatRuleChange("count", Number(e.target.value))
                }
              />
              lần
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={repeatEndType === "date"}
                onChange={() => setRepeatEndType("date")}
              />
              Đến ngày

              <input
                type="date"
                className="input"
                disabled={repeatEndType !== "date"}
                onChange={e =>
                  handleRepeatRuleChange("until", e.target.value)
                }
              />
            </label>
          </div>
        </div>
      )}
    </div>
    {/* ===== NHẮC NHỞ ===== */}
    <div className="form-row">
      <label className="form-label">Nhắc nhở</label>

      <div className="space-y-3 border rounded-lg p-3 bg-gray-50">

        {/* ----- Nhắc trước khi bắt đầu ----- */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 font-medium">
            <input
              type="checkbox"
              name="remindBeforeStart"
              checked={formData.remindBeforeStart}
              onChange={handleChange}
            />
            Nhắc trước khi bắt đầu
          </label>

          {formData.remindBeforeStart && (
            <div className="flex items-center gap-2 ml-6">
              <span>Trước</span>

              <input
                type="number"
                min={1}
                className="input w-[80px]"
                name="remindStartValue"
                value={formData.remindStartValue}
                onChange={handleChange}
              />

              <select
                name="remindStartUnit"
                className="select w-[120px]"
                value={formData.remindStartUnit}
                onChange={handleChange}
              >
                <option value="minutes">Phút</option>
                <option value="hours">Giờ</option>
                <option value="days">Ngày</option>
              </select>
            </div>
          )}
        </div>

        {/* ----- Nhắc trước khi kết thúc ----- */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 font-medium">
            <input
              type="checkbox"
              name="remindBeforeEnd"
              checked={formData.remindBeforeEnd}
              onChange={handleChange}
            />
            Nhắc trước khi kết thúc
          </label>

          {formData.remindBeforeEnd && (
            <div className="flex items-center gap-2 ml-6">
              <span>Trước</span>

              <input
                type="number"
                min={1}
                className="input w-[80px]"
                name="remindEndValue"
                value={formData.remindEndValue}
                onChange={handleChange}
              />

              <select
                name="remindEndUnit"
                className="select w-[120px]"
                value={formData.remindEndUnit}
                onChange={handleChange}
              >
                <option value="minutes">Phút</option>
                <option value="hours">Giờ</option>
                <option value="days">Ngày</option>
              </select>
            </div>
          )}
        </div>

      </div>
    </div>


      
      {/* ===== ACTIONS ===== */}
      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>Hủy</button>
        <button type="submit" className="btn-save">Lưu sự kiện</button>
      </div>
    </form>
  );
}
