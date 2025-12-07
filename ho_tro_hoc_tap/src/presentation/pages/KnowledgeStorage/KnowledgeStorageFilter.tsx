import React, { useState, useEffect } from "react";
import type { KnowledgeStorageFilters } from "../../../shared/types/KnowledgeStorage.type";

export interface KnowledgeStorageFilterProps {
  onFilterChange?: (filters: KnowledgeStorageFilters) => void;
  className?: string;
}

const SUBJECTS_DEMO = [
  { id: "all", label: "Tất cả tài liệu", count: 247 },
  { id: "math", label: "Toán cao cấp", count: 68 },
  { id: "physics", label: "Vật lý đại cương", count: 45 },
  { id: "chem", label: "Hóa học cơ bản", count: 32 },
  { id: "cs", label: "Khoa học máy tính", count: 56 },
  { id: "eng", label: "Tiếng Anh", count: 28 },
  { id: "ai", label: "Trí tuệ nhân tạo", count: 18 },
];

const DOC_TYPES = [
  { id: "pdf", label: "PDF", count: 156 },
  { id: "video", label: "Video", count: 43 },
  { id: "audio", label: "Audio", count: 18 },
  { id: "image", label: "Hình ảnh", count: 30 },
];

const KnowledgeStorageFilter: React.FC<KnowledgeStorageFilterProps> = ({
  onFilterChange,
  className = "",
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedTypes, setSelectedTypes] = useState<Record<string, boolean>>({});
  const [rating, setRating] = useState<number | null>(null);
  const [maxFileMB, setMaxFileMB] = useState<number>(50);

  useEffect(() => {
    const init: Record<string, boolean> = {};
    DOC_TYPES.forEach((t) => (init[t.id] = false));
    setSelectedTypes(init);
  }, []);

  useEffect(() => {
    onFilterChange?.({
      subject: selectedSubject === "all" ? undefined : selectedSubject,
      type: Object.keys(selectedTypes).filter((k) => selectedTypes[k]),
      rating: rating ?? undefined,
      fileSize: maxFileMB,
    });
  }, [selectedSubject, selectedTypes, rating, maxFileMB, onFilterChange]);

  const toggleType = (id: string) => {
    setSelectedTypes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const cardClass =
    "bg-white rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-5";

  const labelClass =
    "font-semibold mb-4 text-slate-900 text-[16px]";

  return (
    <aside className={`w-[280px] flex flex-col gap-4 ${className}`} aria-label="Bộ lọc">

      {/* Card 1 */}
      <div className={cardClass}>
        <div className={labelClass}>Danh mục chính</div>

        <ul className="flex flex-col gap-2">
          {SUBJECTS_DEMO.map((s) => {
            const active = selectedSubject === s.id;
            return (
              <li
                key={s.id}
                onClick={() => setSelectedSubject(s.id)}
                className={`flex justify-between items-center px-3 py-2 rounded-xl cursor-pointer transition-all
                ${active
                  ? "bg-blue-50 border border-blue-300"
                  : "hover:bg-slate-100"
                }`}
              >
                <span className="text-[14px] font-medium">{s.label}</span>
                <span
                  className={`px-2 py-1 rounded-lg text-[12px] 
                  ${active ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}
                >
                  {s.count}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Card 2 */}
      <div className={cardClass}>
        <div className={labelClass}>Loại tài liệu</div>

        <div className="flex flex-col gap-2">
          {DOC_TYPES.map((t) => (
            <label
              key={t.id}
              className="flex items-center gap-3 text-[14px] font-medium cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={!!selectedTypes[t.id]}
                onChange={() => toggleType(t.id)}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-slate-800">{t.label}</span>
              <span className="text-slate-500 text-[13px]">({t.count})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Card 3 */}
      <div className={cardClass}>
        <div className={labelClass}>Đánh giá</div>

        <div className="flex flex-col gap-2">
          {[5, 4, 3].map((star) => (
            <label key={star} className="flex items-center gap-3 text-[14px] cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={rating === star}
                onChange={() => setRating(star)}
                className="w-4 h-4 accent-amber-500"
              />
              <span className="text-amber-500">
                {"★".repeat(star)}{"☆".repeat(5 - star)}
              </span>
              <span className="text-slate-500 text-[13px]">
                ({star === 5 ? 45 : star === 4 ? 78 : 34})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Card 4 */}
      <div className={cardClass}>
        <div className={labelClass}>Kích thước file</div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-slate-500 w-12 text-center">0 MB</span>

            <input
              type="range"
              min={0}
              max={100}
              value={maxFileMB}
              onChange={(e) => setMaxFileMB(Number(e.target.value))}
              className="w-full h-2 rounded-full bg-slate-200 accent-blue-600"
            />

            <span className="text-[13px] text-slate-500 w-12 text-center">100 MB</span>
          </div>

          <div className="text-[13px] text-slate-700">
            Tối đa: <strong className="text-slate-900">{maxFileMB} MB</strong>
          </div>
        </div>
      </div>

    </aside>
  );
};

export default KnowledgeStorageFilter;
