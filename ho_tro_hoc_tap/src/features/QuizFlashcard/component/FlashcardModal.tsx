import { useState } from "react";
import "./FlashcardModal.css";
import ManualForm from "./ManualForm";
import AiForm from "./AiForm";

interface FlashcardModalProps {
  maBoFlashcard: number;
  onClose: () => void;
}

type TabType = "manual" | "ai";

export default function FlashcardModal({
  maBoFlashcard,
  onClose,
}: FlashcardModalProps) {

  const [tab, setTab] = useState<TabType>("manual");

  return (
    <div className="fc-overlay">
      <div className="fc-modal">
        {/* HEADER */}
        <div className="fc-header">
          <h2>Luyện Flashcards</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* TABS */}
        <div className="fc-tabs">
          <button
            className={tab === "manual" ? "active" : ""}
            onClick={() => setTab("manual")}
          >
            ✍️ Tạo thủ công
          </button>
          <button
            className={tab === "ai" ? "active" : ""}
            onClick={() => setTab("ai")}
          >
            🤖 Tạo bằng AI
          </button>
        </div>

        {/* CONTENT */}
        <div className="fc-content">
         {tab === "manual" ? (
            <ManualForm
              maBoFlashcard={maBoFlashcard}
              onSuccess={onClose}
            />
          ) : (
            <AiForm
                maBoFlashcard={maBoFlashcard}
                onSuccess={onClose}
              />

          )}

        </div>
      </div>
    </div>
  );
}
