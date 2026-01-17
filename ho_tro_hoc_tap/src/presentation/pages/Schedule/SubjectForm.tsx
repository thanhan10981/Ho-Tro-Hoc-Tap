import { useState } from "react";
import type { CreateMonHocPayload } from "../../../shared/types/monHoc";

interface Props {
  onSubmit: (data: CreateMonHocPayload) => void;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}


export default function SubjectForm({ onSubmit, onCancel, loading, error }: Props) {
  const [form, setForm] = useState<CreateMonHocPayload>({
    tenMonHoc: "",
    moTa: "",
    mucDoHoc: "moi_bat_dau",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
        {error && (
            <div className="form-error text-red-600 mb-2">
            {error}
            </div>
        )}
      {/* Tên môn học */}
      <div className="form-row">
        <label className="form-label">Tên môn học</label>
        <input
          type="text"
          name="tenMonHoc"
          className="input"
          value={form.tenMonHoc}
          onChange={e => setForm({ ...form, tenMonHoc: e.target.value })}
          required
        />
      </div>

      {/* Mô tả */}
      <div className="form-row">
        <label className="form-label">Mô tả</label>
        <textarea
          name="moTa"
          className="textarea"
          value={form.moTa}
          onChange={handleChange}
        />
      </div>

      {/* Mức độ học */}
      <div className="form-row">
        <label className="form-label">Mức độ học</label>
        <select
          name="mucDoHoc"
          className="select"
          value={form.mucDoHoc}
          onChange={handleChange}
        >
          <option value="moi_bat_dau">Mới bắt đầu</option>
          <option value="dang_hoc">Đang học</option>
          <option value="on_tap">Ôn tập</option>
          <option value="thanh_thao">Thành thạo</option>
        </select>
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button
          type="button"
          className="btn-cancel"
          onClick={onCancel}
        >
          Huỷ
        </button>

        <button
          type="submit"
          className="btn-save"
          disabled={loading}
        >
          {loading ? "Đang lưu..." : "Lưu môn học"}
        </button>
      </div>
    </form>
  );
}
