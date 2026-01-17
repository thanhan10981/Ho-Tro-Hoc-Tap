import { FiDownload, FiPrinter } from "react-icons/fi";
import type { SummaryItem } from "../../../shared/types/Summary.type";
import ReactMarkdown from "react-markdown";
import { exportPdf, exportDocx } from "../../../shared/services/summary.Service";


interface Props {
  open: boolean;
  detail?: SummaryItem;
  onClose: () => void;
}

export default function SummaryDetailPopup({ open, detail, onClose }: Props) {
  if (!open || !detail) return null;

  const handleExportPdf = async () => {
  try {
    const response = await exportPdf(detail.id);

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", `${detail.title || "tom_tat"}.pdf`);

    document.body.appendChild(link);
    link.click();

    link.remove();
  } catch (err) {
    alert("Không thể xuất PDF!");
    console.error(err);
  }
};

const handleExportDocx = async () => {
  try {
    const response = await exportDocx(detail.id);

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", `${detail.title || "tom_tat"}.docx`);

    document.body.appendChild(link);
    link.click();

    link.remove();
  } catch (err) {
    alert("Không thể xuất DOCX!");
    console.error(err);
  }
};

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-modal detail-popup" onClick={e => e.stopPropagation()}>

        <div className="detail-content-wrapper">

          {/* HEADER */}
          <div className="detail-header">
            <h2>{detail.title}</h2>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>

          {/* FILE INFO */}
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

            {/* CONTENT */}
            <div className="detail-text markdown">
            <h4>Tóm tắt nội dung:</h4>

            <ReactMarkdown>
                {detail.description}
            </ReactMarkdown>

            <h4>Từ khóa:</h4>
            <div className="keyword-list">
                {detail.keywords.map((kw, i) => (
                <span key={i} className="keyword">{kw}</span>
                ))}
            </div>
            </div>


          {/* ACTIONS */}
          <div className="detail-bottom-actions">
            <button onClick={handleExportPdf}>
              <FiDownload size={15} /> Xuất PDF
            </button>

            <button onClick={handleExportDocx}>
              <FiPrinter size={15} /> Xuất DOCX
            </button>
          </div>



        </div>
      </div>
    </div>
  );
}
