import { useState } from "react";

interface Props {
  maBoFlashcard: number;
  onSuccess?: () => void;
}

export default function ManualForm({ maBoFlashcard, onSuccess }: Props) {
  const [matTruoc, setMatTruoc] = useState("");
  const [matSau, setMatSau] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!matTruoc || !matSau) {
      alert("Vui lòng nhập đầy đủ nội dung");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:9090/api/flashcards/manual",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            maBoFlashcard,
            matTruoc,
            matSau,
          }),
        }
      );

      if (!res.ok) throw new Error("Tạo flashcard thất bại");

      setMatTruoc("");
      setMatSau("");

      onSuccess?.();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fc-form">
      <textarea
        placeholder="Mặt trước flashcard..."
        value={matTruoc}
        onChange={(e) => setMatTruoc(e.target.value)}
      />

      <textarea
        placeholder="Mặt sau flashcard..."
        value={matSau}
        onChange={(e) => setMatSau(e.target.value)}
      />

      <button
        className="primary"
        disabled={loading}
        onClick={handleSubmit}
      >
        {loading ? "Đang lưu..." : "Lưu Flashcard"}
      </button>
    </div>
  );
}
