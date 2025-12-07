import React from "react";
import { useKnowledgeHeader } from "../../../features/KnowledgeStorage/useKnowledgeHeader";
import UploadModal from "./UploadModal";
const KnowledgeStorageHeader: React.FC = () => {
  const {
    searchValue,
    setSearchValue,
    handleAdvancedSearch,

    subjects,
    types,
  } = useKnowledgeHeader();

  const [openUpload, setOpenUpload] = React.useState(false);

  return (
    <header className="relative bg-white">
      <div className="w-full max-w-[1400px] mx-auto px-6 py-4">

        {/* ---------- TOP ROW ---------- */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[30px] font-bold text-slate-800">Kho kiến thức</h1>
            <p className="text-[16px] text-slate-500">
              Tìm kiếm và tra cứu tài liệu học tập từ kho dữ liệu phong phú
            </p>
          </div>

          <button
            onClick={() => setOpenUpload(true)}
            className="flex items-center gap-2 bg-[#22c55e] text-white px-4 py-2 rounded-md text-[14px] hover:bg-[#16A34A] transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 3v12m0-12l-4 4m4-4l4 4" />
              <path d="M4 15v6h16v-6" />
            </svg>

            Tải lên tài liệu mới
          </button>


        </div>

        {/* ---------- SEARCH ---------- */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center w-full max-w-[1160px] bg-white border border-slate-300 rounded-xl px-4 py-2 shadow-sm">
            <span className="material-icons text-slate-500 mr-2 text-[18px]">
              🔍︎ 
            </span>

            <input
              type="text"
              placeholder="Tìm kiếm tài liệu, bài giảng, ghi chú..."
              className="flex-1 outline-none bg-transparent text-[15px] text-slate-800 placeholder:text-slate-400"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          <button
            onClick={handleAdvancedSearch}
            className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-md text-[14px] hover:bg-slate-200 transition"
          >
            <img src="/filter-svgrepo-com.svg" className="w-6.5 h-6.8" />
            Tìm kiếm nâng cao
          </button>
        </div>

        {/* ---------- FILTERS ---------- */}
        <div className="flex items-center gap-4 mt-3">
          <select className="px-3 py-2 border border-slate-300 rounded-md bg-white text-[14px]">
            <option value="">Tất cả môn học</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <select className="px-3 py-2 border border-slate-300 rounded-md bg-white text-[14px]">
            <option value="">Tất cả loại tài liệu</option>
            {types.map((t) => (
              <option key={t.id} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <select className="px-3 py-2 border border-slate-300 rounded-md bg-white text-[14px]">
            <option value="popular">Độ phổ biến</option>
            <option value="newest">Mới nhất</option>
            <option value="most-viewed">Lượt xem cao</option>
          </select>

          <div className="text-[15px] text-slate-600">
            Tìm thấy <span className="font-semibold text-slate-800">247</span> tài liệu
          </div>
        </div>

      </div>
            <UploadModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
      />

    </header>
  );
};

export default KnowledgeStorageHeader;
