import "../../../styles/SummaryPreviewPopup.css";
import ReactMarkdown from "react-markdown";

export interface SummaryPreviewData {
  tieuDe: string;
  noiDungTomTat: string;
  soTu: number;
  soTrang: number;
}

interface Props {
  open: boolean;
  preview: SummaryPreviewData | null;
  onClose: () => void;      // bấm "Tạo lại"
  onSave: () => void;       // bấm "Lưu" (chưa gọi BE)
  onRegenerateTitle: () => void;
}

export default function SummaryPreviewPopup({
  open,
  preview,
  onClose,
  onSave,
  onRegenerateTitle,
}: Props) {
  if (!open || !preview) return null;

  return (
    <div className="preview-overlay">
      <div className="preview-modal">
            <h2 className="preview-title">
            👀 Xem trước tóm tắt
            </h2>

            <div className="preview-title-row">
            <input
                className="preview-input"
                value={preview.tieuDe}
                readOnly
            />

            <button
                className="btn-secondary"
                onClick={onRegenerateTitle}
            >
                🔄 Tạo lại tiêu đề
            </button>
            </div>


            <div className="preview-content markdown">
            <ReactMarkdown>
                {preview.noiDungTomTat}
            </ReactMarkdown>
            </div>

            <div className="preview-footer">
            <div className="preview-meta">
                <span>📄 {preview.soTrang} trang</span>
                <span>📝 {preview.soTu} từ</span>
            </div>

            <div className="preview-actions">
                <button className="btn-secondary" onClick={onClose}>
                ⬅ Tạo lại
                </button>
                <button className="btn-primary" onClick={onSave}>
                💾 Lưu
                </button>
            </div>
            </div>

      </div>
    </div>
  );
}
