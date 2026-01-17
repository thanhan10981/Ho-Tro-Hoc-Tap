import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../features/auth/context/useAuth";
import "../../../styles/dashboard.css";
import { getToken } from "../../../features/auth/util/token";

type AIItem = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
};

type AIResponse = {
  greeting: string;
  summary: string;
  items: AIItem[];
  actions: string[];
};
type ChatMessage = {
  id: string;
  question: string;
  response: AIResponse;
  createdAt: number;
};
type EventItem = {
  maSuKien: number;
  tieuDe: string;
  moTa: string;
  thoiGianBatDau: string;
  mucDoUuTien: string; // "quan_trong" | "binh_thuong"
  diaDiem: string;
};


const DashboardPage = () => {
  const { user } = useAuth();
  const STORAGE_KEY = `ai_chat_history_${user?.email}`;
  const [question, setQuestion] = useState("");

  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const chatRef = useRef<HTMLDivElement>(null);

  const lastActions =
    chatHistory.length > 0
      ? chatHistory[chatHistory.length - 1].response.actions ?? []
      : [];
  useEffect(() => {
    if (!chatRef.current) return;

    chatRef.current.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory, loading]);

  useEffect(() => {
    if (!STORAGE_KEY) return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setChatHistory(JSON.parse(saved));
    }
  }, [STORAGE_KEY]);
  const token = getToken();
  const askAI = async () => {
    if (!question.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("http://localhost:9090/api/assistant/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: question }),
      });

      const data: AIResponse = await res.json();

      const newChat: ChatMessage = {
        id: crypto.randomUUID(),
        question,
        response: data,
        createdAt: Date.now(),
      };

      setChatHistory((prev) => {
        const updated = [...prev, newChat];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      setQuestion("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const formatEventTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const hhmm = `${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    if (isToday) return `Hôm nay ${hhmm}`;
    if (isTomorrow) return `Ngày mai ${hhmm}`;

    return `T${date.getDay() + 1} • ${hhmm}`;
  };
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    if (!token) return;

    const fetchEvents = async () => {
    try {
      const res = await fetch(
        "http://localhost:9090/api/lich-hoc/upcoming",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch events error:", err);
      setEvents([]);
    }
  };


    fetchEvents();
  }, [token]);

import { useEffect, useState } from "react";
import type { LichHocUpcoming } from "../../../shared/types/lichHoc";
import { getUpcomingEvents } from "../../../shared/services/summary.Service";

const DashboardPage = () => {
  const [events, setEvents] = useState<LichHocUpcoming[]>([]);
useEffect(() => {
  getUpcomingEvents()
    .then(setEvents)
    .catch(err => console.error("Lỗi load sự kiện:", err));
}, []);
const getPriorityClass = (priority: string) => {
  switch (priority) {
    case "khan_cap":
      return "urgent";

    case "quan_trong":
      return "important";

    case "binh_thuong":
    default:
      return "normal";
  }
};

const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case "khan_cap":
      return "KHẨN CẤP";

    case "quan_trong":
      return "QUAN TRỌNG";

    case "binh_thuong":
    default:
      return "BÌNH THƯỜNG";
  }
};


  return (
    <div className="dashboard">
      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <h1>{user ? user.hoTen : "?"}! 👋</h1>
          <p>Hôm nay bạn muốn học gì?</p>

          <div className="search-row">
            <div className="search-box">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Đặt câu hỏi cho AI..."
              />
              <img src="/search.svg" className="search-icon" />
            </div>

            <button className="ask-ai-btn" onClick={askAI} disabled={loading}>
              {loading ? "Đang hỏi..." : "Hỏi AI"}
            </button>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-circle"></div>
          <img src="/logo_ai.svg" className="hero-img" />
        </div>
      </section>
      {/* STAT CARDS */}
      <section className="stats">
        <div className="stat-card">
          <div className="stat-top">
            <h3>Môn học đang theo</h3>
            <div className="stat-icon blue">
              <img src="/icons/book.svg" />
            </div>
          </div>
          <div className="stat-value">8</div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <h3>Deadline sắp tới</h3>
            <div className="stat-icon orange">
              <img src="/icons/bell.svg" />
            </div>
          </div>
          <div className="stat-value orange">5</div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <h3>Quiz hoàn thành</h3>
            <div className="stat-icon green">
              <img src="/icons/check.svg" />
            </div>
          </div>
          <div className="stat-value green">85%</div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <h3>Điểm yếu cần cải thiện</h3>
            <div className="stat-icon red">
              <img src="/icons/warning.svg" />
            </div>
          </div>
          <div className="stat-value red">3</div>
        </div>
      </section>

      {/* ASSISTANT + SỰ KIỆN (2 CỘT) */}
      <section className="assistant-events">
        {/* CỘT 1 — AI ASSISTANT */}
        <div className="assistant">
          <div className="assistant-header">
            <div className="icon-blue">
              <img src="/logo_ai.svg" />
            </div>
            <h2>AI Assistant</h2>
          </div>

          <div className="assistant-input">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Đặt câu hỏi cho AI..."
            />
            <button onClick={askAI} disabled={loading}>
              {loading ? "Đang hỏi..." : "Hỏi AI"}
            </button>
          </div>

          <div className="assistant-suggest">
            {Array.isArray(lastActions) &&
              lastActions.map((action: string) => (
                <button
                  key={action}
                  onClick={() => {
                    setQuestion(action.replace(/^[^\w]+/, ""));
                    setTimeout(() => askAI(), 0);
                  }}
                >
                  {action}
                </button>
              ))}
          </div>

          <div className="assistant-chat" ref={chatRef}>
            {chatHistory.map((chat) => (
              <div key={chat.id}>
                <div className="user-msg">{chat.question}</div>

                <div className="ai-msg">
                  <h4>🤖 AI StudyBuddy</h4>
                  <p>{chat.response.summary}</p>

                  {chat.response.items?.length > 0 && (
                    <ul>
                      {chat.response.items.map((item) => (
                        <li key={item.id}>{item.title}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}

            {loading && <div className="ai-msg">🤖 AI đang suy nghĩ...</div>}
          </div>
        </div>

        {/* === UPCOMING EVENTS === */}
        <section className="events-card">
  <h2 className="events-title">Sự kiện sắp tới</h2>

  {events.map((event) => {
    const priorityMap: Record<string, string> = {
      quan_trong: "important",
      binh_thuong: "normal",
    };
  {events.length === 0 && (
    <p style={{ padding: "10px" }}>Không có sự kiện nào trong tuần tới</p>
  )}

  {events.map((event, index) => {
    const css = getPriorityClass(event.mucDoUuTien);

    return (
      <div key={index} className={`event-item ${css}`}>
        <div className={`event-line ${css}`}></div>

        <div className="event-body">
          <div className="event-top">
            <span className={`badge ${css}`}>
              {getPriorityLabel(event.mucDoUuTien)}
            </span>

            <span className="event-time">
              {event.thoiGianKetThuc}
            </span>
          </div>

          <h3 className="event-name">{event.tieuDe}</h3>

          <p className="event-desc">
            {event.diaDiem
              ? `${event.diaDiem} • ${event.moTa ?? ""}`
              : event.moTa}
          </p>
        </div>
      </div>
    );
  })}
</section>

    const priorityClass =
      priorityMap[event.mucDoUuTien] ?? "normal";

    return (
      <div
        key={event.maSuKien}
        className={`event-item ${priorityClass}`}
      >
        <div className={`event-line ${priorityClass}`} />

    </section>
<div className="dashboard-grid">
{/* RECENT ACTIVITIES */}
<section className="recent-activity">
  <h2>Hoạt động học tập gần đây</h2>

        <div className="event-body">
          <div className="event-top">
            <span className={`badge ${priorityClass}`}>
              {event.mucDoUuTien}
            </span>

            <span className="event-time">
              {formatEventTime(event.thoiGianBatDau)}
            </span>
          </div>

          <h3 className="event-name">{event.tieuDe}</h3>
          <p className="event-desc">{event.moTa || "Không có mô tả"}</p>
        </div>
      </div>
    );
  })}
</section>

      </section>
      <div className="dashboard-grid">
        {/* RECENT ACTIVITIES */}
        <section className="recent-activity">
          <h2>Hoạt động học tập gần đây</h2>

          <div className="activity-item">
            <div className="activity-left">
              <div className="activity-icon blue">
                <img src="/icons/document.svg" />
              </div>
              <div>
                <p className="activity-title">Tóm tắt: Thuật toán sắp xếp</p>
                <span className="activity-desc">
                  Cấu trúc dữ liệu • 2 giờ trước
                </span>
              </div>
            </div>
            <button className="activity-btn blue">Xem tóm tắt</button>
          </div>

          <div className="activity-item">
            <div className="activity-left">
              <div className="activity-icon green">
                <img src="/icons/check.svg" />
              </div>
              <div>
                <p className="activity-title">Quiz: Cơ sở dữ liệu quan hệ</p>
                <span className="activity-desc">
                  Điểm: 8.5/10 • 1 ngày trước
                </span>
              </div>
            </div>
            <button className="activity-btn green">Xem kết quả</button>
          </div>

          <div className="activity-item">
            <div className="activity-left">
              <div className="activity-icon purple">
                <img src="/icons/layers.svg" />
              </div>
              <div>
                <p className="activity-title">Flashcard: Từ vựng tiếng Anh</p>
                <span className="activity-desc">
                  Tiến độ: 45/60 thẻ • 3 ngày trước
                </span>
              </div>
            </div>
            <button className="activity-btn purple">Tiếp tục học</button>
          </div>
        </section>

        {/* RIGHT: Smart Suggestions */}
        <section className="smart-suggest">
          <h2>Gợi ý thông minh</h2>

          {/* Gợi ý 1 */}
          <div className="suggest-card danger">
            <div className="suggest-icon red">
              <img src="/icons/alert.svg" />
            </div>
            <div className="suggest-content">
              <p className="suggest-title">Bạn nên ôn lại</p>
              <span className="suggest-desc">
                Dynamic Programming – điểm yếu trong môn Cấu trúc dữ liệu
              </span>
              <button className="suggest-btn red">Tạo Quiz</button>
            </div>
          </div>

          {/* Gợi ý 2 */}
          <div className="suggest-card warning">
            <div className="suggest-icon orange">
              <img src="/icons/time.svg" />
            </div>
            <div className="suggest-content">
              <p className="suggest-title">Deadline sắp tới</p>
              <span className="suggest-desc">
                Bài tập Cơ sở dữ liệu — còn 6 tiếng
              </span>
              <button className="suggest-btn orange">Xem chi tiết</button>
            </div>
          </div>

          {/* Gợi ý 3 */}
          <div className="suggest-card info">
            <div className="suggest-icon blue">
              <img src="/icons/info.svg" />
            </div>
            <div className="suggest-content">
              <p className="suggest-title">Gợi ý tóm tắt</p>
              <span className="suggest-desc">
                Slide mới từ môn Trí tuệ nhân tạo
              </span>
              <button className="suggest-btn blue">Tóm tắt ngay</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
