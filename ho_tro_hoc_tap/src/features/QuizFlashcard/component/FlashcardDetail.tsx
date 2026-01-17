import { useEffect, useState } from "react";
import FlashcardModal from "./FlashcardModal";
import "./FlashcardDetail.css";

interface Flashcard {
  maFlashcard: number;
  matTruoc: string;
  matSau: string;
}

interface FlashcardSet {
  maBoFlashcard: number;
  tenBo: string;
}

interface Props {
  flashcardSet: FlashcardSet;
  onClose: () => void;
}

export default function FlashcardDetail({ flashcardSet, onClose }: Props) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [flip, setFlip] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const token = localStorage.getItem("token");
  /* ======================
     FETCH FLASHCARDS
  ====================== */
  const fetchCards = async () => {
    const res = await fetch(
      `http://localhost:9090/api/flashcards/by-set/${flashcardSet.maBoFlashcard}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.ok) {
      const data: Flashcard[] = await res.json();
      setCards(data);
      setIndex(0);
      setFlip(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [flashcardSet.maBoFlashcard]);

  const current = cards[index] || null;

  return (
    <div className="fc-overlay">
      <div className="fc-detail">
        {/* HEADER */}
        <div className="fc-detail-header">
          <h2>{flashcardSet.tenBo}</h2>

          <span className="fc-count">{cards.length} flashcard</span>

          <div className="fc-header-actions">
            <button
              className="fc-add-btn"
              onClick={() => setOpenAdd(true)}
              title="Thêm flashcard"
            >
              ➕
            </button>

            <button className="fc-close-btn" onClick={onClose} title="Đóng">
              ✕
            </button>
          </div>
        </div>

        {/* EMPTY STATE */}
        {cards.length === 0 && (
          <div className="fc-empty">
            <p>Chưa có flashcard nào</p>
            <div className="fc-actions">
              <button onClick={() => setOpenAdd(true)}>✍️ Thêm thủ công</button>
              <button onClick={() => setOpenAdd(true)}>🤖 Thêm bằng AI</button>
            </div>
          </div>
        )}

        {/* FLASHCARD VIEW */}
        {cards.length > 0 && current && (
          <>
            <div
              className={`fc-card ${flip ? "flip" : ""}`}
              onClick={() => setFlip(!flip)}
            >
              <div className="fc-front">{current.matTruoc}</div>
              <div className="fc-back">{current.matSau}</div>
            </div>

            {/* NAVIGATION */}
            <div className="fc-nav">
              <button
                disabled={index === 0}
                onClick={() => {
                  setIndex(index - 1);
                  setFlip(false);
                }}
              >
                ◀
              </button>

              <span>
                {index + 1} / {cards.length}
              </span>

              <button
                disabled={index === cards.length - 1}
                onClick={() => {
                  setIndex(index + 1);
                  setFlip(false);
                }}
              >
                ▶
              </button>
            </div>
          </>
        )}
      </div>

      {/* ADD FLASHCARD MODAL */}
      {openAdd && (
        <FlashcardModal
          maBoFlashcard={flashcardSet.maBoFlashcard}
          onClose={() => {
            setOpenAdd(false);
            fetchCards();
          }}
        />
      )}
    </div>
  );
}
