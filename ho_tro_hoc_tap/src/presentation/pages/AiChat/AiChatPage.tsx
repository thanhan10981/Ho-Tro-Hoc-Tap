import "../../../styles/AiChat.css";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";


interface Conversation {
  id: number;
  createdAt: string;
}
interface Message {
  sender: "ai" | "user";
  text: string;
}

export default function AiChatPage() {
const [conversationId, setConversationId] = useState<number | null>(null);
const [conversations, setConversations] = useState<Conversation[]>([]);

const [messages, setMessages] = useState<Message[]>([
  {
    sender: "ai",
    text: `Xin chào! Tôi là **AI StudyBuddy**, trợ lý học tập thông minh của bạn.`
  }
]);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
const loadMessages = async (id: number) => {
  const res = await fetch(
    `http://localhost:9090/api/chat/conversation/${id}`
  );
  const data = await res.json();

  if (data.length === 0) {
    setMessages([
      { sender: "ai", text: "Xin chào! Tôi là AI StudyBuddy." }
    ]);
    return;
  }

  setMessages(
    data.map((m: any) => ({
      sender: m.sender === "nguoi_dung" ? "user" : "ai",
      text: m.content
    }))
  );
};

const createConversation = async () => {
  const res = await fetch("http://localhost:9090/api/chat/conversation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: 1,
      monHocId: 1
    })
  });

  const conv = await res.json();

  const mappedConv = {
    id: conv.id,
    createdAt: conv.createdAt
  };

  setConversations(prev => [mappedConv, ...prev]);
  setConversationId(mappedConv.id);
  setMessages([]);
};


useEffect(() => {
  const init = async () => {
    const res = await fetch(
      "http://localhost:9090/api/chat/conversation/user/1"
    );
    const data = await res.json();

    const mapped = data.map((c: any) => ({
      id: c.id,
      createdAt: c.createdAt
    }));

    setConversations(mapped);

    if (mapped.length > 0) {
      setConversationId(mapped[0].id);
      loadMessages(mapped[0].id);
    }
  };

  init();
}, []);


const sendMessage = async () => {
  if (!input.trim() || loading || !conversationId) return;

  const question = input;

  setMessages(prev => [
    ...prev,
    { sender: "user", text: question },
    { sender: "ai", text: "_⏳ AI đang suy nghĩ..._" }
  ]);

  setInput("");
  setLoading(true);

  try {
    const res = await fetch("http://localhost:9090/api/chat/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId,
        message: question
      })
    });

    const text = await res.text();

    setMessages(prev => {
      const copy = [...prev];
      copy[copy.length - 1] = { sender: "ai", text };
      return copy;
    });

  } catch {
    setMessages(prev => {
      const copy = [...prev];
      copy[copy.length - 1] = {
        sender: "ai",
        text: "Không kết nối được AI"
      };
      return copy;
    });
  } finally {
    setLoading(false);
  }
};
const cleanMarkdown = (text: string) =>
  text
    .split("\n")
    .filter(line => line.trim() !== "") // ❗ bỏ dòng trắng
    .join("\n");

return (
        <div className="ai-chat-page">

            {/* ===== MAIN LAYOUT 3 CỘT ===== */}
            <div className="ai-chat-page layout">


                {/* ========== LEFT SIDEBAR ========== */}
                <aside className="sidebar">
                    <h2 className="title">Hỏi đáp AI</h2>
                    <p className="subtitle">Đặt câu hỏi và nhận câu trả lời thông minh từ trí tuệ nhân tạo</p>

                    <label className="label">Tất cả môn học</label>
                    <select className="select">
                        <option>Toán học</option>
                        <option>Vật lý</option>
                        <option>AI</option>
                        <option>Hóa học</option>
                    </select>

                    <div className="chat-list">
                        {conversations.map(c => (
                            <div
                            key={c.id}
                            className={`chat-item ${c.id === conversationId ? "active" : ""}`}
                            onClick={() => {
                                setConversationId(c.id);
                                loadMessages(c.id);
                            }}
                            >
                            <div className="chat-icon blue">💬</div>
                            <div>
                                <p className="chat-title">
                                Cuộc trò chuyện #{c.id}
                                </p>
                                <span className="chat-sub">
                                {new Date(c.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            </div>
                        ))}
                    </div>

                </aside>

                {/* ========== CHAT MAIN ========== */}
                <main className="chat">

                    <div className="chat-header">
                        <h2>AI StudyBuddy</h2>
                        <div className="header-actions">
                            <button className="btn primary" onClick={createConversation}>
                                + Cuộc trò chuyện mới
                                </button>
                        </div>
                    </div>

                    <div className="messages">
                        {messages.map((msg, i) => (
                            <div className={`msg ${msg.sender}`}>
                                {msg.sender === "ai" && (
                                    <div className="avatar ai">
                                    <img src="/logo_ai.svg" alt="AI" />
                                    </div>
                                )}

                                <div className={`bubble ${msg.sender}`}>
                                    <ReactMarkdown
                                    remarkPlugins={[remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                    >
                                    {msg.text}
                                    </ReactMarkdown>
                                </div>

                                {msg.sender === "user" && (
                                    <div className="avatar user">NT</div>
                                )}
                                </div>

                        ))}
                    </div>

                    <div className="chat-input">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && sendMessage()}
                            placeholder="Nhập câu hỏi của bạn..."
                            disabled={loading}
                        />
                        <button
                            className="send-btn"
                            onClick={sendMessage}
                            disabled={loading || !conversationId}
                            >
                            Gửi
                            </button>

                    </div>
                </main>

                {/* RIGHT SIDEBAR */}
                <aside className="rightbar">

                    <div className="card">
                        <h3 className="card-title">Tuỳ chọn chủ đề</h3>

                        <label className="label">Môn học</label>
                        <select className="select">
                            <option>Chọn môn học</option>
                        </select>

                        <label className="label">Mức độ chi tiết</label>
                        <div className="detail-buttons">
                            <button className="btn small active">Đơn giản</button>
                            <button className="btn small">Chi tiết</button>
                        </div>

                        <label className="label">Ngôn ngữ trả lời</label>
                        <select className="select">
                            <option>Tiếng Việt</option>
                            <option>English</option>
                        </select>
                    </div>

                    <div className="card">
                        <h3 className="card-title">Đề xuất câu hỏi</h3>

                        <div className="tag-item">Giải thích định lý Pythagorean <span className="tag blue">Toán</span></div>
                        <div className="tag-item">Phân biệt tốc độ và vận tốc <span className="tag green">Vật lý</span></div>
                        <div className="tag-item">Cách cân bằng phương trình hóa học <span className="tag yellow">Hóa học</span></div>
                        <div className="tag-item">Thuật toán sắp xếp nào hiệu quả nhất? <span className="tag green">CNTT</span></div>
                        <div className="tag-item">Phân biệt AI, ML và Deep Learning <span className="tag purple">AI</span></div>
                    </div>

                    <div className="card">
                        <h3 className="card-title">Tài liệu đã tải lên</h3>

                        <div className="file-item">calculus_notes.pdf <span className="remove">✕</span></div>
                        <div className="file-item">formula_image.jpg <span className="remove">✕</span></div>

                        <button className="btn dashed">+ Thêm tài liệu</button>
                    </div>

                </aside>

            </div>
        </div>
    );
}
