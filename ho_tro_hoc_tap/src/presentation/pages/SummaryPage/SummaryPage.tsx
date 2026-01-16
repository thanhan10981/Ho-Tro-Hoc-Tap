import "../../../styles/summary/summary.css";
import { useState } from "react";
import { useSummary } from "../../../features/summary/useSummary";
import HeadPage from "./HeadPage";
import LeftPage from "./LeftPage";
import MainPage from "./MainPage";
import RightPage from "./RightPage";

export default function SummaryPage() {

  const {
    summaries,
    selected,
    setSelected,
    sortLabel,
    sortOptions,
    handleSortChange,
    applyFilter
  } = useSummary();


  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showUpload, setShowUpload] = useState(false);
  const [showCreateAI, setShowCreateAI] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);


  return (
    <div className="page">
      <div className="container">

        <HeadPage
          onCreateAI={() => setShowCreateAI(true)}
        />
        {/* ============= UPLOAD POPUP =============== */}
        {showUpload && (
          <div className="upload-overlay">
            <div className="upload-card">
              <h2 className="upload-title-header">Tải lên tài liệu</h2>

              <div className="upload-box">
                <div className="upload-circle">⬆</div>
                <p className="upload-text">Kéo thả tài liệu vào đây hoặc</p>
                <button className="upload-btn">Chọn tệp</button>
                <p className="upload-note">
                  Hỗ trợ: PDF, DOC, DOCX, JPG, PNG (tối đa 10MB)
                </p>
              </div>

              <button
                className="upload-close"
                onClick={() => setShowUpload(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        <div className="main-grid">

          <LeftPage
            summaries={summaries}
            applyFilter={applyFilter}
          />

          <MainPage
            summaries={summaries}
            selected={selected}
            setSelected={setSelected}
            sortLabel={sortLabel}
            sortOptions={sortOptions}
            handleSortChange={handleSortChange}
            viewMode={viewMode}
            setViewMode={setViewMode}
            showCreateAI={showCreateAI}
            setShowCreateAI={setShowCreateAI}
            dropdownOpen={dropdownOpen}
            setDropdownOpen={setDropdownOpen}
          />

          <RightPage
          />

        </div>
      </div>
    </div>
  );
}
