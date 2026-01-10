import  { useState } from "react";
import "../../../styles/KnowledgeStorage.css";
import {
  RiStarFill,
  RiStarLine,
  RiEyeLine,
  RiDownloadLine,
  RiShareLine,
  RiSearchLine,
  RiUpload2Line,
  RiArrowLeftSLine,
  RiArrowRightSLine
} from "react-icons/ri";
import { useNavigate } from "react-router-dom"

/* ================= TYPES ================= */
type Mode = "common" | "personal";

type Doc = {
  id: number;
  title: string;
  desc: string;
  subject: string;
  type: string;
  size: string;
  time: string;
  views?: number;
  downloads?: number;
  rating?: number;
  status?: "done" | "todo";
};

/* ================= MOCK DATA ================= */
const COMMON_DOCS: Doc[] = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  title: `Tài liệu số ${i + 1} – Chủ đề nâng cao`,
  desc: "Mô tả tài liệu mẫu dùng để hiển thị xem trước.",
  subject: i % 2 === 0 ? "Toán học" : "CNTT",
  type: "PDF",
  size: "2.0 MB",
  time: `${i + 1} ngày trước`,
  rating: 4.5,
  views: 1000 + i * 3,
  downloads: 200 + i * 2,
}));

const PERSONAL_DOCS: Doc[] = [
  {
    id: 1,
    title: "Giải tích 1 – Bài 1",
    desc: "Giới hạn và liên tục",
    subject: "Toán học",
    type: "PDF",
    size: "1.8 MB",
    time: "2 ngày trước",
    status: "done",
  },
  {
    id: 2,
    title: "Cấu trúc dữ liệu – Stack",
    desc: "Khái niệm và ví dụ",
    subject: "CNTT",
    type: "PDF",
    size: "2.4 MB",
    time: "5 ngày trước",
    status: "todo",
  },
];
type PersonalDoc = {
  id: number;
  title: string;
  type: string;
  content: string;
  updatedAt: string;
};

/* ================= PAGE ================= */
export default function KnowledgeStoragePage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("common");
  const [preview, setPreview] = useState<Doc | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [page, setPage] = useState(1);

  const ITEMS = 6;
  const data = mode === "common" ? COMMON_DOCS : PERSONAL_DOCS;
  const totalPages = Math.ceil(data.length / ITEMS);

  const pageData = data.slice(
    (page - 1) * ITEMS,
    page * ITEMS
  );

  function saveToPersonal(doc: Doc) {
  const stored: PersonalDoc[] = JSON.parse(
    localStorage.getItem("personalDocs") || "[]"
  );

  const exists = stored.some(d => d.title === doc.title);
  if (exists) {
    alert("Tài liệu đã tồn tại trong kho cá nhân");
    return;
  }

  const newDoc: PersonalDoc = {
    id: Date.now(),
    title: doc.title,
    type: doc.type,
    content: "",
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(
    "personalDocs",
    JSON.stringify([...stored, newDoc])
  );

  alert("Đã lưu vào kho cá nhân");
}


  return (
    <div className="ks-page">

      {/* ================= HEADER ================= */}
      <div className="ks-header">
        <div>
          <h1>{mode === "common" ? "Kho kiến thức" : "Kho kiến thức cá nhân"}</h1>
          <p>
            {mode === "common"
              ? "Tìm kiếm và tra cứu tài liệu học tập"
              : "Tài liệu bạn đã lưu để học"}
          </p>
        </div>

        <div className="ks-actions">
          <div className="ks-tabs">
            <button
              className={mode === "common" ? "active" : ""}
              onClick={() => setMode("common")}
            >
              Kho chung
            </button>
            <button
              className={mode === "personal" ? "active" : ""}
              onClick={() => setMode("personal")}
            >
              Kho cá nhân
            </button>
          </div>

          {mode === "common" && (
            <button className="btn-primary" onClick={() => setUploadOpen(true)}>
              <RiUpload2Line />
              Import
            </button>
          )}
        </div>
      </div>

      {/* ================= TOOLBAR ================= */}
      <div className="ks-toolbar">
        <div className="ks-search">
          <RiSearchLine />
          <input
            placeholder={
              mode === "common"
                ? "Tìm kiếm tài liệu, bài giảng, ghi chú..."
                : "Tìm kiếm tài liệu đã lưu..."
            }
          />
        </div>


        <select><option>Tất cả môn học</option></select>
        <select><option>Tất cả loại tài liệu</option></select>
        <select><option>Độ phổ biến</option></select>

        <span className="ks-count">
          {mode === "common"
            ? `Tìm thấy ${COMMON_DOCS.length} tài liệu`
            : `Đã lưu ${PERSONAL_DOCS.length} tài liệu`}
        </span>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="ks-body">

        {/* SIDEBAR FILTER */}
        {mode === "common" && (
          <aside className="ks-filter">
            <h3>Danh mục chính</h3>
            <ul>
              <li className="active">Tất cả tài liệu <span>247</span></li>
              <li>Toán cao cấp <span>68</span></li>
              <li>Vật lý <span>45</span></li>
              <li>CNTT <span>56</span></li>
            </ul>

            <h3>Loại tài liệu</h3>
            <label><input type="checkbox" /> PDF</label>
            <label><input type="checkbox" /> Video</label>

            <h3>Đánh giá</h3>
            <label className="ks-rating">
              <input type="radio" name="rate" />
              <span className="stars">
                <RiStarFill />
                <RiStarFill />
                <RiStarFill />
                <RiStarFill />
                <RiStarFill />
              </span>
              <span>5 sao</span>
            </label>

            <label className="ks-rating">
              <input type="radio" name="rate" />
              <span className="stars">
                <RiStarFill />
                <RiStarFill />
                <RiStarFill />
                <RiStarFill />
                <RiStarLine />
              </span>
              <span>4 sao</span>
            </label>

            <h3>Kích thước file</h3>
            <input type="range" />
          </aside>
        )}

        {/* GRID */}
        <div className="ks-grid">
          {pageData.map((d) => (
            <div
              className="ks-card"
              key={d.id}
              onClick={() => {
                if (mode === "common") {
                  setPreview(d);
                } else {
                  navigate(`/personalStore/${d.id}`);
                }
              }}
            >
              <div className="ks-thumb">
                {/* Badge PDF */}
                <span className="ks-badge">{d.type}</span>

                {/* Hover overlay */}
                <div className="ks-thumb-hover">
                  <button
                    className="preview-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreview(d);
                    }}
                  >
                    <RiEyeLine />
                    Xem trước
                  </button>

                  <div className="thumb-actions">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      title="Tải xuống"
                    >
                      <RiDownloadLine />
                    </button>

                    <button
                      onClick={(e) => e.stopPropagation()}
                      title="Chia sẻ"
                    >
                      <RiShareLine />
                    </button>
                  </div>
                </div>
              </div>
              <div className="ks-card-body">
              <h4>{d.title}</h4>
              <p className="muted">{d.desc}</p>

              <div className="ks-tags">
                <span>{d.subject}</span>
                <span>{d.type}</span>
              </div>

              {mode === "common" && (
                <div className="ks-stats">
                  <span className="rating">
                    <RiStarFill /> {d.rating}
                  </span>
                  <span>
                    <RiEyeLine /> {d.views}
                  </span>
                  <span>
                    <RiDownloadLine /> {d.downloads}
                  </span>
                </div>
              )}

              {mode === "personal" && (
                <div className="ks-personal-actions">
                  <span className={d.status === "done" ? "done" : "todo"}>
                    {d.status === "done" ? "Đã học" : "Chưa học"}
                  </span>
                  <button>Ghi chú</button>
                  <button className="danger">Xoá</button>
                </div>
              )}

              <div className="ks-meta">
                <span>{d.size}</span>
                <span>{d.time}</span>
              </div>

              
</div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= PAGINATION ================= */}
      {mode === "common" && (
        <div className="ks-pagination">
          {/* PREV */}
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            <RiArrowLeftSLine />
          </button>

          {/* PAGE NUMBERS */}
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          {/* NEXT */}
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            <RiArrowRightSLine />
          </button>
        </div>
      )}


      {/* ================= PREVIEW MODAL ================= */}
      {preview && (
  <div className="ks-modal">
    <div className="backdrop" onClick={() => setPreview(null)} />

    <div className="modal-box preview-large">
      {/* HEADER */}
      <header className="modal-header">
        <div>
          <h2>{preview.title}</h2>
          <p className="muted">
            {preview.type} • {preview.size} • {preview.time}
          </p>
        </div>

        <button
          className="modal-close"
          onClick={() => setPreview(null)}
        >
          ×
        </button>
      </header>

      {/* BODY */}
      <div className="modal-body">
        {/* PREVIEW AREA */}
        <div className="preview-area pdf-preview">
          <div className="pdf-page">Trang 1</div>
          <div className="pdf-page">Trang 2</div>
          <div className="pdf-page">Trang 3</div>

          {/* PAGINATION */}
          <div className="pdf-controls">
            <button>‹</button>
            <span>1 / 10</span>
            <button>›</button>
          </div>
        </div>

        {/* INFO AREA */}
        <div className="info-area">
          <h4>Thông tin tài liệu</h4>

          <ul className="doc-info">
            <li><strong>Môn học:</strong> {preview.subject}</li>
            <li><strong>Loại:</strong> {preview.type}</li>
            <li><strong>Dung lượng:</strong> {preview.size}</li>
            <li><strong>Lượt xem:</strong> {preview.views ?? "—"}</li>
            <li><strong>Lượt tải:</strong> {preview.downloads ?? "—"}</li>
            <li><strong>Đánh giá:</strong> {preview.rating ?? "—"} / 5</li>
          </ul>

          <h4>Mô tả</h4>
          <p>{preview.desc}</p>

          <p className="muted small">
            * Chỉ cho phép xem trước một số trang đầu
          </p>

          <button
            className="btn-primary full"
            onClick={() => saveToPersonal(preview)}
          >
            Lưu vào kho cá nhân
          </button>

        </div>
      </div>
    </div>
  </div>
)}


      {/* ===== UPLOAD MODAL (ĐÃ ĐỦ TRI THỨC) ===== */}
      {uploadOpen && (
        <div className="ks-modal">
          <div className="backdrop" onClick={() => setUploadOpen(false)} />
          <div className="modal-box small">
            <header className="modal-header">
              <h2>Tải lên tài liệu mới</h2>
              <button
                className="modal-close"
                onClick={() => setUploadOpen(false)}
              >
                ×
              </button>
            </header>


            <div className="upload-body">
              <select><option>Cấp bậc học</option></select>
              <select><option>Lĩnh vực</option></select>
              <select><option>Chủ đề</option></select>
              <input placeholder="Nhãn (VD: Giải tích, Ôn tập)" />
              <input type="file" />
              <input placeholder="Tiêu đề tài liệu" />
              <textarea placeholder="Mô tả ngắn gọn nội dung tài liệu" />
              <button className="btn-primary">Tải lên và xuất bản</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
