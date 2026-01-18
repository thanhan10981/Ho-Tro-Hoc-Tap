import { useState } from "react";
import {
  updateEvent,
  updateNhacNho,
  deleteNhacNho,
} from "../../../shared/services/lichHocService";

import type { LichHocCalendarDTO, UpdateEventFormState } from "../../../shared/types/lichHoc";
import "../../../styles/Schedule/UpdateEventForm.css";
interface Props {
  event: LichHocCalendarDTO;
  onClose: () => void;
  onSuccess: () => void;
  onToast: (msg: string) => void;
}

export default function UpdateEventForm({ event, onClose, onSuccess,  onToast }: Props) {
    const [form, setForm] = useState<UpdateEventFormState>({
    tieuDe: event.tieuDe,
    diaDiem: event.diaDiem ?? "",
    loaiSuKien: event.loaiSuKien,
    ngayBatDau: event.ngayBatDau,
    ngayKetThuc: event.ngayKetThuc,
    gioBatDau: event.gioBatDau.slice(0, 5),
    gioKetThuc: event.gioKetThuc.slice(0, 5),
    mucDoUuTien: "binh_thuong",
    moTa: event.moTa ?? "",
    });


  const [nhacBatDau, setNhacBatDau] = useState<string>("");
  const [nhacKetThuc, setNhacKetThuc] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
    ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
        ...prev,
        [name]: value,
    }));
    };

  const submit = async () => {
    try {
      await updateEvent(event.maSuKien, form);

      if (nhacBatDau) {
        await updateNhacNho(event.maSuKien, false, nhacBatDau);
      }

      if (nhacKetThuc) {
        await updateNhacNho(event.maSuKien, true, nhacKetThuc);
      }

      onToast("✅ Đã cập nhật sự kiện");
      onSuccess();

      setTimeout(() => onToast(""), 2500);
    } catch {
      onToast("❌ Cập nhật thất bại");
      setTimeout(() => onToast(""), 2500);
    }
  };


  return (
    <div className="modal">
      <h3>Cập nhật sự kiện</h3>

      <input name="tieuDe" value={form.tieuDe} onChange={handleChange} />
      <input name="diaDiem" value={form.diaDiem} onChange={handleChange} />

      <select
        name="loaiSuKien"
        value={form.loaiSuKien}
        onChange={handleChange}
      >
        <option value="hoc">Lớp học</option>
        <option value="thi">Thi cử</option>
        <option value="deadline">Deadline</option>
        <option value="on_tap">Ôn tập</option>
      </select>

      <div className="grid-2">
        <input type="date" name="ngayBatDau" value={form.ngayBatDau} onChange={handleChange} />
        <input type="time" name="gioBatDau" value={form.gioBatDau} onChange={handleChange} />
      </div>

      <div className="grid-2">
        <input type="date" name="ngayKetThuc" value={form.ngayKetThuc} onChange={handleChange} />
        <input type="time" name="gioKetThuc" value={form.gioKetThuc} onChange={handleChange} />
      </div>

      <textarea
        name="moTa"
        value={form.moTa}
        onChange={handleChange}
        placeholder="Mô tả"
      />

      {/* ===== NHẮC NHỞ ===== */}
      <h4>Nhắc nhở</h4>

      <label>Nhắc trước khi bắt đầu</label>
        <input
        type="datetime-local"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNhacBatDau(e.target.value + ":00")
        }
        />
<button
        onClick={async () => {
          if (!window.confirm("Bạn có chắc muốn xóa nhắc bắt đầu không?")) return;

          await deleteNhacNho(event.maSuKien, false);
          onToast("🗑️ Đã xóa nhắc bắt đầu");

          setTimeout(() => onToast(""), 2500);
        }}
      >
        Xóa nhắc bắt đầu
      </button>


      <label>Nhắc trước khi kết thúc</label>
        <input
        type="datetime-local"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNhacKetThuc(e.target.value + ":00")
        }
        />

        <button
          onClick={async () => {
            if (!window.confirm("Bạn có chắc muốn xóa nhắc kết thúc không?")) return;

            await deleteNhacNho(event.maSuKien, true);
            onToast("🗑️ Đã xóa nhắc kết thúc");

            setTimeout(() => onToast(""), 2500);
          }}
        >
          Xóa nhắc kết thúc
        </button>


      <div className="actions">
        <button onClick={submit}>Lưu</button>
        <button onClick={onClose}>Hủy</button>
      </div>
    </div>
  );
}
