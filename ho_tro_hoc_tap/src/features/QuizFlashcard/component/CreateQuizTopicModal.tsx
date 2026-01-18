import { useEffect, useState } from "react";
import "./CreateQuizTopicModal.css";
import { getMyMonHoc, type MonHoc } from "../api/monHocApi";
import { createQuiz } from "../api/quizApi";

type Props = {
  onClose: () => void;
  onSubmit?: (data: QuizTopicForm) => void;
  onNotify: (message: string, type: ToastType) => void;
};
type ToastType = "success" | "error";
export type QuizTopicForm = {
  tenChuDe: string;
  monHoc: string;
  moTa: string;
};

export default function CreateQuizTopicModal({ onClose, onSubmit,onNotify, }: Props) {
  const [monHocList, setMonHocList] = useState<MonHoc[]>([]);
  const [loadingMonHoc, setLoadingMonHoc] = useState<boolean>(false);
  const [maMonHoc, setMaMonHoc] = useState("");
  const [form, setForm] = useState<QuizTopicForm>({
    tenChuDe: "",
    monHoc: "",
    moTa: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
  if (!form.tenChuDe || !maMonHoc) {
    onNotify("Vui lòng nhập đầy đủ thông tin", "error");
    return;
  }

  try {
    await createQuiz({
      maMonHoc: Number(maMonHoc),
      tenQuiz: form.tenChuDe,
      moTa: form.moTa,
    });

    onNotify("🎉 Tạo quiz thành công", "success");

    setTimeout(() => {
      onSubmit?.(form);
      onClose();
    }, 500);
  } catch (err) {
    console.error(err);
    onNotify("❌ Tạo quiz thất bại", "error");
  }
};


  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      monHoc: maMonHoc,
    }));
  }, [maMonHoc]);

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
  <>
    <div className="modal-overlay">
      <div className="modal quiz-theme">
        <h2>Tạo Chủ Đề Quiz</h2>

        <label>Tên chủ đề *</label>
        <input
          name="tenChuDe"
          value={form.tenChuDe}
          onChange={handleChange}
          placeholder="VD: Cấu trúc dữ liệu - Stack"
        />

        <label>Môn học *</label>
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

        <label>Mô tả</label>
        <textarea
          name="moTa"
          value={form.moTa}
          onChange={handleChange}
          placeholder="Mô tả ngắn về chủ đề quiz..."
        />

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Hủy
          </button>
          <button className="btn-submit" onClick={handleSubmit}>
            Tạo Quiz
          </button>
        </div>
      </div>
    </div>

    
  </>
);

}
