import { useEffect, useState } from "react";
import "./CreateFlashcardSetModal.css";
import { createFlashcardSet } from "../api/flashcardSetApi";
import { getMyMonHoc, type MonHoc } from "../api/monHocApi";

interface CreateFlashcardSetModalProps {
  onClose: () => void;
}

export default function CreateFlashcardSetModal({
  onClose,
}: CreateFlashcardSetModalProps) {
  const [tenBo, setTenBo] = useState("");
  const [maMonHoc, setMaMonHoc] = useState("");
  const [moTa, setMoTa] = useState("");
  const [loading, setLoading] = useState(false);
  const [monHocList, setMonHocList] = useState<MonHoc[]>([]);
  const [loadingMonHoc, setLoadingMonHoc] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async () => {
  if (!tenBo || !maMonHoc) {
    setToast({
      type: "error",
      message: "Vui lòng nhập tên bộ và chọn môn học",
    });
    return;
  }

  try {
    setLoading(true);

    const result = await createFlashcardSet({
      tenBo,
      maMonHoc: Number(maMonHoc),
      moTa,
    });

    console.log("Tạo bộ flashcard thành công:", result);

    setToast({
      type: "success",
      message: "Tạo bộ flashcard thành công ",
    });

    // đóng modal sau 1.5s để người dùng thấy toast
    setTimeout(() => {
      onClose();
    }, 1500);

  } catch (error: any) {
    setToast({
      type: "error",
      message: error.message || "Tạo bộ flashcard thất bại",
    });
  } finally {
    setLoading(false);

    // auto hide toast sau 3s
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }
};

  useEffect(() => {
    const fetchMonHoc = async () => {
      try {
        setLoadingMonHoc(true);
        const data = await getMyMonHoc();
        setMonHocList(data);
      } catch (err) {
        console.error(err);
        alert("Không tải được môn học");
      } finally {
        setLoadingMonHoc(false);
      }
    };

    fetchMonHoc();
  }, []);

  return (
    <div className="fcs-overlay">
      <div className="fcs-modal">
        <div className="fcs-header">
          <h2>Tạo chủ đề Flashcard</h2>
          <button className="fcs-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="fcs-form">
          <label>Tên chủ đề</label>
          <input
            type="text"
            value={tenBo}
            onChange={(e) => setTenBo(e.target.value)}
            placeholder="VD: Stack cơ bản"
          />

          <label>Môn học</label>
          <select
            value={maMonHoc}
            onChange={(e) => setMaMonHoc(e.target.value)}
            disabled={loadingMonHoc}
          >
            <option value="">-- Chọn môn học --</option>

            {monHocList.map((mh) => (
              <option key={mh.maMonHoc} value={mh.maMonHoc}>
                {mh.tenMonHoc}
              </option>
            ))}
          </select>

          <label>Mô tả (không bắt buộc)</label>
          <textarea
            value={moTa}
            onChange={(e) => setMoTa(e.target.value)}
            placeholder="Mô tả ngắn cho bộ flashcard..."
          />

          <button
            className="fcs-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang tạo..." : "Tạo chủ đề"}
          </button>
        </div>
      </div>
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

    </div>
  );
}
