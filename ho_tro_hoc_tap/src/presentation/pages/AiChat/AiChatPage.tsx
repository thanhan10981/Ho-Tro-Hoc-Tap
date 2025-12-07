import "../../../styles/AiChat.css";
import { useState } from "react";

export default function AiChatPage() {
    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: `Xin chào! Tôi là AI StudyBuddy, trợ lý học tập thông minh của bạn.
Tôi có thể hỗ trợ bạn:
• Giải thích khái niệm học thuật
• Giải bài tập và phương trình
• Phân tích tài liệu hoặc hình ảnh
• Tạo câu hỏi ôn tập
Hãy đặt câu hỏi hoặc tải tài liệu lên để bắt đầu!`
        }
    ]);

    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (!input.trim()) return;

        const userMsg = { sender: "user", text: input };
        setMessages(prev => [...prev, userMsg]);

        setTimeout(() => {
            setMessages(prev => [...prev, { sender: "ai", text: "Đây là phản hồi mẫu từ AI…" }]);
        }, 700);

        setInput("");
    };

    return (
        <div className="ai-chat-page">

            {/* ===== MAIN LAYOUT 3 CỘT ===== */}
            <div className="ai-chat-page layout">


                {/* ========== LEFT SIDEBAR ========== */}
                <aside className="sidebar">
                    <h2 className="title">Hỏi đáp AI</h2>
                    <p className="subtitle">Đặt câu hỏi và nhận câu trả lời thông minh từ trí tuệ nhân tạo</p>

                    {/* <div className="search-box">
                        <input type="text" placeholder="Tìm kiếm cuộc trò chuyện…" />
                        <span className="icon">🔍</span>
                    </div> */}

                    <label className="label">Tất cả môn học</label>
                    <select className="select">
                        <option>Toán học</option>
                        <option>Vật lý</option>
                        <option>AI</option>
                        <option>Hóa học</option>
                    </select>

                    <div className="chat-list">
                        <div className="chat-item">
                            <div className="chat-icon blue">📘</div>
                            <div>
                                <p className="chat-title">Giải phương trình vi phân</p>
                                <span className="chat-sub">Toán • 15 tin nhắn</span>
                            </div>
                        </div>

                        <div className="chat-item">
                            <div className="chat-icon green">🧪</div>
                            <div>
                                <p className="chat-title">Định luật Newton</p>
                                <span className="chat-sub">Vật lý • 18 tin nhắn</span>
                            </div>
                        </div>

                        <div className="chat-item">
                            <div className="chat-icon purple">🤖</div>
                            <div>
                                <p className="chat-title">Machine Learning cơ bản</p>
                                <span className="chat-sub">AI • 23 tin nhắn</span>
                            </div>
                        </div>

                        <div className="chat-item active">
                            <div className="chat-icon yellow">⚗️</div>
                            <div>
                                <p className="chat-title">Phản ứng hóa học</p>
                                <span className="chat-sub">Hóa học • 12 tin nhắn</span>
                            </div>
                        </div>
                    </div>

                    <div className="stats">
                        <p><span>Tổng câu hỏi</span><strong>127</strong></p>
                        <p><span>Tuần này</span><strong>18</strong></p>
                        <p><span>Độ hài lòng</span><strong className="green">94%</strong></p>
                    </div>
                </aside>

                {/* ========== CHAT MAIN ========== */}
                <main className="chat">

                    <div className="chat-header">
                        <h2>AI StudyBuddy</h2>
                        <div className="header-actions">
                            <button className="btn primary">+ Cuộc trò chuyện mới</button>
                            <button className="btn green">⬆ Tải lên tài liệu</button>
                            <button className="btn dark">⟳ Lịch sử hỏi đáp</button>
                        </div>
                    </div>

                    <div className="messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`msg ${msg.sender}`}>
                                {msg.sender === "ai" && <div className="avatar ai">AI</div>}

                                <div className={`bubble ${msg.sender}`}>
                                    {msg.text}
                                </div>

                                {msg.sender === "user" && <div className="avatar user">U</div>}
                            </div>
                        ))}
                    </div>

                    <div className="chat-input">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && sendMessage()}
                            placeholder="Đặt câu hỏi hoặc mô tả vấn đề bạn cần giúp đỡ…"
                        />
                        <button className="send-btn" onClick={sendMessage}>Gửi</button>
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
