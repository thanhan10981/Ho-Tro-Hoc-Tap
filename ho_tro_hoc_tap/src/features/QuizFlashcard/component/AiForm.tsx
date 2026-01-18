import { useState } from "react";

interface Props {
  maBoFlashcard: number;
  onSuccess?: () => void; // 👈 thêm callback
}

export default function AiForm({ maBoFlashcard, onSuccess }: Props) {
  const [content, setContent] = useState("");
  const [amount, setAmount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!content.trim()) {
      setMessage("⚠️ Vui lòng nhập nội dung học tập");
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:9090/api/flashcards/ai",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            maBoFlashcard,
            content,
            amount,
          }),
        }
      );

      if (!res.ok) throw new Error("Tạo flashcard bằng AI thất bại");

      setMessage("🎉 AI đã tạo flashcard thành công");

      // ⏳ đợi 0.8s cho user thấy thông báo rồi đóng
      setTimeout(() => {
        onSuccess?.();
      }, 800);

    } catch (err: any) {
      setMessage("❌ " + (err.message || "Có lỗi xảy ra"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fc-form">
      <textarea
        placeholder="Nhập nội dung học tập cho AI (VD: Stack trong cấu trúc dữ liệu)..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
      />

      <input
        type="number"
        min={1}
        max={50}
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        disabled={loading}
      />

      <button
        className="primary ai"
        disabled={loading}
        onClick={handleGenerate}
      >
        {loading ? "🤖 AI đang tạo..." : "🤖 Tạo Flashcard bằng AI"}
      </button>

      {/* THÔNG BÁO */}
      {message && (
        <div className="fc-message">
          {message}
        </div>
      )}
    </div>
  );
}
