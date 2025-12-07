import "../../styles/header.css";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="h-header">
      <div className="h-container">

        {/* LEFT: Logo */}
        <div className="h-left">
      <img
        src="/logo_ai.svg"
        className="w-10 h-10"
        style={{ filter: "invert(43%) sepia(88%) saturate(2711%) hue-rotate(201deg) brightness(95%) contrast(92%)" }}
      />

          <span className="h-logo-text">AI StudyBuddy</span>
        </div>

        {/* CENTER: Navigation */}
        <nav className="h-nav">

          <Link to="/" className={`nav-item ${isActive("/") ? "active" : ""}`}>
            Dashboard
          </Link>

          <Link to="/ask-ai" className={`nav-item ${isActive("/ask-ai") ? "active" : ""}`}>
            Hỏi đáp AI
          </Link>

          <Link to="/summary" className={`nav-item ${isActive("/summary") ? "active" : ""}`}>
            Tóm tắt bài học
          </Link>

          <Link to="/knowledgestorage" className={`nav-item ${isActive("/knowledgestorage") ? "active" : ""}`}>
            Kho kiến thức
          </Link>

          <Link to="/quiz" className={`nav-item ${isActive("/quiz") ? "active" : ""}`}>
            Quiz/Flashcard
          </Link>

          <Link to="/schedule" className={`nav-item ${isActive("/schedule") ? "active" : ""}`}>
            Lịch học
          </Link>

        </nav>

        {/* RIGHT: Notification + User */}
        <div className="h-right">
          <div className="h-noti">
            <span className="noti-badge">5</span>
            <i className="fa-regular fa-bell"></i>
          </div>

          <div className="h-user">
            <div className="h-avatar">NT</div>
            <div className="h-user-info">
              <div className="name">Nguyễn Thành</div>
              <div className="role">Sinh viên CNTT</div>
            </div>
            <i className="fa-solid fa-chevron-down arrow"></i>
          </div>
        </div>

      </div>
    </header>
  );
}
