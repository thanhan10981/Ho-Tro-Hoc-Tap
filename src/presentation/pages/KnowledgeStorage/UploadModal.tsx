import React from "react";
import { useEffect } from "react";
interface UploadModalProps {
  open: boolean;
  onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ open, onClose }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 overflow-y-auto"
    onClick={onClose}>
      <div className="bg-white w-full max-w-[520px] rounded-2xl shadow-xl p-6 animate-fadeIn relative overflow-y-auto"
      onClick={(e) => e.stopPropagation()}>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Tải lên tài liệu mới
        </h2>

        {/* Upload box */}
        <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center mb-4">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
              <span className="text-3xl text-blue-500">⭱</span>
            </div>

            <p className="text-slate-600">Kéo thả tài liệu vào đây hoặc</p>

            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Chọn tệp
            </button>

            <p className="text-sm text-slate-400 mt-1">
              Hỗ trợ: PDF, DOC, DOCX, JPG, PNG (tối đa 10MB)
            </p>
          </div>
        </div>

        {/* Title */}
        <label className="block text-sm text-slate-600 mb-1">Tiêu đề tài liệu</label>
        <input
          type="text"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-3 focus:border-blue-500 outline-none"
          placeholder="Nhập tiêu đề tài liệu"
        />

        {/* Subject */}
        <label className="block text-sm text-slate-600 mb-1">Môn học</label>
        <select className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-3">
          <option>Chọn môn học</option>
        </select>

        {/* Type */}
        <label className="block text-sm text-slate-600 mb-1">Loại tài liệu</label>
        <select className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-3">
          <option>Chọn loại tài liệu</option>
        </select>

        {/* Description */}
        <label className="block text-sm text-slate-600 mb-1">Mô tả</label>
        <textarea
          className="w-full border border-slate-300 rounded-lg px-3 py-2 h-20 mb-4 resize-none focus:border-blue-500 outline-none"
          placeholder="Mô tả ngắn gọn về nội dung tài liệu"
        />

        {/* Submit */}
        <button className="w-full py-3 bg-blue-600 text-white rounded-lg text-[15px] font-medium hover:bg-blue-700">
          Tải lên và xuất bản
        </button>
      </div>
    </div>
  );
};

export default UploadModal;
