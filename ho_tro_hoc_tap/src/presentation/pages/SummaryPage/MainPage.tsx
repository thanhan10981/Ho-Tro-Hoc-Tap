import {
  FiFileText,
  FiGrid,
  FiEye,
  FiShare2,
  FiDownload
} from "react-icons/fi";

import type { SummaryItem } from "../../../shared/types/Summary.type";
import { useState, useEffect } from "react";
import { useSummaryCreate } from "../../../features/summary/useSummaryCreate";
import { getMyMonHoc } from "../../../shared/services/monHocService";
import SummaryPreviewPopup from "./SummaryPreviewPopup";
import SummaryDetailPopup from "./SummaryDetailPopup";
import type { SummaryPreviewData } from "./SummaryPreviewPopup";

import type { MonHocResponse } from "../../../shared/types/monHoc";
import type { PreviewMixParams } from "../../../shared/types/Summary.type";
interface Props {
  summaries: SummaryItem[];
  selected: number | null;
  setSelected: (id: number) => void;
  sortLabel: string;
  sortOptions: string[];
  handleSortChange: (v: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (v: "grid" | "list") => void;
  showCreateAI: boolean;
  setShowCreateAI: (v: boolean) => void;
  dropdownOpen: boolean;
  setDropdownOpen: (v: boolean) => void;
}

export default function MainPage(props: Props) {

const [summaryLength, setSummaryLength] = useState<"short" | "medium" | "long">("medium");
const [subject, setSubject] = useState<number | "">("");
const [customTitle, setCustomTitle] = useState("");

const [selectedDetail, setSelectedDetail] = useState<SummaryItem | null>(null);
const [highlightTuKhoa, setHighlightTuKhoa] = useState(false);
const [themViDu, setThemViDu] = useState(false);
const [taoCauHoiOnTap, setTaoCauHoiOnTap] = useState(false);

const { createPreview, confirm, regenerate, loading } = useSummaryCreate();



const [monHocs, setMonHocs] = useState<MonHocResponse[]>([]);
const [loadingMonHoc, setLoadingMonHoc] = useState(false);
const [errors, setErrors] = useState<string[]>([]);

const [previewData, setPreviewData] =
  useState<SummaryPreviewData | null>(null);

const [showPreview, setShowPreview] = useState(false);

const handleGenerate = async () => {
  const errorList: string[] = [];

  if (!hasFile && !hasText) {
    errorList.push("Bạn phải nhập văn bản hoặc tải lên ít nhất một file.");
  }

  if (subject === "") {
    errorList.push("Vui lòng chọn môn học trước khi tạo tóm tắt.");
  }

  if (errorList.length > 0) {
    setErrors(errorList);
    return;
  }

  // Nếu hợp lệ thì xóa lỗi cũ
  setErrors([]);

  const params: PreviewMixParams = {
    title: customTitle.trim() || undefined,
    noiDungText: hasText ? input.text : undefined,
    files: hasFile ? input.files : undefined,
    doDai: summaryLength,
    maMonHoc: subject as number,
    highlightTuKhoa,
    themViDu,
    taoCauHoiOnTap,
  };

  const data = await createPreview(params);

  setPreviewData(data);
  setShowPreview(true);
};

const handleRegenerateTitle = async () => {
  if (!previewData) return;

  try {
    const newTitle = await regenerate(previewData.noiDungTomTat);

    setPreviewData(prev =>
      prev
        ? {
            ...prev,
            tieuDe: newTitle,
          }
        : prev
    );
  } catch (e) {
    console.error("Regenerate title failed", e);
  }
};

const handleSave = async () => {
  if (!previewData || subject === "") return;

  try {
    await confirm({
      tieuDe: previewData.tieuDe,
      noiDungTomTat: previewData.noiDungTomTat,
      soTu: previewData.soTu,
      soTrang: previewData.soTrang,
      maMonHoc: subject,
      highlightTuKhoa,
      themViDu,
      taoCauHoiOnTap,
    });

    // đóng popup + form
    setShowPreview(false);
    props.setShowCreateAI(false);

  } catch (err) {
    console.error("Lưu tóm tắt thất bại", err);
  }
};



useEffect(() => {
  if (!props.showCreateAI) return;

  let mounted = true;

  const load = async () => {
    setLoadingMonHoc(true);
    try {
      const data = await getMyMonHoc();
      if (mounted) setMonHocs(data);
    } catch (err) {
      console.error("Load môn học thất bại", err);
      if (mounted) setMonHocs([]);
    } finally {
      if (mounted) setLoadingMonHoc(false);
    }
  };

  load();

  return () => {
    mounted = false;
  };
}, [props.showCreateAI]);


  type InputSource = {
    files: File[];
    text: string;
  };

  const [input, setInput] = useState<InputSource>({
    files: [],
    text: "",
  });

  const hasFile = input.files.length > 0;
  const hasText = input.text.trim().length > 0;


const validateInput = (newFiles: File[], currentText: string) => {
  const errorList: string[] = [];

  // 1. Kiểm tra text length
  if (currentText.length > 5000) {
    errorList.push("Nội dung văn bản không được vượt quá 5000 ký tự.");
  }

  // 2. Danh sách extension hợp lệ
  const allowedExtensions = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg"];

  newFiles.forEach(file => {
    const fileName = file.name.toLowerCase();

    const isValidExt = allowedExtensions.some(ext =>
      fileName.endsWith(ext)
    );

    if (!isValidExt) {
      errorList.push(
        `File "${file.name}" không đúng định dạng. Chỉ chấp nhận: PDF, DOC, DOCX, PNG, JPG.`
      );
    }
  });

  // 3. Kiểm tra tổng dung lượng
  const totalSize = newFiles.reduce((sum, file) => sum + file.size, 0);

  const maxSize = 20 * 1024 * 1024; // 20MB

  if (totalSize > maxSize) {
    errorList.push("Tổng dung lượng file không được vượt quá 20MB.");
  }

  setErrors(errorList);

  return errorList.length === 0;
};

  return (
    <main className="summary-section">
      <section className="summary-section">
      {props.showCreateAI ? (
        <div className="create-ai-box">
            <h2 className="ai-title">Tạo tóm tắt với AI</h2>
                        {errors.length > 0 && (
              <div className="ai-error-box">
                {errors.map((err, i) => (
                  <div key={i} className="ai-error">
                    ❗ {err}
                  </div>
                ))}
              </div>
            )}
            
            {/* ====== UPLOAD FILE ====== */}
            <div className="ai-upload-box">
              <label className="upload-dropzone">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  hidden
                  onChange={e => {
                    const files = Array.from(e.target.files ?? []);

                    const newFileList = [...input.files, ...files];

                    const isValid = validateInput(newFileList, input.text);

                    if (isValid) {
                      setInput(prev => ({
                        ...prev,
                        files: newFileList,
                      }));
                    }

                    e.target.value = "";
                  }}

                />

              <div className="upload-icon">⬆</div>
                  <p className="upload-title">
                    Kéo & thả tài liệu hoặc ảnh
                  </p>
                  <p className="upload-sub">
                    PDF / DOC / DOCX / JPG / PNG
                  </p>
              </label>

              {hasFile && (
                <ul className="file-preview">
                  {input.files.map((f, i) => (
                    <li key={i}>
                      <FiFileText /> {f.name}
                      <button
                        onClick={() => {
                          setInput(prev => ({
                            ...prev,
                            files: prev.files.filter((_, index) => index !== i)
                          }));

                          validateInput(
                            input.files.filter((_, index) => index !== i),
                            input.text
                          );
                        }}
                      >
                        ❌
                      </button>
                    </li>
                  ))}
                </ul>

              )}
            </div>



            {/* ====== NHẬP TEXT ====== */}
            <div className="ai-text-box">
              <label className="sub-label">
                Văn bản / mô tả thêm (không bắt buộc)
              </label>

              <textarea
                maxLength={5000}
                value={input.text}
                onChange={e => {
                  const text = e.target.value;

                  validateInput(input.files, text);

                  setInput(prev => ({ ...prev, text }));
                }}

                placeholder={`• Dán nội dung cần tóm tắt
            • Hoặc ghi chú thêm: mục tiêu, kiến thức ngoài, yêu cầu đặc biệt
            • Ví dụ: "Giải thích dễ hiểu cho sinh viên năm 1"`}
                className="ai-textarea"
              />

              <div className="text-footer">
                <span className={input.text.length > 4800 ? "warning" : ""}>
                  {input.text.length} / 5000 ký tự
                </span>
              </div>
            </div>

            {!hasFile && !hasText && (
              <div className="ai-hint">
                💡 Bạn có thể nhập văn bản bên dưới, hoặc tải tài liệu để AI tóm tắt
              </div>
            )}

            {/* ====== TIÊU ĐỀ ====== */}
            <div className="ai-row">
              <label>Tiêu đề tóm tắt (không bắt buộc)</label>
              <input
                type="text"
                className="ai-input"
                placeholder="VD: Chương 1 – Nhập môn AI"
                value={customTitle}
                onChange={e => setCustomTitle(e.target.value)}
                maxLength={150}
              />
            </div>


            {/* ====== ĐỘ DÀI ====== */}
            <div className="ai-row">
            <label>Độ dài tóm tắt</label>
            <select
            className="ai-combobox"
            value={summaryLength}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSummaryLength(e.target.value as "short" | "medium" | "long")
            }

            >
            <option value="short">Ngắn – Ý chính</option>
            <option value="medium">Vừa – Cân bằng</option>
            <option value="long">Dài – Chi tiết</option>
            </select>

            </div>
            
            {/* ====== CHỌN MÔN HỌC ====== */}
            <div className="ai-row">
            <label>Môn học</label>

            <select
              className="ai-combobox"
              value={subject}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const value = e.target.value;
                setSubject(value === "" ? "" : Number(value));
              }}
              disabled={loadingMonHoc}
            >

              <option value="">
                {loadingMonHoc ? "Đang tải môn học..." : "— Chọn môn học —"}
              </option>

              {monHocs.map(mon => (
                <option key={mon.maMonHoc} value={mon.maMonHoc}>
                  {mon.tenMonHoc}
                </option>
              ))}
            </select>
          </div>


            {/* ====== OPTIONS ====== */}
            <div className="ai-options">
              <label>
                <input
                  type="checkbox"
                  checked={highlightTuKhoa}
                  onChange={e => setHighlightTuKhoa(e.target.checked)}
                />
                Highlight từ khóa
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={themViDu}
                  onChange={e => setThemViDu(e.target.checked)}
                />
                Thêm ví dụ
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={taoCauHoiOnTap}
                  onChange={e => setTaoCauHoiOnTap(e.target.checked)}
                />
                Tạo câu hỏi ôn tập
              </label>
            </div>



            {/* ====== ACTION ====== */}
            <button
              className="ai-generate"
              disabled={loading || (!hasFile && !hasText)}
              onClick={handleGenerate}
            >
              {loading ? "⏳ Đang tạo..." : "✨ Tạo tóm tắt"}
            </button>

            <button
            className="ai-close"
            onClick={() => props.setShowCreateAI(false)}
            >
            Đóng
            </button>
        </div>
        ) : (
        <>
          {/* HEADER */}
          <div className="section-header">
            <h2>Danh sách tóm tắt</h2>

            <div
              className={`dropdown ${props.dropdownOpen ? "open" : ""}`}
              onClick={() => props.setDropdownOpen(!props.dropdownOpen)}
            >
              <button className="dropdown-btn">
                {props.sortLabel} <span className="arrow">▾</span>
              </button>

              <div className="dropdown-menu">
                {props.sortOptions.map(opt => (
                  <div
                    key={opt}
                    className="item"
                    onClick={() => props.handleSortChange(opt)}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            </div>

            <div className="view-switch">
              <button
                className={`switch-btn ${props.viewMode === "grid" ? "active" : ""}`}
                onClick={() => props.setViewMode("grid")}
              >
                <FiGrid size={18} />
              </button>

              <button
                className={`switch-btn ${props.viewMode === "list" ? "active" : ""}`}
                onClick={() => props.setViewMode("list")}
              >
                ☰
              </button>
            </div>
          </div>

          <div className={`summary-grid ${props.viewMode}`}>
            {props.summaries.map(item => (
              <div
                key={item.id}
                className={`summary-card ${props.selected === item.id ? "selected" : ""}`}
                onClick={() => {
                  props.setSelected(item.id);
                  setSelectedDetail(item);
                }}

              >
              <div className="card-icon blue">
                <FiFileText size={26} />
              </div>


                <div className="card-content">
                  <h3>{item.title}</h3>
                  {item.chapter && <p>{item.chapter}</p>}

                  <div className="tag-row">
                    <span className="tag blue-tag">{item.subject}</span>
                    <span className="time">{item.timeAgo}</span>
                  </div>
                  <div className="meta">
                    <span>{item.wordCount} từ</span>
                    •
                    <span>{item.pageCount} trang</span>

                    <div className="meta-actions">
                      <button><FiEye size={16} /></button>
                      <button><FiDownload size={16} /></button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <SummaryPreviewPopup
        open={showPreview}
        preview={previewData}
        onClose={() => setShowPreview(false)}
        onSave={handleSave}
        onRegenerateTitle={handleRegenerateTitle}
      />
      <SummaryDetailPopup
          open={!!selectedDetail}
          detail={selectedDetail ?? undefined}
          onClose={() => setSelectedDetail(null)}
        />
      </section>
    </main>
  );
}
