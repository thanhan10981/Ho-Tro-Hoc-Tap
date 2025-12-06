import "../../styles/summary.css";
import { useState } from "react";
import {
  FiFileText, FiGrid, FiEye, FiShare2, FiDownload,
  FiCircle, FiSearch, FiPrinter,
  FiImage
} from "react-icons/fi";

import { useSummary } from "../../features/summary/useSummary";
import type { SummaryItem } from "../../shared/types/Summary.type";

export default function SummaryPage() {

  // Lấy dữ liệu + hàm xử lý từ hook
  const {
    summaries,
    selected,
    setSelected,
    sortLabel,
    sortOptions,
    handleSortChange,
  } = useSummary();

  const renderIcon = (item: SummaryItem) => {
  if (item.status === "processing") return <FiCircle size={26} />;

  switch (item.icon) {
    case "file":
      return <FiFileText size={26} />;
    case "grid":
      return <FiGrid size={26} />;
    case "image":
      return <FiImage size={26} />;
    case "circle":
      return <FiCircle size={26} />;
    default:
      return <FiFileText size={26} />;
  }
};

  // UI state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showUpload, setShowUpload] = useState(false);
  const [showCreateAI, setShowCreateAI] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Tìm summary đang chọn
  const detail = summaries.find(s => s.id === selected);

  return (
    <div className="page">

      {/* ---------------- HEADER ---------------- */}
      <header className="header">
        <div className="header-left">
          <img src="/logo_ai.svg" className="logo" />

          <nav className="menu">
            <a>Dashboard</a>
            <a>Hỏi đáp AI</a>
            <a className="active">Tóm tắt bài học</a>
            <a>Kho kiến thức</a>
            <a>Quiz/Flashcard</a>
            <a>Lịch học</a>
          </nav>
        </div>

        <div className="header-right">
          <div className="notif">3</div>
          <div className="avatar">NT</div>
          <div className="user-info">
            <strong>Nguyễn Thành</strong>
          </div>
        </div>
      </header>

      {/* ---------------- CONTAINER ---------------- */}
      <div className="container">

        {/* -------- TITLE & BUTTONS -------- */}
        <section className="page-header">
          <div className="title-left">
            <h1>Tóm tắt bài học</h1>
            <p>Sử dụng AI để tóm tắt tài liệu học tập một cách thông minh và hiệu quả</p>
          </div>

          <div className="title-right">
            <button className="btn upload" onClick={() => setShowUpload(true)}>⬆ Tải lên tài liệu</button>
            <button className="btn create" onClick={() => setShowCreateAI(true)}>+ Tạo tóm tắt mới</button>
            <button className="btn export">⬇ Xuất tất cả</button>
          </div>
        </section>


        {/* ================== MAIN GRID ================== */}
        <div className="main-grid">

          {/* ============= UPLOAD POPUP =============== */}
          {showUpload && (
            <div className="upload-overlay">
              <div className="upload-card">
                <h2 className="upload-title-header">Tải lên tài liệu</h2>

                <div className="upload-box">
                  <div className="upload-circle">⬆</div>
                  <p className="upload-text">Kéo thả tài liệu vào đây hoặc</p>
                  <button className="upload-btn">Chọn tệp</button>
                  <p className="upload-note">Hỗ trợ: PDF, DOC, DOCX, JPG, PNG (tối đa 10MB)</p>
                </div>

                <button className="upload-close" onClick={() => setShowUpload(false)}>Đóng</button>
              </div>
            </div>
          )}


          {/* =========== LEFT COLUMN (FILTER + STATS) =========== */}
          <div className="left-column">

            <aside className="filter-box">
              <h2>Tìm kiếm & Bộ lọc</h2>

              <div className="search-box">
                <span><FiSearch size={19} /></span>
                <input placeholder="Tìm kiếm tóm tắt..." />
              </div>

              <label>Môn học</label>
              <select>
                <option>Tất cả môn học</option>
                <option>Toán cao cấp</option>
                <option>Vật lý</option>
                <option>Hóa học</option>
              </select>

              <label>Loại tài liệu</label>
              <div className="check-group">
                <label><input type="checkbox" defaultChecked /> PDF</label>
                <label><input type="checkbox" defaultChecked /> Word</label>
                <label><input type="checkbox" defaultChecked /> Hình ảnh</label>
              </div>

              <label>Trạng thái</label>
              <div className="check-group">
                <label><input type="checkbox" defaultChecked /> Đã tóm tắt</label>
                <label><input type="checkbox" /> Đang xử lý</label>
                <label><input type="checkbox" /> Lỗi</label>
              </div>

              <label>Thời gian tạo</label>
              <select>
                <option>Tuần này</option>
                <option>Tháng này</option>
                <option>3 tháng gần đây</option>
                <option>Tất cả</option>
              </select>
            </aside>


            <div className="stats-box under-filter">
              <h3>Thống kê</h3>

              <div className="stat-row">
                <span>Tổng tóm tắt</span>
                <strong className="blue">{summaries.length}</strong>
              </div>

              <div className="stat-row">
                <span>Tuần này</span>
                <strong className="green">8</strong>
              </div>

              <div className="stat-row">
                <span>Đang xử lý</span>
                <strong className="orange">
                  {summaries.filter(s => s.status === "processing").length}
                </strong>
              </div>

              <h4>Môn có nhiều tóm tắt nhất</h4>
              <p className="subject-top">Khoa học máy tính</p>
            </div>

          </div>


          {/* ================= CENTER ================= */}
          <main className="summary-section">

            {/* CREATE WITH AI */}
            {showCreateAI ? (
              <div className="create-ai-box">
                <h2 className="ai-title">Tạo tóm tắt với AI</h2>

                <div className="ai-row">
                  <label>Loại tóm tắt</label>
                  <select className="ai-select">
                    <option>Tóm tắt ngắn</option>
                    <option>Tóm tắt đầy đủ</option>
                    <option>Tóm tắt siêu ngắn</option>
                  </select>
                </div>

                <div className="ai-row">
                  <label>Độ dài</label>
                  <input type="range" min="1" max="100" />
                  <div className="range-labels"><span>Ngắn</span><span>Dài</span></div>
                </div>

                <div className="ai-options">
                  <label><input type="checkbox" /> Highlight từ khóa quan trọng</label>
                  <label><input type="checkbox" /> Bao gồm ví dụ minh họa</label>
                  <label><input type="checkbox" /> Tạo câu hỏi ôn tập</label>
                </div>

                <button className="ai-generate">✨ Tạo tóm tắt với AI</button>
                <button className="ai-close" onClick={() => setShowCreateAI(false)}>Đóng</button>
              </div>
            ) : (
              <>
                {/* ===== HEADER ===== */}
                <div className="section-header">
                  <h2>Danh sách tóm tắt</h2>

                  {/* Dropdown Sort */}
                  <div
                    className={`dropdown ${dropdownOpen ? "open" : ""}`}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <button className="dropdown-btn">
                      {sortLabel} <span className="arrow">▾</span>
                    </button>

                    <div className="dropdown-menu">
                      {sortOptions.map(opt => (
                        <div
                          key={opt}
                          className="item"
                          onClick={() => handleSortChange(opt)}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* VIEW SWITCH */}
                  <div className="view-switch">
                    <button
                      className={`switch-btn ${viewMode === "grid" ? "active" : ""}`}
                      onClick={() => setViewMode("grid")}
                    >
                      <FiGrid size={18} />
                    </button>

                    <button
                      className={`switch-btn ${viewMode === "list" ? "active" : ""}`}
                      onClick={() => setViewMode("list")}
                    >
                      ☰
                    </button>
                  </div>
                </div>


                {/* ===== SUMMARY LIST ===== */}
                <div className={`summary-grid ${viewMode}`}>
                  {summaries.map(item => (
                    <div
                      key={item.id}
                      className={`summary-card ${selected === item.id ? "selected" : ""}`}
                      onClick={() => setSelected(item.id)}
                    >
                      <div className={`card-icon ${item.status === "processing" ? "orange" : "blue"}`}>
                        {renderIcon(item)}
                      </div>

                      <div className="card-content">
                        <h3>{item.title}</h3>
                        {item.chapter && <p>{item.chapter}</p>}

                        <div className="tag-row">
                          <span className="tag blue-tag">{item.subject}</span>
                          <span className="time">{item.timeAgo}</span>
                        </div>

                        {item.status === "processing" ? (
                          <div className="progress"><div className="bar"></div></div>
                        ) : (
                          <div className="meta">
                            <span>{item.wordCount} từ</span>•<span>{item.pageCount} trang</span>

                            <div className="meta-actions">
                              <button><FiEye size={16} /></button>
                              <button><FiShare2 size={16} /></button>
                              <button><FiDownload size={16} /></button>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              </>
            )}

          </main>


          {/* ================= RIGHT COLUMN ================= */}
          <div className="right-column">

            {/* DETAIL BOX */}
            <aside className={`detail-box ${!detail ? "empty" : ""}`}>

              {!detail ? (
                <div className="detail-empty">
                  <div className="icon">📄</div>
                  <h3>Chọn tóm tắt để xem</h3>
                  <p>Nhấp vào một tóm tắt bên trái để xem nội dung chi tiết</p>
                </div>
              ) : (
                <div className="detail-content-wrapper">

                  <div className="detail-header">
                    <h2>{detail.title}</h2>
                    <button className="close-btn" onClick={() => setSelected(null)}>✕</button>
                  </div>

                  <div className="file-info-box">
                    <div className="file-icon">
                      📄 <span className="file-name">{detail.fileName}</span>
                    </div>

                    <div className="file-meta">
                      <span>{detail.wordCount} từ</span>
                      <span>{detail.pageCount} trang</span>
                      <span>{detail.timeAgo}</span>
                    </div>
                  </div>

                  <div className="detail-text">
                    <h4>Tóm tắt nội dung:</h4>
                    <p style={{ whiteSpace: "pre-line" }}>
                      {detail.description}
                    </p>

                    <h4>Từ khóa:</h4>
                    <div className="keyword-list">
                      {detail.keywords.map((kw, idx) => (
                        <span key={idx} className="keyword">{kw}</span>
                      ))}
                    </div>
                  </div>

                  <div className="detail-actions">
                    <button className="btn-blue">Chỉnh sửa</button>
                  </div>

                  <button className="btn-green detail-share">Chia sẻ</button>

                  <div className="detail-bottom-actions">
                    <button><FiDownload size={15} /> Xuất</button>
                    <button><FiPrinter size={15} /> In</button>
                  </div>

                </div>
              )}

            </aside>


            {/* RECENT BOX */}
            <div className="recent-box under-detail">
              <h3>Hoạt động gần đây</h3>

              <div className="recent-item">
                <span className="check">✔</span>
                <div>
                  <p>Tóm tắt “Giải tích” đã hoàn thành</p>
                  <small>2 giờ trước</small>
                </div>
              </div>

              <div className="recent-item">
                <span className="check">✔</span>
                <div>
                  <p>Chia sẻ tóm tắt với Minh Anh</p>
                  <small>1 ngày trước</small>
                </div>
              </div>

              <div className="recent-item">
                <span className="check">⬆</span>
                <div>
                  <p>Tải lên “Machine Learning”</p>
                  <small>3 ngày trước</small>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
