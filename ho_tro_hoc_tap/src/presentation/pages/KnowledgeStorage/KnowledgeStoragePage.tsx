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
  RiArrowRightSLine,
} from "react-icons/ri";
import { useKnowledgeStorage } from "../../../features/KnowledgeStorage/useKnowledgeStorage";
import { useNavigate } from "react-router-dom";
import {
  increaseDownload,
  increaseView,
} from "../../../features/KnowledgeStorage/knowledge";
import { downloadDoc } from "../../../features/KnowledgeStorage/knowledge";
import { useState } from "react";
import { saveToPersonal as saveToPersonalApi } from "../../../features/KnowledgeStorage/knowledge";

/* ================= PAGE ================= */
export default function KnowledgeStoragePage() {
  const token = localStorage.getItem("token") || "";
  const [previewError, setPreviewError] = useState(false);
  const navigate = useNavigate();
  const FILE_TYPES = ["PDF", "DOCX", "PPTX", "XLSX"];
  const {
    /* mode */
    mode,
    setMode,

    /* sidebar */
    sidebarLinhVuc,
    capBacList,
    chuDeList,
    activeLinhVuc,
    setActiveLinhVuc,
    activeCapBac,
    setActiveCapBac,
    activeChuDe,
    setActiveChuDe,

    /* search */
    docs,
    totalDocs,
    keyword,
    setKeyword,
    rating,
    setRating,
    type,
    setType,

    /* ui */
    preview,
    setPreview,
    uploadOpen,
    setUploadOpen,
    page,
    setPage,
    ITEMS,

    /* actions */
    // saveToPersonal,

    /* upload 🔥 */
    setFile,
    title,
    setTitle,
    description,
    setDescription,
    setCapBacId,
    setLinhVucId,
    setChuDeId,
    uploading,
    submitUpload,
    linhVucId,
    chuDeId,
  } = useKnowledgeStorage();

  const totalPages = Math.ceil(totalDocs / ITEMS);

  return (
    <div className="ks-page">
      {/* ================= HEADER ================= */}
      <div className="ks-header">
        <div>
          <h1>
            {mode === "common" ? "Kho kiến thức" : "Kho kiến thức cá nhân"}
          </h1>
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
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1); // reset page khi search
            }}
            placeholder={
              mode === "common"
                ? "Tìm kiếm tài liệu, bài giảng, ghi chú..."
                : "Tìm kiếm tài liệu đã lưu..."
            }
          />
        </div>

        <span className="ks-count">
          {mode === "common"
            ? `Tìm thấy ${totalDocs} tài liệu`
            : `Đã lưu ${docs.length} tài liệu`}
        </span>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="ks-body">
        {/* SIDEBAR FILTER */}
        {mode === "common" && (
          <aside className="ks-filter">
            {/* ===== LĨNH VỰC ===== */}
            <h3>Lĩnh vực</h3>
            <ul>
              <li
                className={!activeLinhVuc ? "active" : ""}
                onClick={() => setActiveLinhVuc(null)}
              >
                Tất cả
              </li>

              {sidebarLinhVuc.map((lv) => (
                <li
                  key={lv.id}
                  className={activeLinhVuc === lv.id ? "active" : ""}
                  onClick={() => setActiveLinhVuc(lv.id)}
                >
                  {lv.name}
                  <span>{lv.count}</span>
                </li>
              ))}
            </ul>

            {/* ===== CHỦ ĐỀ (PHỤ THUỘC LĨNH VỰC) ===== */}
            {chuDeList.length > 0 && (
              <>
                <h3>Chủ đề</h3>
                <ul>
                  {chuDeList.map((cd) => (
                    <li
                      key={cd.id}
                      className={activeChuDe === cd.id ? "active" : ""}
                      onClick={() => setActiveChuDe(cd.id)}
                    >
                      {cd.tenChuDe}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* ===== LOẠI FILE ===== */}
            <h3>Loại tài liệu</h3>
            <ul>
              <li
                className={!type ? "active" : ""}
                onClick={() => setType(null)}
              >
                Tất cả
              </li>

              {FILE_TYPES.map((ft) => (
                <li
                  key={ft}
                  className={type === ft ? "active" : ""}
                  onClick={() => {
                    setType(ft);
                    setPage(1);
                  }}
                >
                  {ft}
                </li>
              ))}
            </ul>

            {/* ===== CẤP BẬC ===== */}
            <h3>Cấp bậc</h3>
            <ul>
              {capBacList.map((cb) => (
                <li
                  key={cb.id}
                  className={activeCapBac === cb.id ? "active" : ""}
                  onClick={() => setActiveCapBac(cb.id)}
                >
                  {cb.tenCapBac}
                </li>
              ))}
            </ul>

            {/* ===== ĐÁNH GIÁ SAO ===== */}
            <h3>Đánh giá</h3>

            {/* Tất cả */}
            <label className="ks-rating">
              <input
                type="radio"
                name="rate"
                checked={rating === null}
                onChange={() => {
                  setRating(null);
                  setPage(1);
                }}
              />
              <span>Tất cả</span>
            </label>

            {[5, 4, 3, 2, 1].map((rate) => (
              <label key={rate} className="ks-rating">
                <input
                  type="radio"
                  name="rate"
                  checked={rating === rate}
                  onChange={() => {
                    setRating(rate);
                    setPage(1);
                  }}
                />
                <span className="stars">
                  {Array.from({ length: 5 }).map((_, i) =>
                    i < rate ? <RiStarFill key={i} /> : <RiStarLine key={i} />
                  )}
                </span>
                <span>{rate}</span>
              </label>
            ))}
          </aside>
        )}

        {/* GRID */}
        <div className="ks-grid">
          {docs.map((d) => (
            <div
              className="ks-card"
              key={d.id}
              onClick={() => {
                if (mode === "common") {
                  setPreview(d);
                } else {
                navigate(`/personalStore/${"docId" in d ? d.docId : d.id}`);

                }
              }}
            >
              <div className="ks-thumb">
                {/* Badge type */}
                <span className="ks-badge">{d.type}</span>

                {/* Hover overlay */}
                <div className="ks-thumb-hover">
                  <button
                    className="preview-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreview(d);
                      increaseView(d.id);
                    }}
                  >
                    <RiEyeLine />
                    Xem trước
                  </button>

                  <div className="thumb-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadDoc(d.id, d.title, d.type);
                        increaseDownload(d.id);
                      }}
                      title="Tải xuống"
                    >
                      <RiDownloadLine />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        const shareUrl = `${window.location.origin}/preview/${d.id}`;

                        if (navigator.share) {
                          navigator
                            .share({
                              title: d.title,
                              text: d.description || "Chia sẻ tài liệu học tập",
                              url: shareUrl,
                            })
                            .catch(() => {});
                        } else {
                          // fallback cho browser cũ
                          navigator.clipboard.writeText(shareUrl);
                          alert(
                            "Trình duyệt không hỗ trợ chia sẻ, đã copy link"
                          );
                        }
                      }}
                      title="Chia sẻ"
                    >
                      <RiShareLine />
                    </button>
                  </div>
                </div>
              </div>

              <div className="ks-card-body">
                <h4>{d.title}</h4>
                <p className="muted">{d.description}</p>

                <div className="ks-tags">
                  {/* <span>{d.linhVuc}</span> */}
                  {/* <span>{d.subject}</span> */}
                  <span>{d.type}</span>
                </div>

                {mode === "common" && (
                  <div className="ks-stats">
                    <span className="rating">
                      <RiStarFill /> {Number(d.rating || 0).toFixed(1)}
                    </span>
                    <span>
                      <RiEyeLine /> {d.views ?? 0}
                    </span>
                    <span>
                      <RiDownloadLine /> {d.downloads ?? 0}
                    </span>
                  </div>
                )}

                {mode === "personal" && "status" in d && (
                  <div className="ks-personal-actions">
                    <span className={d.status === "done" ? "done" : "todo"}>
                      {d.status === "done" ? "Đã học" : "Chưa học"}
                    </span>
                    <button>Ghi chú</button>
                    <button className="danger">Xoá</button>
                  </div>
                )}

                <div className="ks-meta">
                  <span>{(Number(d.size) / 1024 / 1024).toFixed(1)} MB</span>
                  <span>
                    {new Date(d.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= PAGINATION ================= */}
      {mode === "common" && totalPages > 1 && (
        <div className="ks-pagination">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            <RiArrowLeftSLine />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
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
                  {preview.type} •{" "}
                  {(Number(preview.size) / 1024 / 1024).toFixed(1)} MB •{" "}
                  {new Date(preview.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>

              <button className="modal-close" onClick={() => setPreview(null)}>
                ×
              </button>
            </header>

            {/* BODY */}
            <div className="modal-body">
              {/* PREVIEW AREA */}
              <div className="preview-area pdf-preview">
                {preview.type === "PDF" && (
                  <iframe
                    src={`http://localhost:9090/api/knowledge/preview/${preview.id}`}
                    width="100%"
                    height="600"
                    style={{ border: "none" }}
                  />
                )}
                {/* ===== DOC / DOCX: preview-office ===== */}

                {(preview.type === "DOC" || preview.type === "DOCX") && (
                  <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(
                      `http://localhost:9090/api/knowledge/download/${preview.id}`
                    )}&embedded=true`}
                    width="100%"
                    height="600"
                    style={{ border: "none" }}
                    onError={() => setPreviewError(true)}
                  />
                )}

                {/* ===== KHÔNG HỖ TRỢ ===== */}
                {(preview.type === "DOC" || preview.type === "DOCX") &&
                  previewError && (
                    <div className="doc-preview-placeholder">
                      <p>⚠️ Không thể xem trước tài liệu này</p>
                      <p>👉 Vui lòng tải file về để xem</p>
                      <button
                        onClick={() =>
                          downloadDoc(preview.id, preview.title, preview.type)
                        }
                      >
                        Tải file
                      </button>
                    </div>
                  )}
              </div>

              {/* INFO AREA */}
              <div className="info-area">
                <h4>Thông tin tài liệu</h4>

                <ul className="doc-info">
                  <li>
                    <strong>Lĩnh vực:</strong>{" "}
                    {preview.chuDe?.tenChuDe ||
                      preview.linhVuc?.name ||
                      "Chưa phân loại"}
                  </li>

                  <li>
                    <strong>Loại:</strong> {preview.type}
                  </li>

                  <li>
                    <strong>Dung lượng:</strong>{" "}
                    {(Number(preview.size) / 1024).toFixed(0)} KB
                  </li>

                  <li>
                    <strong>Lượt xem:</strong> {preview.views ?? 0}
                  </li>

                  <li>
                    <strong>Lượt tải:</strong> {preview.downloads ?? 0}
                  </li>

                  <li>
                    <strong>Đánh giá:</strong>{" "}
                    {preview.rating != null
                      ? `${preview.rating} / 5`
                      : "Chưa có đánh giá"}
                  </li>
                </ul>

                <h4>Mô tả</h4>
                <p>{preview.description}</p>

                <p className="muted small">
                  * Chỉ cho phép xem trước một số trang đầu
                </p>

                <button
                  className="btn-primary full"
                  onClick={async () => {
                    const token = localStorage.getItem("token");
                    if (!token) {
                      alert("Bạn chưa đăng nhập");
                      return;
                    }

                    try {
                      await saveToPersonalApi(preview.id);
                      alert("✅ Đã lưu vào kho cá nhân");
                    } catch {
                      alert("⚠️ Tài liệu đã có trong kho cá nhân");
                    }
                  }}
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
              <select onChange={(e) => setCapBacId(Number(e.target.value))}>
                <option value="">Cấp bậc học</option>
                {capBacList.map((cb) => (
                  <option key={cb.id} value={cb.id}>
                    {cb.tenCapBac}
                  </option>
                ))}
              </select>
              <select
                value={linhVucId ?? ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setActiveLinhVuc(id); // ✅ trigger fetchChuDe
                  setLinhVucId(id); // ✅ dùng cho upload
                  setChuDeId(null); // ✅ reset chủ đề cũ
                }}
              >
                <option value="">Lĩnh vực</option>
                {sidebarLinhVuc.map((lv) => (
                  <option key={lv.id} value={lv.id}>
                    {lv.name}
                  </option>
                ))}
              </select>

              <select
                value={chuDeId ?? ""}
                onChange={(e) => setChuDeId(Number(e.target.value))}
              >
                <option value="">Chủ đề</option>
                {chuDeList.map((cd) => (
                  <option key={cd.id} value={cd.id}>
                    {cd.tenChuDe}
                  </option>
                ))}
              </select>

              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <button
                className="btn-primary"
                disabled={uploading}
                onClick={() => submitUpload(token)}
              >
                {" "}
                {uploading ? "Đang tải..." : "Tải lên và xuất bản"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
