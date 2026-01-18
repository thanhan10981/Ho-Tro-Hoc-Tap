import "../../../styles/AiChat.css";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { useAuth } from "../../../features/auth/context/useAuth";

interface Conversation {
  id: number;
  createdAt: string;
}
interface Message {
  sender: "ai" | "user";
  text: string;
}

export default function AiChatPage() {
const { user} = useAuth();
const [conversationId, setConversationId] = useState<number | null>(null);
const [conversations, setConversations] = useState<Conversation[]>([]);
const [pendingFile, setPendingFile] = useState<File | null>(null);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteId, setDeleteId] = useState<number | null>(null);
const [toast, setToast] = useState<{
  message: string;
  type: "error" | "success";
} | null>(null);
const showToast = (message: string, type: "error" | "success" = "error") => {
  setToast({ message, type });
  setTimeout(() => setToast(null), 3000);
};
const authFetch = (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
};

const [messages, setMessages] = useState<Message[]>([
  {
    sender: "ai",
    text: `Xin chào! Tôi là **AI StudyBuddy**, trợ lý học tập thông minh của bạn.`
  }
]);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
const loadMessages = async (id: number) => {
  const res = await authFetch(
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
  const res = await authFetch(
    "http://localhost:9090/api/chat/conversation",
    { method: "POST" }
  );

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
    const res = await authFetch(
      "http://localhost:9090/api/chat/conversation/user"
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
  if (loading || !conversationId) return;
  if (!input.trim() && !pendingFile) return;

  const userInput = input.trim();   
  const file = pendingFile;

  setInput("");
  setLoading(true);

  setMessages(prev => [
    ...prev,
    {
      sender: "user",
      text: file
        ? ` ${file.name}\nCâu hỏi: ${
            userInput || "Hãy phân tích nội dung tài liệu này"
          }`
        : userInput
    },
    { sender: "ai", text: "__loading__" }

  ]);

  try {
    let aiText = "";

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("conversationId", conversationId.toString());
      formData.append(
        "question",
        userInput || "Hãy phân tích nội dung tài liệu này"
      );

      const res = await authFetch(
        "http://localhost:9090/api/chat/upload",
        { method: "POST", body: formData }
      );

      aiText = await res.text();
      setPendingFile(null); 
    }

    else {
      const res = await authFetch(
        "http://localhost:9090/api/chat/message",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId,
            message: userInput,
          }),
        }
      );

      aiText = await res.text();
    }

    setMessages(prev => {
      const copy = [...prev];
      copy[copy.length - 1] = { sender: "ai", text: aiText };
      return copy;
    });

  } catch (err) {
    setMessages(prev => {
      const copy = [...prev];
      copy[copy.length - 1] = {
        sender: "ai",
        text: "Không xử lý được yêu cầu"
      };
      return copy;
    });
  } finally {
    setLoading(false);
  }
};

const deleteConversation = async () => {
  if (!deleteId) return;

  await fetch(`http://localhost:9090/api/chat/conversation/${deleteId}`, {
    method: "DELETE"
  });

  setConversations(prev => prev.filter(c => c.id !== deleteId));

  if (conversationId === deleteId) {
    setConversationId(null);
    setMessages([
      { sender: "ai", text: "Đoạn chat đã được xóa." }
    ]);
  }

  setShowDeleteModal(false);
  setDeleteId(null);
};
 const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg"
];


const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!ALLOWED_TYPES.includes(file.type)) {
    showToast("Chỉ hỗ trợ PDF, Word hoặc ảnh (PNG, JPG)", "error");
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    showToast("File tối đa 10MB", "error");
    return;
  }

  setPendingFile(file);     
};

return (
        <div className="ai-chat-page">
            <div className="ai-chat-page layout">
                <aside className="sidebar">
                    <h2 className="title">Hỏi đáp AI</h2>
                    <p className="subtitle">Đặt câu hỏi và nhận câu trả lời thông minh từ trí tuệ nhân tạo</p>

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
                            <div className="chat-left">
                              <div className="chat-avatar">💬</div>

                              <div className="chat-info">
                                <div className="chat-title">
                                  Cuộc trò chuyện #{c.id}
                                </div>
                                <div className="chat-date">
                                  {new Date(c.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>

                            <button
                              className="chat-delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteId(c.id);
                                setShowDeleteModal(true);
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                    </div>

                </aside>

                {/* ========== CHAT MAIN ========== */}
                <main className="chat">

                    <div className="chat-header">
                        <div className="chat-title">
                            <img src="/logo_ai.svg" alt="AI" />
                            <div>
                            <h2>AI StudyBuddy</h2>
                            <span className="status">● Sẵn sàng</span>
                            </div>
                        </div>

                        <div className="header-actions">
                            <button className="btn primary" onClick={createConversation}>
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                              </svg>
                              Đoạn chat mới
                            </button>

                        </div>
                        </div>


                    <div className="messages">
                        {messages.map((msg) => (
                            <div className={`msg ${msg.sender}`}>
                                {msg.sender === "ai" && (
                                    <div className="avatar ai">
                                    <img src="/logo_ai.svg" alt="AI" />
                                    </div>
                                )}

                                <div className={`bubble ${msg.sender}`}>
                                    {msg.sender === "ai" && msg.text === "__loading__" ? (
                                      <div className="typing">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                      </div>
                                    ) : (
                                      <ReactMarkdown
                                        remarkPlugins={[remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                      >
                                        {msg.text}
                                      </ReactMarkdown>
                                    )}
                                  </div>


                                {msg.sender === "user" && (
                                    <div className="avatar user"> {user ? user.hoTen.charAt(0).toUpperCase() : "?"}</div>
                                )}
                                </div>

                        ))}
                    </div>

                    <div className="chat-input">
                      <label className="file-btn">
                        <span className="icon">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21.44 11.05l-8.49 8.49a5 5 0 0 1-7.07-7.07l8.49-8.49a3.5 3.5 0 0 1 4.95 4.95l-8.49 8.49a2 2 0 1 1-2.83-2.83l8.49-8.49" />
                          </svg>
                        </span>
                          {pendingFile && (
                            <div className="pending-file">
                               {pendingFile.name}
                              <button onClick={() => setPendingFile(null)}>✕</button>
                            </div>
                          )}

                        <input
                          type="file"
                          hidden
                          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                          onChange={handleFileUpload}
                        />
                      </label>

                        <input
                          value={input}
                          onChange={e => setInput(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && sendMessage()}
                          placeholder="Nhập câu hỏi của bạn hoặc tải file..."
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

            </div>
            <ConfirmDeleteModal
                open={showDeleteModal}
                onCancel={() => {
                  setShowDeleteModal(false);
                  setDeleteId(null);
                }}
                onConfirm={deleteConversation}
              />
              {toast && (
                <div className={`toast ${toast.type}`}>
                  {toast.message}
                </div>
              )}

        </div>
        
    );
   

}
